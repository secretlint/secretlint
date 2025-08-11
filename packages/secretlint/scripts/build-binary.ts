#!/usr/bin/env node --experimental-strip-types
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read package.json to get version
const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;

console.log("Building secretlint binary...");
console.log(`Version: ${version}`);

// Build with TypeScript first
console.log("Building TypeScript...");
execSync("npm run build", { cwd: join(__dirname, ".."), stdio: "inherit" });

// Compile binary with Bun
console.log("Compiling binary with Bun...");
const entryPoint = join(__dirname, "..", "bin", "secretlint.js");
const outputPath = join(__dirname, "..", "secretlint-binary");

// Set environment variable for version
const env = { ...process.env, SECRETLINT_VERSION: version };

execSync(`bun compile ${entryPoint} --outfile ${outputPath}`, {
    stdio: "inherit",
    env
});

console.log(`Binary compiled successfully to: ${outputPath}`);
console.log(`Version will be available via multiple strategies:`);
console.log(`  1. Environment variable: SECRETLINT_VERSION=${version}`);
console.log(`  2. Direct file read from package.json`);
console.log(`  3. Package resolver (fallback)`);

// Test the binary
console.log("\nTesting binary --version:");
try {
    const versionOutput = execSync(`${outputPath} --version`, { encoding: "utf-8" }).trim();
    console.log(`Output: ${versionOutput}`);
    if (versionOutput === version) {
        console.log("✅ Version check passed!");
    } else {
        console.log("⚠️ Version mismatch - binary may need package.json bundled");
    }
} catch (error) {
    console.error("❌ Failed to test binary:", error);
}