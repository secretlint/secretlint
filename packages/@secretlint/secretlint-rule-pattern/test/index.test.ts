import { snapshot } from "@secretlint/tester";
import path from "path";
import rule from "../src/index";

describe("@secretlint/secretlint-rule-patttern", () => {
    snapshot({
        defaultConfig: {
            rules: [
                {
                    id: require("../package.json").name,
                    rule,
                    options: {
                        patterns: [
                            {
                                name: "password=",
                                pattern:
                                    "/password\\s*=\\s*(?<password>[\\w\\d!@#$%^&(){}\\[\\]:\";'<>,.?/~`_+-=|]{1,256})\\b.*/gi",
                            },
                        ],
                    },
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
