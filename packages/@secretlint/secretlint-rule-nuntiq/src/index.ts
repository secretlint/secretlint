import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
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

const messageIdByKind: Record<string, keyof typeof messages> = {
    ck: "NUNTIQ_CUSTOMER_API_KEY",
    pk: "NUNTIQ_PARTNER_API_KEY",
    rs: "NUNTIQ_ROTATION_SECRET",
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     */
    allows?: string[];
};

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const CRC32_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
})();

const crc32 = (text: string): number => {
    let crc = 0xffffffff;
    for (let i = 0; i < text.length; i++) {
        crc = (CRC32_TABLE[(crc ^ text.charCodeAt(i)) & 0xff] ?? 0) ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
};

/**
 * CRC32 (IEEE) of the random part as 6 base62 digits, most significant first.
 */
export const checksum = (randomPart: string): string => {
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
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-nuntiq/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions: Required<Options> = {
            allows: options.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // Nuntiq keys: nuntiq_{kind}_{environment}_{8 hex key id}_{43 base64url random}{6 base62 checksum}
                // kind: ck (customer API key), pk (partner API key), rs (rotation secret)
                // environment: live, test, dev
                // The checksum is CRC32 (IEEE) of the random part in base62 (0-9A-Za-z, most significant first).
                // Gitleaks and TruffleHog use the same pattern:
                // nuntiq_(?:ck|pk|rs)_(?:live|test|dev)_[0-9a-f]{8}_[A-Za-z0-9_-]{43}[0-9A-Za-z]{6}
                const pattern =
                    /(?<![\p{L}\p{N}_-])nuntiq_(?<kind>ck|pk|rs)_(?:live|test|dev)_[0-9a-f]{8}_(?<random>[A-Za-z0-9_-]{43})(?<sum>[0-9A-Za-z]{6})(?![A-Za-z0-9_-])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const kind = match.groups?.kind ?? "";
                    // A look-alike with a wrong checksum is not a Nuntiq key.
                    if (checksum(match.groups?.random ?? "") !== match.groups?.sum) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const messageId = messageIdByKind[kind] ?? "NUNTIQ_CUSTOMER_API_KEY";
                    context.report({
                        message: t(messageId, {
                            KEY: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
