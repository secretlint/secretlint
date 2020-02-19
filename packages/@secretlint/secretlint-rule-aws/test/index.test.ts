import { snapshot } from "@secretlint/tester";
import path from "path";
import rule from "../src/index";

describe("Snapshot Testing", () => {
    snapshot({
        defaultConfig: {
            rules: [
                {
                    id: require("../package.json").name,
                    rule
                }
            ]
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: path.join(__dirname, "snapshots")
    }).forEach((name, test) => {
        console.log("name", name);
        it(name, async function() {
            const status = await test();
            if (status === "skip") {
                this.skip();
            }
        });
    });
});
