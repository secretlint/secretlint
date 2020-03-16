// TODO: add locale
export type SecretLintRuleLocaleTag =
    | "en"
    | "cs"
    | "de"
    | "es"
    | "fr"
    | "it"
    | "ja"
    | "ko"
    | "pl"
    | "ru"
    | "tr"
    | "zh-CN"
    | "zh-TW"
    | string;

export type SecretLintRuleLocalizeMessageMulti = { [P in SecretLintRuleLocaleTag]?: string } & { en: string };
export type SecretLintRuleLocalizeMessages = {
    // must have "en"
    [index: string]: string | SecretLintRuleLocalizeMessageMulti;
};

export type SecretLintRuleTranslatorResult<Data extends {}> = {
    message: string;
    messageId: string;
    data: Data | undefined;
};

export type SecretLintRuleMessageTranslateData = { [index: string]: any };
export type SecretLintRuleMessageTranslate<
    T extends SecretLintRuleLocalizeMessages,
    Data extends SecretLintRuleMessageTranslateData = {}
> = (message: keyof T, data?: Data) => SecretLintRuleTranslatorResult<Data>;

export type SecretLintCreateRuleMessageTranslator<T extends SecretLintRuleLocalizeMessages> = (
    messages: T
) => SecretLintRuleMessageTranslate<T>;
