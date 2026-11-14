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
/**
 * The content types that a rule checks.
 * A rule that checks both text and binary content lists both: `["text", "binary"]`.
 */
export type SecretLintRuleContentType = "binary" | "text";
type SecretLintRuleCreatorBase = {
    messages: SecretLintRuleLocalizeMessages;
    meta: {
        id: string;
        type: "scanner" | "filter";
        recommended: boolean;
        docs?: {
            url: string;
        };
        /**
         * The content types that the rule checks.
         * If it is only "text", secretlint does not pass a binary to this rule.
         * Note: secretlint still treats "all" of older rules as both text and binary.
         */
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
};
/**
 * A keyword of a pattern: a string, or a keyword with a guard.
 *
 * A guard is for a keyword that is short or common, such as `00`. Such a keyword is in most files,
 * so the keyword alone does not tell where the secret can be.
 * `{ keyword: "00", after: "[A-Za-z0-9_-]{40,}" }` is the keyword `00` only where 40 or more characters
 * of the set follow it. Secretlint checks the guard while it looks for the keywords.
 *
 * - `keyword` is written as a keyword of a string is, and it is matched ASCII case-insensitively.
 * - `after` is one set of ASCII characters and one least count, in the syntax of regular expressions:
 *   `[` and `]` around characters and ranges, and `{n,}` (n is from 1 to 255).
 *   In the set, `\` is written only before `\` and `]`, and a `-` as a character is the last item.
 * - The set is compared as it is written: `[a-f0-9]` does not have `A`.
 * - The syntax is strict. Other forms, such as `{40}`, `{32,40}`, `+`, `\d`, and `[^...]`, are an error.
 * - Every match of the pattern that contains the keyword must also have the characters that meet the guard
 *   after it. The tests of `@secretlint/tester` fail if a guard rejects a secret that the pattern reports.
 *
 * @example
 * // The regular expression has 40 characters after "00", so every match meets the guard
 * {
 *     pattern: /(?<![A-Za-z0-9_-])00[A-Za-z0-9_-]{40}(?![A-Za-z0-9_-])/g,
 *     keywords: [{ keyword: "00", after: "[A-Za-z0-9_-]{40,}" }],
 *     scope: "line",
 *     report(match, context) {}
 * }
 */
export type SecretLintRulePatternKeyword = string | { keyword: string; after: string };
/**
 * A rule that is defined with code.
 * It is for a rule that can not be written as `patterns`, for example a rule that parses the content.
 */
export type SecretLintRuleHandlerCreator<Options = SecretLintRuleCreatorOptions> = SecretLintRuleCreatorBase & {
    /**
     * Create the handlers of the rule.
     */
    create(context: SecretLintRuleContext, options: Options): SecretLintRuleReportHandler;
    patterns?: undefined;
};
/**
 * A rule that is defined with declarative patterns.
 * Secretlint scans the content once for the keywords of all patterns,
 * runs the regular expression of a pattern only where its keywords are found,
 * and calls `report()` of the pattern for each match.
 */
export type SecretLintRulePatternCreator<
    Options = SecretLintRuleCreatorOptions,
    When extends string = SecretLintRulePatternWhen<Options>,
> = SecretLintRuleCreatorBase & {
    patterns: SecretLintRulePattern<Options, When>[];
    /**
     * Secretlint that supports `patterns` does not call `create()` of a rule that has `patterns`.
     * Define it only if the rule should also work on secretlint that does not support `patterns`:
     * such a secretlint requires `create()`, and it ignores `patterns`.
     */
    create?(context: SecretLintRuleContext, options: Options): SecretLintRuleReportHandler;
};
/**
 * A rule is defined with `create()` or with `patterns`.
 *
 * `When` is the strings that `when` of a pattern accepts.
 * It is computed from `Options`, so you do not need to pass it.
 * It is a type parameter of its own so that a rule with its own `Options` is assignable to
 * `SecretLintRuleCreator<unknown>`, such as an item of `rules` of a preset.
 */
export type SecretLintRuleCreator<
    Options = SecretLintRuleCreatorOptions,
    When extends string = SecretLintRulePatternWhen<Options>,
> = SecretLintRuleHandlerCreator<Options> | SecretLintRulePatternCreator<Options, When>;
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
/**
 * The names of the options whose value is a boolean.
 * If the type of the options has no property, such as the default `{}` and `unknown`, any name is accepted.
 */
export type SecretLintRulePatternBooleanOptionName<Options> = [keyof Options] extends [never]
    ? string
    : Extract<
          {
              [Name in keyof Options]-?: NonNullable<Options[Name]> extends boolean ? Name : never;
          }[keyof Options],
          string
      >;
/**
 * The strings that `when` of a pattern accepts:
 * `options.` and the name of a boolean option of the rule, with or without `!` before it.
 */
export type SecretLintRulePatternWhen<Options> =
    | `options.${SecretLintRulePatternBooleanOptionName<Options>}`
    | `!options.${SecretLintRulePatternBooleanOptionName<Options>}`;
/**
 * A pattern of a rule.
 *
 * Secretlint throws an error if a pattern has a property that it does not know.
 * So a rule that uses a property of a newer secretlint does not run on an older secretlint with a different result.
 * The meaning of a property is never changed: a change is added as a property with a new name.
 */
export type SecretLintRulePattern<
    Options = SecretLintRuleCreatorOptions,
    When extends string = SecretLintRulePatternWhen<Options>,
> = {
    /**
     * The regular expression that finds the secret.
     * Secretlint finds all matches of the pattern, regardless of the "g" flag.
     */
    pattern: RegExp;
    /**
     * Keywords for pre-filtering.
     * Secretlint runs the pattern only when the content contains at least one of the keywords.
     *
     * - Keywords are always matched ASCII case-insensitively.
     * - Every match of the pattern must contain one of the keywords.
     *   If `scope` is "line", the line of the match must contain one of the keywords.
     * - Empty keywords and non-ASCII keywords disable the pre-filter for the pattern.
     * - An item can be a keyword with a guard. See {@link SecretLintRulePatternKeyword}.
     *
     * Default: undefined (the pattern runs for all content)
     */
    keywords?: SecretLintRulePatternKeyword[];
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
     * The condition for the pattern to be a part of the lint.
     * It refers to a boolean option of the rule as `options.<name>`:
     *
     * - `"options.name"`: the pattern is enabled only when the option is `true`.
     * - `"!options.name"`: the pattern is enabled unless the option is `true`.
     *
     * An option that is not set is `false`.
     * Secretlint throws an error if the value of the option is not a boolean.
     *
     * Secretlint reads the option once for a config, and a disabled pattern is not a part of the lint:
     * its keywords are not searched, and the pattern never runs.
     * Use it for a pattern that an option turns on or off, instead of checking the option in `report()`.
     *
     * Only these two forms are supported. Secretlint throws an error on any other string.
     *
     * Default: undefined (the pattern is always enabled)
     * @example
     * // type Options = { enableIDScanRule?: boolean }
     * when: "options.enableIDScanRule"
     */
    when?: When;
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
