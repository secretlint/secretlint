import { snapshot } from "../src";
import path from "path";
import { creator as rule } from "./fixtures/secretlint-rule-example";

describe("@secretlint/tester", () => {
    snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "secretlint-rule-example",
                    rule,
                    options: {},
                },
            ],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: path.join(__dirname, "fixtures/snapshots"),
    }).forEach((name, test) => {
        it(name, async function () {
            const status = await test();
            if (status === "skip") {
                this.skip();
            }
        });
    });
});
