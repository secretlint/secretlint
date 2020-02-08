import { SecretLintContext, SecretLintRuleCreator, SecretLintSource } from "@secretlint/types";

export interface Options {
    allows?: string[];
}

const reportSECRET = (source: SecretLintSource, context: SecretLintContext, _options: Required<Options>) => {
    const results = source.content.matchAll(/secret/i);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length];
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
