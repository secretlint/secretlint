const HTML_ESCAPES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};
/**
 * Escape `&`, `<`, `>`, `"` and `'` as HTML entities. It is the same as `escape` of lodash.
 */
export const escapeHtml = (text: string): string => {
    return text.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
};

const XML_ESCAPES: Record<string, string> = {
    ...HTML_ESCAPES,
    "'": "&apos;",
};
/**
 * Escape `&`, `<`, `>`, `"` and `'` as XML entities.
 */
export const escapeXml = (value: unknown): string => {
    return `${value}`.replace(/[<>&"']/g, (character) => XML_ESCAPES[character]);
};
