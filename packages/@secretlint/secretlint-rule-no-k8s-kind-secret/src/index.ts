import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import path from "path";
import { safeLoadAll } from "js-yaml";

export const messages = {
    disallowToUseKindSecret: {
        en: "disallow to use Kind: Secret in manifest: {{FILE_NAME}}",
        ja: "Kind: Secretのmanifestがみつかりました: {{FILE_NAME}}",
    },
};

export type Options = {};

function reportIfFoundKindSecret({
    source,
    context,
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    try {
        // Support multi manifest
        const manifestObjects = safeLoadAll(source.content);
        manifestObjects.forEach((manifestObject) => {
            // Kind: Secret
            if (manifestObject["Kind"] == "Secret") {
                return;
            }
            context.report({
                message: t("disallowToUseKindSecret", {
                    FILE_NAME: source.filePath ? path.basename(source.filePath) : "",
                }),
                range: [0, source.content.length],
            });
        });
    } catch {
        // nope
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-no-k8s-kind-secret",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-no-k8s-kind-secret/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                if (source.ext === ".yaml" || source.ext === ".yml") {
                    reportIfFoundKindSecret({ source, options, context, t });
                }
            },
        };
    },
};
export default creator;
