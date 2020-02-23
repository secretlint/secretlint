import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

require("string.prototype.matchall").shim();

export const messages = {
    BasicAuth: {
        en: "found basic auth credential: {{CREDENTIAL}}",
        ja: "ベーシック認証情報: {{CREDENTIAL}} がみつかりました"
    }
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

function reportIfFoundBasicAuth({
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
    // https://developer.mozilla.org/docs/Web/HTTP/Authentication
    // https://ihateregex.io/expr/url
    const URL_PATTERN = /(?<protocol>(:?[-a-zA-Z0-9_]{1,256})):\/\/(?<user>[-a-zA-Z0-9_]{1,256}):(?<password>[-a-zA-Z0-9_]{1,256})@(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&=]*)/gm;
    const results = source.content.matchAll(URL_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const user = result.groups!.user;
        const password = result.groups!.password;
        const range = [index, index + match.length];
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("BasicAuth", {
                CREDENTIAL: match,
                user,
                password
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
                reportIfFoundBasicAuth({ source, options: normalizedOptions, context, t });
            }
        };
    }
};
export default creator;
