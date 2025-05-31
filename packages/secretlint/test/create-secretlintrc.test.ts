// LICENSE : MIT
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { runConfigCreator } from "../src/create-secretlintrc.js";

/**
 *
 * Create .secretlintrc.json
 * - yarn test -g "create-secretlintrc"
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
describe("create-secretlintrc", function () {
    let tmpConfigDir: string;

    beforeEach(async () => {
        tmpConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), "secretlint-config"));
        const packageFilePath = new URL(path.join("fixtures", "package.json"), import.meta.url);
        await fs.copyFile(packageFilePath, path.join(tmpConfigDir + "/package.json"));
    });

    afterEach(async () => {
        await fs.rm(tmpConfigDir, { recursive: true });
    });

    context("when package.json has @secretlint/* packages", function () {
        it("Run secretlint --init", async () => {
            const actual = await runConfigCreator({ cwd: tmpConfigDir });
            if (actual.stdout === null) {
                assert.fail("stdout is unexpected null.");
            }
            assert.match(actual.stdout, /Create .*\.secretlintrc\.json/);
            assert.strictEqual(actual.stderr, null);
        });
    });

    context("when .secretlintrc.json is already existed", function () {
        it("should be an error", async () => {
            const actual = await runConfigCreator({ cwd: tmpConfigDir });
            assert.strictEqual(actual.exitStatus, 0);
            if (actual.stdout === null) {
                assert.fail("stdout is unexpected null.");
            }
            assert.match(actual.stdout, /Create .*\.secretlintrc\.json/);
            assert.strictEqual(actual.stderr, null);
            // try to re-create
            const reActual = await runConfigCreator({ cwd: tmpConfigDir });
            assert.strictEqual(reActual.exitStatus, 1);
            assert.strictEqual(reActual.stdout, null);
            if (reActual.stderr === null) {
                assert.fail("stderr is unexpected null.");
            }
            assert.strictEqual(reActual.stderr.toString(), "Error: secretlint config file is already existed.");
        });
    });
});
