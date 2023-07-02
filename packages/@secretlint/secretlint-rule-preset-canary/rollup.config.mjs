import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import replace from "@rollup/plugin-replace";

import { defineConfig } from "rollup";

export default defineConfig([
    {
        input: "src/index.ts",
        output: [
            {
                dir: "module/",
                format: "esm",
                exports: "named",
                sourcemap: true,
                interop: "esModule"
            }
        ],
        plugins: [resolve({ preferBuiltins: true }), commonjs({
            // disable __esModule interop
            // Node.js ESM does not recognize `__esModule` flag interop
            defaultIsModuleExports: true
        }), typescript()]
    },
    {
        input: "src/index.ts",
        output: [
            {
                dir: "browser/",
                format: "esm",
                exports: "named",
                sourcemap: true,
                // disable __esModule interop
                // Node.js ESM does not recognize `__esModule` flag interop
                interop: "esModule"
            }
        ],
        // Delete process.version
        plugins: [replace({
            "__DEV__": false,
            "process.platform": null,
            "process.version": null,
            "process.env.NODE_ENV": JSON.stringify("production"),
            preventAssignment: false
        }), resolve({ preferBuiltins: false }), commonjs({
            // disable __esModule interop
            // Node.js ESM does not recognize `__esModule` flag interop
            defaultIsModuleExports: true
        }), typescript({
            tsconfig: "tsconfig.browser.json"
        }), nodePolyfills()]
    }
]);
