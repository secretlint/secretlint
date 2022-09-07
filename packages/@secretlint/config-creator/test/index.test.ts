// LICENSE : MIT
"use strict";
import assert from "assert";
import path from "path";
import fs from "fs";
import os from "os";
import readPkg from "read-pkg";
import { createConfig } from "@secretlint/config-creator";

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

    beforeEach(function () {
        tmpConfigDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-config"));
        const packageFilePath = path.join(__dirname, "fixtures", "package.json");
        fs.promises.copyFile(packageFilePath, tmpConfigDir + "/package.json");
    });

    afterEach(function () {
        fs.rmSync(tmpConfigDir, { recursive: true });
    });

    context("When config-creator is called", function () {
        it("Run config-creator successfully", async function () {
            const pkg = await readPkg({
                cwd: tmpConfigDir,
            });
            const actual = createConfig({ packageJSON: pkg });
            actual.rules.forEach((rule) => {
                assert.equal(rule.id, "@secretlint/secretlint-rule-preset-recommend");
            });
        });
    });
});
