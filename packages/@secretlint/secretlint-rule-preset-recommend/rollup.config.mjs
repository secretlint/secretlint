import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/index.ts",
    treeshake: {
        preset: "smallest",
        // node-forge sub-modules attach themselves to the shared forge object
        // via top-level `require()` side effects (e.g. pkcs12.js requires
        // asn1/util/pbe/...). Preserve those side effects so features stay wired.
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
