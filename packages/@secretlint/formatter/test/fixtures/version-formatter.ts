import type { SecretLintFormatter } from "@secretlint/types";

const formatter: SecretLintFormatter = (_results, options) => JSON.stringify(options);
export default formatter;
