import { SecretLintProfiler } from "./index.js";

export * from "./index.js";
export const secretLintProfiler = new SecretLintProfiler({
    now: () => performance.now(),
});
