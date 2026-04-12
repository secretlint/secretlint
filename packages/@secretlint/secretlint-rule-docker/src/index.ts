import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
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

function reportIfFoundDockerPAT({
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
    // Docker Personal Access Token
    // Prefix: dckr_pat_ followed by exactly 27 alphanumeric, underscore, or hyphen characters
    // Reference: https://docs.docker.com/security/access-tokens/
    // Reference: https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/dockerhub/v2/dockerhub.go
    const DOCKER_PAT_PATTERN = /(?<!\p{L})dckr_pat_[a-zA-Z0-9_-]{27}(?![a-zA-Z0-9_-])/gu;
    const results = source.content.matchAll(DOCKER_PAT_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("DOCKER_PERSONAL_ACCESS_TOKEN", {
                TOKEN: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
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
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };

        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundDockerPAT({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
