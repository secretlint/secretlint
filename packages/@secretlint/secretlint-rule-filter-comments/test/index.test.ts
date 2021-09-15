import { snapshot } from "@secretlint/tester";
import path from "path";
import { creator as rule } from "../src/index";
import { creator as exampleRule } from "@secretlint/secretlint-rule-example";

describe("@secretlint/secretlint-rule-filter-comments", () => {
    snapshot({
        defaultConfig: {
            rules: [
                {
                    id: require("../package.json").name,
                    rule,
                    options: {}
                },
                {
                    id: "@secretlint/secretlint-rule-example",
                    rule: exampleRule,
                    options: {}
                }
            ]
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: path.join(__dirname, "snapshots")
    }).forEach((name, test) => {
        it(name, async function () {
            const status = await test();
            if (status === "skip") {
                this.skip();
            }
        });
    });
});
