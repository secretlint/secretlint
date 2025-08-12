import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        typecheck: {
            enabled: true,
            include: ["test/**/*.test-d.ts"],
        },
    },
});
