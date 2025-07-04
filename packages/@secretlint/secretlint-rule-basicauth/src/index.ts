import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    BasicAuth: {
        en: (props: { CREDENTIAL: string }) => `found basic auth credential: ${props.CREDENTIAL}`,
        ja: (props: { CREDENTIAL: string }) => `ベーシック認証情報: ${props.CREDENTIAL} がみつかりました`,
    },
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
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    // https://developer.mozilla.org/docs/Web/HTTP/Authentication
    // https://ihateregex.io/expr/url
    const URL_PATTERN =
        /(?<protocol>(?:https?|ftp|ftps)):\/\/(?<user>[-a-zA-Z0-9_]{1,256}):(?<password>[-a-zA-Z0-9_]{1,256})@[-a-zA-Z0-9%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/g;
    const results = source.content.matchAll(URL_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("BasicAuth", {
                CREDENTIAL: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-basicauth",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-basicauth/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundBasicAuth({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
