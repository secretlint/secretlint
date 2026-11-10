import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintRuleLocalizeMessages,
    SecretLintRulePattern,
    SecretLintRulePatternContext,
    SecretLintSourceCode,
} from "@secretlint/types";

export type SecretLintRuleDefinition<Options = SecretLintRuleCreatorOptions> = {
    messages: SecretLintRuleLocalizeMessages;
    /**
     * `meta.keywords` is created from the keywords of the patterns, if it is not defined.
     */
    meta: SecretLintRuleCreator<Options>["meta"];
    /**
     * Patterns of the rule. See `SecretLintRulePattern` of `@secretlint/types`.
     */
    patterns: SecretLintRulePattern<Options>[];
};

/**
 * Return a copy of the regular expression with the "g" flag.
 */
const toGlobalRegExp = (pattern: RegExp): RegExp => {
    return new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
};

/**
 * Return the keywords of all patterns.
 * Return undefined if a pattern has no keywords, because the rule should run for all content.
 */
const collectKeywords = (patterns: SecretLintRulePattern<any>[]): string[] | undefined => {
    const keywords = new Set<string>();
    for (const pattern of patterns) {
        if (!Array.isArray(pattern.keywords) || pattern.keywords.length === 0) {
            return undefined;
        }
        pattern.keywords.forEach((keyword) => keywords.add(keyword));
    }
    return patterns.length > 0 ? [...keywords] : undefined;
};

/**
 * Run the patterns on the whole content.
 * It reports the same messages as secretlint that supports `patterns`, but it does not use keywords and scopes.
 */
const runPatterns = <Options>(
    patterns: { pattern: SecretLintRulePattern<Options>; regex: RegExp }[],
    source: SecretLintSourceCode,
    context: SecretLintRuleContext,
    options: Options,
): void => {
    const patternContext: SecretLintRulePatternContext<Options> = {
        sharedOptions: context.sharedOptions,
        createTranslator: (messages) => context.createTranslator(messages),
        report: (descriptor) => context.report(descriptor),
        ignore: (descriptor) => context.ignore(descriptor),
        options,
        source,
    };
    for (const { pattern, regex } of patterns) {
        for (const match of source.content.matchAll(regex)) {
            const text = match[0];
            const startIndex = match.index ?? 0;
            pattern.report(
                {
                    text,
                    range: [startIndex, startIndex + text.length],
                    captures: match,
                    groups: match.groups,
                },
                patternContext,
            );
        }
    }
};

/**
 * Define a rule with declarative patterns.
 *
 * A pattern is a regular expression, its keywords, and a `report()` function.
 * Secretlint scans the content once for the keywords of all rules,
 * runs the regular expression only where the keywords are found, and calls `report()` for each match.
 *
 * The returned rule also has `create()` and `meta.keywords` for secretlint that does not support `patterns`.
 * `create()` runs the patterns on the whole content, so the rule reports the same messages on any version.
 *
 * @example
 * export const creator = defineRule<Options>({
 *     messages,
 *     meta: { id: "example", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
 *     patterns: [
 *         {
 *             pattern: /ghp_[A-Za-z0-9_]{36}/g,
 *             keywords: ["ghp_"],
 *             scope: "line",
 *             report(match, context) {
 *                 const t = context.createTranslator(messages);
 *                 context.report({ message: t("GitHubToken", { TOKEN: match.text }), range: match.range });
 *             },
 *         },
 *     ],
 * });
 */
export const defineRule = <Options = SecretLintRuleCreatorOptions>(
    definition: SecretLintRuleDefinition<Options>,
): SecretLintRuleCreator<Options> => {
    const patterns = definition.patterns;
    const compiledPatterns = patterns.map((pattern) => ({ pattern, regex: toGlobalRegExp(pattern.pattern) }));
    const keywords = definition.meta.keywords ?? collectKeywords(patterns);
    return {
        messages: definition.messages,
        meta: keywords === undefined ? definition.meta : { ...definition.meta, keywords },
        patterns,
        create(context, options) {
            return {
                file(source: SecretLintSourceCode) {
                    // options is {} by default
                    runPatterns(compiledPatterns, source, context, options ?? ({} as Options));
                },
            };
        },
    };
};
