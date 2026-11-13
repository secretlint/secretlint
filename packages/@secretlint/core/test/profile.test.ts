import assert from "node:assert";
import { secretLintProfiler } from "@secretlint/profiler";
import type { SecretLintRuleCreator } from "@secretlint/types";
import { lintSource } from "../src/index.js";

const patternRule: SecretLintRuleCreator = {
    messages: {},
    meta: {
        id: "@secretlint/secretlint-rule-profile-pattern",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    patterns: [
        {
            pattern: /SECRET_[0-9]+/g,
            keywords: ["SECRET_"],
            scope: "line",
            report(match, context) {
                context.report({ message: "found", range: match.range });
            },
        },
    ],
};
const asyncRule: SecretLintRuleCreator = {
    messages: {},
    meta: {
        id: "@secretlint/secretlint-rule-profile-async",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    create() {
        return {
            async file() {
                await new Promise((resolve) => setTimeout(resolve, 5));
            },
        };
    },
};
const lint = (content: string, filePath: string) => {
    return lintSource({
        source: { content, filePath, contentType: "text" },
        options: {
            config: {
                rules: [
                    // the id of the config is a short id
                    { id: "profile-pattern", rule: patternRule },
                    { id: "profile-async", rule: asyncRule },
                ],
            },
        },
    });
};
describe("profile", () => {
    beforeEach(() => {
        secretLintProfiler.setEnabled(true);
    });
    afterEach(() => {
        // reset the shared profiler state for other tests
        secretLintProfiler.setEnabled(false);
    });
    it("should record the keyword scan, the patterns, and the rules by the id of the rule", async () => {
        await lint("a\nSECRET_1 SECRET_2\nSECRET_x\n", "/path/to/file");
        const stats = secretLintProfiler.getStats();
        const statOf = (type: string, id?: string) => stats.find((stat) => stat.type === type && stat.id === id);
        const patternId = "@secretlint/secretlint-rule-profile-pattern#0 /SECRET_[0-9]+/g";
        assert.strictEqual(statOf("@core>keyword-scan")?.count, 1);
        // the pattern runs on the two lines that have the keyword
        assert.strictEqual(statOf("@core>pattern", patternId)?.count, 2);
        assert.strictEqual(statOf("@core>pattern-match", patternId)?.count, 2);
        assert.strictEqual(statOf("@core>rule-handler", "@secretlint/secretlint-rule-profile-pattern")?.count, 1);
        assert.strictEqual(statOf("@core>rule-handler", "@secretlint/secretlint-rule-profile-async")?.count, 1);
        assert.strictEqual(statOf("@core>lint", "/path/to/file")?.count, 1);
    });
    it("should record each of the lints that overlap", async () => {
        // the async rule keeps the two lints of the same file running at the same time
        await Promise.all([lint("SECRET_1", "/path/to/file"), lint("SECRET_1", "/path/to/file")]);
        const stats = secretLintProfiler.getStats();
        const statOf = (type: string, id?: string) => stats.find((stat) => stat.type === type && stat.id === id);
        assert.strictEqual(statOf("@core>lint", "/path/to/file")?.count, 2);
        const asyncStat = statOf("@core>rule-handler", "@secretlint/secretlint-rule-profile-async");
        assert.strictEqual(asyncStat?.count, 2);
        // each record has the time of its own call
        assert.ok((asyncStat?.maxDuration ?? 0) >= 4, `maxDuration: ${asyncStat?.maxDuration}`);
        assert.ok((asyncStat?.duration ?? 0) >= 8, `duration: ${asyncStat?.duration}`);
    });
});
