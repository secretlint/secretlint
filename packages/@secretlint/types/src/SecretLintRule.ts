// Rule Interfaces
import { SecretLintSourceIdentifierNode } from "./SecretLintSource";
import {
    createRuleMessageTranslator,
    SecretLintRuleLocalizeMessages,
    SecretLintRuleTranslatorResult
} from "./SecretLintRuleTranslator";
import { SecretLintSourceCode } from "./SecretLintSourceCode";

export type SecretLintRuleReportDescriptor = {
    message: SecretLintRuleTranslatorResult<{}>;
    range: number[];
    data?: {};
};
export type SecretLintRuleIgnoreDescriptor = {
    message: SecretLintRuleTranslatorResult<{}>;
    /**
     *  Specify target rule id is ignored.
     *  If Set "*", match any rule id.
     *  Examples:
     *  { targetRuleId: "@secretlint/secretelint-rule-example" }
     *  { targetRuleId: "*" }
     */
    targetRuleId: string;
    range: number[];
};
export type SecretLintRuleContext = {
    sharedOptions?: {};
    createTranslator: createRuleMessageTranslator;
    report(descriptor: SecretLintRuleReportDescriptor): void;
    ignore(descriptor: SecretLintRuleIgnoreDescriptor): void;
};
export type SecretLintRuleCreatorOptions = {};
export type SecretLintRuleContentType = "binary" | "text" | "all";
export type SecretLintRuleCreator<Options = SecretLintRuleCreatorOptions> = {
    messages: SecretLintRuleLocalizeMessages;
    meta: {
        id: string;
        type: "scanner" | "filter";
        recommended: boolean;
        docs?: {
            url: string;
        };
        // meta information for optimizing
        // If supportedContentTypes is only "text", secretlint does not pass a binary to this rule
        // Default: all
        supportedContentTypes: SecretLintRuleContentType[];
    };

    create(context: SecretLintRuleContext, options: Options): SecretLintRuleReportHandler;
};
export type SecretLintRuleReportHandler = {
    // TODO: pre-all
    file?(source: SecretLintSourceCode): void | Promise<any>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSourceCode): void | Promise<any>;
    // TODO: post-all
};
