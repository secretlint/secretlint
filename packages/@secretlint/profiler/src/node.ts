import { SecretLintProfiler } from "./index.js";
import perf_hooks from "node:perf_hooks";

export { SecretLintProfiler };
class NullPerformanceObserver {
    disconnect(): void {}
    observe(_options?: PerformanceObserverInit | undefined): void {}
}

export const secretLintProfiler = new SecretLintProfiler({
    perf: perf_hooks.performance,
    PerformanceObserver: perf_hooks.PerformanceObserver ? perf_hooks.PerformanceObserver : NullPerformanceObserver,
});
