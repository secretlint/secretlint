import assert from "assert";
import { SecretLintProfiler } from "../src/node.js";

/**
 * A clock that returns the times in order
 */
const createClock = (times: number[]) => {
    let calledCount = 0;
    return {
        now: () => {
            const time = times[calledCount];
            calledCount++;
            if (time === undefined) {
                throw new Error("No more time");
            }
            return time;
        },
        get calledCount() {
            return calledCount;
        },
    };
};
describe("profile", () => {
    it("should record the total time between ::start and ::end for each type and id", () => {
        const clock = createClock([0, 10, 10, 25, 30, 31]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: true });
        profiler.mark({ type: "@config-loader>load-config-file::start" });
        profiler.mark({ type: "@config-loader>load-config-file::end" });
        profiler.mark({ type: "@core>lint::start", id: "a.txt" });
        profiler.mark({ type: "@core>lint::end", id: "a.txt" });
        profiler.mark({ type: "@core>lint::start", id: "b.txt" });
        profiler.mark({ type: "@core>lint::end", id: "b.txt" });
        assert.deepStrictEqual(profiler.getStats(), [
            { type: "@config-loader>load-config-file", id: undefined, count: 1, duration: 10, maxDuration: 10 },
            { type: "@core>lint", id: "a.txt", count: 1, duration: 15, maxDuration: 15 },
            { type: "@core>lint", id: "b.txt", count: 1, duration: 1, maxDuration: 1 },
        ]);
    });
    it("should add up the records of the same type and id", () => {
        const clock = createClock([0, 2, 10, 15]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: true });
        const id = "@secretlint/secretlint-rule-example";
        profiler.mark({ type: "@core>rule-handler::start", id });
        profiler.mark({ type: "@core>rule-handler::end", id });
        profiler.mark({ type: "@core>rule-handler::start", id });
        profiler.mark({ type: "@core>rule-handler::end", id });
        assert.deepStrictEqual(profiler.getStats(), [
            { type: "@core>rule-handler", id, count: 2, duration: 7, maxDuration: 5 },
        ]);
    });
    it("should ignore ::end without ::start", () => {
        const clock = createClock([0]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: true });
        profiler.mark({ type: "secretlint>cli::end" });
        assert.deepStrictEqual(profiler.getStats(), []);
    });
    it("should record the time from now() with record()", () => {
        const clock = createClock([100, 103, 200, 201]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: true });
        const first = profiler.now();
        profiler.record("@core>pattern", "rule#0 /a/g", first);
        const second = profiler.now();
        profiler.record("@core>pattern", "rule#0 /a/g", second);
        assert.deepStrictEqual(profiler.getStats(), [
            { type: "@core>pattern", id: "rule#0 /a/g", count: 2, duration: 4, maxDuration: 3 },
        ]);
    });
    it("should count without duration with count()", () => {
        const clock = createClock([]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: true });
        profiler.count("@core>pattern-match", "rule#0 /a/g");
        profiler.count("@core>pattern-match", "rule#0 /a/g", 3);
        assert.deepStrictEqual(profiler.getStats(), [
            { type: "@core>pattern-match", id: "rule#0 /a/g", count: 4, duration: 0, maxDuration: 0 },
        ]);
    });
    it("should be disabled by default", () => {
        const profiler = new SecretLintProfiler({ now: createClock([]).now });
        assert.strictEqual(profiler.isEnabled, false);
    });
    it("should not read the clock and not record if the profiler is disabled", () => {
        const clock = createClock([]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: false });
        profiler.mark({ type: "secretlint>cli::start" });
        profiler.mark({ type: "@core>lint::start", id: "disabled-test" });
        profiler.mark({ type: "@core>lint::end", id: "disabled-test" });
        profiler.record("@core>pattern", "rule#0 /a/g", profiler.now());
        profiler.count("@core>pattern-match", "rule#0 /a/g");
        profiler.mark({ type: "secretlint>cli::end" });
        assert.strictEqual(profiler.isEnabled, false);
        assert.strictEqual(clock.calledCount, 0, "the clock should not be read");
        assert.deepStrictEqual(profiler.getStats(), []);
    });
    it("should clear the totals if setEnabled(false) is called", () => {
        const clock = createClock([0, 10, 20]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: true });
        profiler.mark({ type: "@node>execute::start" });
        profiler.mark({ type: "@node>execute::end" });
        profiler.mark({ type: "secretlint>cli::start" });
        profiler.setEnabled(false);
        assert.deepStrictEqual(profiler.getStats(), []);
        // marking again should do nothing
        profiler.mark({ type: "secretlint>cli::end" });
        assert.strictEqual(clock.calledCount, 3);
        assert.deepStrictEqual(profiler.getStats(), []);
    });
    it("should record again if setEnabled(true) is called", () => {
        const clock = createClock([0, 1, 6]);
        const profiler = new SecretLintProfiler({ now: clock.now, enabled: false });
        profiler.mark({ type: "secretlint>cli::start" });
        profiler.setEnabled(true);
        // the start was not marked, so this end is ignored
        profiler.mark({ type: "secretlint>cli::end" });
        profiler.mark({ type: "@node>format::start" });
        profiler.mark({ type: "@node>format::end" });
        assert.strictEqual(profiler.isEnabled, true);
        assert.deepStrictEqual(profiler.getStats(), [
            { type: "@node>format", id: undefined, count: 1, duration: 5, maxDuration: 5 },
        ]);
    });
});
