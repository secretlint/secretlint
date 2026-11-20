import assert from "node:assert";
import { getKeywordScanPlan } from "../../src/index.js";
import { createKeywordScanner } from "../../src/keyword-scan.js";
import { creator as rule } from "../../src/builtin/rules/telegram/index.js";

describe("Telegram keyword filtering", () => {
    it("skips ordinary annotations and short token suffixes before running the rule", () => {
        const plan = getKeywordScanPlan({ config: { rules: [{ id: rule.meta.id, rule }] } });
        assert.ok(plan);
        const scanner = createKeywordScanner(plan);
        const scan = (content: string) => scanner.scan(new TextEncoder().encode(content));
        assert.strictEqual(scan("type:Any\nvalue:Array<string>\n12345:A" + "b".repeat(33)).runsRules, false);
        assert.strictEqual(scan("12345:A" + "b".repeat(34)).runsRules, true);
        assert.strictEqual(scan("https://api.telegram.org/bot12345:A" + "_".repeat(34) + "/getMe").runsRules, true);
    });
});
