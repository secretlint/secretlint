import * as fs from "fs";
import * as path from "path";
import * as assert from "assert";
import { lintSource, SecretLintCoreOptions } from "@secretlint/core";

export type SnapshotOptions = {
    snapshotDirectory: string;
    lintOptions: SecretLintCoreOptions;
    /**
     * Update snapshot if the options is true
     * Exception, process.env.UPDATE_SNAPSHOT=1 force turn on this option.
     */
    updateSnapshot: boolean;
};
const createSnapshotRepalcer = (options: SnapshotOptions) => {
    return (key: string, value: any) => {
        // Filtering out properties
        if (key === "filePath") {
            return value.replace(options.snapshotDirectory, "[SNAPSHOT]");
        }
        return value;
    };
};

/**
 * // Mocha
 * describe("Snapshot Testing", () => {
 *  snapshot(options).forEach((name, test) => {
 *    it(name, async function() {
 *        const status = await test();
 *        if(status === "skip"){
 *            this.skip();
 *        }
 *    });
 *  }
 * })
 */
export const snapshot = (options: SnapshotOptions) => {
    const fixturesDir = options.snapshotDirectory;
    const updateSnapshot = !!process.env.UPDATE_SNAPSHOT || options.updateSnapshot;
    const snapshotReplacer = createSnapshotRepalcer(options);
    return {
        forEach(handler: (testCaseName: string, testFunction: () => Promise<"skip" | "done">) => void) {
            fs.readdirSync(fixturesDir).map((caseName: string) => {
                const normalizedTestName = caseName.replace(/[-_]/g, " ");
                handler(normalizedTestName, async () => {
                    const fixtureDir = path.join(fixturesDir, caseName);
                    const actualFilePath = path.join(fixtureDir, "input");
                    const actualContent = fs.readFileSync(actualFilePath, "utf-8");
                    const actualResult = await lintSource(
                        {
                            filePath: actualFilePath,
                            content: actualContent
                        },
                        options.lintOptions
                    );
                    const expectedFilePath = path.join(fixtureDir, "output.json");
                    // Usage: update snapshots
                    // UPDATE_SNAPSHOT=1 npm test
                    if (!fs.existsSync(expectedFilePath) || updateSnapshot) {
                        fs.writeFileSync(expectedFilePath, JSON.stringify(actualResult, snapshotReplacer, 4));
                        return "skip";
                    }
                    // compare input and output
                    const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                    assert.deepEqual(
                        JSON.parse(JSON.stringify(actualResult, snapshotReplacer)),
                        expected,
                        `
${fixtureDir}
${JSON.stringify(actualResult, snapshotReplacer)}
`
                    );
                    return "done";
                });
            });
        }
    };
};
