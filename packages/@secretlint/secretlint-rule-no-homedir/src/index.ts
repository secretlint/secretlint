import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import escapeStringRegexp from "escape-string-regexp";
import os from "node:os";

const multiplatformPath = (dirPath: string): RegExp => {
    return new RegExp(
        dirPath
            .split(/[\/¥]/)
            .map((pathinfo) => escapeStringRegexp(pathinfo))
            .join("[/¥]"),
        "g"
    );
};
export const messages = {
    HOMEDIR: {
        en: (props: { PATH: string }) => `found user's homedir path: ${props.PATH}`,
        ja: (props: { PATH: string }) => `ユーザーホームのパスが見つかりました: ${props.PATH}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
    /**
     * For debug
     */
    _debugHomeDir?: string;
};

function reportIfFoundHomedir({
    source,
    options,
    context,
    t,
    getUserHomeDirPattern,
}: {
    source: SecretLintSourceCode;
    options: Required<Omit<Options, "_debugHomeDir">>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
    getUserHomeDirPattern: () => RegExp;
}) {
    const homedirPattern = getUserHomeDirPattern();
    const results = source.content.matchAll(homedirPattern);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("HOMEDIR", {
                PATH: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-no-homedir",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-no-homedir/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        const userHomeDirPattern = multiplatformPath(options._debugHomeDir ?? os.homedir());
        /**
         * Clone RegExp to avoid reuse lastIndex
         */
        const getUserHomeDirPattern = () => {
            return new RegExp(userHomeDirPattern.source, userHomeDirPattern.flags);
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundHomedir({ source, options: normalizedOptions, context, t, getUserHomeDirPattern });
            },
        };
    },
};
