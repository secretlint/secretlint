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

type GITHUB_TOKEN_TYPE = "ghp" | "gho" | "ghu" | "ghs" | "ghr" | "github_pat";
// ghp for GitHub personal access tokens
// gho for OAuth access tokens
// ghu for GitHub user-to-server tokens
// ghs for GitHub server-to-server tokens
// ghr for refresh tokens
// github_pat for fine-grained personal access tokens
const typeMap = new Map<GITHUB_TOKEN_TYPE, string>([
    ["ghp", "GitHub personal access tokens"],
    ["gho", "OAuth access tokens"],
    ["ghu", "GitHub user-to-server tokens"],
    ["ghs", "GitHub server-to-server tokens"],
    ["ghr", "refresh tokens"],
    ["github_pat", "fine-grained personal access tokens"],
]);

// FIXME: GitHub Token implement CRC-32 checksum
// We need to check it
// https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
const validChecksum = (_token: string): boolean => {
    return true;
};

function reportIfFoundKey({
    pattern,
    source,
    options,
    context,
    t,
}: {
    pattern: RegExp;
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    const results = source.content.matchAll(pattern);
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
        const range = [index, index + match.length] as const;
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
        // token length should be 40
        // https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
        const CLASSIC_GITHUB_TOKEN_PATTERN = /(?<type>ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}/g;
        // fine-grained personal access tokens. FIXME: Format of the token is unclear
        // https://github.com/community/community/discussions/36441#discussioncomment-4014190
        const FINE_GRAINED_GITHUB_TOKEN_PATTERN = /(?<type>github_pat)_[A-Za-z0-9_]{82}/g;
        const patterns = [CLASSIC_GITHUB_TOKEN_PATTERN, FINE_GRAINED_GITHUB_TOKEN_PATTERN];
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                for (const pattern of patterns) {
                    reportIfFoundKey({ pattern, source, options: normalizedOptions, context, t });
                }
            },
        };
    },
};
