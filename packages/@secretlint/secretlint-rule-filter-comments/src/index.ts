import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { parseComments } from "./parse-comment.js";
import { CommentState } from "./CommentState.js";

export const messages = {
    IGNORE_MESSAGE: {
        en: () => `disable by secretlint-disable comment`
    }
};
export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-filter-comments",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-filter-comments/README.md"
        }
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const state = new CommentState(source);
                const comments = parseComments(source);
                for (const comment of comments) {
                    if (comment.type === "secretlint-disable") {
                        state.disableReporting(comment.index, comment.options);
                    } else if (comment.type === "secretlint-enable") {
                        state.enableReporting(comment.index, comment.options);
                    } else if (comment.type === "secretlint-disable-line") {
                        state.disableLine(comment.line, comment.options);
                    } else if (comment.type === "secretlint-disable-next-line") {
                        state.disableLine(comment.line, comment.options);
                    }
                }
                state.getIgnoringMessages().forEach((message) => {
                    context.ignore({
                        message: t("IGNORE_MESSAGE"),
                        range: [message.startIndex, message.endIndex],
                        targetRuleId: message.ruleId
                    });
                });
            }
        };
    }
};
