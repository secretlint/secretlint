import { cli } from "../../../src/cli.js";

// User passes a literal file path that exists on disk but is excluded by
// the directory's .gitignore (`*.log`). The expected behaviour is silent
// success (exit 0, empty output) — a deliberate distinction from "file
// not found", which throws. searchFiles' empty-result fallback walk
// detects "would have matched without the cascade" and returns ok=true
// with an empty items list so the engine produces no findings.
export const inputs: string[] = ["secret.log"];
export const options: Partial<typeof cli.flags> = {};
