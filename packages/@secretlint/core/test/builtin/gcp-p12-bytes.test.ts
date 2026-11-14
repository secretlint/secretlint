import fs from "node:fs";
import { fileURLToPath } from "node:url";
import type { SecretLintRuleContext, SecretLintSourceCode } from "@secretlint/types";
import { creator as rule } from "../../src/builtin/rules/gcp/index.js";

const p12FilePath = fileURLToPath(new URL("rules/gcp/snapshots/ng.privatekey-p12/input.p12", import.meta.url));

const lintP12 = async (contentBytes: Uint8Array | undefined) => {
    const reports: unknown[] = [];
    const context = {
        createTranslator: () => (messageId: string) => ({ message: messageId, messageId, data: {} }),
        report: (descriptor: unknown) => reports.push(descriptor),
    } as unknown as SecretLintRuleContext;
    const bytes = fs.readFileSync(p12FilePath);
    const source = {
        // the file exists on the disk, so the rule could read it if it tried
        filePath: p12FilePath,
        physicalFilePath: p12FilePath,
        ext: ".p12",
        contentType: "binary",
        content: bytes.toString(),
        contentBytes,
    } as unknown as SecretLintSourceCode;
    const handler = rule.create(context, {});
    await handler.file?.(source);
    return reports;
};

it("gcp: reports a .p12 service account key from contentBytes", async () => {
    const reports = await lintP12(new Uint8Array(fs.readFileSync(p12FilePath)));
    expect(reports.length).toBe(1);
});

it("gcp: does not read the file and reports nothing without contentBytes", async () => {
    const reports = await lintP12(undefined);
    expect(reports).toEqual([]);
});
