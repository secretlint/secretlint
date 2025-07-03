import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

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
    // Check for common variable patterns
    const variablePatterns = [
        /\$\{[^}]+\}/, // ${var}
        /\{\{[^}]+\}\}/, // {{var}}
        /\{[^}]+\}/, // {var}
        /%[A-Z_]+%/, // %VAR%
        /\$[A-Z_]+/, // $VAR
    ];

    return variablePatterns.some((pattern) => pattern.test(str));
}

/**
 * Calculate simple entropy to detect random-looking passwords
 */
function calculateEntropy(str: string): number {
    const chars = Array.from(new Set(str.split("")));
    return chars.length / str.length;
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

    // Require reasonable entropy (mixed characters)
    const entropy = calculateEntropy(password);
    if (entropy < 0.3) return false; // Too repetitive

    return true;
}

function reportMongoDBConnectionString({
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
    // MongoDB URI patterns: mongodb:// and mongodb+srv://
    // Captures: mongodb://[username:password@]host[:port][/database][?options]
    const MONGODB_PATTERN =
        /mongodb(?:\+srv)?:\/\/(?:([^:\/\s]+):([^@\/\s]+)@)?([^\/\s?]+)(?:\/([^?\s]*))?(?:\?([^\s]*))?/gi;

    const results = source.content.matchAll(MONGODB_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const username = result[1];
        const password = result[2];

        // Skip if no credentials found
        if (!username || !password) continue;

        // Skip if password doesn't look real
        if (!isLikelyRealPassword(password)) continue;

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }

        context.report({
            message: t("MongoDBConnection", {
                URI: match,
            }),
            range,
        });
    }
}

function reportMySQLConnectionString({
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
    // MySQL URI patterns: jdbc:mysql://, mysql://, mysqlx://
    const MYSQL_URI_PATTERN =
        /(?:jdbc:)?mysql(?:x)?:\/\/(?:([^:\/\s]+):([^@\/\s]+)@)?([^\/\s?]+)(?:\/([^?\s]*))?(?:\?([^\s]*))?/gi;

    const results = source.content.matchAll(MYSQL_URI_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const username = result[1];
        const password = result[2];

        // Skip if no credentials found
        if (!username || !password) continue;

        // Skip if password doesn't look real
        if (!isLikelyRealPassword(password)) continue;

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }

        context.report({
            message: t("MySQLConnection", {
                URI: match,
            }),
            range,
        });
    }

    // MySQL key-value patterns: find patterns with Uid/Username followed by Pwd/Password
    const MYSQL_KEYVALUE_PATTERN = /\b(?:Uid|Username)\s*=\s*([^;\s]+)[^;]*;[^;]*\b(?:Pwd|Password)\s*=\s*([^;\s]+)/gi;

    const kvResults = source.content.matchAll(MYSQL_KEYVALUE_PATTERN);
    for (const result of kvResults) {
        const index = result.index || 0;
        const match = result[0] || "";
        const password = result[2];

        // Skip if password doesn't look real
        if (!isLikelyRealPassword(password)) continue;

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }

        context.report({
            message: t("MySQLConnection", {
                URI: match,
            }),
            range,
        });
    }
}

function reportPostgreSQLConnectionString({
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
    // PostgreSQL URI patterns: postgresql://, postgres://
    const POSTGRESQL_URI_PATTERN =
        /postgres(?:ql)?:\/\/(?:([^:\/\s]+):([^@\/\s]+)@)?([^\/\s?]+)(?:\/([^?\s]*))?(?:\?([^\s]*))?/gi;

    const results = source.content.matchAll(POSTGRESQL_URI_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const username = result[1];
        const password = result[2];

        // Skip if no credentials found
        if (!username || !password) continue;

        // Skip if password doesn't look real
        if (!isLikelyRealPassword(password)) continue;

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }

        context.report({
            message: t("PostgreSQLConnection", {
                URI: match,
            }),
            range,
        });
    }

    // PostgreSQL key-value patterns: find patterns with Username followed by Password
    const POSTGRESQL_KEYVALUE_PATTERN =
        /\b(?:Username|User)\s*=\s*([^;\s]+)[^;]*;[^;]*\b(?:Password|Pwd)\s*=\s*([^;\s]+)/gi;

    const kvResults = source.content.matchAll(POSTGRESQL_KEYVALUE_PATTERN);
    for (const result of kvResults) {
        const index = result.index || 0;
        const match = result[0] || "";
        const password = result[2];

        // Skip if password doesn't look real
        if (!isLikelyRealPassword(password)) continue;

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }

        context.report({
            message: t("PostgreSQLConnection", {
                URI: match,
            }),
            range,
        });
    }
}

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
    create(context, options) {
        const normalizedOptions: Required<Options> = {
            allows: options.allows || [],
        };
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                reportMongoDBConnectionString({ source, options: normalizedOptions, context, t });
                reportMySQLConnectionString({ source, options: normalizedOptions, context, t });
                reportPostgreSQLConnectionString({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
