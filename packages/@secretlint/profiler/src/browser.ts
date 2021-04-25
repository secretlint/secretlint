import { SecretLintProfiler } from "./index";

export { SecretLintProfiler };
export const secretLintProfiler = new SecretLintProfiler({
    perf: performance,
    PerformanceObserver: PerformanceObserver,
});
