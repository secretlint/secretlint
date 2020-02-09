// Core Interface
// Core Input and Output
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

// Rule Interfaces
export type SecretLintRuleReportDescriptor = {
    message: string;
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

// Util
export type SecretLintSource = {
    content: string;
    filePath: string;
};

export type SecretLintSourceNodePosition = {
    line: number;
    column: number;
};

/**
 * Line number starts with 1.
 * Column number starts with 0.
 */
export type SecretLintSourceNodeLocation = {
    start: SecretLintSourceNodePosition;
    end: SecretLintSourceNodePosition;
};

export type SecretLintSourceNodeRange = [number, number];
export type SecretLintSourceValueNode = {
    type: "Value";
    value: string;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
};
export type SecretLintSourceIdentifierNode = {
    type: "Identifier";
    name: string;
    value?: SecretLintSourceValueNode;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
};
