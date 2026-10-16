import type { messages, Options } from "./index.js";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import type { SecretLintRuleContext, SecretLintRuleMessageTranslate, SecretLintSourceCode } from "@secretlint/types";
import { verifyPkcs12Mac } from "./pkcs12Mac.js";

// The PKCS#12 password for GCP Service Account private key files.
// https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys#serviceaccountprivatekeytype
const GCP_SERVICE_ACCOUNT_P12_PASSWORD = "notasecret";

export async function reportIfFoundPrivateKeyP12Format({
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
    if (!source.filePath) {
        return;
    }
    try {
        // lazy load fs/path; browser does not have fs module
        const fs = await import("node:fs");
        const path = await import("node:path");
        // p12 is binary, so allows matches against the file name
        const fileName = path.basename(source.filePath);
        if (matchPatterns(fileName, options.allows).length > 0) {
            return;
        }
        const pfxBytes = new Uint8Array(fs.readFileSync(source.filePath));
        const isGcpServiceAccountP12 = await verifyPkcs12Mac(pfxBytes, GCP_SERVICE_ACCOUNT_P12_PASSWORD);
        if (!isGcpServiceAccountP12) {
            return;
        }
        context.report({
            message: t("PrivateKeyP12", {
                FILE_NAME: fileName,
            }),
            range: [0, source.content.length],
        });
    } catch {
        // nope
    }
}
