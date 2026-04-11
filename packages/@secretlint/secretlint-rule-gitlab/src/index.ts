import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    GITLAB_PERSONAL_ACCESS_TOKEN: {
        en: (props: { KEY: string }) => `found GitLab Personal Access Token: ${props.KEY}`,
        ja: (props: { KEY: string }) => `GitLab Personal Access Tokenが見つかりました: ${props.KEY}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

function reportIfFoundKey({
    pattern,
    source,
    options,
    context,
    t,
}: {
    pattern: RegExp;
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    const results = source.content.matchAll(pattern);
    for (const result of results) {
        const index = result.index ?? 0;
        const match = result[0] ?? "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("GITLAB_PERSONAL_ACCESS_TOKEN", {
                KEY: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-gitlab",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-gitlab/README.md",
        },
    },
    create(context, options) {
        // GitLab Personal Access Token
        // Prefix `glpat-` followed by 20–128 characters.
        // Standard PATs are a fixed 20 characters. Routable tokens extend up to ~38 characters with a dot-suffix.
        // - https://docs.gitlab.com/security/tokens/
        // - https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
        const GITLAB_PERSONAL_ACCESS_TOKEN_PATTERN = /(?<!\p{L})glpat-[A-Za-z0-9_-]{20,128}(?![A-Za-z0-9_-])/gu;
        const patterns = [GITLAB_PERSONAL_ACCESS_TOKEN_PATTERN];
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                for (const pattern of patterns) {
                    reportIfFoundKey({ pattern, source, options: normalizedOptions, context, t });
                }
            },
        };
    },
};
