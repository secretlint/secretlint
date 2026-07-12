import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { clearHooks, tryResolve } from "../src/index.js";

/**
 * Rule package that exists *only* in the temporary project created below.
 * It must not be a name that is resolvable from this repository, otherwise the
 * workspace's own node_modules would satisfy the resolution and hide the bug.
 */
const RULE_NAME = "secretlint-rule-fixture-not-installed-in-this-repo";

/**
 * Emulates pnpm's `enableGlobalVirtualStore: true` layout.
 *
 * Node resolves bare specifiers by walking `node_modules` upwards from the importer.
 * With a global virtual store the packages live outside the project, so walking up
 * from @secretlint/resolver's own location never reaches the project's node_modules.
 * Here the resolver is imported from this repo while the "project" lives in a temp
 * dir: two disjoint trees, which is exactly the shape that breaks under a global
 * virtual store. Without a global virtual store the store is nested inside the
 * project, so the upwards walk happens to reach the project - that is why this only
 * reproduces with the flag enabled.
 */
describe("tryResolve baseDirectories", () => {
    let projectDir: string;
    beforeEach(() => {
        projectDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-virtual-store-")));
        const ruleDir = path.join(projectDir, "node_modules", RULE_NAME);
        fs.mkdirSync(ruleDir, { recursive: true });
        fs.writeFileSync(
            path.join(ruleDir, "package.json"),
            JSON.stringify({ name: RULE_NAME, version: "1.0.0", main: "index.js" }),
        );
        fs.writeFileSync(path.join(ruleDir, "index.js"), "module.exports = {};");
    });
    afterEach(() => {
        clearHooks();
        fs.rmSync(projectDir, { recursive: true, force: true });
    });

    it("should resolve a package that is only installed in the baseDirectories", () => {
        const result = tryResolve(RULE_NAME, {
            parentImportMeta: import.meta,
            parentModule: "config-loader",
            baseDirectories: [projectDir],
        });
        assert.strictEqual(result, path.join(projectDir, "node_modules", RULE_NAME, "index.js"));
    });

    it("should not resolve a package that is installed outside of the baseDirectories", () => {
        const result = tryResolve(RULE_NAME, {
            parentImportMeta: import.meta,
            parentModule: "config-loader",
            baseDirectories: [os.tmpdir()],
        });
        assert.ok(!result);
    });
});
