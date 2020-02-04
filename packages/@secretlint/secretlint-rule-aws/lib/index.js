"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regx = require('regx');
const matchAll = require('string.prototype.matchall');
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
const reportAWSAccessKey = (source, context) => {
    // AWS Access Key ID
    // Example) AKIAIOSFODNN7EXAMPLE
    const AWSAccessKeyIDPattern = /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g;
    const results = matchAll(source.content, AWSAccessKeyIDPattern);
    for (const result of results) {
        const index = result.index || 0;
        const range = [index, index + (result.input || "").length];
        context.report({
            message: "found AWS Access Key ID: {{ID}}",
            data: {
                ID: result.input
            },
            range
        });
    }
};
const reportAWSSecretKey = (source, context) => {
    const AWS = "(AWS|aws|Aws)?_?";
    const QUOTE = `("|')`;
    const CONNECT = "\\s*(:|=>|=)\\s*";
    const AWSSecretPatten = regx(`${QUOTE}${AWS}(SECRET|secret|Secret)?_?(ACCESS|access|Access)?_?(KEY|key|Key)${QUOTE}${CONNECT}${QUOTE}[A-Za-z0-9/\+=]{40}${QUOTE}`);
    const results = matchAll(source.content, AWSSecretPatten);
    for (const result of results) {
        const index = result.index || 0;
        const range = [index, index + (result.input || "").length];
        context.report({
            message: "found AWS Secret Access Key: {{key}}",
            data: {
                key: result.input
            },
            range
        });
    }
};
const reportAWSAccountID = (source, context) => {
    const AWS = "(AWS|aws|Aws)?_?";
    const QUOTE = `("|')`;
    const CONNECT = "\\s*(:|=>|=)\\s*";
    const AWSSecretPatten = regx(`${QUOTE}${AWS}(ACCOUNT|account|Account)_?(ID|id|Id)?${QUOTE}${CONNECT}${QUOTE}[0-9]{4}\-?[0-9]{4}\-?[0-9]{4}${QUOTE}`);
    const results = matchAll(source.content, AWSSecretPatten);
    for (const result of results) {
        const index = result.index || 0;
        const range = [index, index + (result.input || "").length];
        context.report({
            message: "found AWS Account ID: {{ID}}",
            data: {
                ID: result.input
            },
            range
        });
    }
};
const creator = {
    meta: {
        recommended: true,
        type: "scanner"
    },
    create(context, _options) {
        return {
            file(source) {
                reportAWSAccessKey(source, context);
                reportAWSSecretKey(source, context);
                reportAWSAccountID(source, context);
            }
        };
    }
};
exports.default = creator;
//# sourceMappingURL=index.js.map