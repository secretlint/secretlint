import { SecretLintCoreResult } from "@secretlint/types";

export default (results: SecretLintCoreResult[]) => {
    return JSON.stringify(results, null, 4);
};
