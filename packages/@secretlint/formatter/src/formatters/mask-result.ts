import { SecretLintFormatter } from "@secretlint/types";

const replaceRange = (str: string, range: readonly [number, number], replace: string) => {
    return str.slice(0, range[0]) + replace + str.slice(range[1]);
};

const formatter: SecretLintFormatter = (results, { getSource }) => {
    let resultOutput = "";
    for (const result of results) {
        const sourceContentType = result.sourceContentType;
        if (sourceContentType === "binary") {
            throw new Error("--format=mask-result: Binary file is not supported");
        }
        // The result does not have the content of the source
        const sourceContent = getSource?.(result.filePath);
        if (sourceContent === undefined) {
            throw new Error("--format=mask-result: the content of the source is not found");
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
