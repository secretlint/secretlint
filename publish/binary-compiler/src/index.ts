import { compile } from "nexe";

export type compileSecretLintOptions = {
    input: string;
    output: string;
};

export const compileSecretLint = (options: compileSecretLintOptions) => {
    return compile({
        input: options.input,
        output: options.output,
        build: false,
    });
};
