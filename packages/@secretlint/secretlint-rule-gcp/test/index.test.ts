import { snapshot } from "@secretlint/tester";
import path from "path";
import rule from "../src/index";

describe("@secretlint/secretlint-rule-gcp", () => {
    snapshot({
        defaultConfig: {
            rules: [
                {
                    id: require("../package.json").name,
                    rule,
                    options: {}
                }
            ]
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: path.join(__dirname, "snapshots")
    }).forEach((name, test) => {
        it(name, async function() {
            const status = await test();
            if (status === "skip") {
                this.skip();
            }
        });
    });
});
