import assert from "assert";
import perf_hooks from "node:perf_hooks";
import { SecretLintProfiler } from "../src/node.js";

const createSpyPerformanceObserver = () => {
    const state = {
        createdCount: 0,
        observedCount: 0,
        disconnectedCount: 0,
    };
    class SpyPerformanceObserver {
        constructor(_callback: (items: PerformanceObserverEntryList) => void) {
            state.createdCount++;
        }

        observe(_options?: any): void {
            state.observedCount++;
        }

        disconnect(): void {
            state.disconnectedCount++;
        }
    }

    return { state, SpyPerformanceObserver };
};
const createSpyPerformance = () => {
    const markNames: string[] = [];
    const perf = {
        mark: (name: string) => {
            markNames.push(name);
        },
        measure: () => {},
    } as unknown as typeof perf_hooks.performance;
    return { markNames, perf };
};
describe("profile", () => {
    it("should profile", async () => {
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
    it("should measure the duration between ::start and ::end", async () => {
        const profiler = new SecretLintProfiler({
            perf: perf_hooks.performance,
            PerformanceObserver: perf_hooks.PerformanceObserver,
        });
        profiler.mark({
            type: "@core>lint::start",
            id: "measure-test",
        });
        profiler.mark({
            type: "@core>lint::end",
            id: "measure-test",
        });
        // wait for finish
        await new Promise((resolve) => setTimeout(resolve, 100));
        const measures = await profiler.getMeasures();
        assert.ok(
            measures.some((measure) => measure.name === "@core>lint||measure-test"),
            `should have a measure for the marked pair: ${measures.map((measure) => measure.name).join(", ")}`,
        );
    });
    it("should be enabled by default", () => {
        const { SpyPerformanceObserver } = createSpyPerformanceObserver();
        const { perf } = createSpyPerformance();
        const profiler = new SecretLintProfiler({
            perf,
            PerformanceObserver: SpyPerformanceObserver,
        });
        assert.strictEqual(profiler.isEnabled, true);
    });
    it("should not mark and not observe if the profiler is disabled", async () => {
        const { state, SpyPerformanceObserver } = createSpyPerformanceObserver();
        const { markNames, perf } = createSpyPerformance();
        const profiler = new SecretLintProfiler({
            perf,
            PerformanceObserver: SpyPerformanceObserver,
            enabled: false,
        });
        profiler.mark({
            type: "secretlint>cli::start",
        });
        profiler.mark({
            type: "@core>lint::start",
            id: "disabled-test",
        });
        profiler.mark({
            type: "@core>lint::end",
            id: "disabled-test",
        });
        profiler.mark({
            type: "secretlint>cli::end",
        });
        assert.strictEqual(profiler.isEnabled, false);
        assert.deepStrictEqual(markNames, [], "performance.mark() should not be called");
        assert.strictEqual(state.createdCount, 0, "PerformanceObserver should not be created");
        assert.deepStrictEqual(await profiler.getEntries(), []);
        assert.deepStrictEqual(await profiler.getMeasures(), []);
    });
    it("should not observe if setEnabled(false) is called before marking", () => {
        const { state, SpyPerformanceObserver } = createSpyPerformanceObserver();
        const { markNames, perf } = createSpyPerformance();
        const profiler = new SecretLintProfiler({
            perf,
            PerformanceObserver: SpyPerformanceObserver,
        });
        profiler.setEnabled(false);
        profiler.mark({
            type: "secretlint>cli::start",
        });
        assert.deepStrictEqual(markNames, [], "performance.mark() should not be called");
        assert.strictEqual(state.createdCount, 0, "PerformanceObserver should not be created");
    });
    it("should disconnect the observer and clear collected entries if setEnabled(false) is called", async () => {
        const { state, SpyPerformanceObserver } = createSpyPerformanceObserver();
        const { markNames, perf } = createSpyPerformance();
        const profiler = new SecretLintProfiler({
            perf,
            PerformanceObserver: SpyPerformanceObserver,
        });
        profiler.mark({
            type: "secretlint>cli::start",
        });
        assert.deepStrictEqual(markNames, ["secretlint>cli::start"]);
        assert.strictEqual(state.createdCount, 1);
        assert.strictEqual(state.observedCount, 1);
        profiler.setEnabled(false);
        assert.strictEqual(state.disconnectedCount, 1, "PerformanceObserver should be disconnected");
        assert.deepStrictEqual(await profiler.getEntries(), []);
        assert.deepStrictEqual(await profiler.getMeasures(), []);
        // marking again should do nothing
        profiler.mark({
            type: "secretlint>cli::end",
        });
        assert.deepStrictEqual(markNames, ["secretlint>cli::start"]);
        assert.strictEqual(state.createdCount, 1, "PerformanceObserver should not be created again");
    });
    it("should observe again if setEnabled(true) is called", async () => {
        const { state, SpyPerformanceObserver } = createSpyPerformanceObserver();
        const { markNames, perf } = createSpyPerformance();
        const profiler = new SecretLintProfiler({
            perf,
            PerformanceObserver: SpyPerformanceObserver,
            enabled: false,
        });
        profiler.mark({
            type: "secretlint>cli::start",
        });
        profiler.setEnabled(true);
        profiler.mark({
            type: "secretlint>cli::end",
        });
        assert.strictEqual(profiler.isEnabled, true);
        assert.deepStrictEqual(markNames, ["secretlint>cli::end"]);
        assert.strictEqual(state.createdCount, 1);
        assert.strictEqual(state.observedCount, 1);
    });
});
