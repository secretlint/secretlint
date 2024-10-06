import * as preset from "@secretlint/secretlint-rule-preset-recommend";
import * as pattern from "@secretlint/secretlint-rule-pattern";
import * as sarif from "@secretlint/secretlint-formatter-sarif";
import { registerImportHook, registerResolveHook } from "@secretlint/resolver";

const mocks = {
    "@secretlint/secretlint-rule-preset-recommend": preset,
    "@secretlint/secretlint-rule-pattern": pattern,
    "@secretlint/secretlint-formatter-sarif": sarif
};
const mockNames = Object.keys(mocks);
const mockNameRegex = new RegExp(`^(?:${mockNames.join("|")})$`);
// preserve mocks module name
// "@secretlint/secretlint-rule-preset-recommend" -> "@secretlint/secretlint-rule-preset-recommend"
// By default, secretlint will resolve it into absolute path, but we want to keep it as is.
registerResolveHook((moduleName) => {
    if (mockNames.includes(moduleName)) {
        return {
            url: moduleName
        };
    }
    return undefined; // pass through
});
// import mock module
// "@secretlint/secretlint-rule-preset-recommend" -> { exports: preset }
registerImportHook(async (moduleName) => {
    if (mockNameRegex.test(moduleName)) {
        return {
            exports: mocks[moduleName as keyof typeof mocks]
        };
    }
    return undefined; // pass through
});
