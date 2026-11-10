import type { SecretLintRuleCreator, SecretLintRulePattern } from "@secretlint/types";
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

const reportGitHubToken: SecretLintRulePattern<Options>["report"] = (match, context) => {
    const type = match.groups?.type as GITHUB_TOKEN_TYPE;
    const typeName = typeMap.get(type);
    if (!typeName) {
        throw new Error("Unknown type:" + typeName);
    }
    if (!validChecksum(match.text)) {
        return;
    }
    const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
    if (allowedResults.length > 0) {
        return;
    }
    const t = context.createTranslator(messages);
    context.report({
        message: t("GITHUB_TOKEN", {
            KEY: match.text,
            typeName,
        }),
        range: match.range,
    });
};

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
    patterns: [
        {
            // token length should be 40
            // https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
            pattern: /(?<!\p{L})(?<type>ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}(?![A-Za-z0-9_])/gu,
            keywords: ["ghp_", "gho_", "ghu_", "ghs_", "ghr_"],
            scope: "line",
            report: reportGitHubToken,
        },
        {
            // fine-grained personal access tokens. FIXME: Format of the token is unclear
            // https://github.com/community/community/discussions/36441#discussioncomment-4014190
            pattern: /(?<!\p{L})(?<type>github_pat)_[A-Za-z0-9_]{82}(?![A-Za-z0-9_])/gu,
            keywords: ["github_pat_"],
            scope: "line",
            report: reportGitHubToken,
        },
        {
            // new format: ghs_<AppID>_<JWT> (~520 chars, JWT contains three base64url segments separated by dots)
            // https://github.blog/changelog/2026-04-24-notice-about-upcoming-new-format-for-github-app-installation-tokens/
            pattern:
                /(?<!\p{L})(?<type>ghs)_[0-9]{1,20}_[A-Za-z0-9_-]{1,1000}\.[A-Za-z0-9_-]{1,10000}\.[A-Za-z0-9_-]{1,1000}(?![A-Za-z0-9_-])/gu,
            keywords: ["ghs_"],
            scope: "line",
            report: reportGitHubToken,
        },
    ],
};
