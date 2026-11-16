import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SLACK_TOKEN: {
        en: (props: { TOKEN: string }) => `found slack token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Slackトークン: ${props.TOKEN} がみつかりました`,
    },
    IncomingWebhook: {
        en: (props: { URL: string }) => `found Slack Incoming Webhook: ${props.URL}`,
        ja: (props: { TOKEN: string }) => `SlackのIncoming Webhooks: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-slack",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/slack.md",
        },
    },
    patterns: [
        {
            // Based on https://docs.cribl.io/docs/regexesyml
            // https://docs.slack.dev/authentication/tokens/
            // Bot user token strings begin with xoxb-
            // User token strings begin with xoxp-
            // App token strings begin with xapp-
            // Workspace access token strings begin with xoxa-2
            // Workspace refresh token strings begin with xoxr
            // A token is divided into sections separated by "-", and the final section is the secret.
            // The secret has 6, 10, or 32 or more characters.
            // The sections before the secret include an ID made of digits (a team ID, a user ID, and so on).
            // e.g. xoxb-{team id}-{bot id}-{secret}, xapp-{version}-{app id}-{id}-{secret}
            // Pattern: {prefix}-({version}-)?({section with a letter}-){0,2}{digits}-({section}-){0,4}{secret}
            // The digit section and the secret length keep words such as "xapp-le-kernel" out.
            // The sections before the digit section must contain a letter,
            // so that a section can be read in only one way.
            // The number and length of the sections are bounded,
            // so that each match attempt reads a bounded part of the line,
            // even on a line that repeats a prefix many times.
            pattern:
                /\b(?:xoxb|xoxp|xapp|xoxa|xoxo|xoxr)-(?:\d-)?(?:\d{0,39}[a-zA-Z][a-zA-Z0-9]{0,39}-){0,2}\d{2,40}-(?:[a-zA-Z0-9]{1,40}-){0,4}[a-zA-Z0-9]{6,}\b/g,
            keywords: ["xoxb-", "xoxp-", "xapp-", "xoxa-", "xoxo-", "xoxr-"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("SLACK_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
        {
            // Incoming Webhooks
            // Based on https://hooks.slack.com/TXXXXX/BXXXXX/XXXXXXXXXX
            // https://api.slack.com/messaging/webhooks
            pattern:
                /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9]{1,40}\/B[a-zA-Z0-9]{1,40}\/[a-zA-Z0-9]{1,40}/gi,
            keywords: ["hooks.slack.com/services/"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("IncomingWebhook", {
                        URL: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
