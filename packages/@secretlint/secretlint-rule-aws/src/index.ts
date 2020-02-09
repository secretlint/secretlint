import { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSource } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

const regx = require("regx").default("g");
const matchAll: (
    text: string,
    regExp: RegExp
) => ReturnType<typeof String.prototype.matchAll> = require("string.prototype.matchall");

export interface Options {
    allows?: string[];
}

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
const reportAWSAccessKey = (source: SecretLintSource, context: SecretLintRuleContext, options: Required<Options>) => {
    // AWS Access Key ID
    // Example) AKIAIOSFODNN7EXAMPLE
    const AWSAccessKeyIDPattern = /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g;
    const results = matchAll(source.content, AWSAccessKeyIDPattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length];
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: "found AWS Access Key ID: {{ID}}",
            data: {
                ID: match
            },
            range
        });
    }
};
const reportAWSSecretAccessKey = (
    source: SecretLintSource,
    context: SecretLintRuleContext,
    options: Required<Options>
) => {
    const AWS = "(AWS|aws|Aws)?_?";
    const QUOTE = `("|')?`;
    const CONNECT = "\\s*(:|=>|=)\\s*";
    const AWSSecretPatten = regx`${QUOTE}${AWS}(SECRET|secret|Secret)?_?(ACCESS|access|Access)?_?(KEY|key|Key)${QUOTE}${CONNECT}${QUOTE}[A-Za-z0-9/\+=]{40}${QUOTE}`;
    const results = matchAll(source.content, AWSSecretPatten);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length];
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: "found AWS Secret Access Key: {{key}}",
            data: {
                key: match
            },
            range
        });
    }
};

const reportAWSAccountID = (source: SecretLintSource, context: SecretLintRuleContext, options: Required<Options>) => {
    const AWS = "(AWS|aws|Aws)?_?";
    const QUOTE = `("|')?`;
    const CONNECT = "\\s*(:|=>|=)\\s*";
    const AWSSecretPatten = regx`${QUOTE}${AWS}(ACCOUNT|account|Account)_?(ID|id|Id)?${QUOTE}${CONNECT}${QUOTE}[0-9]{4}\-?[0-9]{4}\-?[0-9]{4}${QUOTE}`;
    const results = matchAll(source.content, AWSSecretPatten);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length];
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: "found AWS Account ID: {{ID}}",
            data: {
                ID: match
            },
            range
        });
    }
};

const creator: SecretLintRuleCreator<Options> = {
    meta: {
        recommended: true,
        type: "scanner",
        docs: {
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-aws/README.md"
        }
    },
    create(context, options) {
        const normalizedOptions: Required<Options> = {
            allows: options.allows || []
        };
        return {
            file(source: SecretLintSource) {
                reportAWSAccessKey(source, context, normalizedOptions);
                reportAWSSecretAccessKey(source, context, normalizedOptions);
                reportAWSAccountID(source, context, normalizedOptions);
            }
        };
    }
};
export default creator;
