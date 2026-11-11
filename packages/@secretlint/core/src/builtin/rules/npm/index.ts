import type { SecretLintRuleCreator } from "@secretlint/types";
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

// TODO: implement
function validChecksum(_token: string): boolean {
    return true;
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
    patterns: [
        {
            // https://github.blog/2012-09-21-easier-builds-and-deployments-using-git-over-https-and-oauth/
            // https://stackoverflow.com/questions/14402407/maximum-length-of-a-domain-name-without-the-http-www-com-parts
            pattern: /https?:\/\/(.{1,256}):x-oauth-basic@github.com\//g,
            keywords: [":x-oauth-basic@github"],
            scope: "line",
            report(match, context) {
                // package.json and package-lock.json only
                if (!isPackageFile(context.source.filePath)) {
                    return;
                }
                const token = match.captures[1] || "";
                const allowedResults = matchPatterns(token, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                // The match is `https://<token>:x-oauth-basic@github.com/`. Report the range of the token
                const startIndex = match.range[0] + match.text.indexOf("://") + "://".length;
                context.report({
                    message: t("PackageJSON_xOauthToken", {
                        TOKEN: token,
                    }),
                    range: [startIndex, startIndex + token.length],
                });
            },
        },
        {
            // https://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules
            // allow _authToken=${NPM_TOKEN}
            // https://github.com/secretlint/secretlint/issues/302
            // `[^$]` may match a line break, so the scope is "file"
            pattern: /_authToken=([^$].*)/g,
            keywords: ["_authToken="],
            scope: "file",
            report(match, context) {
                // .npmrc only
                const filePath = context.source.filePath;
                if (isPackageFile(filePath) || !isNpmrc(filePath)) {
                    return;
                }
                const token = match.captures[1] || "";
                const allowedResults = matchPatterns(token, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                // The match is `_authToken=<token>`. Report the range of the token
                const startIndex = match.range[0] + "_authToken=".length;
                context.report({
                    message: t("Npmrc_authToken", {
                        TOKEN: token,
                    }),
                    range: [startIndex, startIndex + token.length],
                });
            },
        },
        {
            // https://github.blog/2021-09-23-announcing-npms-new-access-token-format/
            // https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
            // token length should be 40
            pattern: /(?<!\p{L})npm_[A-Za-z0-9_]{36}(?![A-Za-z0-9_])/gu,
            keywords: ["npm_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                if (!validChecksum(match.text)) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("NPM_ACCESS_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
