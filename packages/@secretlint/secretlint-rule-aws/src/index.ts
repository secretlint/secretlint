import { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import { SecretLintRuleMessageTranslate } from "@secretlint/types";

const regx = require("regx").default("g");
const matchAll: (
    text: string,
    regExp: RegExp
) => ReturnType<typeof String.prototype.matchAll> = require("string.prototype.matchall");

export interface Options {
    allows?: string[];
}

/**
 * These should be ignored by default, because these are used in AWS example.
 * https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-access-keys-best-practices.html
 */
export const BUILTIN_IGNORED = {
    AWSAccountID: ["AKIAIOSFODNN7EXAMPLE"],
    AWSSecretAccessKey: ["wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"]
};
export const messages = {
    AWSAccountID: {
        en: "found AWS Account ID: {{ID}}",
        ja: "AWS Account ID: {{ID}} がみつかりました"
    },
    AWSSecretAccessKey: {
        en: "found AWS Secret Access Key: {{KEY}}",
        ja: "AWS Secret Access Key: {{KEY}} がみつかりました"
    },
    AWSAccessKeyID: {
        en: "found AWS Access Key ID: {{ID}}",
        ja: "AWS Access Key Id: {{ID}} がみつかりました"
    }
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
const reportAWSAccessKey = ({
    t,
    source,
    context,
    options
}: {
    t: SecretLintRuleMessageTranslate<typeof messages>;
    source: SecretLintSourceCode;
    context: SecretLintRuleContext;
    options: Required<Options>;
}) => {
    // AWS Access Key ID
    // Example) AKIAIOSFODNN7SECRETS
    const AWSAccessKeyIDPattern = /\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g;
    const results = matchAll(source.content, AWSAccessKeyIDPattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length];
        // Built-in ignore
        if (BUILTIN_IGNORED.AWSAccountID.includes(match)) {
            continue;
        }
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("AWSAccessKeyID", {
                ID: match
            }),
            range
        });
    }
};
const reportAWSSecretAccessKey = ({
    t,
    source,
    context,
    options
}: {
    t: SecretLintRuleMessageTranslate<typeof messages>;
    source: SecretLintSourceCode;
    context: SecretLintRuleContext;
    options: Required<Options>;
}) => {
    const AWS = "(?:AWS|aws|Aws)?_?";
    const QUOTE = `["']?`;
    const CONNECT = "\\s*(?::|=>|=)\\s*";
    // git-secrets implementation match _KEY=XXX, but it is false-positive
    // https://github.com/awslabs/git-secrets/blob/5e28df337746db4f070c84f7069d365bfd0d72a8/git-secrets#L239
    // This Pattern match only `AWS?_SECRET_ACCESS_KEY=XXX`
    const AWSSecretPatten = regx`${QUOTE}${AWS}(?:SECRET|secret|Secret)_?(?:ACCESS|access|Access)_?(?:KEY|key|Key)${QUOTE}${CONNECT}${QUOTE}([A-Za-z0-9/\+=]{40})${QUOTE}\b`;
    const results = matchAll(source.content, AWSSecretPatten);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[1] || "";
        const range = [index, index + match.length];
        // Built-in ignored
        if (BUILTIN_IGNORED.AWSSecretAccessKey.includes(match)) {
            continue;
        }
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("AWSSecretAccessKey", {
                KEY: match
            }),
            range
        });
    }
};

const reportAWSAccountID = ({
    t,
    source,
    context,
    options
}: {
    t: SecretLintRuleMessageTranslate<typeof messages>;
    source: SecretLintSourceCode;
    context: SecretLintRuleContext;
    options: Required<Options>;
}) => {
    const AWS = "(AWS|aws|Aws)?_?";
    const QUOTE = `("|')?`;
    const CONNECT = "\\s*(:|=>|=)\\s*";
    const AWSSecretPatten = regx`${QUOTE}${AWS}(ACCOUNT|account|Account)_?(ID|id|Id)?${QUOTE}${CONNECT}${QUOTE}[0-9]{4}\-?[0-9]{4}\-?[0-9]{4}${QUOTE}\b`;
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
            message: t("AWSAccountID", {
                ID: match
            }),
            range
        });
    }
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-aws",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-aws/README.md"
        }
    },
    create(context, options) {
        const normalizedOptions: Required<Options> = {
            allows: options.allows || []
        };
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                reportAWSAccessKey({ t, source: source, context: context, options: normalizedOptions });
                reportAWSSecretAccessKey({ t, source: source, context: context, options: normalizedOptions });
                reportAWSAccountID({ t, source: source, context: context, options: normalizedOptions });
            }
        };
    }
};
export default creator;
