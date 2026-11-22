import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    NUNTIQ_CUSTOMER_API_KEY: {
        en: (props: { KEY: string }) => `found Nuntiq customer API key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Nuntiq カスタマー API キー: ${props.KEY} がみつかりました`,
    },
    NUNTIQ_PARTNER_API_KEY: {
        en: (props: { KEY: string }) => `found Nuntiq partner API key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Nuntiq パートナー API キー: ${props.KEY} がみつかりました`,
    },
    NUNTIQ_ROTATION_SECRET: {
        en: (props: { KEY: string }) => `found Nuntiq key rotation secret: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Nuntiq キーローテーションシークレット: ${props.KEY} がみつかりました`,
    },
};

const messageIdByKind = {
    ck: "NUNTIQ_CUSTOMER_API_KEY",
    pk: "NUNTIQ_PARTNER_API_KEY",
    rs: "NUNTIQ_ROTATION_SECRET",
} as const satisfies Record<string, keyof typeof messages>;

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let crc32Table: Uint32Array | undefined;
const crc32 = (text: string): number => {
    if (!crc32Table) {
        crc32Table = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) {
                c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            }
            crc32Table[n] = c >>> 0;
        }
    }
    let crc = 0xffffffff;
    for (let i = 0; i < text.length; i++) {
        crc = (crc32Table[(crc ^ text.charCodeAt(i)) & 0xff] ?? 0) ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
};

/**
 * CRC32 (IEEE) of the random part as 6 base62 digits, most significant first.
 */
const checksum = (randomPart: string): string => {
    let value = crc32(randomPart);
    let digits = "";
    for (let i = 0; i < 6; i++) {
        digits = BASE62[value % 62] + digits;
        value = Math.floor(value / 62);
    }
    return digits;
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-nuntiq",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/nuntiq.md",
        },
    },
    patterns: [
        {
            // Nuntiq keys: nuntiq_{kind}_{environment}_{8 hex key id}_{43 base64url random}{6 base62 checksum}
            // kind: ck (customer API key), pk (partner API key), rs (key rotation secret)
            // environment: live, test, dev
            // The checksum is CRC32 (IEEE) of the random part in base62 (0-9A-Za-z, most significant first).
            // https://github.com/secretlint/secretlint/issues/1772
            pattern:
                /(?<![\p{L}\p{N}_-])nuntiq_(?<kind>ck|pk|rs)_(?:live|test|dev)_[0-9a-f]{8}_(?<random>[A-Za-z0-9_-]{43})(?<sum>[0-9A-Za-z]{6})(?![A-Za-z0-9_-])/gu,
            keywords: ["nuntiq_"],
            scope: "line",
            report(match, context) {
                // A look-alike with a wrong checksum is not a Nuntiq key.
                if (checksum(match.groups?.random ?? "") !== match.groups?.sum) {
                    return;
                }
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const kind = match.groups?.kind as keyof typeof messageIdByKind;
                const t = context.createTranslator(messages);
                context.report({
                    message: t(messageIdByKind[kind], { KEY: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
