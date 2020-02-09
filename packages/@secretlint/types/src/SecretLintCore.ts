// Core Input and Output
import { SecretLintRuleIgnoreDescriptor, SecretLintRuleReportDescriptor } from "./SecretLintRule";

export type SecretLintCoreResult = {
    filePath: string;
    messages: SecretLintCoreResultMessage[];
};
export type SecretLintCoreResultMessage = {
    message: string;
    range: number[];
    data?: {};
};
export type SecretLintCoreReportDescriptor = {
    ruleId: string;
} & SecretLintRuleReportDescriptor;

export type SecretLintCoreIgnoreDescriptor = {
    ruleId: string;
} & SecretLintRuleIgnoreDescriptor;
