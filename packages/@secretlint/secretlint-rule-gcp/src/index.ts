import fs from "fs";
import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import forge from "node-forge";
import path from "path";

export const messages = {
    PrivateKeyP12: {
        en: (props: { FILE_NAME: string }) => `found CP Service Account's private key(p12): ${props.FILE_NAME}`,
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
        const PRIVATE_KEY_PATTERN = /-----BEGIN\s*(DSA|RSA|EC|PGP|OPENSSH)?\s*PRIVATE KEY/gm;
        const isGCPServiceAccountPrivateKeyJSON =
            "private_key_id" in credentialObject &&
            "private_key" in credentialObject &&
            PRIVATE_KEY_PATTERN.test(credentialObject["private_key"]);
        if (!isGCPServiceAccountPrivateKeyJSON) {
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

function reportIfFoundPrivateKeyP12Format({
    source,
    context,
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    if (!source.filePath) {
        return;
    }
    try {
        // Read file as Buffer to Base64 -> bytes -> asn1
        const p12String = fs.readFileSync(source.filePath).toString("base64");
        const p12Der = forge.util.decode64(p12String);
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        // read p12 file with "notasecret" pass phase
        // The password for Service Account's the PKCS12 file is "notasecret".
        // If success read p12 file, report it as error
        // https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys#serviceaccountprivatekeytype
        forge.pkcs12.pkcs12FromAsn1(p12Asn1, "notasecret");
        // because, this p12 file is credential for GCP Service Account
        context.report({
            message: t("PrivateKeyP12", {
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
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                if (source.ext === ".p12") {
                    reportIfFoundPrivateKeyP12Format({ source, options: normalizedOptions, context, t });
                } else if (source.ext === ".json") {
                    reportIfFoundPrivateKeyJSONFormat({ source, options: normalizedOptions, context, t });
                }
            },
        };
    },
};
export default creator;
