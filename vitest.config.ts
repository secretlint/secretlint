import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: [
            "packages/**/test/**/*.{test,spec}.{js,ts}",
            "packages/**/test/**/*{-test,-spec}.{js,ts}",
            "packages/**/test/**/test-*.{js,ts}",
            "packages/**/test/**/spec-*.{js,ts}"
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
            "**/test-formatter.ts" // Exclude test helper files
        ],
        globals: true,
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000
    }
});
