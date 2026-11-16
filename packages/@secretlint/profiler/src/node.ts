import { SecretLintProfiler } from "./index.js";
import perf_hooks from "node:perf_hooks";

export * from "./index.js";
export const secretLintProfiler = new SecretLintProfiler({
    now: () => perf_hooks.performance.now(),
});
