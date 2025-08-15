import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        typecheck: {
            enabled: true,
            only: true,
            include: ["test/**/*.test-d.ts"],
            tsconfig: "./tsconfig.test.json",
        },
    },
});
