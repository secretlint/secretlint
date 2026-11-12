import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SecretLintCoreConfig } from "@secretlint/types";
import { getBuiltinRule } from "../../src/builtin/index.js";
import { additionalRules } from "./additional-rules.js";
import { createRawSource } from "@secretlint/source-creator";
import { createSnapshotTestCases } from "../../src/testing/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesDir = path.join(__dirname, "rules");
const ruleNames = fs
    .readdirSync(rulesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

it("each built-in rule has snapshot tests", () => {
    const sourceRuleNames = fs
        .readdirSync(path.join(__dirname, "../../src/builtin/rules"), { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    expect(ruleNames.sort()).toEqual(sourceRuleNames.sort());
});

// Snapshot tests of each built-in rule: test/builtin/rules/<name>/snapshots/<test case>/
describe.each(ruleNames)("@secretlint/secretlint-rule-%s", (name) => {
    const id = `@secretlint/secretlint-rule-${name}`;
    const rule = getBuiltinRule(id);
    if (!rule) {
        throw new Error(`${id} is not a built-in rule`);
    }
    const testCases = createSnapshotTestCases({
        createRawSource,
        snapshotDirectory: path.join(rulesDir, name, "snapshots"),
        defaultConfig: {
            rules: [
                { id, rule, options: {} } as SecretLintCoreConfig["rules"][number],
                ...(additionalRules[name] ?? []),
            ],
        },
    });
    it.for(testCases)("$name", async ({ run }, context) => {
        if ((await run()) === "skip") {
            context.skip();
        }
    });
});
