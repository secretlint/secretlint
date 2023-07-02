import fs from "node:fs";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const packagesDir = path.join(__dirname, "../");
const ruleDirs = fs
    .readdirSync(packagesDir, {
        withFileTypes: true,
    })
    .filter((dirent) => {
        return (
            dirent.isDirectory() &&
            dirent.name.startsWith("secretlint-rule-") &&
            !dirent.name.startsWith("secretlint-rule-preset")
        );
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

console.log("Need to update snapshots via $ npm run updateSnapshots");
console.log("Copied snapshot is a bit different from preset.");
