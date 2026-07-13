import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { clearHooks, tryResolve } from "../src/index.js";

const RULE_NAME = "secretlint-rule-logical-install-fixture";
const PHYSICAL_ONLY_PACKAGE_NAME = "secretlint-resolver-physical-install-fixture";

describe("tryResolve moduleResolutionBase", () => {
    let installGroupDirectory: string;
    let globalVirtualStoreDirectory: string;
    let moduleResolutionBase: string;
    const physicalOnlyPackageDirectory = path.join(
        import.meta.dirname,
        "..",
        "node_modules",
        PHYSICAL_ONLY_PACKAGE_NAME
    );

    beforeEach(() => {
        installGroupDirectory = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-install-group-")));
        globalVirtualStoreDirectory = fs.realpathSync(
            fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-global-virtual-store-"))
        );
        moduleResolutionBase = path.join(installGroupDirectory, "node_modules", "secretlint", "bin", "secretlint.js");
        fs.mkdirSync(physicalOnlyPackageDirectory, { recursive: true });
        fs.writeFileSync(
            path.join(physicalOnlyPackageDirectory, "package.json"),
            JSON.stringify({ name: PHYSICAL_ONLY_PACKAGE_NAME, version: "1.0.0", main: "index.js" })
        );
        fs.writeFileSync(path.join(physicalOnlyPackageDirectory, "index.js"), "module.exports = {};");
    });

    afterEach(() => {
        clearHooks();
        fs.rmSync(installGroupDirectory, { recursive: true, force: true });
        fs.rmSync(globalVirtualStoreDirectory, { recursive: true, force: true });
        fs.rmSync(physicalOnlyPackageDirectory, { recursive: true, force: true });
    });

    it("resolves a package linked from a global virtual store into the logical install group", () => {
        const storedPackageDirectory = path.join(globalVirtualStoreDirectory, "node_modules", RULE_NAME);
        const logicalPackageDirectory = path.join(installGroupDirectory, "node_modules", RULE_NAME);
        const packageEntry = path.join(storedPackageDirectory, "index.js");
        fs.mkdirSync(storedPackageDirectory, { recursive: true });
        fs.writeFileSync(
            path.join(storedPackageDirectory, "package.json"),
            JSON.stringify({ name: RULE_NAME, version: "1.0.0", main: "index.js" })
        );
        fs.writeFileSync(packageEntry, "module.exports = {};");
        fs.mkdirSync(path.dirname(logicalPackageDirectory), { recursive: true });
        fs.symlinkSync(
            storedPackageDirectory,
            logicalPackageDirectory,
            process.platform === "win32" ? "junction" : "dir"
        );

        const result = tryResolve(RULE_NAME, {
            parentImportMeta: import.meta,
            parentModule: "config-loader",
            moduleResolutionBase
        });

        assert.strictEqual(result, packageEntry);

        const resultFromFileUrl = tryResolve(RULE_NAME, {
            parentImportMeta: import.meta,
            parentModule: "config-loader",
            moduleResolutionBase: pathToFileURL(moduleResolutionBase)
        });
        assert.strictEqual(resultFromFileUrl, packageEntry);
    });

    it("does not fall back to the resolver's physical install when an explicit base is provided", () => {
        const resolverRelativeResult = tryResolve(PHYSICAL_ONLY_PACKAGE_NAME, {
            parentImportMeta: import.meta,
            parentModule: "config-loader",
            moduleResolutionBase: import.meta.url
        });
        assert.ok(resolverRelativeResult, "The control package should be visible from @secretlint/resolver");

        const result = tryResolve(PHYSICAL_ONLY_PACKAGE_NAME, {
            parentImportMeta: import.meta,
            parentModule: "config-loader",
            moduleResolutionBase
        });

        assert.strictEqual(result, undefined);
    });
});
