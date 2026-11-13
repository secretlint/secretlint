import { defineConfig } from "vite";

// Bundle for browsers without Node.js polyfills.
export default defineConfig({
    build: {
        outDir: "dist",
        minify: false,
        rollupOptions: {
            // Vite replaces a Node.js built-in module with an empty module that throws only when it is used.
            // Keep `node:*` as an import instead: a static import of it makes the page fail to load in the browser test,
            // and a dynamic import of it fails only when it runs, as it does in a real browser.
            external: (id) => id.startsWith("node:"),
            onwarn(warning, warn) {
                // A bare module name that is not resolved means a missing dependency or a Node.js built-in without `node:`
                if (warning.code === "UNRESOLVED_IMPORT") {
                    throw new Error(`Can not bundle for browsers: ${warning.message}`);
                }
                warn(warning);
            }
        }
    }
});
