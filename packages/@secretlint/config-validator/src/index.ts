import _validate from "./validation";

export { isSecretLintConfigDescriptor } from "./validation";
export const validate = (value: unknown): { ok: true } | { ok: false; error: Error } => {
    try {
        _validate(value);
        return {
            ok: true
        };
    } catch (error) {
        // SecretLintConfigDescriptor -> secretlintrc
        const errorMessage = error.message.replace(/SecretLintConfigDescriptor/g, "secretlintrc");
        return {
            ok: false,
            error: new Error(errorMessage)
        };
    }
};
