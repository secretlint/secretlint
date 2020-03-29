import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

import secp256k1 from "secp256k1";
import BN from "bn.js";

export const messages = {
    secp256k1Priv: {
        en: "found secp256k1 private key: {{KEY}}",
        ja: "秘密鍵(secp256k1) {{KEY}} が見つかりました",
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
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-secp256k1-privatekey/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /[0-9a-f]{64}/gi;
                let match;
                while ((match = pattern.exec(source.content)) !== null) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length];

                    if (!secp256k1.privateKeyVerify(new BN(matchString, 16).toBuffer())) return;

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
export default creator;
