import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

require("string.prototype.matchall").shim();

export const messages = {
    FOUND_SLACK_TOKEN: {
        en: "found slack token: {{TOKEN}}",
        ja: "Slackトークン: {{TOKEN}} がみつかりました"
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
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    // Based on https://docs.cribl.io/docs/regexesyml
    // https://api.slack.com/docs/token-types
    const PRIVATE_KEY_PATTERN = /xox[abposr]-(?:\d+-)+[a-z0-9]{1,255}/g;
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
            message: t("FOUND_SLACK_TOKEN", {
                TOKEN: match
            }),
            range
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    meta: {
        id: "@secretlint/secretlint-rule-privatekey",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"]
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || []
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundRawPrivateKey({ source, options: normalizedOptions, context, t });
            }
        };
    }
};
export default creator;
