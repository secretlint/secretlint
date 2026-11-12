import { lintSource } from "@secretlint/core";
import { creator as presetRecommend } from "@secretlint/secretlint-rule-preset-recommend";

/**
 * Lint the content with the recommend preset.
 * @param {string} content
 * @param {{ filePath?: string, useBytes?: boolean }} [options]
 */
export const lint = (content, { filePath = "/virtual/test.txt", useBytes = false } = {}) => {
    return lintSource({
        source: {
            content,
            contentBytes: useBytes ? new TextEncoder().encode(content) : undefined,
            filePath,
            contentType: "text"
        },
        options: {
            config: {
                rules: [
                    {
                        id: "@secretlint/secretlint-rule-preset-recommend",
                        rule: presetRecommend
                    }
                ]
            }
        }
    });
};
