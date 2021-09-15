import { SecretLintSourceCode } from "@secretlint/types";

type IgnoringCommentObject = {
    startIndex: null | number;
    endIndex: null | number;
    ruleId: null | string;
};

export class CommentState {
    private reportingConfig: IgnoringCommentObject[];
    private endIndex: number;

    constructor(private source: SecretLintSourceCode) {
        this.reportingConfig = [];
        this.endIndex = source.content.length;
    }

    getIgnoringMessages(): { startIndex: number; endIndex: number; ruleId: string }[] {
        const isFilledMessage = (
            message: IgnoringCommentObject
        ): message is { startIndex: number; endIndex: number; ruleId: string } => {
            return message.startIndex !== null && message.endIndex !== null && message.ruleId !== null;
        };
        return this.reportingConfig
            .map((reporting) => {
                if (reporting.endIndex === null) {
                    // [start, ?= document-end]
                    // filled with document's end
                    reporting.endIndex = this.endIndex;
                }
                return reporting;
            })
            .filter(isFilledMessage);
    }

    disableLine(lineNumber: number, rulesToDisable: string[]) {
        const reportingConfig = this.reportingConfig;
        const range = this.source.locationToRange({
            start: {
                line: lineNumber,
                column: 0
            },
            end: {
                line: lineNumber + 1,
                column: 0
            }
        });
        if (rulesToDisable.length) {
            rulesToDisable.forEach((ruleId) => {
                reportingConfig.push({
                    startIndex: range[0],
                    endIndex: range[1] - 1,
                    ruleId: ruleId
                });
            });
        } else {
            reportingConfig.push({
                startIndex: range[0],
                endIndex: range[1] - 1,
                ruleId: "*"
            });
        }
    }

    /**
     * Add data to reporting configuration to disable reporting for list of rules
     * starting from start location
     * @returns {void}
     */
    disableReporting(startIndex: number, rulesToDisable: string[]) {
        const reportingConfig = this.reportingConfig;
        if (rulesToDisable.length) {
            rulesToDisable.forEach(function (ruleId) {
                reportingConfig.push({
                    startIndex: startIndex,
                    endIndex: null,
                    ruleId: ruleId
                });
            });
        } else {
            reportingConfig.push({
                startIndex: startIndex,
                endIndex: null,
                ruleId: "*"
            });
        }
    }

    /**
     * Add data to reporting configuration to enable reporting for list of rules
     * starting from start location
     */
    enableReporting(endIndex: number, rulesToEnable: string[]) {
        const reportingConfig = this.reportingConfig;
        if (rulesToEnable.length) {
            rulesToEnable.forEach(function (ruleId) {
                for (let i = reportingConfig.length - 1; i >= 0; i--) {
                    if (!reportingConfig[i].endIndex && reportingConfig[i].ruleId === ruleId) {
                        reportingConfig[i].endIndex = endIndex;
                        break;
                    }
                }
            });
        } else {
            // find all previous disabled locations if they was started as list of rules
            let prevStart;
            for (let i = reportingConfig.length - 1; i >= 0; i--) {
                if (prevStart && prevStart !== reportingConfig[i].startIndex) {
                    break;
                }
                if (!reportingConfig[i].endIndex) {
                    reportingConfig[i].endIndex = endIndex;
                    prevStart = reportingConfig[i].startIndex;
                }
            }
        }
    }
}
