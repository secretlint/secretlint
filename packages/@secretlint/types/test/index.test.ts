import { expectType } from "tsd";
import { SecretLintRuleContext, SecretLintRuleCreator } from "../src/SecretLintRule";
import { SecretLintSource } from "../src/SecretLintSource";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintRuleContext;
declare var source: SecretLintSource;
const rule = creator.create(context, {});
if (rule.file) {
    expectType<void | Promise<void>>(rule.file(source));
}
