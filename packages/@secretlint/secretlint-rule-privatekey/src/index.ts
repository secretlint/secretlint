import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    PrivateKey: {
        en: (props: { KEY: string }) => `found private key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `秘密鍵: ${props.KEY} がみつかりました`,
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
    "...",
    "YOUR_PRIVATE_KEY_CONTENT_HERE",
    "YOUR_PRIVATE_KEY_HERE",
    "PRIVATE_KEY_CONTENT",
    "your-private-key",
    "your-key-here",
    "{private_key}",
    "${private_key}",
    "{{private_key}}",
    "{PRIVATE_KEY}",
    "${PRIVATE_KEY}",
    "{{PRIVATE_KEY}}",
    "REPLACE_WITH_PRIVATE_KEY",
    "INSERT_PRIVATE_KEY_HERE",
    "<private_key>",
    "<PRIVATE_KEY>",
    "[private_key]",
    "[PRIVATE_KEY]",
];

/**
 * Check if the private key content looks like a real private key or a placeholder
 */
function isLikelyRealPrivateKey(keyContent: string): boolean {
    // Remove common whitespace and newlines for analysis
    const cleanContent = keyContent.replace(/\s+/g, "");

    // Check if it's in the builtin ignored patterns
    if (BUILTIN_IGNORED_PATTERNS.some((pattern) => cleanContent.includes(pattern.replace(/\s+/g, "")))) {
        return false;
    }

    // Very short content is likely a placeholder
    if (cleanContent.length < 10) {
        return false;
    }

    // Only filter out the most obvious placeholder patterns
    // Real private keys have variety in characters and good length
    const uniqueChars = new Set(cleanContent).size;
    if (uniqueChars < 3) {
        return false;
    }

    return true;
}

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
    const PRIVATE_KEY_PATTERN =
        /-----BEGIN\s?((?:DSA|RSA|EC|PGP|OPENSSH|[A-Z]{2,16})?\s?PRIVATE KEY(\sBLOCK)?)-----[\s\S]{1,10000}?-----END\s?\1-----/gm;
    const results = source.content.matchAll(PRIVATE_KEY_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";

        // Extract the content between BEGIN and END markers to validate it
        const beginMarker = result[1] || "PRIVATE KEY";
        const beginPattern = new RegExp(`-----BEGIN\\s?${beginMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-----\\s*`);
        const endPattern = new RegExp(`\\s*-----END\\s?${beginMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-----`);

        const beginMatch = match.match(beginPattern);
        const endMatch = match.match(endPattern);

        // If we can extract the key content, validate it
        if (beginMatch && endMatch) {
            const keyContent = match.slice(beginMatch[0].length, match.length - endMatch[0].length);

            // Skip if the key content doesn't look like a real private key
            if (!isLikelyRealPrivateKey(keyContent)) {
                continue;
            }
        }
        // If we can't extract the key content properly, still proceed with original logic
        // (this maintains backward compatibility for edge cases)

        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("PrivateKey", {
                KEY: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-privatekey",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-privatekey/README.md",
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
            },
        };
    },
};
