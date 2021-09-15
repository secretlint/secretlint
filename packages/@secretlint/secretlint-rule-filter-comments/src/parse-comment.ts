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
 */
export function parseComment(options?: string): string[] {
    return (
        options
            ?.split(/\s{0, 5},\s{0,5}/)
            .map((arg) => arg.split(/\s-{2,}\s/u)[0].trim())
            .filter((arg) => arg !== "") ?? []
    );
}
