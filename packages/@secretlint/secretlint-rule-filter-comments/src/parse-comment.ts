import { SecretLintSourceCode } from "@secretlint/types";

const HTML_COMMENT_REGEXP = /(?<type>secretlint-(?:disable-next-line|disable-line|disable|enable))(?<options>.*)/g;

type SecretlintCommentType =
    | "secretlint-enable"
    | "secretlint-disable"
    | "secretlint-disable-next-line"
    | "secretlint-disable-line";
export const parseComments = (source: SecretLintSourceCode) => {
    const matches = source.content.matchAll(HTML_COMMENT_REGEXP);
    return Array.from(matches).map((match) => {
        const type = match.groups?.type! as SecretlintCommentType;
        const index = match.index!;
        if (type === "secretlint-disable-line") {
            return {
                type: type,
                options: parseComment(match.groups?.options),
                line: source.indexToPosition(index).line
            };
        }
        if (type === "secretlint-disable-next-line") {
            return {
                type: type,
                options: parseComment(match.groups?.options),
                line: source.indexToPosition(index).line + 1
            };
        }
        return {
            type: type,
            options: parseComment(match.groups?.options),
            index: index
        };
    });
};

/**
 * Parses a config of values separated by comma.
 *
 * secretlint-disable a,b,c => ["a", "b", "c"]
 * secretlint-disable -- comment　=> []
 */
export function parseComment(options?: string): string[] {
    if (!options) {
        return [];
    }
    const commentStart = options.indexOf("--");
    const ruleIdString = commentStart === -1 ? options : options.slice(0, commentStart);
    return (
        ruleIdString
            .split(/,/)
            .map((arg) => arg.trim())
            .filter((arg) => arg !== "") ?? []
    );
}
