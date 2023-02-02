import { SecretLintRuleContext, SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import { SecretLintRuleMessageTranslate } from "@secretlint/types";

// Sources:
// - https://learn.microsoft.com/en-us/dotnet/api/azure.identity.environmentcredential
// - https://learn.microsoft.com/en-us/microsoft-365/compliance/sit-defn-azure-ad-client-secret

const regx = require("regx").default("gi");
export interface Options {
    allows?: string[];
}

export const messages = {
    AzureTenantId: {
        en: (props: { ID: string }) => `found Azure AD tenant ID: ${props.ID}`,
    },
    AzureClientId: {
        en: (props: { ID: string }) => `found Azure Client ID: ${props.ID}`,
    },
    AzureClientSecret: {
        en: (props: { SECRET: string }) => `found Azure Client Secret: ${props.SECRET}`,
    },
};

const QUOTE = `["']?`;
const CONNECT = "\\s*(?::|=>|=|:=)\\s*";
const GUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const SECRET = "[-_.~a-z0-9]{40}";

const reportAzureTenantId = ({
    t,
    source,
    context,
    options,
}: {
    t: SecretLintRuleMessageTranslate<typeof messages>;
    source: SecretLintSourceCode;
    context: SecretLintRuleContext;
    options: Required<Options>;
}) => {
    const pattern = regx`${QUOTE}(?:azure|ad)_?tenant_?id${QUOTE}${CONNECT}${QUOTE}(${GUID})${QUOTE}\b`;
    const results = source.content.matchAll(pattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[1] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("AzureTenantId", {
                ID: match,
            }),
            range,
        });
    }
};

const reportAzureClientId = ({
    t,
    source,
    context,
    options,
}: {
    t: SecretLintRuleMessageTranslate<typeof messages>;
    source: SecretLintSourceCode;
    context: SecretLintRuleContext;
    options: Required<Options>;
}) => {
    const pattern = regx`${QUOTE}(?:azure)?_?client_?id${QUOTE}${CONNECT}${QUOTE}(${GUID})${QUOTE}\b`;
    const results = source.content.matchAll(pattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[1] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("AzureClientId", {
                ID: match,
            }),
            range,
        });
    }
};

const reportAzureClientSecret = ({
    t,
    source,
    context,
    options,
}: {
    t: SecretLintRuleMessageTranslate<typeof messages>;
    source: SecretLintSourceCode;
    context: SecretLintRuleContext;
    options: Required<Options>;
}) => {
    const pattern = regx`${QUOTE}(?:azure)?_?client_?secret${QUOTE}${CONNECT}${QUOTE}(${SECRET})${QUOTE}\b`;
    const results = source.content.matchAll(pattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[1] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("AzureClientSecret", {
                SECRET: match,
            }),
            range,
        });
    }
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-azure",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-azure/README.md",
        },
    },
    create(context: any, options: any) {
        const normalizedOptions: Required<Options> = {
            allows: options.allows || [],
        };
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                reportAzureTenantId({ t, source, context, options: normalizedOptions });
                reportAzureClientId({ t, source, context, options: normalizedOptions });
                reportAzureClientSecret({ t, source, context, options: normalizedOptions });
            },
        };
    },
};
