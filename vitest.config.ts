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
            "**/test-formatter.ts" // Exclude test helper files
        ],
        globals: true,
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000,
        projects: ["packages/*/vitest.config.ts", "packages/@secretlint/*/vitest.config.ts"]
    }
});
