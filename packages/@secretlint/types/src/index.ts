// Lint
export type SecretLintResult = {
    filePath: string;
    messages: SecretLintResultMessage[];
};

export interface SecretLintResultMessage {
    message: string;
    range: number[];
    data?: {};
}

// Rule Interfaces
// Report
export interface SecretLintReportDescriptor {
    message: string;
    range: number[];
    data?: {};
}

export interface SecretLintContext {
    sharedOptions?: {};

    report(descriptor: SecretLintReportDescriptor): void;
}

export interface SecretLintRuleCreator<Options = {}> {
    meta: {
        type: "scanner";
        recommended: boolean;
        docs: {
            url: string;
        };
    };

    create(context: SecretLintContext, options: Options): SecretLintRuleReportHandler;
}

export type SecretLintSource = {
    content: string;
    filePath: string;
};

export interface SecretLintSourceNodePosition {
    line: number;
    column: number;
}

/**
 * Line number starts with 1.
 * Column number starts with 0.
 */
export interface SecretLintSourceNodeLocation {
    start: SecretLintSourceNodePosition;
    end: SecretLintSourceNodePosition;
}

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
    file?(source: SecretLintSource): void | Promise<any>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSource): void | Promise<any>;
};
