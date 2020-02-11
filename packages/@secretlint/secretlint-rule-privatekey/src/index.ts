import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSource
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

require("string.prototype.matchall").shim();

export const messages = {
    PrivateKey: {
        en: "found private key: {{KEY}}",
        ja: "秘密鍵: {{KEY}} がみつかりました"
    }
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

function reportIfFoundRawPrivateKey({
    source,
    options,
    context,
    t
}: {
    source: SecretLintSource;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    // Based on https://docs.cribl.io/docs/regexesyml
    const PRIVATE_KEY_PATTERN = /-----BEGIN (DSA|RSA|EC|PGP|OPENSSH) PRIVATE KEY(\sBLOCK)?-----[\s\S]*/gm;
    const results = source.content.matchAll(PRIVATE_KEY_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length];
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("PrivateKey", {
                KEY: match
            }),
            range
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    meta: {
        recommended: true,
        type: "scanner"
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || []
        };
        return {
            file(source: SecretLintSource) {
                reportIfFoundRawPrivateKey({ source, options: normalizedOptions, context, t });
            }
        };
    }
};
export default creator;
