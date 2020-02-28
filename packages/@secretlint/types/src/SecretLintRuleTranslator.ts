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

export type SecretLintRuleMessageTranslatorOptions = {
    defaultLocale: SecretLintRuleLocaleTag;
};
export type SecretLintRuleTranslatorResult<T extends {}> = {
    message: string;
    messageId: string;
    data: T | undefined;
};

export type SecretLintRuleMessageTranslate<T extends SecretLintRuleLocalizeMessages, Data extends {} = {}> = (
    message: keyof T,
    data?: Data
) => SecretLintRuleTranslatorResult<Data>;

export type createRuleMessageTranslator = <T extends SecretLintRuleLocalizeMessages>(
    messages: T,
    options?: SecretLintRuleMessageTranslatorOptions
) => SecretLintRuleMessageTranslate<T>;
