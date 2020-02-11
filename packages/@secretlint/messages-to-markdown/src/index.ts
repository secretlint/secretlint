import { SecretLintRuleLocalizeMessageMulti, SecretLintRuleLocalizeMessages } from "@secretlint/types";

export type messagesToMarkdownOptions = {
    headerLevel: number;
};
export const messagesToMarkdown = (messages: SecretLintRuleLocalizeMessages, options: messagesToMarkdownOptions) => {
    let output = "";
    Object.keys(messages).forEach(messageId => {
        const enMessage = (messages[messageId] as SecretLintRuleLocalizeMessageMulti)["en"];
        const shortDescription = enMessage.split("\n")[0];
        output += `${"#".repeat(options.headerLevel)} ${messageId}
${shortDescription ? `> ${shortDescription}` : ""}

`;
    });
    return output;
};
