import test from "node:test";
import { snapshot } from "../src/index.js";
import path from "node:path";
import { creator as rule } from "./fixtures/secretlint-rule-example.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
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
        snapshotDirectory: path.join(__dirname, "fixtures/snapshots"),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});
