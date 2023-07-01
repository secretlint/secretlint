import { SecretLintFormatter } from "@secretlint/types";

const jsonFormatter: SecretLintFormatter = (results) => {
    return JSON.stringify(results);
};
export default jsonFormatter;
