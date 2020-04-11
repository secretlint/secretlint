import { SecretLintRuleLocalizeMessageMulti, SecretLintRuleLocalizeMessages } from "@secretlint/types";

export type messagesToMarkdownOptions = {
    headerLevel: number;
};
export const messagesToMarkdown = (messages: SecretLintRuleLocalizeMessages, options: messagesToMarkdownOptions) => {
    let output = "";
    const proxy = new Proxy({}, {
        get(_target: {}, p: PropertyKey, _receiver: any): any {
            return `{{${String(p)}}`;
        }
    });
    Object.keys(messages).forEach(messageId => {
        const enMessage = (messages[messageId] as SecretLintRuleLocalizeMessageMulti<any>)["en"];
        const shortDescription = enMessage(proxy).split("\n")[0];
        output += `${"#".repeat(options.headerLevel)} ${messageId}
${shortDescription ? `> ${shortDescription}` : ""}

`;
    });
    return output;
};
