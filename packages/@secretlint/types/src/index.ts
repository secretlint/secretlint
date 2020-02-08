// Lint
export type SecretLintResult = {
    filePath: string;
    messages: SecretLintResultMessage[];
};

export type SecretLintResultMessage = {
    message: string;
    range: number[];
    data?: {};
};

// Rule Interfaces
// Report
export type SecretLintReportDescriptor = {
    message: string;
    range: number[];
    data?: {};
};
export type SecretLintIgnoreDescriptor = {
    message: string;
    range: number[];
    data?: {};
};

export type SecretLintContext = {
    sharedOptions?: {};

    report(descriptor: SecretLintReportDescriptor): void;
    ignore(descriptor: SecretLintIgnoreDescriptor): void;
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

    create(context: SecretLintContext, options: Options): SecretLintRuleReportHandler;
};

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

export type SecretLintRuleReportHandler = {
    // TODO: pre-all
    file?(source: SecretLintSource): void | Promise<any>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSource): void | Promise<any>;
    // TODO: post-all
};
