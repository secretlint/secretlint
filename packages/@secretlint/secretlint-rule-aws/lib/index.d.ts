import { SecretLintRuleCreator } from "@secretlint/types";
export interface Options {
    allows?: string[];
}
declare const creator: SecretLintRuleCreator<Options>;
export default creator;
