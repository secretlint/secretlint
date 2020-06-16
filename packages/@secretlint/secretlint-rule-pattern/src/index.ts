import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

require("string.prototype.matchall").shim();

export const messages = {
    PATTERN: {
        en: (props: { PATTERN_NAME: string; CREDENTIAL: string }) =>
            `found matching ${props.PATTERN_NAME}: ${props.CREDENTIAL}`,
        ja: (props: { PATTERN_NAME: string; CREDENTIAL: string }) =>
            `${props.PATTERN_NAME}にマッチするパターンが見つかりました: ${props.CREDENTIAL}`,
    },
};

export type PatternType = {
    name: string;
    pattern: string;
};

export type Options = {
    allows?: string[];
    patterns?: PatternType[];
};

function reportIfFoundPattern({
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
    for (const p of options.patterns) {
        const results = matchPatterns(source.content, [p.pattern]);
        for (const result of results) {
            const index = result.startIndex || 0;
            const match = result.match || "";
            const range = [index, index + match.length];
            const allowedResults = matchPatterns(match, options.allows);
            if (allowedResults.length > 0) {
                continue;
            }
            context.report({
                message: t("PATTERN", {
                    PATTERN_NAME: p.name,
                    CREDENTIAL: match,
                }),
                range,
            });
        }
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-pattern",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
            patterns: options.patterns || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundPattern({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
export default creator;
