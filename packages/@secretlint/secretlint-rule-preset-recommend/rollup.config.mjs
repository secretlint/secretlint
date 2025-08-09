import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/index.ts",
    // gcp rule is broken by moduleSideEffects option
    // treeshake: "smallest",
    external: [/^@secretlint\//],
    output: [
        {
            dir: "module/",
            format: "esm",
            exports: "named",
            sourcemap: true,
            // Node.js ESM does not recognize `__esModule` flag interop
            interop: "esModule",
        }
    ],
    plugins: [resolve({ preferBuiltins: true }), commonjs({
        // disable __esModule interop
        // Node.js ESM does not recognize `__esModule` flag interop
        defaultIsModuleExports: true
    }), typescript()]
};
