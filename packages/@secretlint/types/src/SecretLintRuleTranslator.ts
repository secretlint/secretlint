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

export type SecretLintRuleLocalizeMessageProps = { [index: string]: any };
export type SecretLintRuleLocalizeMessageHandler<Props extends SecretLintRuleLocalizeMessageProps> = (
    props?: Props
) => string;
export type SecretLintRuleLocalizeMessageMulti<Props extends SecretLintRuleLocalizeMessageProps> = {
    [P in SecretLintRuleLocaleTag]: SecretLintRuleLocalizeMessageHandler<Props>;
} & { en: SecretLintRuleLocalizeMessageHandler<Props> };

export type SecretLintRuleLocalizeMessages = {
    // must have "en"
    [index: string]: SecretLintRuleLocalizeMessageMulti<any>;
};

export type SecretLintRuleTranslatorResult<Props extends SecretLintRuleLocalizeMessageProps> = {
    message: string;
    messageId: string;
    data: Props | undefined;
};
type ValueOf<T> = T[keyof T];
export type SecretLintRuleMessageTranslate<
    T extends SecretLintRuleLocalizeMessages,
    MessageId extends keyof T = keyof T,
    // Props is a union type of Message Handler's props
    Props extends Parameters<ValueOf<T[MessageId]>>[0] = Parameters<ValueOf<T[MessageId]>>[0]
> = (messageId: MessageId, props?: Props) => SecretLintRuleTranslatorResult<Props>;

export type SecretLintCreateRuleMessageTranslator<T extends SecretLintRuleLocalizeMessages> = (
    messages: T
) => SecretLintRuleMessageTranslate<T>;
