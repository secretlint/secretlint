import { expectTypeOf, test } from "vitest";
import type { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "../src/index.js";
import type { SecretLintCreateRuleMessageTranslator } from "../src/SecretLintRuleTranslator.js";

test("SecretLintRuleCreator types", () => {
    const creator = {} as SecretLintRuleCreator;
    const context = {} as SecretLintRuleContext;
    const source = {} as SecretLintSourceCode;
    const rule = creator.create(context, {});
    if (rule.file) {
        expectTypeOf(rule.file(source)).toMatchTypeOf<void | Promise<void>>();
    }
});

test("SecretLintCreateRuleMessageTranslator types", () => {
    const messages = {
        key: {
            en: (props: { k1: string }) => `${props.k1}`,
        },
    };
    const createTranslator = {} as SecretLintCreateRuleMessageTranslator<typeof messages>;
    const t = createTranslator(messages);
    expectTypeOf(t).toBeCallableWith("key", { k1: "str" });
});
