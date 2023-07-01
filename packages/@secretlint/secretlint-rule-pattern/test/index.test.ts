import path from "path";
import { creator as rule } from "../src/index";

import test from "node:test";
test("@secretlint/secretlint-rule-pattern", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    return snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-pattern",
                    rule,
                    options: {
                        patterns: [
                            {
                                name: "password=",
                                pattern:
                                    "/password\\s*=\\s*(?<password>[\\w\\d!@#$%^&(){}\\[\\]:\";'<>,.?/~`_+-=|]{1,256})\\b.*/gi",
                            },
                        ],
                        allows: ["foo-bar"],
                    },
                },
            ],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: path.join(__dirname, "snapshots"),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});
