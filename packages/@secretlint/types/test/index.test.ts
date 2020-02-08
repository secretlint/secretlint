import { SecretLintContext, SecretLintRuleCreator, SecretLintSource } from "../src/index";
import { expectType } from "tsd";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintContext;
declare var source: SecretLintSource;
const rule = creator.create(context, {});
if (rule.file) {
    expectType<void | Promise<void>>(rule.file(source));
}
