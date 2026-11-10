// Rule Interfaces
import type { SecretLintSourceIdentifierNode } from "./SecretLintSource.js";
import type {
    SecretLintRuleLocalizeMessages,
    SecretLintRuleMessageTranslate,
    SecretLintRuleMessageTranslateResult,
} from "./SecretLintRuleTranslator.js";
import type { SecretLintSourceCode } from "./SecretLintSourceCode.js";
import type { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions.js";

export type SecretLintRuleReportDescriptor = {
    message: SecretLintRuleMessageTranslateResult<any>;
    range: readonly [startIndex: number, endIndex: number];
    data?: {};
};
export type SecretLintRuleIgnoreDescriptor = {
    message: SecretLintRuleMessageTranslateResult<any>;
    /**
     *  Specify target rule id is ignored.
     *  If Set "*", match any rule id.
     *  Examples:
     *  { targetRuleId: "@secretlint/secretelint-rule-example" }
     *  { targetRuleId: "*" }
     */
    targetRuleId: string;
    range: readonly [startIndex: number, endIndex: number];
};

export type SecretLintRuleContext = {
    sharedOptions: SecretlintCoreSharedOptions;
    createTranslator<T extends SecretLintRuleLocalizeMessages>(messages: T): SecretLintRuleMessageTranslate<T>;
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
        /**
         * Keywords for pre-filtering.
         * If keywords are defined, secretlint calls the rule's handlers only when the source content contains
         * at least one of the keywords. Secretlint scans the content once for the keywords of all rules,
         * so a rule does not need to run its regular expressions on files that can not contain its secrets.
         *
         * - Keywords are matched ASCII case-insensitively.
         * - Every match the rule can report must contain one of the keywords. Otherwise the rule misses it.
         *   For example, `/ghp_[A-Za-z0-9]{36}/` can use `["ghp_"]`.
         * - Do not define keywords if the rule can report without a fixed string,
         *   for example a rule that checks the file name or uses a pattern from the options.
         * - Empty keywords and non-ASCII keywords disable the pre-filter for the rule.
         *
         * Default: undefined (the rule's handlers are always called)
         */
        keywords?: string[];
    };

    create(context: SecretLintRuleContext, options: Options): SecretLintRuleReportHandler;
};
export type SecretLintRuleReportHandler = {
    // TODO: pre-all
    file?(source: SecretLintSourceCode): void | Promise<void>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSourceCode): void | Promise<void>;
    // TODO: post-all
};
