import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "../../../helper/regexp-string-matcher.js";

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
    patterns: [
        {
            // Hugging Face User Access Token format:
            // - Prefix: `hf_`
            // - Body: exactly 34 alphabetic characters (a-z, A-Z)
            // References:
            // - https://huggingface.co/docs/hub/security-tokens
            // - https://github.com/gitleaks/gitleaks
            pattern: /(?<!\p{L})hf_[a-zA-Z]{34}(?![a-zA-Z])/gu,
            keywords: ["hf_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("HUGGINGFACE_USER_ACCESS_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
