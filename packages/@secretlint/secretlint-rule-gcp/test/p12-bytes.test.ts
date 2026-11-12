import { creator as rule } from "../src/index.js";
import type { SecretLintRuleContext, SecretLintSourceCode } from "@secretlint/types";
import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const p12FilePath = fileURLToPath(new URL("snapshots/ng.privatekey-p12/input.p12", import.meta.url));

const lintP12 = async (
    contentBytes: Uint8Array | undefined,
    { filePath = p12FilePath, allows = [] as string[] } = {},
) => {
    const reports: unknown[] = [];
    const context = {
        createTranslator: () => (messageId: string) => ({ message: messageId, messageId, data: {} }),
        report: (descriptor: unknown) => reports.push(descriptor),
    } as unknown as SecretLintRuleContext;
    const bytes = fs.readFileSync(p12FilePath);
    const source = {
        // the file exists on the disk, so the rule could read it if it tried
        filePath,
        physicalFilePath: filePath,
        ext: ".p12",
        contentType: "binary",
        content: bytes.toString(),
        contentBytes,
    } as unknown as SecretLintSourceCode;
    const handler = rule.create(context, { allows });
    await handler.file?.(source);
    return reports;
};

test("gcp: reports a .p12 service account key from contentBytes", async () => {
    const reports = await lintP12(new Uint8Array(fs.readFileSync(p12FilePath)));
    assert.strictEqual(reports.length, 1);
});

test("gcp: does not read the file and reports nothing without contentBytes", async () => {
    const reports = await lintP12(undefined);
    assert.deepStrictEqual(reports, []);
});
