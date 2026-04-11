import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    HUGGINGFACE_USER_ACCESS_TOKEN: {
        en: (props: { TOKEN: string }) => `found Hugging Face User Access Token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Hugging Face User Access Token: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-huggingface",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-huggingface/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // Hugging Face User Access Token format:
                // - Prefix: `hf_`
                // - Body: exactly 34 alphabetic characters (a-z, A-Z)
                // References:
                // - https://huggingface.co/docs/hub/security-tokens
                // - https://github.com/gitleaks/gitleaks
                const pattern = /(?<!\p{L})hf_[a-zA-Z]{34}(?![a-zA-Z])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("HUGGINGFACE_USER_ACCESS_TOKEN", {
                            TOKEN: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
