import { lintSource } from "@secretlint/core";
import { creator as presetRecommend } from "@secretlint/secretlint-rule-preset-recommend";
import type { SecretLintCoreResult } from "@secretlint/types";

export type LintOptions = {
    filePath?: string;
    /**
     * Pass the content as UTF-8 bytes (`contentBytes`) too
     */
    useBytes?: boolean;
};

/**
 * Lint the content with the recommend preset.
 */
export const lint = (
    content: string,
    { filePath = "/virtual/test.txt", useBytes = false }: LintOptions = {}
): Promise<SecretLintCoreResult> => {
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

declare global {
    interface Window {
        secretlint: { lint: typeof lint };
    }
}
