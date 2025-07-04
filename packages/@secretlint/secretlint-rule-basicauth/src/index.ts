import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    BasicAuth: {
        en: (props: { CREDENTIAL: string }) => `found basic auth credential: ${props.CREDENTIAL}`,
        ja: (props: { CREDENTIAL: string }) => `ベーシック認証情報: ${props.CREDENTIAL} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

// Common placeholder patterns that should be ignored to avoid false positives
const BUILTIN_IGNORED_PATTERNS = [
    "localhost",
    "127.0.0.1",
    "password",
    "mypassword",
    "myusername",
    "{password}",
    "${password}",
    "{{password}}",
    "{username}",
    "${username}",
    "{{username}}",
    "YOUR_PASSWORD",
    "YOUR_USERNAME",
    "REPLACE_WITH_PASSWORD",
    "REPLACE_WITH_USERNAME",
];

/**
 * Check if the string contains variable-like patterns that indicate it's likely a template
 */
function isVariableLikeString(str: string): boolean {
    // Check for common variable patterns with length limits to prevent ReDoS
    const variablePatterns = [
        /\$\{[^}]{1,50}\}/, // ${var}
        /\{\{[^}]{1,50}\}\}/, // {{var}}
        /\{[^}]{1,50}\}/, // {var}
        /%[A-Z_]{1,30}%/, // %VAR%
        /\$[A-Z_]{1,30}/, // $VAR
    ];

    return variablePatterns.some((pattern) => pattern.test(str));
}

/**
 * Check if the username part looks like a real credential
 */
function isLikelyRealUsername(username: string): boolean {
    // Skip if it's too short
    if (username.length < 2) return false;

    // Skip if it contains variable patterns
    if (isVariableLikeString(username)) return false;

    // Skip if it's a common placeholder
    if (BUILTIN_IGNORED_PATTERNS.some((pattern) => username.toLowerCase().includes(pattern.toLowerCase()))) {
        return false;
    }

    return true;
}

/**
 * Check if the password part looks like a real credential
 */
function isLikelyRealPassword(password: string): boolean {
    // Skip if it's too short or too simple
    if (password.length < 4) return false;

    // Skip if it contains variable patterns
    if (isVariableLikeString(password)) return false;

    // Skip if it's a common placeholder
    if (BUILTIN_IGNORED_PATTERNS.some((pattern) => password.toLowerCase().includes(pattern.toLowerCase()))) {
        return false;
    }

    // Skip passwords that are too repetitive (same character repeated)
    if (/^(.)\1{3,}$/.test(password)) return false; // e.g., "aaaa", "1111", "xxxx"

    return true;
}

function reportIfFoundBasicAuth({
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
    // https://developer.mozilla.org/docs/Web/HTTP/Authentication
    // https://ihateregex.io/expr/url
    // Using possessive quantifiers to prevent ReDoS
    const URL_PATTERN =
        /(?<protocol>(?:https?|ftp|ftps)):\/\/(?<user>[-a-zA-Z0-9_]{1,256}):(?<password>[-a-zA-Z0-9_]{1,256})@[-a-zA-Z0-9%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/g;
    const results = source.content.matchAll(URL_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const username = result.groups?.user;
        const password = result.groups?.password;

        // Skip if no credentials found
        if (!username || !password) continue;

        // Skip if username doesn't look real
        if (!isLikelyRealUsername(username)) continue;

        // Skip if password doesn't look real
        if (!isLikelyRealPassword(password)) continue;

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("BasicAuth", {
                CREDENTIAL: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-basicauth",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-basicauth/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundBasicAuth({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
