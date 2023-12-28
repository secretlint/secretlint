import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    OPS_TOKEN: {
        en: (props: { TOKEN: string }) => `found 1Password Service Account token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `1Password Service Account: ${props.TOKEN} がみつかりました`,
    },
};
const is1PasswordServiceAccountToken = (base64String: string) => {
    try {
        const jsonString = atob(base64String.replace(/-/g, "+").replace(/_/g, "/"));
        const json = JSON.parse(jsonString);
        return typeof json === "object" && json !== null;
    } catch (error) {
        return false;
    }
};
export type Options = {
    allows?: string[];
};
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-1password",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-1password/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // 1Password Service Account format is `ops_<base64>`
                // https://developer.1password.com/docs/service-accounts/security/
                // It will be like ops_{"email":"ejwe64qmlxhri@1passwordserviceaccounts.lcl","muk":{"alg":"A256GCM","ext":true,"k":"M8VPfIc8VEfThcMXLaKCKF8sMh5JMZsPAtu92fQNb-o","key_ops":["encrypt","decrypt"],"kty":"oct","kid":"mp"},"secretKey":"A3-C4ZJMN-PQTZTL-HGL84-G64M7-KVZRN-4ZVP6","srpX":"870d67a9e626625d9e368507804c9c32e661c57e7e558778291bf29d5a279ae1","signInAddress":"gotham.b5local.com:4000","userAuth":{"method":"SRPg-4096","alg":"PBES2g-HS256","iterations":100000,"salt":"FMRUPiyrN4Xf_8Hoh6YRXQ"}}
                // This regexp match `ops_{...}` pattern
                const pattern = /ops_(ey[A-Za-z0-9+/=]{100,1280}fQ)/g;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const base64String = match[1] ?? "";
                    if (!is1PasswordServiceAccountToken(base64String)) {
                        continue;
                    }
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("OPS_TOKEN", {
                            TOKEN: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
