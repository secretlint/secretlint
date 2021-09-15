const HTML_COMMENT_REGEXP = /(?<type>secretlint-(?:disable|disable-next-line|disable-line|enable))(?<options>.*?)/g;

type SecretlintCommentType =
    | "secretlint-enable"
    | "secretlint-disable"
    | "secretlint-disable-next-line"
    | "secretlint-disable-line";
export const parseComments = (text: string) => {
    const matches = text.matchAll(HTML_COMMENT_REGEXP);
    return Array.from(matches).map((match) => {
        return {
            type: match.groups?.type! as SecretlintCommentType,
            options: parseComment(match.groups?.options),
            index: match.index!
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
            .map((arg) => arg.trim())
            .filter((arg) => arg !== "") ?? []
    );
}
