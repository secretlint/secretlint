import { SecretLintProfiler } from "./index.js";
import perf_hooks from "node:perf_hooks";

export { SecretLintProfiler };
export const secretLintProfiler = new SecretLintProfiler({
    perf: perf_hooks.performance,
    PerformanceObserver: perf_hooks.PerformanceObserver,
});
