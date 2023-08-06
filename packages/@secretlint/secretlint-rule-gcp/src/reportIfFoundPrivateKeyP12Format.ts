import type { messages, Options } from "./index.js";
import type { SecretLintRuleContext, SecretLintRuleMessageTranslate, SecretLintSourceCode } from "@secretlint/types";

export async function reportIfFoundPrivateKeyP12Format({
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
        // lazy load fs/path and node-forge
        // browser does not have fs module
        // node-forge is heavy module
        const fs = await import("node:fs");
        const path = await import("node:path");
        // Read file as Buffer to Base64 -> bytes -> asn1
        const p12String = fs.readFileSync(source.filePath).toString("base64");
        const forge = (await import("node-forge")).default;
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
    } catch (err) {
        // nope
        console.error(err);
    }
}
