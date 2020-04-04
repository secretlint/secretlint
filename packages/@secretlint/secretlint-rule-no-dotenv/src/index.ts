import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import path from "path";

const FILE_NAME_DOTENV = ".env";

export const messages = {
    FOUND_DOTENV_FILE: {
        en: "found .env file",
        ja: ".env ファイルがみつかりました",
    },
};

const isDotenvFile = (filePath: string): boolean => {
    const { name, ext } = path.parse(filePath);
    const fileName = `${name}${ext}`;
    return fileName === FILE_NAME_DOTENV;
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-no-dotenv",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-no-dotenv/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                if (!source.filePath) {
                    return;
                }
                if (isDotenvFile(source.filePath)) {
                    context.report({
                        message: t("FOUND_DOTENV_FILE"),
                        range: [0, source.content.length],
                    });
                }
            },
        };
    },
};

export default creator;
