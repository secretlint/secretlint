import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: [
            "test/**/*.{test,spec}.{js,ts}",
            "test/**/*{-test,-spec}.{js,ts}",
            "test/**/test-*.{js,ts}",
            "test/**/spec-*.{js,ts}",
        ],
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/module/**",
            "**/lib/**",
            "**/fixtures/**",
            "**/snapshots/**",
            "**/*.type-test.ts", // Exclude type tests (using tsd)
            "**/test-formatter.ts", // Exclude test helper files
        ],
        globals: true,
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000,
    },
});
