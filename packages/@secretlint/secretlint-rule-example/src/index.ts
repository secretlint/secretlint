import { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSource } from "@secretlint/types";

export interface Options {
    allows?: string[];
}

const reportSECRET = (source: SecretLintSource, context: SecretLintRuleContext, _options: Required<Options>) => {
    const pattern = /secret/gi;
    let match;
    while ((match = pattern.exec(source.content)) !== null) {
        const index = match.index || 0;
        const matchString = match[0] || "";
        const range = [index, index + matchString.length];
        context.report({
            message: "found secret: {{ID}}",
            data: {
                ID: match
            },
            range
        });
    }
};

export const creator: SecretLintRuleCreator<Options> = {
    meta: {
        recommended: true,
        type: "scanner"
    },
    create(context, options) {
        const normalizedOptions: Required<Options> = {
            allows: options.allows || []
        };
        return {
            file(source: SecretLintSource) {
                reportSECRET(source, context, normalizedOptions);
            }
        };
    }
};
export default creator;
