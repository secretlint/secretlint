import { SecretLintFormatter } from "@secretlint/types";

const replaceRange = (str: string, range: readonly [number, number], replace: string) => {
    return str.slice(0, range[0]) + replace + str.slice(range[1]);
};

const formatter: SecretLintFormatter = (results) => {
    let resultOutput = "";
    for (const result of results) {
        const sourceContent = result.sourceContent;
        const sourceContentType = result.sourceContentType;
        if (sourceContentType === "binary") {
            throw new Error("--format=mask-result: Binary file is not supported");
        }
        if (!sourceContent) {
            throw new Error("--format=mask-result: sourceContent is not found");
        }
        let tmp = sourceContent;
        result.messages.forEach((message) => {
            const length = message.range[1] - message.range[0];
            tmp = replaceRange(tmp, message.range, "*".repeat(length));
        });
        resultOutput += tmp;
    }
    return resultOutput;
};

export default formatter;
