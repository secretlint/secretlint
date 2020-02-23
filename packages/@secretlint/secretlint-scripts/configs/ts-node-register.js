/**
 * Transpile by tsc in runtime
 * It does transpile and type-check.
 *
 * Note: It does not babel-plugin-static-fs
 * Some behavior is a bit difference
 */
const fs = require("fs");
const paths = require("./paths");
const useTypeScript = fs.existsSync(paths.appTsConfig);
if (!useTypeScript) {
    throw new Error(`${paths.appTsConfig} not found.

ts register mode require tsconfig.json.`);
}
try {
    require.resolve("ts-node-test-register");
} catch (error) {
    throw new Error(`ts-node and ts-node-test-register are required

You should install ts-node, ts-node-test-register and typescript.`);
}
require("ts-node-test-register");
