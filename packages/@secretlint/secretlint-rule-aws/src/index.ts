import { defineRule } from "@secretlint/define-rule";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export interface Options {
    allows?: string[];
    /**
     * Enable ID Scan Rule
     * Default: false
     */
    enableIDScanRule?: boolean;
}

/**
 * These should be ignored by default, because these are used in AWS example.
 * https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-access-keys-best-practices.html
 */
export const BUILTIN_IGNORED = {
    AWSAccountID: ["AKIAIOSFODNN7EXAMPLE"],
    AWSSecretAccessKey: ["wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"],
};
export const messages = {
    AWSAccountID: {
        en: (props: { ID: string }) => `found AWS Account ID: ${props.ID}`,
        ja: (props: { ID: string }) => `AWS Account ID: ${props.ID} がみつかりました`,
    },
    AWSSecretAccessKey: {
        en: (props: { KEY: string }) => `found AWS Secret Access Key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `AWS Secret Access Key: ${props.KEY} がみつかりました`,
    },
    AWSAccessKeyID: {
        en: (props: { ID: string }) => `found AWS Access Key ID: ${props.ID}`,
        ja: (props: { ID: string }) => `AWS Access Key Id: ${props.ID} がみつかりました`,
    },
};
/*
  local aws="(AWS|aws|Aws)?_?" quote="(\"|')" connect="\s*(:|=>|=)\s*"
  local opt_quote="${quote}?"
  add_config 'secrets.providers' 'git secrets --aws-provider'

  add_config 'secrets.patterns' '(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'

  add_config 'secrets.patterns' "${opt_quote}${aws}(SECRET|secret|Secret)?_?(ACCESS|access|Access)?_?(KEY|key|Key)${opt_quote}${connect}${opt_quote}[A-Za-z0-9/\+=]{40}${opt_quote}"

  add_config 'secrets.patterns' "${opt_quote}${aws}(ACCOUNT|account|Account)_?(ID|id|Id)?${opt_quote}${connect}${opt_quote}[0-9]{4}\-?[0-9]{4}\-?[0-9]{4}${opt_quote}"

  add_config 'secrets.allowed' 'AKIAIOSFODNN7EXAMPLE'
  add_config 'secrets.allowed' "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

  https://docs.cribl.io/docs/regexesyml
 */
// AWS Access Key ID
// Example) AKIAIOSFODNN7EXAMPLE
const AWSAccessKeyIDPattern = /\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g;
// git-secrets implementation match _KEY=XXX, but it is false-positive
// https://github.com/awslabs/git-secrets/blob/5e28df337746db4f070c84f7069d365bfd0d72a8/git-secrets#L239
// This Pattern match only `AWS?_SECRET_ACCESS_KEY=XXX`
const AWSSecretAccessKeyPattern = (() => {
    const AWS = "(?:AWS|aws|Aws)?_?";
    const QUOTE = `["']?`;
    const CONNECT = "\\s*(?::|=>|=)\\s*";
    return new RegExp(
        String.raw`${QUOTE}${AWS}(?:SECRET|secret|Secret)_?(?:ACCESS|access|Access)_?(?:KEY|key|Key)${QUOTE}${CONNECT}${QUOTE}([A-Za-z0-9/\+=]{40})${QUOTE}\b`,
        "g",
    );
})();
const AWSAccountIDPattern = (() => {
    const AWS = "(AWS|aws|Aws)?_?";
    const QUOTE = `("|')?`;
    const CONNECT = "\\s*(:|=>|=)\\s*";
    return new RegExp(
        String.raw`${QUOTE}${AWS}(ACCOUNT|account|Account)_?(ID|id|Id)?${QUOTE}${CONNECT}${QUOTE}[0-9]{4}\-?[0-9]{4}\-?[0-9]{4}${QUOTE}\b`,
        "g",
    );
})();

export const creator = defineRule<Options>({
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-aws",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-aws/README.md",
        },
    },
    patterns: [
        {
            pattern: AWSAccessKeyIDPattern,
            keywords: ["A3T", "AKIA", "AGPA", "AIDA", "AROA", "AIPA", "ANPA", "ANVA", "ASIA"],
            // the prefixes are upper case only. "asia" and "aida" appear often in lower case
            caseSensitiveKeywords: true,
            scope: "line",
            report(match, context) {
                if (!context.options.enableIDScanRule) {
                    return;
                }
                // Built-in ignore
                if (BUILTIN_IGNORED.AWSAccountID.includes(match.text)) {
                    return;
                }
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("AWSAccessKeyID", {
                        ID: match.text,
                    }),
                    range: match.range,
                });
            },
        },
        {
            // The connector between the name and the value may include line breaks, so the scope is "file"
            pattern: AWSAccountIDPattern,
            keywords: ["ACCOUNT", "account", "Account"],
            caseSensitiveKeywords: true,
            scope: "file",
            report(match, context) {
                if (!context.options.enableIDScanRule) {
                    return;
                }
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("AWSAccountID", {
                        ID: match.text,
                    }),
                    range: match.range,
                });
            },
        },
        {
            // The connector between the name and the value may include line breaks, so the scope is "file"
            pattern: AWSSecretAccessKeyPattern,
            // SECRET_?ACCESS of the pattern
            keywords: ["secret_access", "secretaccess"],
            scope: "file",
            report(match, context) {
                const key = match.captures[1] || "";
                // Built-in ignored
                if (BUILTIN_IGNORED.AWSSecretAccessKey.includes(key)) {
                    return;
                }
                const allowedResults = matchPatterns(key, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                const startIndex = match.range[0];
                context.report({
                    message: t("AWSSecretAccessKey", {
                        KEY: key,
                    }),
                    range: [startIndex, startIndex + key.length],
                });
            },
        },
    ],
});
