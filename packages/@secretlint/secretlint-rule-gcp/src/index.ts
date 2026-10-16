import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import path from "node:path";
import { reportIfFoundPrivateKeyP12Format } from "./reportIfFoundPrivateKeyP12Format.js";

export const messages = {
    PrivateKeyP12: {
        en: (props: { FILE_NAME: string }) => `found GCP Service Account's private key(p12): ${props.FILE_NAME}`,
        ja: (props: { FILE_NAME: string }) => `GCPサービスアカウントの秘密鍵(p12) ${props.FILE_NAME} がみつかりました`,
    },
    PrivateKeyJSON: {
        en: (props: { FILE_NAME: string }) => `found GCP Service Account's private key(json): ${props.FILE_NAME}`,
        ja: (props: { FILE_NAME: string }) =>
            `GCPサービスアカウントの秘密鍵(json): ${props.FILE_NAME} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

function reportIfFoundPrivateKeyJSONFormat({
    source,
    options,
    context,
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    try {
        const credentialObject = JSON.parse(source.content);
        // Private Key Pattern
        const PRIVATE_KEY_PATTERN = /-----BEGIN\s?(DSA|RSA|EC|PGP|OPENSSH)?\s?PRIVATE KEY/gm;
        const isGCPServiceAccountPrivateKeyJSON =
            "private_key_id" in credentialObject &&
            "private_key" in credentialObject &&
            PRIVATE_KEY_PATTERN.test(credentialObject["private_key"]);
        if (!isGCPServiceAccountPrivateKeyJSON) {
            return;
        }
        // allows matches against key-specific values only. client_email is not used because it stays the same
        // across key rotations, so allowing it would hide newly issued keys for the same service account.
        const allowCandidates = [credentialObject["private_key_id"], credentialObject["private_key"]].filter(
            (value): value is string => typeof value === "string",
        );
        if (allowCandidates.some((value) => matchPatterns(value, options.allows).length > 0)) {
            return;
        }
        context.report({
            message: t("PrivateKeyJSON", {
                FILE_NAME: source.filePath ? path.basename(source.filePath) : "",
            }),
            range: [0, source.content.length],
        });
    } catch {
        // nope
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-gcp",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["all"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-gcp/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                if (source.ext === ".p12") {
                    return reportIfFoundPrivateKeyP12Format({ source, options: normalizedOptions, context, t });
                } else if (source.ext === ".json") {
                    return reportIfFoundPrivateKeyJSONFormat({ source, options: normalizedOptions, context, t });
                }
            },
        };
    },
};
