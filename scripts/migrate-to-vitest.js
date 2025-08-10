#!/usr/bin/env node --experimental-strip-types
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

async function updatePackageJsonScripts() {
    const packagePaths = await glob("packages/**/package.json", {
        cwd: rootDir,
        exclude: ["**/node_modules/**", "**/test/**"]
    });

    for (const packagePath of packagePaths) {
        const fullPath = path.join(rootDir, packagePath);
        const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

        let modified = false;

        if (content.scripts) {
            // Update test script if it uses mocha
            if (content.scripts.test === "mocha") {
                content.scripts.test = "vitest run";
                modified = true;
                console.log(`✅ Updated test script in ${packagePath}`);
            }

            // Update updateSnapshot script if it exists
            if (content.scripts.updateSnapshot && content.scripts.updateSnapshot.includes("UPDATE_SNAPSHOT=1")) {
                content.scripts.updateSnapshot = "UPDATE_SNAPSHOT=1 vitest run";
                modified = true;
                console.log(`✅ Updated updateSnapshot script in ${packagePath}`);
            }
        }

        if (modified) {
            fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + "\n");
        }
    }
}

async function removeIllegalMochaImports() {
    const testFiles = await glob("packages/**/*.{test,spec}.{js,ts}", {
        cwd: rootDir,
        exclude: ["**/node_modules/**"]
    });

    for (const testFile of testFiles) {
        const fullPath = path.join(rootDir, testFile);
        let content = fs.readFileSync(fullPath, "utf-8");

        // Remove mocha imports (globals will be available)
        const originalContent = content;
        content = content.replace(/import\s+{[^}]*}\s+from\s+["']mocha["'];?\n?/g, "");

        // Convert function() to arrow functions in describe/it blocks
        content = content.replace(
            /describe\s*\(\s*["'`]([^"'`]*?)["'`]\s*,\s*function\s*\(\)/g,
            'describe("$1", () =>'
        );
        content = content.replace(
            /it\s*\(\s*["'`]([^"'`]*?)["'`]\s*,\s*async\s+function\s*\(\)/g,
            'it("$1", async () =>'
        );
        content = content.replace(/it\s*\(\s*["'`]([^"'`]*?)["'`]\s*,\s*function\s*\(\)/g, 'it("$1", () =>');
        content = content.replace(/before\s*\(\s*function\s*\(\)/g, "before(() =>");
        content = content.replace(/after\s*\(\s*function\s*\(\)/g, "after(() =>");
        content = content.replace(/beforeEach\s*\(\s*function\s*\(\)/g, "beforeEach(() =>");
        content = content.replace(/afterEach\s*\(\s*function\s*\(\)/g, "afterEach(() =>");

        // Convert this.skip() to it.skip()
        content = content.replace(/this\.skip\(\)/g, "it.skip()");

        // Fix template literals in test names
        content = content.replace(/it\("test \$\{caseName\}"/g, "it(`test ${caseName}`");

        if (content !== originalContent) {
            fs.writeFileSync(fullPath, content);
            console.log(`✅ Updated test file: ${testFile}`);
        }
    }
}

async function removeMochaConfigs() {
    const mochaConfigs = await glob("packages/**/.mocharc.{json,js,yaml,yml}", {
        cwd: rootDir
    });

    for (const configPath of mochaConfigs) {
        const fullPath = path.join(rootDir, configPath);
        try {
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log(`🗑️  Removed ${configPath}`);
            }
        } catch (err) {
            console.warn(`⚠️  Could not remove ${configPath}: ${err.message}`);
        }
    }
}

async function main() {
    console.log("🚀 Starting Vitest migration...\n");

    console.log("📦 Updating package.json scripts...");
    await updatePackageJsonScripts();

    console.log("\n📝 Updating test files...");
    await removeIllegalMochaImports();

    console.log("\n🧹 Removing mocha config files...");
    await removeMochaConfigs();

    console.log("\n✨ Migration script completed!");
    console.log("\n⚠️  Next steps:");
    console.log("1. Run tests to verify they work: pnpm test");
    console.log("2. Remove mocha dependencies: pnpm -r remove mocha @types/mocha");
    console.log("3. Commit the changes");
}

main().catch(console.error);
