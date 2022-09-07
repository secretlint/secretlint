// LICENSE : MIT
"use strict";
import assert from "assert";
import path from "path";
import fs from "fs";
import os from "os";
import { runConfigCreator } from "../src/create-secretlintrc";

/**
 *
 * Create .secretlintrc.json
 * - yarn test -g "create-secretlintrc-test"
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
describe("create-secretlintrc-test", function () {
    let tmpConfigDir: string;

    beforeEach(function () {
        tmpConfigDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-config"));
        const packageFilePath = path.join(__dirname, "fixtures", "package.json");
        fs.promises.copyFile(packageFilePath, tmpConfigDir + "/package.json");
    });

    afterEach(function () {
        fs.rmSync(tmpConfigDir, { recursive: true });
    });

    context("when pacakge.json has @secretlint/* packages", function () {
        it("Run secretlint --init", async function () {
            const expectedConfigFilePath = `${tmpConfigDir}/.secretlintrc.json`;
            return runConfigCreator({ cwd: tmpConfigDir }).then(function (actual) {
                assert.equal(actual.exitStatus, 0);
                assert.equal(actual.stdout, `Create ${expectedConfigFilePath}`);
                assert.equal(actual.stderr, null);
            });
        });
    });

    context("when .secretlintrc.json is already existed", function () {
        it("should be an error", async function () {
            const expectedConfigFilePath = `${tmpConfigDir}/.secretlintrc.json`;
            return runConfigCreator({ cwd: tmpConfigDir })
                .then((actual) => {
                    assert.equal(actual.exitStatus, 0);
                    assert.equal(actual.stdout, `Create ${expectedConfigFilePath}`);
                    assert.equal(actual.stderr, null);
                    // try to re-create
                    return runConfigCreator({ cwd: tmpConfigDir });
                })
                .then((actual) => {
                    assert.equal(actual.exitStatus, 1);
                    assert.equal(actual.stdout, null);
                    assert.equal(actual.stderr, "Error: secretlint config file is already existed.");
                });
        });
    });
});
