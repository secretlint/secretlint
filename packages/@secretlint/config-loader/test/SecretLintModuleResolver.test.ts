import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SecretLintModuleResolver } from "../src/SecretLintModuleResolver.js";

/**
 * These packages exist *only* in the temporary project created below.
 * They must not be names that are resolvable from this repository, otherwise the
 * workspace's own node_modules would satisfy the resolution and hide the bug.
 */
const RULE_NAME = "secretlint-rule-fixture-not-installed-in-this-repo";
const PRESET_NAME = "secretlint-rule-preset-fixture-not-installed-in-this-repo";

/**
 * Rules and presets are dependencies of the linted project, so they have to be resolved
 * from the project - not from the location that secretlint itself is installed in.
 * Those are the same directory only when the package manager happens to install secretlint
 * inside the project. pnpm's `enableGlobalVirtualStore: true` stores packages outside of
 * the project, and then resolving from secretlint's own location cannot see the project's
 * rules at all.
 *
 * Here the project lives in a temp dir while secretlint is loaded from this repo, which
 * reproduces that layout.
 */
describe("SecretLintModuleResolver", () => {
    let projectDir: string;
    const installPackage = (packageName: string) => {
        const packageDir = path.join(projectDir, "node_modules", packageName);
        fs.mkdirSync(packageDir, { recursive: true });
        fs.writeFileSync(
            path.join(packageDir, "package.json"),
            JSON.stringify({ name: packageName, version: "1.0.0", main: "index.js" }),
        );
        fs.writeFileSync(path.join(packageDir, "index.js"), "module.exports = {};");
        return path.join(packageDir, "index.js");
    };
    beforeEach(() => {
        projectDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-config-loader-")));
    });
    afterEach(() => {
        fs.rmSync(projectDir, { recursive: true, force: true });
    });

    it("should resolve a rule that is installed in `cwd`", () => {
        const expected = installPackage(RULE_NAME);
        const moduleResolver = new SecretLintModuleResolver({ cwd: projectDir });
        assert.strictEqual(moduleResolver.resolveRulePackageName(RULE_NAME), expected);
    });

    it("should resolve a preset that is installed in `cwd`", () => {
        const expected = installPackage(PRESET_NAME);
        const moduleResolver = new SecretLintModuleResolver({ cwd: projectDir });
        assert.strictEqual(
            moduleResolver.resolvePresetPackageName("preset-fixture-not-installed-in-this-repo"),
            expected,
        );
    });

    it("should throw an error when the rule is not installed in `cwd`", () => {
        const moduleResolver = new SecretLintModuleResolver({ cwd: projectDir });
        assert.throws(() => moduleResolver.resolveRulePackageName(RULE_NAME), ReferenceError);
    });
});
