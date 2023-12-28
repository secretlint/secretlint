import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
const ruleDependencies = Object.keys(pkg.devDependencies).filter((name) => {
    return name.startsWith("@secretlint/secretlint-rule-");
});
const packagesDir = path.join(__dirname, "../");
const ruleDirs = fs
    .readdirSync(packagesDir, {
        withFileTypes: true,
    })
    .filter((dirent) => {
        return dirent.isDirectory() && ruleDependencies.includes(`@secretlint/${dirent.name}`);
    });

/**
 *
 * @param {Dirent} ruleDir
 */
const copyTestFiles = (ruleDir) => {
    const ruleDirName = ruleDir.name;
    const snapshotsDir = path.join(packagesDir, ruleDir.name, "test", "snapshots");
    if (fs.existsSync(snapshotsDir) === false) {
        return;
    }
    console.log(`Copy test files: ${ruleDirName}`);
    const testDirs = fs
        .readdirSync(snapshotsDir, {
            withFileTypes: true,
        })
        .filter((dirent) => {
            return dirent.isDirectory();
        });
    testDirs.forEach((dir) => {
        const src = path.join(snapshotsDir, dir.name);
        // test/snapshots/<rule>/...
        const dest = path.join("test", "snapshots", ruleDirName, dir.name);
        fs.cpSync(src, dest, {
            recursive: true,
        });
    });
};
const rmCurrentSnapshots = () => {
    console.log(`Remove current snapshots`);
    const currentSnapshotsDir = path.join(__dirname, "test", "snapshots");
    return fs.rmSync(currentSnapshotsDir, {
        recursive: true,
    });
};

await rmCurrentSnapshots();
ruleDirs.forEach(copyTestFiles);

console.log("Need to update snapshots:");
console.log("$ npm run updateSnapshots");
console.log("Copied snapshot is a bit different from preset.");
