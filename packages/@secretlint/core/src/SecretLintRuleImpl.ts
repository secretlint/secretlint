import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintCoreConfigRule,
    SecretLintRuleReportHandler,
    SecretLintSourceCode,
} from "@secretlint/types";
import { AllowMessage } from "./messages/filter-message-id.js";

export type SecretLintRuleOptions = {
    context: SecretLintRuleContext;
    descriptorRule: SecretLintCoreConfigRule;
};

export class SecretLintRule {
    private ruleReportHandle: SecretLintRuleReportHandler;
    private ruleCreator: SecretLintRuleCreator;
    private descriptorRule: SecretLintCoreConfigRule;

    constructor({ descriptorRule, context }: SecretLintRuleOptions) {
        this.descriptorRule = descriptorRule;
        this.ruleCreator = descriptorRule.rule;
        // normalize rule options
        const ruleCreatorOptions = descriptorRule.options || {};
        this.ruleReportHandle = this.ruleCreator.create(context, ruleCreatorOptions);
    }

    allowMessageIds(): AllowMessage[] {
        if (!this.descriptorRule.allowMessageIds) {
            return [];
        }
        const ruleId = this.ruleCreator.meta.id;
        return this.descriptorRule.allowMessageIds.map((allowMessageId) => {
            return {
                messageId: allowMessageId,
                ruleId,
            };
        });
    }

    supportSourceCode(sourceCode: SecretLintSourceCode) {
        const contentType = sourceCode.contentType;
        if (contentType === "unknown") {
            return true;
        }
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
