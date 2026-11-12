import type { SecretLintRuleCreator, SecretLintRulePattern } from "@secretlint/types";
import { matchPatterns } from "../../../helper/regexp-string-matcher.js";

export const messages = {
    MongoDBConnection: {
        en: (props: { URI: string }) => `found MongoDB connection string: ${props.URI}`,
        ja: (props: { URI: string }) => `MongoDB接続文字列: ${props.URI} がみつかりました`,
    },
    MySQLConnection: {
        en: (props: { URI: string }) => `found MySQL connection string: ${props.URI}`,
        ja: (props: { URI: string }) => `MySQL接続文字列: ${props.URI} がみつかりました`,
    },
    PostgreSQLConnection: {
        en: (props: { URI: string }) => `found PostgreSQL connection string: ${props.URI}`,
        ja: (props: { URI: string }) => `PostgreSQL接続文字列: ${props.URI} がみつかりました`,
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
    "example.com",
    "example.org",
    "test.com",
    "password",
    "username",
    "secret",
    "mypassword",
    "myusername",
    "root",
    "admin",
    "user",
    "pass",
    "{password}",
    "${password}",
    "{{password}}",
    "{username}",
    "${username}",
    "{{username}}",
    "YOUR_PASSWORD",
    "YOUR_USERNAME",
    "REPLACE_WITH_PASSWORD",
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
        /\$\([^)]{1,50}\)/, // $(var)
    ];

    return variablePatterns.some((pattern) => pattern.test(str));
}

/**
 * Check if the username and password look like real credentials
 */
function isLikelyRealCredential(username: string, password: string): boolean {
    // Skip example credentials that repeat the username as the password
    if (username === password) return false;

    // Skip if it's too short or too simple
    if (password.length < 4) return false;

    // Skip if it contains variable patterns
    if (isVariableLikeString(password)) return false;

    // Skip if it's exactly a common placeholder (not just contains it)
    const passwordLower = password.toLowerCase();
    if (BUILTIN_IGNORED_PATTERNS.some((pattern) => passwordLower === pattern.toLowerCase())) {
        return false;
    }

    // Skip passwords that are too repetitive (same character repeated)
    if (/^(.)\1{3,}$/.test(password)) return false; // e.g., "aaaa", "1111", "xxxx"

    return true;
}

const createReport = (messageId: keyof typeof messages): SecretLintRulePattern<Options>["report"] => {
    return (match, context) => {
        const username = match.groups?.username;
        const password = match.groups?.password;

        // Skip if no credentials found
        if (!username || !password) return;

        // Skip if the credentials look like an example
        if (!isLikelyRealCredential(username, password)) return;

        const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
        if (allowedResults.length > 0) {
            return;
        }
        const t = context.createTranslator(messages);
        context.report({
            message: t(messageId, {
                URI: match.text,
            }),
            range: match.range,
        });
    };
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-database-connection-string",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-database-connection-string/README.md",
        },
    },
    patterns: [
        {
            // MongoDB URI patterns: mongodb:// and mongodb+srv://
            // Captures: mongodb://[username:password@]host[:port][/database][?options]
            // Using possessive quantifiers to prevent ReDoS
            pattern:
                /mongodb(?:\+srv)?:\/\/(?:(?<username>[^:\/\s]{1,100}):(?<password>[^@\/\s]{1,200})@)?(?<host>[^\/\s?]{1,100})(?:\/(?<database>[^?\s]{0,100}))?(?:\?(?<options>[^\s]{0,500}))?/gi,
            keywords: ["mongodb://", "mongodb+srv://"],
            scope: "line",
            report: createReport("MongoDBConnection"),
        },
        {
            // MySQL URI patterns: jdbc:mysql://, mysql://, mysqlx://
            // Using possessive quantifiers to prevent ReDoS
            pattern:
                /(?:jdbc:)?mysql(?:x)?:\/\/(?:(?<username>[^:\/\s]{1,100}):(?<password>[^@\/\s]{1,200})@)?(?<host>[^\/\s?]{1,100})(?:\/(?<database>[^?\s]{0,100}))?(?:\?(?<options>[^\s]{0,500}))?/gi,
            keywords: ["mysql://", "mysqlx://"],
            scope: "line",
            report: createReport("MySQLConnection"),
        },
        {
            // PostgreSQL URI patterns: postgresql://, postgres://
            // Using possessive quantifiers to prevent ReDoS
            pattern:
                /postgres(?:ql)?:\/\/(?:(?<username>[^:\/\s]{1,100}):(?<password>[^@\/\s]{1,200})@)?(?<host>[^\/\s?]{1,100})(?:\/(?<database>[^?\s]{0,100}))?(?:\?(?<options>[^\s]{0,500}))?/gi,
            keywords: ["postgres://", "postgresql://"],
            scope: "line",
            report: createReport("PostgreSQLConnection"),
        },
    ],
};
