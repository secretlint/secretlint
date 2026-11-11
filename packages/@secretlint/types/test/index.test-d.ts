import { expectTypeOf } from "vitest";
import type { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "../src/index.js";
import type { SecretLintCreateRuleMessageTranslator } from "../src/SecretLintRuleTranslator.js";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintRuleContext;
declare var source: SecretLintSourceCode;
// `create` is optional: a rule that has `patterns` does not need it
const rule = creator.create?.(context, {});
if (rule?.file) {
    expectTypeOf(rule.file(source)).toEqualTypeOf<void | Promise<void>>();
}

// translate
const messages = {
    key: {
        en: (props: { k1: string }) => `${props.k1}`,
    },
};
declare var createTranslator: SecretLintCreateRuleMessageTranslator<typeof messages>;
const t = createTranslator(messages);
t("key", {
    k1: "str",
});

// a rule is defined with `create()` or with `patterns`
const meta = { id: "rule", type: "scanner", recommended: true, supportedContentTypes: ["text"] } as const;
const baseRule = { messages, meta: { ...meta, supportedContentTypes: [...meta.supportedContentTypes] } };
expectTypeOf({ ...baseRule, create: () => ({}) }).toExtend<SecretLintRuleCreator>();
expectTypeOf({ ...baseRule, patterns: [] }).toExtend<SecretLintRuleCreator>();
expectTypeOf(baseRule).not.toExtend<SecretLintRuleCreator>();
