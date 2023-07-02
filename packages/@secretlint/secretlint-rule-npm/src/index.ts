import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    PackageJSON_xOauthToken: {
        en: (props: { TOKEN: string }) => `found GitHub Token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `GitHub Token: ${props.TOKEN} がみつかりました`,
    },
    Npmrc_authToken: {
        en: (props: { TOKEN: string }) => `found npmrc authToken: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `npmrc authToken: ${props.TOKEN} がみつかりました`,
    },
    NPM_ACCESS_TOKEN: {
        en: (props: { TOKEN: string }) => `found npm access token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `npm access token: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

function reportIfFoundXOauthGitHubToken({
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
    // https://github.blog/2012-09-21-easier-builds-and-deployments-using-git-over-https-and-oauth/
    // https://stackoverflow.com/questions/14402407/maximum-length-of-a-domain-name-without-the-http-www-com-parts
    const XOAuthPattern = /https?:\/\/(.{1,256}):x-oauth-basic@github.com\//g;
    const results = source.content.matchAll(XOAuthPattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[1] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("PackageJSON_xOauthToken", {
                TOKEN: match,
            }),
            range,
        });
    }
}

function reportIfFound_AuthTokenInNpmrc({
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
    // https://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules
    // allow _authToken=${NPM_TOKEN}
    // https://github.com/secretlint/secretlint/issues/302
    const AuthTokenPattern = /_authToken=([^$].*)/g;
    const results = source.content.matchAll(AuthTokenPattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[1] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("Npmrc_authToken", {
                TOKEN: match,
            }),
            range,
        });
    }
}

// TODO: implement
function validChecksum(_token: string): boolean {
    return true;
}

function reportIfFound_NPM_ACCESS_TOKEN({
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
    // https://github.blog/2021-09-23-announcing-npms-new-access-token-format/
    // https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
    // token length should be 40
    const NPM_ACCESS_TOKEN_PATTERN = /npm_[A-Za-z0-9_]{36}/g;
    const results = source.content.matchAll(NPM_ACCESS_TOKEN_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        if (!validChecksum(match)) {
            continue;
        }
        context.report({
            message: t("NPM_ACCESS_TOKEN", {
                TOKEN: match,
            }),
            range,
        });
    }
}

const isPackageFile = (filePath?: string): boolean => {
    if (!filePath) {
        return true;
    }
    return filePath.endsWith("package.json") || filePath.endsWith("package-lock.json");
};
const isNpmrc = (filePath?: string): boolean => {
    if (!filePath) {
        return true;
    }
    return filePath.endsWith(".npmrc");
};
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-npm",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-npm/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };

        return {
            file(source: SecretLintSourceCode) {
                if (isPackageFile(source.filePath)) {
                    reportIfFoundXOauthGitHubToken({ source, options: normalizedOptions, context, t });
                } else if (isNpmrc(source.filePath)) {
                    reportIfFound_AuthTokenInNpmrc({ source, options: normalizedOptions, context, t });
                }
                reportIfFound_NPM_ACCESS_TOKEN({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
