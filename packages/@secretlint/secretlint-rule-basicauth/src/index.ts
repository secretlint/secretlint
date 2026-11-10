import { defineRule } from "@secretlint/define-rule";
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

export const creator = defineRule<Options>({
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
    patterns: [
        {
            // https://developer.mozilla.org/docs/Web/HTTP/Authentication
            // https://ihateregex.io/expr/url
            // Using possessive quantifiers to prevent ReDoS
            pattern:
                /(?<protocol>(?:https?|ftp|ftps)):\/\/(?<user>[-a-zA-Z0-9_]{1,256}):(?<password>[-a-zA-Z0-9_]{1,256})@[-a-zA-Z0-9%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/g,
            // every match starts with one of the protocols
            keywords: ["http://", "https://", "ftp://", "ftps://"],
            scope: "line",
            report(match, context) {
                const username = match.groups?.user;
                const password = match.groups?.password;

                // Skip if no credentials found
                if (!username || !password) return;

                // Skip if username doesn't look real
                if (!isLikelyRealUsername(username)) return;

                // Skip if password doesn't look real
                if (!isLikelyRealPassword(password)) return;

                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("BasicAuth", {
                        CREDENTIAL: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
});
