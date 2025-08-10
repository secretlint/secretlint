#!/usr/bin/env node --experimental-strip-types
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const vitestConfig = `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'test/**/*.{test,spec}.{js,ts}',
      'test/**/*{-test,-spec}.{js,ts}',
      'test/**/test-*.{js,ts}',
      'test/**/spec-*.{js,ts}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/module/**',
      '**/lib/**',
      '**/fixtures/**',
      '**/snapshots/**',
      '**/*.type-test.ts',
      '**/test-formatter.ts'
    ],
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000
  }
})`;

async function createVitestConfigs() {
    const packagePaths = await glob("packages/**/package.json", {
        cwd: rootDir,
        exclude: ["**/node_modules/**", "**/test/**"]
    });

    for (const packagePath of packagePaths) {
        const packageDir = path.dirname(path.join(rootDir, packagePath));
        const content = JSON.parse(fs.readFileSync(path.join(rootDir, packagePath), "utf-8"));

        // Only create config if package has test script
        if (content.scripts && content.scripts.test === "vitest run") {
            const configPath = path.join(packageDir, "vitest.config.ts");
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, vitestConfig);
                console.log(`✅ Created vitest.config.ts in ${packagePath.replace("/package.json", "")}`);
            }
        }
    }
}

async function main() {
    console.log("🚀 Creating Vitest configs for packages...\n");
    await createVitestConfigs();
    console.log("\n✨ Done!");
}

main().catch(console.error);
