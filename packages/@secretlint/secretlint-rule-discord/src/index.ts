import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DISCORD_BOT_TOKEN: {
        en: (props: { ID: string }) => `found discord bot token: ${props.ID}`,
        ja: (props: { ID: string }) => `discord bot token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

const decodeBase64Url = (value: string): string | undefined => {
    try {
        const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
        const canonical = btoa(decoded).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        return canonical === value ? decoded : undefined;
    } catch {
        return undefined;
    }
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-discord",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-discord/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const allows = options?.allows ?? [];
        return {
            file(source: SecretLintSourceCode) {
                const pattern =
                    /(?<![\p{L}\p{N}_-])[A-Za-z0-9_-]{23,27}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,128}(?![\p{L}\p{N}_-])/gu;
                for (const match of source.content.matchAll(pattern)) {
                    const token = match[0];
                    const [encodedId, encodedTimestamp] = token.split(".");
                    const id = decodeBase64Url(encodedId ?? "");
                    const timestamp = decodeBase64Url(encodedTimestamp ?? "");
                    if (
                        !id ||
                        !/^[1-9][0-9]{16,19}$/.test(id) ||
                        BigInt(id) > 18446744073709551615n ||
                        timestamp?.length !== 4
                    ) {
                        continue;
                    }
                    if (matchPatterns(token, allows).length > 0) {
                        continue;
                    }
                    context.report({
                        message: t("DISCORD_BOT_TOKEN", { ID: token }),
                        range: [match.index, match.index + token.length],
                    });
                }
            },
        };
    },
};
