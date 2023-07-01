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
                dir: "lib/",
                format: "commonjs",
                exports: "named",
                sourcemap: true
            }
        ],
        plugins: [resolve({ preferBuiltins: true }), commonjs(), typescript()]
    },
    {
        input: "src/index.ts",
        output: [
            {
                dir: "browser/",
                format: "es",
                exports: "named",
                sourcemap: true,
                treeshake: true
            }
        ],
        // Delete process.version
        plugins: [replace({
            "__DEV__": false,
            "process.platform": null,
            "process.version": null,
            "process.env.NODE_ENV": JSON.stringify("production"),
            preventAssignment: false
        }), resolve({ preferBuiltins: false }), commonjs(), typescript(), nodePolyfills()]
    }
]);
