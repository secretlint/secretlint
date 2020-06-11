import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

require("string.prototype.matchall").shim();

export const messages = {
    PATTERN: {
        en: (props: { PATTERN_NAME: string, CREDENTIAL: string }) => `found matching ${props.PATTERN_NAME}: ${props.CREDENTIAL}`
    },
};

export type PatternType = {
    name: string;
    pattern: string;
}

export type Options = {
    allows?: string[];
    patterns?: PatternType[]
};

function reportIfFoundPattern({
    source,
    options,
    context,
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    for (const p of options.patterns) {
      /**
      * The next several lines were to allow the configuration to be the full regex string
      * and to break it down to what the RegExp class expects
      **/
      const lastIndex = p.pattern.lastIndexOf('/')
      const regexText = p.pattern.startsWith('/') ? p.pattern.substr(1, lastIndex - 1) : p.pattern.substr(0, lastIndex - 1)
      const flags = p.pattern.endsWith('/') ? 'g' : p.pattern.substr(lastIndex + 1)
      const regex = new RegExp(regexText, flags)
      const results = source.content.matchAll(regex);
      for (const result of results) {
          const index = result.index || 0;
          const match = result[0] || "";
          const range = [index, index + match.length];
          const allowedResults = matchPatterns(match, options.allows);
          if (allowedResults.length > 0) {
              continue;
          }
          context.report({
              message: t("PATTERN", {
                  PATTERN_NAME: p.name,
                  CREDENTIAL: match,
              }),
              range,
          });
      }
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-pattern",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
            patterns: options.patterns || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundPattern({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
export default creator;
