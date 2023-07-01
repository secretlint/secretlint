import path from "path";
import { creator as rule } from "../src/index";

import test from "node:test";
test("@secretlint/secretlint-rule-aws", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    return snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-aws",
                    rule,
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
