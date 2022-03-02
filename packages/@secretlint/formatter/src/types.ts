import { SecretLintFormatterOptions } from "@secretlint/types";

export type FormatterConfig = {
    formatterName: string;
} & SecretLintFormatterOptions;
