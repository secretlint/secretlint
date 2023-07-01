import path from "path";
import { creator as rule } from "../src/index";

(async function () {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    describe("@secretlint/secretlint-rule-basicauth", () => {
        snapshot({
            defaultConfig: {
                rules: [
                    {
                        id: "@secretlint/secretlint-rule-basicauth",
                        rule,
                        options: {},
                    },
                ],
            },
            updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
            snapshotDirectory: path.join(__dirname, "snapshots"),
        }).forEach((name, test) => {
            it(name, async function () {
                const status = await test();
                if (status === "skip") {
                    this.skip();
                }
            });
        });
    });
})();
