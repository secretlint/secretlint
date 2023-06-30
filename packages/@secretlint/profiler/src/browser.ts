import { SecretLintProfiler } from "./index.js";

export { SecretLintProfiler };
export const secretLintProfiler = new SecretLintProfiler({
    perf: performance,
    PerformanceObserver: PerformanceObserver,
});
