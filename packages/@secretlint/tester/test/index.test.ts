import test from "node:test";
import { snapshot } from "../src/index.js";
import { creator as rule } from "./fixtures/secretlint-rule-example.js";

test("@secretlint/tester", (t) => {
    return snapshot({
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
        snapshotDirectory: new URL("./fixtures/snapshots", import.meta.url),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});
