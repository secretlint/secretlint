import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    STRIPE_SECRET_KEY_LIVE: {
        en: (props: { KEY: string }) => `found Stripe Live Secret Key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Stripe Live Secret Keyが見つかりました: ${props.KEY}`,
    },
    STRIPE_SECRET_KEY_TEST: {
        en: (props: { KEY: string }) => `found Stripe Test Secret Key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Stripe Test Secret Keyが見つかりました: ${props.KEY}`,
    },
    STRIPE_RESTRICTED_KEY_LIVE: {
        en: (props: { KEY: string }) => `found Stripe Live Restricted Key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Stripe Live Restricted Keyが見つかりました: ${props.KEY}`,
    },
    STRIPE_RESTRICTED_KEY_TEST: {
        en: (props: { KEY: string }) => `found Stripe Test Restricted Key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Stripe Test Restricted Keyが見つかりました: ${props.KEY}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

type STRIPE_KEY_PREFIX = "sk_live" | "sk_test" | "rk_live" | "rk_test";
const messageIdMap: Record<STRIPE_KEY_PREFIX, keyof typeof messages> = {
    sk_live: "STRIPE_SECRET_KEY_LIVE",
    sk_test: "STRIPE_SECRET_KEY_TEST",
    rk_live: "STRIPE_RESTRICTED_KEY_LIVE",
    rk_test: "STRIPE_RESTRICTED_KEY_TEST",
};

// Stripe API key format: {prefix}_{24-99 alphanumeric chars}
// Officially documented prefixes (https://docs.stripe.com/keys):
// - sk_live_ : Live Secret Key
// - sk_test_ : Test Secret Key
// - rk_live_ : Live Restricted Key
// - rk_test_ : Test Restricted Key
//
// Length lower bound (24):
//   Stripe's documentation samples and historical key format use a 24-char body
//   after the prefix. Issue #1531 also describes the format as "typically 24-32
//   characters" after the prefix. Stripe does not publish a hard minimum, but
//   24 reflects the smallest length seen in real keys; gitleaks uses 10 and
//   TruffleHog uses 20, but those values produce more false positives.
//   Tightening to 24 trades a (non-existent in practice) shorter key for fewer
//   false positives.
//
// Length upper bound (99):
//   Modern Stripe keys use an extended `51...` account-prefix encoding and run
//   up to ~99 chars after the prefix. Matches gitleaks' upper bound.
const STRIPE_KEY_PATTERN = /(?<!\p{L})(?<prefix>sk_live|sk_test|rk_live|rk_test)_[a-zA-Z0-9]{24,99}(?![a-zA-Z0-9])/gu;

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-stripe",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-stripe/README.md",
        },
    },
    patterns: [
        {
            pattern: STRIPE_KEY_PATTERN,
            keywords: ["sk_live_", "sk_test_", "rk_live_", "rk_test_"],
            scope: "line",
            report(match, context) {
                const prefix = match.groups?.["prefix"] as STRIPE_KEY_PREFIX | undefined;
                if (!prefix) {
                    return;
                }
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t(messageIdMap[prefix], {
                        KEY: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
