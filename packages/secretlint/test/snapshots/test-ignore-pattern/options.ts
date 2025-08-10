import { cli } from "../../../src/cli.js";

// Set environment variable to test custom ignore patterns
process.env.SECRETLINT_TEST_IGNORE_PATTERNS = "**/test-secrets/**";

export const inputs: string[] = ["test-secrets/**"];
export const options: Partial<typeof cli.flags> = {};
