import assert from "node:assert";
import type { SecretLintProfilerStat } from "@secretlint/profiler";
import { createProfileReport, formatProfileReport } from "../src/profile-report.js";

const stat = (
    type: SecretLintProfilerStat["type"],
    id: string | undefined,
    count: number,
    duration: number,
): SecretLintProfilerStat => {
    return { type, id, count, duration, maxDuration: duration };
};
const stats: SecretLintProfilerStat[] = [
    stat("@node>load-config", undefined, 1, 10),
    stat("secretlint>search-files", undefined, 1, 20),
    stat("@node>read-file", undefined, 2, 5),
    stat("@core>setup-rules", undefined, 1, 1),
    stat("@core>setup-rule", "@secretlint/secretlint-rule-preset-recommend", 1, 1),
    stat("@core>keyword-scan", undefined, 3, 30),
    stat("@core>line-check", undefined, 1, 2),
    stat("@core>pattern-line-test", "@secretlint/secretlint-rule-a#0 /a_[0-9]+/g", 4, 1.5),
    stat("@core>pattern", "@secretlint/secretlint-rule-a#0 /a_[0-9]+/g", 2, 0.5),
    stat("@core>pattern-match", "@secretlint/secretlint-rule-a#0 /a_[0-9]+/g", 1, 0),
    stat("@core>pattern", "@secretlint/secretlint-rule-b#1 /b #1 x/gu", 1, 8),
    stat("@core>rule-handler", "@secretlint/secretlint-rule-a", 1, 0.6),
    stat("@core>rule-handler", "@secretlint/secretlint-rule-b", 1, 8.1),
    stat("@core>lint", "/cwd/a.txt", 1, 40),
    stat("@core>lint", "/cwd/b.txt", 1, 2.004),
    stat("@node>format", undefined, 1, 3),
    stat("@node>execute", undefined, 1, 60),
    stat("secretlint>cli", undefined, 1, 100),
];
describe("profile-report", () => {
    it("should create the report from the totals of the profiler", () => {
        assert.deepStrictEqual(createProfileReport(stats), {
            total: 100,
            files: 2,
            phases: [
                { name: "secretlint>cli", depth: 0, duration: 100, percent: 100, count: 1 },
                { name: "@node>load-config", depth: 1, duration: 10, percent: 10, count: 1 },
                { name: "secretlint>search-files", depth: 1, duration: 20, percent: 20, count: 1 },
                { name: "@node>execute", depth: 1, duration: 60, percent: 60, count: 1 },
                { name: "@node>read-file", depth: 2, duration: 5, percent: 5, count: 2 },
                { name: "@core>lint", depth: 2, duration: 42, percent: 42, count: 2 },
                { name: "@core>setup-rules", depth: 3, duration: 1, percent: 1, count: 1 },
                { name: "@core>keyword-scan", depth: 3, duration: 30, percent: 30, count: 3 },
                { name: "@core>line-check", depth: 3, duration: 2, percent: 2, count: 1 },
                { name: "@core>rule-handler", depth: 3, duration: 8.7, percent: 8.7, count: 2 },
                { name: "@node>format", depth: 2, duration: 3, percent: 3, count: 1 },
            ],
            rules: [
                { ruleId: "@secretlint/secretlint-rule-b", duration: 8.1, files: 1 },
                { ruleId: "@secretlint/secretlint-rule-a", duration: 0.6, files: 1 },
            ],
            patterns: [
                {
                    ruleId: "@secretlint/secretlint-rule-b",
                    index: 1,
                    pattern: "/b #1 x/gu",
                    duration: 8,
                    runDuration: 8,
                    runs: 1,
                    matches: 0,
                    lineTestDuration: 0,
                    lineTests: 0,
                },
                {
                    ruleId: "@secretlint/secretlint-rule-a",
                    index: 0,
                    pattern: "/a_[0-9]+/g",
                    duration: 2,
                    runDuration: 0.5,
                    runs: 2,
                    matches: 1,
                    lineTestDuration: 1.5,
                    lineTests: 4,
                },
            ],
            slowestFiles: [
                { filePath: "/cwd/a.txt", duration: 40 },
                { filePath: "/cwd/b.txt", duration: 2 },
            ],
        });
    });
    it("should format the report as text", () => {
        const output = formatProfileReport(createProfileReport(stats), { cwd: "/cwd" });
        assert.strictEqual(
            output,
            `secretlint profile: 100.00ms, 2 files

Phase                      Time(ms)      %  Count
secretlint>cli               100.00  100.0      1
  @node>load-config           10.00   10.0      1
  secretlint>search-files     20.00   20.0      1
  @node>execute               60.00   60.0      1
    @node>read-file            5.00    5.0      2
    @core>lint                42.00   42.0      2
      @core>setup-rules        1.00    1.0      1
      @core>keyword-scan      30.00   30.0      3
      @core>line-check         2.00    2.0      1
      @core>rule-handler       8.70    8.7      2
    @node>format               3.00    3.0      1

Time(ms)  Files  Rule
    8.10      1  @secretlint/secretlint-rule-b
    0.60      1  @secretlint/secretlint-rule-a

Time(ms)  Run(ms)  Runs  Matches  LineTest(ms)  LineTests  Pattern
    8.00     8.00     1        0          0.00          0  @secretlint/secretlint-rule-b#1 /b #1 x/gu
    2.00     0.50     2        1          1.50          4  @secretlint/secretlint-rule-a#0 /a_[0-9]+/g

Time(ms)  File
   40.00  <cwd>/a.txt
    2.00  <cwd>/b.txt`,
        );
    });
    it("should show the top 10 of the rules, the patterns, and the files in text", () => {
        const manyStats: SecretLintProfilerStat[] = [stat("secretlint>cli", undefined, 1, 100)];
        for (let i = 0; i < 12; i++) {
            manyStats.push(stat("@core>rule-handler", `rule-${i}`, 1, i));
            manyStats.push(stat("@core>pattern", `rule-${i}#0 /${"x".repeat(100)}/g`, 1, i));
            manyStats.push(stat("@core>lint", `/cwd/${i}.txt`, 1, i));
        }
        const report = createProfileReport(manyStats);
        assert.strictEqual(report.rules.length, 12);
        assert.strictEqual(report.patterns.length, 12);
        assert.strictEqual(report.slowestFiles.length, 10);
        const output = formatProfileReport(report, { cwd: "/cwd" });
        assert.match(output, /Rule \(top 10 of 12\)/);
        assert.match(output, /Pattern \(top 10 of 12\)/);
        assert.match(output, /File \(top 10 of 12\)/);
        assert.ok(output.includes(`rule-11#0 /${"x".repeat(79)}...`));
        assert.ok(!output.includes("rule-1#0"));
    });
    it("should remove terminal control sequences and control characters from the text", () => {
        const report = createProfileReport([
            stat("secretlint>cli", undefined, 1, 1),
            stat("@core>rule-handler", "rule-\u001b[31mred", 1, 1),
            stat("@core>pattern", "rule-\u001b[31mred#0 /a\u001b]0;title\u0007b/g", 1, 1),
            stat("@core>lint", "/cwd/\u001b[2Jclear\nline\ttab.txt", 1, 1),
        ]);
        const output = formatProfileReport(report, { cwd: "/cwd" });
        assert.doesNotMatch(output, /[\x00-\x09\x0b-\x1f\x7f-\x9f]/);
        assert.ok(output.includes("  rule-red\n"));
        assert.ok(output.includes("  rule-red#0 /ab/g\n"));
        assert.ok(output.endsWith("  <cwd>/clearlinetab.txt"));
        // JSON.stringify escapes them
        assert.doesNotMatch(JSON.stringify(report), /[\x00-\x1f\x7f-\x9f]/);
    });
    it("should create an empty report if nothing is recorded", () => {
        const report = createProfileReport([]);
        assert.deepStrictEqual(report, { total: 0, files: 0, phases: [], rules: [], patterns: [], slowestFiles: [] });
        assert.strictEqual(
            formatProfileReport(report, { cwd: "/cwd" }),
            "secretlint profile: 0.00ms, 0 files\n\nPhase  Time(ms)  %  Count",
        );
    });
});
