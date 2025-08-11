import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

// Bun macro file - this gets executed at compile time
export function getCompiledVersion() {
    try {
        // Read package.json at compile time
        const packagePath = join(dirname(__filename), "..", "package.json");
        const packageContent = readFileSync(packagePath, "utf-8");
        const packageJson = JSON.parse(packageContent);
        return packageJson.version;
    } catch (error) {
        console.error("Failed to read version at compile time:", error);
        return undefined;
    }
}