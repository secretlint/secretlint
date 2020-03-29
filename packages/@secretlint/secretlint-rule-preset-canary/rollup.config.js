import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
    input: "src/index.ts",
    output: [
        {
            dir: "lib/",
            format: "commonjs",
            exports: "named",
            sourcemap: true,
        },
    ],
    plugins: [resolve({ preferBuiltins: true }), commonjs(), typescript(), json()],
};
