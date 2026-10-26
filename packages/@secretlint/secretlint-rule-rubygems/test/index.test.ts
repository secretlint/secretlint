import test from "node:test";
import { snapshot } from "@secretlint/tester";
import { creator as rule } from "../src/index.js";

test("@secretlint/secretlint-rule-rubygems", async (t) => {
    await snapshot({
        defaultConfig: {
            rules: [{ id: "@secretlint/secretlint-rule-rubygems", rule, options: {} }],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots", import.meta.url),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") context.skip();
        });
    });
});
