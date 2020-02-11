import { expectType } from "tsd";
import { SecretLintRuleContext, SecretLintRuleCreator } from "../src/SecretLintRule";
import { SecretLintRawSource } from "../src/SecretLintSource";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintRuleContext;
declare var source: SecretLintRawSource;
const rule = creator.create(context, {});
if (rule.file) {
    expectType<void | Promise<void>>(rule.file(source));
}
