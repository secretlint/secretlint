import { SecretLintCoreResult, SecretLintFormatter } from "@secretlint/types";
import { SarifBuilder, SarifResultBuilder, SarifRuleBuilder, SarifRunBuilder } from "node-sarif-builder";
import path from "node:path";
import { pathToFileURL } from "node:url";

function buildSarifResult(lintResults: SecretLintCoreResult[]) {
    // SARIF builder
    const sarifBuilder = new SarifBuilder();
    // SARIF Run builder
    const sarifRunBuilder = new SarifRunBuilder().initSimple({
        toolDriverName: "secretlint",
        toolDriverVersion: "1.0.0", // TODO: currently can not get secretlint's version from formatter
        url: "https://github.com/secretlint/secretlint"
    });
    // SARIF rules
    const addedRuleSet = new Set<string>();
    lintResults.forEach((result) => {
        result.messages.forEach((message) => {
            const ruleId = message.ruleParentId ? `${message.ruleParentId} > ${message.ruleId}` : message.ruleId;
            if (addedRuleSet.has(ruleId)) {
                return;
            }
            addedRuleSet.add(ruleId);
            const sarifRuleBuiler = new SarifRuleBuilder().initSimple({
                ruleId: ruleId,
                shortDescriptionText: `secretlint rule(${ruleId}) error`,
                helpUri: message?.docsUrl
            });
            sarifRunBuilder.addRule(sarifRuleBuiler);
        });
    });
    // Add SARIF results (individual errors)
    lintResults.forEach((result) => {
        result.messages.forEach((message) => {
            const sarifResultBuilder = new SarifResultBuilder();
            const ruleId = message.ruleParentId ? `${message.ruleParentId} > ${message.ruleId}` : message.ruleId;
            const sarifResultInit = {
                level: message.severity === "info" ? "note" : message.severity, // Other values can be "warning" or "error"
                messageText: message.message,
                ruleId: ruleId,
                fileUri: process.env.SARIF_URI_ABSOLUTE
                    ? pathToFileURL(result.filePath).toString()
                    : path.relative(process.cwd(), result.filePath),
                startLine: fixLine(message.loc.start.line),
                startColumn: fixCol(message.loc.start.column),
                endLine: fixLine(message.loc.end.line),
                endColumn: fixCol(message.loc.end.column)
            } as const;
            sarifResultBuilder.initSimple(sarifResultInit);
            sarifRunBuilder.addResult(sarifResultBuilder);
        });
    });
    sarifBuilder.addRun(sarifRunBuilder);
    return sarifBuilder.buildSarifJsonString({ indent: true });
}

function fixLine(val: number) {
    if (val === null) {
        return undefined;
    }
    return val === 0 ? 1 : val;
}

function fixCol(val: number) {
    if (val === null) {
        return undefined;
    }
    return val === 0 ? 1 : val + 1;
}

const formatter: SecretLintFormatter = (results) => {
    return buildSarifResult(results);
};
export default formatter;
