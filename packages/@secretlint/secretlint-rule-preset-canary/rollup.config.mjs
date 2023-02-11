import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-polyfill-node';
export default [
    {
        input: "src/index.ts",
        output: [
            {
                dir: "lib/",
                format: "commonjs",
                exports: "named",
                sourcemap: true,
            }
        ],
        plugins: [resolve({ preferBuiltins: true }), commonjs(), typescript()],
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
        plugins: [resolve({ preferBuiltins: true }), commonjs(), typescript(), nodePolyfills()],
    }
];
