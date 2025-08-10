import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
const PRESET_ID = "@secretlint/secretlint-rule-preset-canary";

const ruleDependencies = Object.keys(pkg.devDependencies).filter((name) => {
    return name.startsWith("@secretlint/secretlint-rule-");
});
const packagesDir = path.join(__dirname, "../");
const ruleDirs = fs
    .readdirSync(packagesDir, {
        withFileTypes: true,
    })
    .filter((dirent) => {
        return dirent.isDirectory() && ruleDependencies.includes(`@secretlint/${dirent.name}`);
    });

/**
 * Transform individual rule config to preset config
 *
 * Background: Some test cases from individual rules contain .secretlintrc.json files
 * that reference the individual rule ID (e.g., "@secretlint/secretlint-rule-aws").
 * When these tests are copied to the preset package, the config needs to be transformed
 * to use the preset ID instead, with the original rule as a nested rule configuration.
 *
 * Original format:
 * {
 *   "rules": [{
 *     "id": "@secretlint/secretlint-rule-aws",
 *     "options": { ... }
 *   }]
 * }
 *
 * Transformed format for preset:
 * {
 *   "rules": [{
 *     "id": "@secretlint/secretlint-rule-preset-canary",
 *     "rules": [{
 *       "id": "@secretlint/secretlint-rule-aws",
 *       "options": { ... }
 *     }]
 *   }]
 * }
 *
 * @param {string} configPath - Path to .secretlintrc.json
 * @param {string} originalRuleId - Original rule ID
 * @returns {object} Transformed config for preset
 */
const transformSecretlintConfig = (configPath, originalRuleId) => {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // If config has rules array with the original rule
    if (config.rules && Array.isArray(config.rules)) {
        const originalRule = config.rules.find((rule) => rule.id === originalRuleId);
        if (originalRule) {
            // Transform to preset format
            return {
                rules: [
                    {
                        id: PRESET_ID,
                        rules: [
                            {
                                id: originalRuleId,
                                options: originalRule.options,
                            },
                        ],
                    },
                ],
            };
        }
    }

    // Return as-is if no transformation needed
    return config;
};

/**
 *
 * @param {Dirent} ruleDir
 */
const copyTestFiles = (ruleDir) => {
    const ruleDirName = ruleDir.name;
    const ruleId = `@secretlint/${ruleDirName}`;
    const snapshotsDir = path.join(packagesDir, ruleDir.name, "test", "snapshots");
    if (fs.existsSync(snapshotsDir) === false) {
        return;
    }
    console.log(`Copy test files: ${ruleDirName}`);
    const testDirs = fs
        .readdirSync(snapshotsDir, {
            withFileTypes: true,
        })
        .filter((dirent) => {
            return dirent.isDirectory();
        });
    testDirs.forEach((dir) => {
        const src = path.join(snapshotsDir, dir.name);
        // test/snapshots/<rule>/...
        const dest = path.join("test", "snapshots", ruleDirName, dir.name);

        // Copy all files
        fs.cpSync(src, dest, {
            recursive: true,
        });

        // Check if .secretlintrc.json exists and transform it
        const configPath = path.join(dest, ".secretlintrc.json");
        if (fs.existsSync(configPath)) {
            const transformedConfig = transformSecretlintConfig(configPath, ruleId);
            fs.writeFileSync(configPath, JSON.stringify(transformedConfig, null, 2));
            console.log(`  - Transformed config for ${dir.name}`);
        }
    });
};
const rmCurrentSnapshots = () => {
    console.log(`Remove current snapshots`);
    const currentSnapshotsDir = path.join(__dirname, "test", "snapshots");
    return fs.rmSync(currentSnapshotsDir, {
        recursive: true,
    });
};

await rmCurrentSnapshots();
ruleDirs.forEach(copyTestFiles);

console.log("Need to update snapshots:");
console.log("$ npm run updateSnapshots");
console.log("Copied snapshot is a bit different from preset.");
