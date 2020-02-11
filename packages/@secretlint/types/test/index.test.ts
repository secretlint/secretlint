import { expectType } from "tsd";
import { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "../src";

declare var creator: SecretLintRuleCreator;
declare var context: SecretLintRuleContext;
declare var source: SecretLintSourceCode;
const rule = creator.create(context, {});
if (rule.file) {
    expectType<void | Promise<void>>(rule.file(source));
}
