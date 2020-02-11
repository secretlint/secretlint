// Rule Interfaces
import { SecretLintSourceIdentifierNode } from "./SecretLintSource";
import { createRuleMessageTranslator, SecretLintRuleTranslatorResult } from "./SecretLintRuleTranslator";
import { SecretLintSourceCode } from "./SecretLintSourceCode";

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
        id: string;
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
    file?(source: SecretLintSourceCode): void | Promise<any>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSourceCode): void | Promise<any>;
    // TODO: post-all
};
