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
 * Run the snapshot tests of a directory that has a test case for each input.
 * Return the status of the last one: the check that every keyword with a guard has a test case.
 */
const runTestCases = async (config: SecretLintCoreConfig, inputs: string[]) => {
    const snapshotDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-testing-guard-"));
    try {
        inputs.forEach((input, index) => {
            fs.mkdirSync(path.join(snapshotDirectory, `case-${index}`));
            fs.writeFileSync(path.join(snapshotDirectory, `case-${index}`, "input.txt"), input);
        });
        const testCases = createSnapshotTestCases({ snapshotDirectory, defaultConfig: config, createRawSource });
        assert.strictEqual(testCases.length, inputs.length + 1);
        let status: "skip" | "done" = "done";
        for (const testCase of testCases) {
            status = await testCase.run();
        }
        return status;
    } finally {
        fs.rmSync(snapshotDirectory, { recursive: true, force: true });
    }
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
    describe("every keyword with a guard has a test case", () => {
        // "tok_" has no guard, and "00" and "SK" have one
        const rule: SecretLintRuleCreator = {
            messages,
            meta: { id: "example-rule", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
            patterns: [
                {
                    pattern: /(?:tok_|00|SK)[a-z0-9]{8}/g,
                    keywords: [
                        "tok_",
                        { keyword: "00", after: "[a-z0-9]{8,}" },
                        { keyword: "SK", after: "[a-z0-9]{8,}" },
                    ],
                    scope: "line",
                    report(match, context) {
                        const t = context.createTranslator(messages);
                        context.report({ message: t("FOUND", { TEXT: match.text }), range: match.range });
                    },
                },
            ],
        };
        it("passes when a reported secret meets each guard", async () => {
            assert.strictEqual(
                await runTestCases(toConfig(rule), ["tok_abcd1234", "00abcd1234\n", "x SKabcd1234"]),
                "done",
            );
        });
        it("fails with the keywords that no reported secret meets", async () => {
            // "SK" is in a test case, but its guard is not met there, and nothing is reported for it
            await assert.rejects(
                runTestCases(toConfig(rule), ["tok_abcd1234", "00abcd1234", "SKab"]),
                (error: Error) => {
                    assert.match(error.message, /No test case has a secret for a keyword with a guard/);
                    assert.match(error.message, /example-rule: the keyword "SK" with the guard "\[a-z0-9\]\{8,\}"/);
                    assert.doesNotMatch(error.message, /the keyword "00"/);
                    return true;
                },
            );
        });
        it("does not fail when the rule reports nothing in the test cases", async () => {
            assert.strictEqual(await runTestCases(toConfig(rule), ["no secret", "00:00:00"]), "done");
        });
        it("does not fail when some test cases did not run", async () => {
            const snapshotDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-testing-guard-"));
            try {
                for (const [name, input] of [
                    ["a", "tok_abcd1234"],
                    ["b", "no secret"],
                ] as const) {
                    fs.mkdirSync(path.join(snapshotDirectory, name));
                    fs.writeFileSync(path.join(snapshotDirectory, name, "input.txt"), input);
                }
                const testCases = createSnapshotTestCases({
                    snapshotDirectory,
                    defaultConfig: toConfig(rule),
                    createRawSource,
                });
                // as with a filter of the test runner: only the first test case and the check run
                await testCases[0]?.run();
                assert.strictEqual(await testCases.at(-1)?.run(), "done");
            } finally {
                fs.rmSync(snapshotDirectory, { recursive: true, force: true });
            }
        });
    });
});
