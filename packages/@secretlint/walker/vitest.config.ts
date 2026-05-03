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
        ],
        globals: true,
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000,
    },
});
