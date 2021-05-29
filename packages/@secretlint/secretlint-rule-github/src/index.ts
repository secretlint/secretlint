import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    GITHUB_TOKEN: {
        en: (props: { KEY: string; typeName: string }) => `found GitHub Token(${props.typeName}): ${props.KEY}`,
        ja: (props: { KEY: string; typeName: string }) =>
            `GitHub Token(${props.typeName})が見つかりました： ${props.KEY}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

type GITHUB_TOKEN_TYPE = "ghp" | "gho" | "ghu" | "ghs" | "ghr";
// ghp for GitHub personal access tokens
// gho for OAuth access tokens
// ghu for GitHub user-to-server tokens
// ghs for GitHub server-to-server tokens
// ghr for refresh tokens
const typeMap = new Map<GITHUB_TOKEN_TYPE, string>([
    ["ghp", "GitHub personal access tokens"],
    ["gho", "OAuth access tokens"],
    ["gho", "GitHub user-to-server tokens"],
    ["ghs", "GitHub user-to-server tokens"],
    ["ghr", "refresh tokens"],
]);

// FIXME: GitHub Token implement CRC-32 checksum
// We need to check it
// https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
const validChecksum = (_token: string): boolean => {
    return true;
};

function reportIfFoundKey({
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
    // https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
    const GITHUB_TOKEN_PATTERN = /(?<type>ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{31,255}/g;
    const results = source.content.matchAll(GITHUB_TOKEN_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const type = result.groups?.type as GITHUB_TOKEN_TYPE;
        const typeName = typeMap.get(type);
        if (!typeName) {
            throw new Error("Unknown type:" + typeName);
        }
        const match = result[0] || "";
        if (!validChecksum(match)) {
            continue;
        }
        const range = [index, index + match.length];
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("GITHUB_TOKEN", {
                KEY: match,
                typeName,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-github",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-github/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundKey({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
export default creator;
