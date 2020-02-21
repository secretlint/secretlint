import { SecretLintProfiler } from "./index";
import perf_hooks from "perf_hooks";

export { SecretLintProfiler };
export const secretLintProfiler = new SecretLintProfiler({
    perf: perf_hooks.performance,
    PerformanceObserver: perf_hooks.PerformanceObserver
});
