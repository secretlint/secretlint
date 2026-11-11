/**
 * Copy the snapshot test cases of each built-in rule to the snapshots of the presets that include the rule.
 *
 * test/builtin/rules/<name>/snapshots/<case>/ -> test/builtin/presets/<preset>/snapshots/secretlint-rule-<name>/<case>/
 *
 * Usage: npm run build && node scripts/sync-preset-snapshots.mjs && UPDATE_SNAPSHOT=1 npm test
 * The output.json of a preset is a bit different from the output.json of the rule, so update the snapshots after copying.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, "../test/builtin");
const { presetRecommend, presetCanary } = await import("../module/builtin/index.js");
const presets = [
    { name: "recommend", preset: presetRecommend },
    { name: "canary", preset: presetCanary },
];
const RULE_ID_PREFIX = "@secretlint/secretlint-rule-";

/**
 * A test case of a rule can have .secretlintrc.json that uses the id of the rule.
 * The preset needs the id of the preset, and the options of the rule as a nested rule config.
 *
 * { rules: [{ id: "@secretlint/secretlint-rule-aws", options }] }
 * -> { rules: [{ id: "@secretlint/secretlint-rule-preset-recommend", rules: [{ id: "@secretlint/secretlint-rule-aws", options }] }] }
 */
const transformSecretlintConfig = (configPath, presetId, ruleId) => {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const originalRule = Array.isArray(config.rules) ? config.rules.find((rule) => rule.id === ruleId) : undefined;
    if (!originalRule) {
        return config;
    }
    return {
        rules: [
            {
                id: presetId,
                rules: [
                    {
                        id: ruleId,
                        options: originalRule.options,
                    },
                ],
            },
        ],
    };
};

for (const { name, preset } of presets) {
    const presetSnapshotsDir = path.join(testDir, "presets", name, "snapshots");
    console.log(`Sync snapshots: ${preset.meta.id}`);
    fs.rmSync(presetSnapshotsDir, { recursive: true, force: true });
    for (const rule of preset.rules) {
        const ruleName = rule.meta.id.slice(RULE_ID_PREFIX.length);
        const ruleSnapshotsDir = path.join(testDir, "rules", ruleName, "snapshots");
        if (!fs.existsSync(ruleSnapshotsDir)) {
            continue;
        }
        for (const dirent of fs.readdirSync(ruleSnapshotsDir, { withFileTypes: true })) {
            if (!dirent.isDirectory()) {
                continue;
            }
            const dest = path.join(presetSnapshotsDir, `secretlint-rule-${ruleName}`, dirent.name);
            fs.cpSync(path.join(ruleSnapshotsDir, dirent.name), dest, { recursive: true });
            const configPath = path.join(dest, ".secretlintrc.json");
            if (fs.existsSync(configPath)) {
                const transformed = transformSecretlintConfig(configPath, preset.meta.id, rule.meta.id);
                fs.writeFileSync(configPath, JSON.stringify(transformed, null, 2));
            }
        }
    }
}
console.log("Update the snapshots: UPDATE_SNAPSHOT=1 npm test");
