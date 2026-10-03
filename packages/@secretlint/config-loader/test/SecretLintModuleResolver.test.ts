import { clearHooks, registerResolveHook } from "@secretlint/resolver";
import assert from "node:assert";
import { SecretLintModuleResolver } from "../src/SecretLintModuleResolver.js";

const HOOK_ONLY_PACKAGE_NAME = "@secretlint/secretlint-rule-hook-only-for-test";
describe("SecretLintModuleResolver", () => {
    beforeEach(() => {
        // Simulate the standalone binary hooks, which match the package name exactly
        registerResolveHook((moduleName) => {
            if (moduleName === HOOK_ONLY_PACKAGE_NAME) {
                return {
                    url: moduleName,
                };
            }
            return undefined;
        });
    });
    afterEach(() => {
        clearHooks();
    });
    // https://github.com/secretlint/secretlint/issues/1707
    it("should pass scoped package name to resolver as is when baseDirectory is not specified", () => {
        const resolver = new SecretLintModuleResolver({});
        assert.strictEqual(resolver.resolveRulePackageName(HOOK_ONLY_PACKAGE_NAME), HOOK_ONLY_PACKAGE_NAME);
    });
});
