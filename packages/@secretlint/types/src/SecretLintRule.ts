// Rule Interfaces
import { SecretLintSource, SecretLintSourceIdentifierNode } from "./SecretLintSource";
import { createRuleMessageTranslator, SecretLintRuleTranslatorResult } from "./SecretLintRuleTranslator";

export type SecretLintRuleReportDescriptor = {
    message: string | SecretLintRuleTranslatorResult<{}>;
    range: number[];
    data?: {};
};
export type SecretLintRuleIgnoreDescriptor = {
    message: string;
    range: number[];
    data?: {};
};
export type SecretLintRuleContext = {
    sharedOptions?: {};
    createTranslator: createRuleMessageTranslator;
    report(descriptor: SecretLintRuleReportDescriptor): void;
    ignore(descriptor: SecretLintRuleIgnoreDescriptor): void;
};
export type SecretLintRuleCreatorOptions = {};
export type SecretLintRuleCreator<Options = SecretLintRuleCreatorOptions> = {
    meta: {
        type: "scanner";
        recommended: boolean;
        docs?: {
            url: string;
        };
    };

    create(context: SecretLintRuleContext, options: Options): SecretLintRuleReportHandler;
};
export type SecretLintRuleReportHandler = {
    // TODO: pre-all
    file?(source: SecretLintSource): void | Promise<any>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSource): void | Promise<any>;
    // TODO: post-all
};
