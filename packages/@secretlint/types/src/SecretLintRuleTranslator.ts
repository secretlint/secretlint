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
} & {
    // Workaround for https://github.com/YousefED/typescript-json-schema/issues/110
    en(props?: Props): string;
};
/**
 * Rule Messages
 *
 * @example
 * const messages = {
 *     messageId: {
 *         en: (props: { key: string }) => `message ${key}`,
 *         ja: (props: { key: string }) => `メッセージ ${key}`
 *     }
 * }
 */
export type SecretLintRuleLocalizeMessages = {
    // must have "en"
    [index: string]: SecretLintRuleLocalizeMessageMulti<any>;
};

export type SecretLintRuleMessageTranslateResult<Props extends SecretLintRuleLocalizeMessageProps> = {
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
> = (messageId: MessageId, props?: Props) => SecretLintRuleMessageTranslateResult<Props>;

export type SecretLintCreateRuleMessageTranslator<T extends SecretLintRuleLocalizeMessages> = (
    messages: T
) => SecretLintRuleMessageTranslate<T>;
