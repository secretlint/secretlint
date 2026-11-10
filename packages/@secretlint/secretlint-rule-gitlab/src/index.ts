import { defineRule } from "@secretlint/define-rule";
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

export const creator = defineRule<Options>({
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
    patterns: [
        {
            // GitLab Personal Access Token
            // Prefix `glpat-` followed by 20–128 characters.
            // Standard PATs are a fixed 20 characters. Routable tokens extend up to ~38 characters with a dot-suffix.
            // - https://docs.gitlab.com/security/tokens/
            // - https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
            pattern: /(?<!\p{L})glpat-[A-Za-z0-9_-]{20,128}(?![A-Za-z0-9_-])/gu,
            keywords: ["glpat-"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("GITLAB_PERSONAL_ACCESS_TOKEN", {
                        KEY: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
});
