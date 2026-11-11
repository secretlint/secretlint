import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    HASHICORP_VAULT_SERVICE_TOKEN: {
        en: (props: { TOKEN: string }) => `found HashiCorp Vault service token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `HashiCorp Vault service token: ${props.TOKEN} がみつかりました`,
    },
    HASHICORP_VAULT_BATCH_TOKEN: {
        en: (props: { TOKEN: string }) => `found HashiCorp Vault batch token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `HashiCorp Vault batch token: ${props.TOKEN} がみつかりました`,
    },
    HASHICORP_VAULT_RECOVERY_TOKEN: {
        en: (props: { TOKEN: string }) => `found HashiCorp Vault recovery token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `HashiCorp Vault recovery token: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

// HashiCorp Vault token formats (Vault 1.10+):
// - Service token:  `hvs.` + 90..120 [A-Za-z0-9_-]
// - Batch token:    `hvb.` + 138..300 [A-Za-z0-9_-]
// - Recovery token: `hvr.` + 90..120 [A-Za-z0-9_-]
// References:
// - https://developer.hashicorp.com/vault/docs/concepts/tokens
// - https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns
// - https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml
//
// Boundaries:
// - Leading `(?<!\p{L})` prevents matching when the prefix is glued to another letter
//   (e.g. `xhvs.`), while still allowing punctuation, digits, whitespace, and line starts.
// - Trailing `(?![A-Za-z0-9_-])` anchors to the end of the token body.
const serviceTokenPattern = /(?<!\p{L})hvs\.[A-Za-z0-9_-]{90,120}(?![A-Za-z0-9_-])/gu;
const batchTokenPattern = /(?<!\p{L})hvb\.[A-Za-z0-9_-]{138,300}(?![A-Za-z0-9_-])/gu;
const recoveryTokenPattern = /(?<!\p{L})hvr\.[A-Za-z0-9_-]{90,120}(?![A-Za-z0-9_-])/gu;

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-hashicorp-vault",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-hashicorp-vault/README.md",
        },
    },
    patterns: [
        {
            pattern: serviceTokenPattern,
            keywords: ["hvs."],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("HASHICORP_VAULT_SERVICE_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
        {
            pattern: batchTokenPattern,
            keywords: ["hvb."],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("HASHICORP_VAULT_BATCH_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
        {
            pattern: recoveryTokenPattern,
            keywords: ["hvr."],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("HASHICORP_VAULT_RECOVERY_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
