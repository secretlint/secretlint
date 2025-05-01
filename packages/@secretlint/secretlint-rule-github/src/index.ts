import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import { createTokenPattern, type TokenDefinition } from "@secretlint/token";

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

// FIXME: GitHub Token implement CRC-32 checksum
// We need to check it
// https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
const validChecksum = (_token: string): boolean => {
    return true;
};

// GitHub Personal Access Token (Classic)
const ghpTokens = createTokenPattern({
    name: "github_personal_access_token",
    patterns: [
        {
            type: "PatternString",
            value: "ghp",
        },
        {
            type: "PatternString",
            value: "_",
        },
        {
            type: "PatternUnion",
            value: "[A-Za-z0-9_]",
            repeat: 36,
        },
    ],
    options: {
        base64: true,
    },
});

// GitHub OAuth Token
const ghoTokens = createTokenPattern({
    name: "github_oauth_token",
    patterns: [
        {
            type: "PatternString",
            value: "gho",
        },
        {
            type: "PatternString",
            value: "_",
        },
        {
            type: "PatternUnion",
            value: "[A-Za-z0-9_]",
            repeat: 36,
        },
    ],
    options: {
        base64: true,
    },
});

// GitHub User-to-Server Token
const ghuTokens = createTokenPattern({
    name: "github_user_to_server_token",
    patterns: [
        {
            type: "PatternString",
            value: "ghu",
        },
        {
            type: "PatternString",
            value: "_",
        },
        {
            type: "PatternUnion",
            value: "[A-Za-z0-9_]",
            repeat: 36,
        },
    ],
    options: {
        base64: true,
    },
});

// GitHub Server-to-Server Token
const ghsTokens = createTokenPattern({
    name: "github_server_to_server_token",
    patterns: [
        {
            type: "PatternString",
            value: "ghs",
        },
        {
            type: "PatternString",
            value: "_",
        },
        {
            type: "PatternUnion",
            value: "[A-Za-z0-9_]",
            repeat: 36,
        },
    ],
    options: {
        base64: true,
    },
});

// GitHub Refresh Token
const ghrTokens = createTokenPattern({
    name: "github_refresh_token",
    patterns: [
        {
            type: "PatternString",
            value: "ghr",
        },
        {
            type: "PatternString",
            value: "_",
        },
        {
            type: "PatternUnion",
            value: "[A-Za-z0-9_]",
            repeat: 36,
        },
    ],
    options: {
        base64: true,
    },
});

// GitHub Fine-grained Personal Access Token
const fineGrainedGitHubTokens = createTokenPattern({
    name: "fine_grained_github_token",
    patterns: [
        {
            type: "PatternString",
            value: "github_pat",
        },
        {
            type: "PatternString",
            value: "_",
        },
        {
            type: "PatternUnion",
            value: "[A-Za-z0-9_]",
            repeat: 82,
        },
    ],
    options: {
        base64: true,
    },
});

function reportIfFoundKey({
    token,
    source,
    options,
    context,
    t,
}: {
    token: TokenDefinition;
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    const results = source.content.matchAll(token.regexp);
    for (const result of results) {
        const index = result.index || 0;
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
                typeName: token.name,
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
        const tokens = [
            ...ghpTokens,
            ...ghoTokens,
            ...ghuTokens,
            ...ghsTokens,
            ...ghrTokens,
            ...fineGrainedGitHubTokens,
        ];
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                for (const token of tokens) {
                    reportIfFoundKey({ token, source, options: normalizedOptions, context, t });
                }
            },
        };
    },
};
