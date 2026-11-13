import { expectTypeOf } from "vitest";
import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRulePattern,
    SecretLintRulePresetCreator,
    SecretLintSourceCode,
} from "../src/index.js";
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

// `when` of a pattern refers to a boolean option of the rule as `options.<name>`, with or without "!"
type ScanOptions = { allows?: string[]; enableIDScan?: boolean; strict: boolean };
expectTypeOf<SecretLintRulePattern<ScanOptions>["when"]>().toEqualTypeOf<
    "options.enableIDScan" | "options.strict" | "!options.enableIDScan" | "!options.strict" | undefined
>();
// a rule without a boolean option can not use it
expectTypeOf<SecretLintRulePattern<{ allows?: string[] }>["when"]>().toEqualTypeOf<undefined>();
// any name is accepted if the type of the options has no property
expectTypeOf<SecretLintRulePattern["when"]>().toEqualTypeOf<`options.${string}` | `!options.${string}` | undefined>();
// rules with different options are in one list of a preset
declare var scanRule: SecretLintRuleCreator<ScanOptions>;
declare var allowsRule: SecretLintRuleCreator<{ allows?: string[] }>;
expectTypeOf([scanRule, allowsRule, creator]).toExtend<SecretLintRulePresetCreator["rules"]>();
expectTypeOf(scanRule).toExtend<SecretLintRuleCreator<unknown>>();
expectTypeOf(scanRule).toExtend<SecretLintRuleCreator>();
