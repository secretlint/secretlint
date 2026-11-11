import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { presetCanary, presetRecommend } from "../../src/builtin/index.js";
import { createRawSource } from "@secretlint/source-creator";
import { createSnapshotTestCases } from "../../src/testing/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presets = [
    { name: "recommend", preset: presetRecommend },
    { name: "canary", preset: presetCanary },
];

// Snapshot tests of each preset: test/builtin/presets/<preset>/snapshots/secretlint-rule-<name>/<test case>/
describe.each(presets)("$preset.meta.id", ({ name, preset }) => {
    const snapshotsDir = path.join(__dirname, "presets", name, "snapshots");
    const ruleDirs = fs
        .readdirSync(snapshotsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    describe.each(ruleDirs)("%s", (ruleDir) => {
        const testCases = createSnapshotTestCases({
            createRawSource,
            snapshotDirectory: path.join(snapshotsDir, ruleDir),
            defaultConfig: { rules: [{ id: preset.meta.id, rule: preset, rules: [], options: {} } as any] },
        });
        it.for(testCases)("$name", async ({ run }, context) => {
            if ((await run()) === "skip") {
                context.skip();
            }
        });
    });
});
