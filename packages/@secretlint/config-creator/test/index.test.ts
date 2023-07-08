// LICENSE : MIT
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import os from "node:os";
import { createConfig } from "../src/index.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readPkg = (filePath: string) => {
    return fs.readFile(filePath, "utf-8").then((content) => {
        return JSON.parse(content);
    });
};
/**
 *
 * Run config-creator
 * - yarn test -g "@secretlint/config-creator"
 *
 * File Overview
 *
 * - tmpConfigDir
 *   - A temporal directory with "secretlint-config"
 *   - Create .secretlintrc.json on the directory
 * - packageFilePath
 *   - A path of package.json to use of this test
 *   - When using this package.json, copy it to tmpConfigDir
 * - expectedConfigFilePath
 *   - A path of .secretlintrc.json to create by this test
 */
describe("@secretlint/config-creator", function () {
    let tmpConfigDir: string;

    beforeEach(async () => {
        tmpConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), "secretlint-config"));
        const packageFilePath = path.join(__dirname, "fixtures", "package.json");
        await fs.copyFile(packageFilePath, path.join(tmpConfigDir + "/package.json"));
    });

    afterEach(async () => {
        await fs.rm(tmpConfigDir, { recursive: true });
    });

    context("When config-creator is called", function () {
        it("Run config-creator successfully", async () => {
            const pkg = await readPkg(path.join(tmpConfigDir, "package.json"));
            const actual = createConfig({ packageJSON: pkg });
            actual.rules.forEach((rule) => {
                assert.strictEqual(rule.id, "@secretlint/secretlint-rule-preset-recommend");
            });
        });
    });
});
