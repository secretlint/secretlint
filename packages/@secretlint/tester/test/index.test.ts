import { snapshot } from "../src/index.js";
import path from "node:path";
import { creator as rule } from "./fixtures/secretlint-rule-example.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
describe("@secretlint/tester", () => {
    snapshot({
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
        it(name, async function () {
            const status = await test();
            if (status === "skip") {
                this.skip();
            }
        });
    });
});
