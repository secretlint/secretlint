import { defineWorkspace } from "vitest/config";

export default defineWorkspace(["packages/*/vitest.config.ts", "packages/@secretlint/*/vitest.config.ts"]);
