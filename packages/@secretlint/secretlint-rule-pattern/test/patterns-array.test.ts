import { creator as rule } from "../src/index.js";

import test from "node:test";
test("@secretlint/secretlint-rule-pattern with patterns array", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    await snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-pattern",
                    rule,
                    options: {
                        patterns: [
                            {
                                name: "credentials",
                                patterns: [
                                    "/password\\s*=\\s*(?<password>[\\w\\d!@#$%^&(){}\\[\\]:\";'<>,.?/~`_+-=|]{1,256})\\b.*/gi",
                                    "/apikey\\s*=\\s*(?<apikey>[\\w\\d_-]{8,})\\b.*/gi",
                                    "/token\\s*=\\s*(?<token>[\\w\\d_-]{16,})\\b.*/gi",
                                ],
                            },
                        ],
                        allows: ["foo-bar"],
                    },
                },
            ],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots-patterns-array", import.meta.url),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});
