import { creator as rule } from "../src/index.js";

import test from "node:test";
test("@secretlint/secretlint-rule-sendgrid", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    await snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-sendgrid",
                    rule,
                    options: {},
                },
            ],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots", import.meta.url),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});
