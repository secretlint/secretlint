import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
// Test target is bundled file
import { creator as rule } from "../module/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("@secretlint/secretlint-rule-preset-recommend", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    const eachRulesDir = fs
        .readdirSync(path.join(__dirname, "snapshots"), {
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isDirectory());
    for (const ruleDir of eachRulesDir) {
        const ruleDirPath = path.join(__dirname, "snapshots", ruleDir.name);
        await snapshot({
            defaultConfig: {
                rules: [
                    {
                        id: "@secretlint/secretlint-rule-preset-recommend",
                        rule,
                        rules: [],
                        options: {},
                    },
                ],
            },
            updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
            snapshotDirectory: ruleDirPath,
        }).forEach((name, test) => {
            return t.test(ruleDir.name + " > " + name, async (context) => {
                const status = await test();
                if (status === "skip") {
                    context.skip();
                }
            });
        });
    }
});
