import { snapshot } from "@secretlint/tester";
import path from "path";
import { creator as rule } from "../src/index";
import { creator as patternRule } from "@secretlint/secretlint-rule-pattern";

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
                    id: "@secretlint/secretlint-rule-secret-number",
                    rule: patternRule,
                    options: {
                        patterns: [
                            {
                                name: "secret-number",
                                pattern: "/SECRET \\d+/"
                            }
                        ]
                    }
                },
                {
                    id: "@secretlint/secretlint-rule-secret-alphabet",
                    rule: patternRule,
                    options: {
                        patterns: [
                            {
                                name: "secret-alphabet",
                                pattern: "/SECRET [a-zA-Z]/"
                            }
                        ]
                    }
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
