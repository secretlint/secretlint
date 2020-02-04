export interface SecretLintReportDescriptor {
    message: string;
    range: number[];
    data?: {};
}

export interface SecretLintContext {
    report(descriptor: SecretLintReportDescriptor): void;
}

export interface SecretLintRuleCreator<Options = {}> {
    meta: {
        type: "scanner";
        recommended: boolean;
    };

    create(context: SecretLintContext, options: Options): SecretLintRuleReportHandler;
}

export declare type SecretLintSource = {
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

export declare type SecretLintSourceNodeRange = [number, number];
export declare type SecretLintSourceValueNode = {
    type: "Value";
    value: string;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
};
export declare type SecretLintSourceIdentifierNode = {
    type: "Identifier";
    name: string;
    value?: SecretLintSourceValueNode;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
};
export declare type SecretLintRuleReportHandler = {
    file?(source: SecretLintSource): void | Promise<any>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSource): void | Promise<any>;
};
