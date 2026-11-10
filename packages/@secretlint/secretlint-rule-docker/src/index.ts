import { defineRule } from "@secretlint/define-rule";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DOCKER_PERSONAL_ACCESS_TOKEN: {
        en: (props: { TOKEN: string }) => `found Docker Personal Access Token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Docker Personal Access Token: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     */
    allows?: string[];
};

export const creator = defineRule<Options>({
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-docker",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-docker/README.md",
        },
    },
    patterns: [
        {
            // Docker Personal Access Token
            // Prefix: dckr_pat_ followed by exactly 27 alphanumeric, underscore, or hyphen characters
            // Reference: https://docs.docker.com/security/access-tokens/
            // Reference: https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/dockerhub/v2/dockerhub.go
            pattern: /(?<!\p{L})dckr_pat_[a-zA-Z0-9_-]{27}(?![a-zA-Z0-9_-])/gu,
            keywords: ["dckr_pat_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOCKER_PERSONAL_ACCESS_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
});
