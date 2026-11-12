import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

// Bundle for browsers without Node.js polyfills.
// `node:*` modules stay as imports: a static import of them makes the page fail to load in the browser test,
// and a dynamic import of them fails only when it runs, as it does in a real browser.
export default {
    input: "src/index.js",
    output: {
        file: "dist/secretlint.js",
        format: "esm"
    },
    external: (id) => id.startsWith("node:"),
    plugins: [resolve({ browser: true, preferBuiltins: false }), commonjs()],
    onwarn(warning, warn) {
        // A bare module name that is not resolved means a missing dependency or a Node.js built-in without `node:`
        if (warning.code === "UNRESOLVED_IMPORT") {
            throw new Error(`Can not bundle for browsers: ${warning.message}`);
        }
        warn(warning);
    }
};
