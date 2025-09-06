#!/usr/bin/env node --experimental-strip-types
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface PackageJson {
    name: string;
    version: string;
    private?: boolean;
}

interface NpmPackageInfo {
    dist?: {
        attestations?: any;
    };
}

function getWorkspacePackages(): PackageJson[] {
    const packages: PackageJson[] = [];
    const workspacePaths = ["packages/*", "packages/@secretlint/*"];

    for (const pattern of workspacePaths) {
        const basePath = pattern.replace("/*", "");
        if (!fs.existsSync(basePath)) continue;

        const dirs = fs.readdirSync(basePath);
        for (const dir of dirs) {
            const packagePath = path.join(basePath, dir, "package.json");
            if (fs.existsSync(packagePath)) {
                const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
                packages.push(packageJson);
            }
        }
    }

    return packages;
}

function checkPackageProvenance(packageName: string): boolean {
    try {
        const output = execSync(`npm view ${packageName} --json`, {
            encoding: "utf-8",
            stdio: ["pipe", "pipe", "ignore"]
        });

        const packageInfo: NpmPackageInfo = JSON.parse(output);
        return packageInfo.dist?.attestations != null;
    } catch (error) {
        // Package might not be published yet
        console.log(`⚠️  ${packageName}: Not published or error checking`);
        return false;
    }
}

async function main() {
    console.log("🔍 Checking npm provenance for public packages...\n");

    const packages = getWorkspacePackages();
    const publicPackages = packages.filter((pkg) => !pkg.private);

    const results = {
        withProvenance: [] as string[],
        withoutProvenance: [] as string[],
        notPublished: [] as string[]
    };

    for (const pkg of publicPackages) {
        try {
            // Check if package exists on npm
            const npmOutput = execSync(`npm view ${pkg.name} version 2>/dev/null`, {
                encoding: "utf-8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim();

            if (!npmOutput) {
                results.notPublished.push(pkg.name);
                console.log(`⏭️  ${pkg.name}: Not published yet`);
                continue;
            }

            // Check provenance
            const hasProvenance = checkPackageProvenance(pkg.name);
            if (hasProvenance) {
                results.withProvenance.push(pkg.name);
                console.log(`✅ ${pkg.name}: Has provenance`);
            } else {
                results.withoutProvenance.push(pkg.name);
                console.log(`❌ ${pkg.name}: Missing provenance`);
            }
        } catch (error) {
            results.notPublished.push(pkg.name);
            console.log(`⏭️  ${pkg.name}: Not published yet`);
        }
    }

    // Summary
    console.log("\n📊 Summary:");
    console.log(`  Total public packages: ${publicPackages.length}`);
    console.log(`  With provenance: ${results.withProvenance.length}`);
    console.log(`  Without provenance: ${results.withoutProvenance.length}`);
    console.log(`  Not published: ${results.notPublished.length}`);

    // Exit with error if any published package lacks provenance
    if (results.withoutProvenance.length > 0) {
        console.log("\n⚠️  The following published packages need OIDC/provenance configuration:");
        results.withoutProvenance.forEach((pkg) => {
            console.log(`  - ${pkg}`);
            console.log(`    https://www.npmjs.com/package/${pkg}/access`);
        });
        console.log("\n📝 To configure OIDC for each package:");
        console.log("  1. Click the URL above for each package");
        console.log("  2. Click 'Add trusted publisher'");
        console.log("  3. Configure with:");
        console.log("     • Repository: secretlint/secretlint");
        console.log("     • Workflow: .github/workflows/publish.yml");
        console.log("     • Environment: (leave empty)");
        process.exit(1);
    }

    // Show instructions for unpublished packages
    if (results.notPublished.length > 0) {
        console.log("\n📦 For new packages that haven't been published yet:");
        results.notPublished.forEach((pkg) => {
            console.log(`  npx setup-npm-trusted-publish ${pkg}`);
        });
        console.log("\nThis will:");
        console.log("  1. Reserve the package name on npm");
        console.log("  2. Configure OIDC trusted publishing automatically");
        console.log("  3. Allow future publishes via CI without npm tokens");
    }

    console.log("\n✅ All published packages have provenance configured!");
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
