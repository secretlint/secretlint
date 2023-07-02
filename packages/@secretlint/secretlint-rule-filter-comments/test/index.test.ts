import { creator as rule } from "../src/index.js";
import { creator as patternRule } from "@secretlint/secretlint-rule-pattern";

import test from "node:test";
test("@secretlint/secretlint-rule-filter-comments", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    await snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-filter-comments",
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
        snapshotDirectory: new URL("./snapshots", import.meta.url)
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});
