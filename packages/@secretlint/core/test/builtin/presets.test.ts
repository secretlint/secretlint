import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type {
    SecretLintConfigDescriptor,
    SecretLintCoreConfig,
    SecretLintCoreResultMessage,
    SecretLintRulePresetCreator,
} from "@secretlint/types";
import { createRawSource } from "@secretlint/source-creator";
import { lintSource } from "../../src/index.js";
import { presetCanary, presetRecommend } from "../../src/builtin/index.js";
import { additionalRules } from "./additional-rules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesDir = path.join(__dirname, "rules");
const RULE_ID_PREFIX = "@secretlint/secretlint-rule-";

const loadInputFileName = async (testCaseDir: string): Promise<string | undefined> => {
    for (const fileName of ["options.json", "options.ts"]) {
        const filePath = path.join(testCaseDir, fileName);
        if (!fs.existsSync(filePath)) {
            continue;
        }
        const options = fileName.endsWith(".json")
            ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
            : (await import(pathToFileURL(filePath).href)).options;
        if (options?.inputFilePath) {
            return options.inputFilePath;
        }
    }
    return fs.readdirSync(testCaseDir).find((fileName) => fileName.startsWith("input"));
};

/**
 * The options of the rule in .secretlintrc.json of a test case of the rule, if any.
 */
const loadRuleOptions = (testCaseDir: string, ruleId: string): unknown => {
    const configFilePath = path.join(testCaseDir, ".secretlintrc.json");
    if (!fs.existsSync(configFilePath)) {
        return undefined;
    }
    const descriptor: SecretLintConfigDescriptor = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    return descriptor.rules.find((rule) => rule.id === ruleId)?.options;
};

const presets = [presetRecommend, presetCanary];

/**
 * The presets do not have their own test cases.
 * Each test case of a rule in the preset (test/builtin/rules/<name>/snapshots/<case>/) runs with the preset,
 * with the options of the rule under the preset entry, and:
 * - the messages of the rule are the same as output.json of the rule, with `ruleParentId` of the preset
 * - an `ok.*` case has no message of any rule in the preset
 */
describe.each(presets)("$meta.id", (preset: SecretLintRulePresetCreator) => {
    const ruleIds = preset.rules.map((rule) => rule.meta.id);
    describe.each(ruleIds)("%s", (ruleId) => {
        const ruleName = ruleId.slice(RULE_ID_PREFIX.length);
        const snapshotsDir = path.join(rulesDir, ruleName, "snapshots");
        const caseNames = fs
            .readdirSync(snapshotsDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
            .map((dirent) => dirent.name);
        it.each(caseNames)("%s", async (caseName) => {
            const testCaseDir = path.join(snapshotsDir, caseName);
            const inputFileName = await loadInputFileName(testCaseDir);
            if (!inputFileName) {
                throw new Error(`Not found input file in ${testCaseDir}`);
            }
            const ruleOptions = loadRuleOptions(testCaseDir, ruleId);
            const extraRules = additionalRules[ruleName] ?? [];
            const config: SecretLintCoreConfig = {
                rules: [
                    {
                        id: preset.meta.id,
                        rule: preset,
                        options: {},
                        rules: ruleOptions === undefined ? [] : [{ id: ruleId, options: ruleOptions }],
                    } as SecretLintCoreConfig["rules"][number],
                    ...extraRules,
                ],
            };
            const result = await lintSource({
                source: await createRawSource(path.join(testCaseDir, inputFileName)),
                options: { config },
            });
            const expected: { messages: SecretLintCoreResultMessage[] } = JSON.parse(
                fs.readFileSync(path.join(testCaseDir, "output.json"), "utf-8"),
            );
            // The ids of the rules that run in the test of the rule alone
            const ownRuleIds = new Set([ruleId, ...extraRules.map((rule) => rule.id)]);
            const normalize = (messages: SecretLintCoreResultMessage[]) => JSON.parse(JSON.stringify(messages));
            expect(normalize(result.messages.filter((message) => ownRuleIds.has(message.ruleId)))).toEqual(
                expected.messages.map((message) =>
                    message.ruleId === ruleId ? { ...message, ruleParentId: preset.meta.id } : message,
                ),
            );
            if (caseName.startsWith("ok")) {
                expect(result.messages).toEqual([]);
            }
        });
    });
});
