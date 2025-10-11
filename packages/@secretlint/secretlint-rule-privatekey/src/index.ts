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

/**
 * Regular expression to detect private keys and extract Base64 content in one pass
 * Based on https://docs.cribl.io/docs/regexesyml
 * Captures the Base64 content (group 1) between BEGIN and END markers
 */
const PEM_CONTENT_PATTERN =
    /-----BEGIN\s?(?:(?:DSA|RSA|EC|PGP|OPENSSH|[A-Z]{2,16})?\s?PRIVATE KEY(?:\sBLOCK)?)-----\n?([\s\S]+?)\n?-----END\s?(?:(?:DSA|RSA|EC|PGP|OPENSSH|[A-Z]{2,16})?\s?PRIVATE KEY(?:\sBLOCK)?)-----/gm;

/**
 * Validate if the Base64 content is a real private key or a placeholder
 * Based on Base64 validation approach without decoding
 *
 * References:
 * - RFC 7468: Textual Encodings of PKIX, PKCS, and CMS Structures
 *   https://tools.ietf.org/html/rfc7468
 * - RFC 4648: The Base16, Base32, and Base64 Data Encodings
 *   https://datatracker.ietf.org/doc/html/rfc4648
 * - RFC 5208: PKCS #8: Private-Key Information Syntax v1.2
 *   https://datatracker.ietf.org/doc/html/rfc5208
 * - RFC 5958: Asymmetric Key Packages
 *   https://datatracker.ietf.org/doc/html/rfc5958
 * - RFC 3447: PKCS #1: RSA Cryptography Specifications v2.1
 *   https://datatracker.ietf.org/doc/html/rfc3447
 * - OpenSSH PROTOCOL.key
 *   https://github.com/openssh/openssh-portable/blob/master/PROTOCOL.key
 *
 * @param base64Content - The Base64-encoded key content (without PEM headers)
 * @returns true if it's likely a real private key, false if it's a placeholder
 */
function validateBase64KeyContent(base64Content: string): boolean {
    // 1. Base64 format validation (RFC 4648)
    // Reject non-Base64 characters like "...", "***", "xxx"
    if (!/^[A-Za-z0-9+/]+=*$/.test(base64Content)) {
        return false;
    }

    // 2. Minimum length check (Base64 100 chars = ~75 bytes decoded)
    // Real keys are much longer: RSA-1024 ≈ 800 chars, EC-256 ≈ 120 chars
    if (base64Content.length < 100) {
        return false;
    }

    // 3. Magic byte check (in Base64)
    // ASN.1 format (PKCS#1, PKCS#8, SEC1): 0x30 (SEQUENCE) → "MI*"
    // OpenSSH format: "openssh-key-v1\0" → "b3BlbnNzaC1rZXktdjE"
    const validMagicBytes = /^(MI|b3BlbnNzaC1rZXktdjE)/;

    if (!validMagicBytes.test(base64Content)) {
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
    // Use PEM_CONTENT_PATTERN to extract both full match and Base64 content in one pass
    const results = source.content.matchAll(PEM_CONTENT_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const base64Raw = result[1] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        // Remove whitespace and escaped newlines (from JSON strings)
        const base64Content = base64Raw.replace(/\s|\\n/g, "");
        // Validate if the Base64 content is a real private key
        if (!validateBase64KeyContent(base64Content)) {
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
