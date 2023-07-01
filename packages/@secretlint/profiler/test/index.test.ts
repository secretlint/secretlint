import assert from "assert";
import perf_hooks from "node:perf_hooks";
import { SecretLintProfiler } from "../src/node.js";
describe("profile", function () {
    it("should profile", async function () {
        const profiler = new SecretLintProfiler({
            perf: perf_hooks.performance,
            PerformanceObserver: perf_hooks.PerformanceObserver,
        });
        profiler.mark({
            type: "@config-loader>load-config-file::start",
        });
        profiler.mark({
            type: "@config-loader>load-config-file::end",
        });
        profiler.mark({
            type: "@core>lint::start",
            id: "test",
        });
        profiler.mark({
            type: "@core>lint::end",
            id: "test",
        });
        // wait for finish
        await new Promise((resolve) => setTimeout(resolve, 100));
        const results = await profiler.getEntries();
        assert.strictEqual(results.length, 4);
    });
});
