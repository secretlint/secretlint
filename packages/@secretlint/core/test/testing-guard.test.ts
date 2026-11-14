import assert from "node:assert";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { SecretLintCoreConfig, SecretLintRawSource, SecretLintRuleCreator } from "@secretlint/types";
import { createSnapshotTestCases } from "../src/testing/index.js";
import { creator as rulePattern } from "../src/builtin/rules/pattern/index.js";

const messages = {
    FOUND: {
        en: (props: { TEXT: string }) => `found: ${props.TEXT}`,
    },
};
const createRule = (after: string, scope: "line" | "file"): SecretLintRuleCreator => {
    return {
        messages,
        meta: { id: "example-rule", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
        patterns: [
            {
                // the key has 8 characters of letters and digits after "00"
                pattern: /(?<![A-Za-z0-9])00[A-Za-z0-9]{8}(?![A-Za-z0-9])/g,
                keywords: [{ keyword: "00", after }],
                scope,
                report(match, context) {
                    const t = context.createTranslator(messages);
                    context.report({ message: t("FOUND", { TEXT: match.text }), range: match.range });
                },
            },
        ],
    };
};
const createRawSource = async (filePath: string): Promise<SecretLintRawSource> => {
    const contentBytes = fs.readFileSync(filePath);
    return { filePath, contentType: "text", content: contentBytes.toString("utf-8"), contentBytes };
};
/**
 * Run the snapshot test of one test case with the input
 */
const runTestCase = async (config: SecretLintCoreConfig, input: string) => {
    const snapshotDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-testing-guard-"));
    try {
        fs.mkdirSync(path.join(snapshotDirectory, "ng.case"));
        fs.writeFileSync(path.join(snapshotDirectory, "ng.case", "input.txt"), input);
        const [testCase] = createSnapshotTestCases({ snapshotDirectory, defaultConfig: config, createRawSource });
        assert.ok(testCase);
        return await testCase.run();
    } finally {
        fs.rmSync(snapshotDirectory, { recursive: true, force: true });
    }
};
const toConfig = (rule: SecretLintRuleCreator): SecretLintCoreConfig => {
    return { rules: [{ id: rule.meta.id, rule }] };
};

describe("the check of guards in @secretlint/core/testing", () => {
    const input = "first line\n  key = 00abcdEF12\n";
    it("passes when every secret meets the guard", async () => {
        for (const scope of ["line", "file"] as const) {
            assert.strictEqual(await runTestCase(toConfig(createRule("[A-Za-z0-9]{8,}", scope)), input), "skip");
        }
    });
    it("fails with the rule, the guard, and the position when a guard rejects a secret", async () => {
        for (const scope of ["line", "file"] as const) {
            // the set has no upper case letters, and the key has "EF"
            await assert.rejects(runTestCase(toConfig(createRule("[a-z0-9]{8,}", scope)), input), (error: Error) => {
                assert.match(error.message, /A guard of a keyword rejects a secret/);
                assert.match(
                    error.message,
                    /example-rule: the guard "\[a-z0-9\]\{8,\}" of the keyword "00" is not met at 2:9, but the rule reports a secret at 2:9-2:19\./,
                );
                return true;
            });
            // the count is over the length of the key
            await assert.rejects(
                runTestCase(toConfig(createRule("[A-Za-z0-9]{9,}", scope)), input),
                /the guard "\[A-Za-z0-9\]\{9,\}" of the keyword "00" is not met at 2:9/,
            );
        }
    });
    it("fails for a guard of a user-defined pattern", async () => {
        const config = (after: string): SecretLintCoreConfig => {
            return {
                rules: [
                    {
                        id: rulePattern.meta.id,
                        rule: rulePattern,
                        options: {
                            patterns: [
                                {
                                    name: "internal key",
                                    patterns: ["/00[A-Za-z0-9]{8}/"],
                                    keywords: [{ keyword: "00", after }],
                                },
                            ],
                        },
                    },
                ],
            };
        };
        assert.strictEqual(await runTestCase(config("[A-Za-z0-9]{8,}"), input), "skip");
        await assert.rejects(
            runTestCase(config("[0-9]{8,}"), input),
            /@secretlint\/secretlint-rule-pattern: the guard "\[0-9\]\{8,\}" of the keyword "00" is not met at 2:9/,
        );
    });
});
