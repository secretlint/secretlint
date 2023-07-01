import { SecretLintFormatter } from "@secretlint/types";

const jsonFormatter: SecretLintFormatter = (results) => {
    return JSON.stringify(results, null, 4);
};
export default jsonFormatter;
