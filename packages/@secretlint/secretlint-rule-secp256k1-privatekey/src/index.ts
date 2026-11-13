import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

// Order n of the secp256k1 curve. https://en.bitcoin.it/wiki/Secp256k1
const SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
/**
 * A secp256k1 private key is an integer k where 0 < k < n.
 * This is the same check as secp256k1's privateKeyVerify.
 */
const isSecp256k1PrivateKey = (hex: string): boolean => {
    const value = BigInt(`0x${hex}`);
    return value > 0n && value < SECP256K1_N;
};

export const messages = {
    secp256k1Priv: {
        en: (props: { KEY: string }) => `found secp256k1 private key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `秘密鍵(secp256k1) ${props.KEY} が見つかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-secp256k1-privatekey",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-secp256k1-privatekey/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // Require non-hex boundaries so substrings inside longer hex strings
                // (e.g. DOTENV_PUBLIC_KEY which is 66 hex chars, or sha512 hashes which are 128 hex chars)
                // are not falsely matched as 64-hex-char private keys.
                const pattern = /(?<![0-9a-f])[0-9a-f]{64}(?![0-9a-f])/gi;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    if (!isSecp256k1PrivateKey(matchString)) {
                        continue;
                    }
                    context.report({
                        message: t("secp256k1Priv", {
                            KEY: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
