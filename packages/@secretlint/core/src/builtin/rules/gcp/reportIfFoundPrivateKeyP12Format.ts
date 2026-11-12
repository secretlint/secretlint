import type { messages, Options } from "./index.js";
import { matchPatterns } from "../../../helper/regexp-string-matcher.js";
import type { SecretLintRuleContext, SecretLintRuleMessageTranslate, SecretLintSourceCode } from "@secretlint/types";
import { verifyPkcs12Mac } from "./pkcs12Mac.js";
import { basename } from "../../path-util.js";

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
    // A .p12 file is binary, and the MAC check needs its original bytes.
    // The caller gives them as `contentBytes`. Without them, the file is not checked:
    // the rule does not read the file, so it works the same in Node.js and in browsers.
    const pfxBytes = source.contentBytes;
    if (pfxBytes === undefined) {
        return;
    }
    // p12 is binary, so allows matches against the file name
    const fileName = source.filePath ? basename(source.filePath) : "";
    if (matchPatterns(fileName, options.allows).length > 0) {
        return;
    }
    try {
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
