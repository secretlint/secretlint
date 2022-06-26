import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
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

function reportIfFoundRawPrivateKey({
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
    // Based on https://docs.cribl.io/docs/regexesyml
    // https://api.slack.com/docs/token-types
    // Bot user token strings begin with xoxb-
    // User token strings begin with xoxp-
    // App token strings begin with xapp-
    // Workspace access token strings begin with xoxa-2
    // Workspace refresh token strings begin with xoxr
    // Pattern: {prefix}-(\d-)-xxxx-xxxx
    const SLACK_TOKEN_PATTERN =
        /\b(?:xoxb|xoxp|xapp|xoxa|xoxo|xoxr)-(?:\d-)?(?:[a-zA-Z0-9]{1,40}-)+[a-zA-Z0-9]{1,40}\b/g;
    const results = source.content.matchAll(SLACK_TOKEN_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("SLACK_TOKEN", {
                TOKEN: match,
            }),
            range,
        });
    }
}

/**
 * Report if found Incoming Webhooks
 * https://api.slack.com/messaging/webhooks
 * @param source
 * @param options
 * @param context
 * @param t
 */
function reportIfFoundIncomingWebhook({
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
    // Based on https://hooks.slack.com/TXXXXX/BXXXXX/XXXXXXXXXX
    // https://api.slack.com/messaging/webhooks
    const IncomingWebhooksPattern =
        /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9]{1,40}\/B[a-zA-Z0-9]{1,40}\/[a-zA-Z0-9]{1,40}/gi;
    const results = source.content.matchAll(IncomingWebhooksPattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("IncomingWebhook", {
                URL: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
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
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundRawPrivateKey({ source, options: normalizedOptions, context, t });
                reportIfFoundIncomingWebhook({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
