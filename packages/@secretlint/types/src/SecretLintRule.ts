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
         * - Keywords are checked only for text content. The rule's handlers are always called for binary content,
         *   if the rule supports it.
         *
         * Default: undefined (the rule's handlers are always called)
         */
        keywords?: string[];
    };
    /**
     * Declarative patterns of the rule.
     * If patterns are defined, secretlint runs the patterns instead of calling `create()`.
     * Secretlint scans the content once for the keywords of all patterns,
     * runs the regular expression of a pattern only where its keywords are found,
     * and calls `report()` of the pattern for each match.
     *
     * `create()` is still required, because an older secretlint does not know `patterns` and calls `create()`.
     * `defineRule()` of `@secretlint/define-rule` creates `create()` and `meta.keywords` from the patterns.
     */
    patterns?: SecretLintRulePattern<Options>[];

    create(context: SecretLintRuleContext, options: Options): SecretLintRuleReportHandler;
};
/**
 * A match of {@link SecretLintRulePattern}
 */
export type SecretLintRulePatternMatch = {
    /**
     * The matched text. It is `match[0]` of the regular expression.
     */
    text: string;
    /**
     * The range of the matched text in the source content.
     */
    range: readonly [startIndex: number, endIndex: number];
    /**
     * The result of the regular expression: `captures[0]` is the matched text and `captures[1]` is the first group.
     */
    captures: readonly (string | undefined)[];
    /**
     * Named capture groups of the regular expression
     */
    groups: { [key: string]: string | undefined } | undefined;
};
/**
 * The context for `report()` of {@link SecretLintRulePattern}
 */
export type SecretLintRulePatternContext<Options = SecretLintRuleCreatorOptions> = SecretLintRuleContext & {
    /**
     * The options of the rule. It is `{}` if the options are not defined in the config.
     */
    options: Options;
    /**
     * The source code that has the match
     */
    source: SecretLintSourceCode;
};
export type SecretLintRulePattern<Options = SecretLintRuleCreatorOptions> = {
    /**
     * The regular expression that finds the secret.
     * Secretlint finds all matches of the pattern, regardless of the "g" flag.
     */
    pattern: RegExp;
    /**
     * Keywords for pre-filtering.
     * Secretlint runs the pattern only when the content contains at least one of the keywords.
     *
     * - Keywords are matched ASCII case-insensitively.
     * - Every match of the pattern must contain one of the keywords.
     *   If `scope` is "line", the line of the match must contain one of the keywords.
     * - Empty keywords and non-ASCII keywords disable the pre-filter for the pattern.
     *
     * Default: undefined (the pattern runs for all content)
     */
    keywords?: string[];
    /**
     * The scope that the pattern needs to see.
     *
     * - "file": the pattern runs on the whole content.
     * - "line": the pattern runs on each line that contains a keyword. The line includes its line break ("\n").
     *   Use "line" if a match never includes a line break, and the result does not depend on other lines.
     *   For example, `^` and `$` without the "m" flag are the start and the end of the line in the "line" scope.
     *   "line" is faster than "file", because secretlint does not need to read the other lines.
     *
     * "line" requires `keywords`. If `keywords` is not valid, the pattern runs in the "file" scope.
     *
     * Default: "file"
     */
    scope?: "line" | "file";
    /**
     * Called for each match of the pattern.
     * Check the match (allow list, checksum, etc.) and call `context.report()`.
     */
    report(match: SecretLintRulePatternMatch, context: SecretLintRulePatternContext<Options>): void;
};
export type SecretLintRuleReportHandler = {
    // TODO: pre-all
    file?(source: SecretLintSourceCode): void | Promise<void>;
    identifier?(node: SecretLintSourceIdentifierNode, source: SecretLintSourceCode): void | Promise<void>;
    // TODO: post-all
};
