import { expectTypeOf } from "vitest";
import type { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "../src/index.js";
import type { SecretLintCreateRuleMessageTranslator } from "../src/SecretLintRuleTranslator.js";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintRuleContext;
declare var source: SecretLintSourceCode;
const rule = creator.create(context, {});
if (rule.file) {
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
