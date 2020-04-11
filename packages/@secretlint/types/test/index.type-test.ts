import { expectType } from "tsd";
import { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "../src";
import { SecretLintCreateRuleMessageTranslator } from "../src/SecretLintRuleTranslator";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintRuleContext;
declare var source: SecretLintSourceCode;
const rule = creator.create(context, {});
if (rule.file) {
    expectType<void | Promise<void>>(rule.file(source));
}

// translate
const messages = {
    key: {
        en: (props: { k1: string }) => `${props.k1}`
    }
};
declare var createTranslator: SecretLintCreateRuleMessageTranslator<typeof messages>;
const t = createTranslator(messages);
t("key", {
    k1: "str"
});
