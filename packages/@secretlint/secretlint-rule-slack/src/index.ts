import { defineRule } from "@secretlint/define-rule";
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

export const creator = defineRule<Options>({
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-slack",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-slack/README.md",
        },
    },
    patterns: [
        {
            // Based on https://docs.cribl.io/docs/regexesyml
            // https://api.slack.com/docs/token-types
            // Bot user token strings begin with xoxb-
            // User token strings begin with xoxp-
            // App token strings begin with xapp-
            // Workspace access token strings begin with xoxa-2
            // Workspace refresh token strings begin with xoxr
            // Pattern: {prefix}-(\d-)-xxxx-xxxx
            pattern: /\b(?:xoxb|xoxp|xapp|xoxa|xoxo|xoxr)-(?:\d-)?(?:[a-zA-Z0-9]{1,40}-)+[a-zA-Z0-9]{1,40}\b/g,
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
});
