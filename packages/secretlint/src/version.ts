import { getPackageJson } from "@secretlint/resolver";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Import package.json directly - this will be embedded in the bundle
let EMBEDDED_PACKAGE_JSON: { version?: string } | undefined;
try {
    // @ts-ignore - JSON import
    EMBEDDED_PACKAGE_JSON = await import("../package.json", { with: { type: "json" } });
} catch {
    // Fallback for environments that don't support JSON imports
    EMBEDDED_PACKAGE_JSON = undefined;
}

/**
 * Get version from package.json
 * This tries multiple strategies to get the version:
 * 1. Environment variable (highest priority for testing)
 * 2. Embedded package.json (for Bun compiled binaries)
 * 3. Direct file read from known location
 * 4. Package resolver (original method)
 */
export function getVersion(): string | undefined {
    // Strategy 1: Check if version was embedded via environment variable (highest priority)
    if (process.env.SECRETLINT_VERSION) {
        return process.env.SECRETLINT_VERSION;
    }
    
    // Strategy 2: Use embedded package.json if available
    if (EMBEDDED_PACKAGE_JSON?.version) {
        return EMBEDDED_PACKAGE_JSON.version;
    }
    
    // Strategy 3: Try to read package.json directly from known location
    try {
        const currentDir = dirname(fileURLToPath(import.meta.url));
        // Try multiple possible locations
        const possiblePaths = [
            join(currentDir, "..", "package.json"),
            join(currentDir, "..", "..", "package.json"),
            join(process.cwd(), "package.json"),
        ];
        
        for (const packagePath of possiblePaths) {
            try {
                const packageContent = readFileSync(packagePath, "utf-8");
                const packageJson = JSON.parse(packageContent);
                if (packageJson.name === "secretlint" && packageJson.version) {
                    return packageJson.version;
                }
            } catch {
                // Continue to next path
            }
        }
    } catch {
        // Fall through to strategy 4
    }
    
    // Strategy 4: Use the original resolver method
    const packageJson = getPackageJson(import.meta.url);
    return packageJson?.version;
}