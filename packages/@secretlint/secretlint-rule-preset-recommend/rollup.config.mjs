import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/index.ts",
    treeshake: {
        preset: "smallest",
        // node-forge's lib/index.js attaches sub-modules (pkcs12, asn1, util, ...) to
        // the forge object via top-level `require()` side effects. Preserve those.
        moduleSideEffects: (id) => id.includes("node-forge"),
    },
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
