import {
    SecretLintRuleContentType,
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintRuleReportHandler,
    SecretLintSourceCode
} from "@secretlint/types";

export type SecretLintRuleOptions = {
    ruleCreator: SecretLintRuleCreator;
    ruleCreatorOptions: SecretLintRuleCreatorOptions;
    context: SecretLintRuleContext;
};

export class SecretLintRule {
    private ruleReportHandle: SecretLintRuleReportHandler;
    private ruleCreator: SecretLintRuleCreator;

    constructor({ ruleCreator, ruleCreatorOptions, context }: SecretLintRuleOptions) {
        this.ruleCreator = ruleCreator;
        this.ruleReportHandle = ruleCreator.create(context, ruleCreatorOptions);
    }

    isSupportContentType(contentType: SecretLintRuleContentType) {
        if (this.ruleCreator.meta.supportedContentTypes.includes("all")) {
            return true;
        }
        return this.ruleCreator.meta.supportedContentTypes.includes(contentType);
    }

    async file(source: SecretLintSourceCode) {
        const file = this.ruleReportHandle.file;
        if (!file) {
            return;
        }
        return file(source);
    }
}
