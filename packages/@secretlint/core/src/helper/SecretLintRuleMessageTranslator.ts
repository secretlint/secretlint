import {
    createRuleMessageTranslator,
    SecretLintRuleLocaleTag,
    SecretLintRuleLocalizeMessages,
    SecretLintRuleLocalizeMessageMulti,
    SecretLintRuleMessageTranslatorOptions
} from "@secretlint/types";
import { SecretLintRuleTranslatorResult } from "@secretlint/types";

const escapeStringRegexp = require("escape-string-regexp");
/**
 * Default locale that is also fallback locale.
 */
const DEFAULT_LOCAL = "en";

const formatMessagePlaceholder = (message: string, data?: {}): string => {
    if (typeof data !== "object" || data === null) {
        return message;
    }
    let output = message;
    Object.entries(data).forEach(([key, value]) => {
        output = output.replace(new RegExp(escapeStringRegexp(`{{${key}}}`), "g"), String(value));
    });
    const unMatchedPlaceholder = /{{[^}]+}}/g;
    const matchUnMatched = output.match(unMatchedPlaceholder);
    if (matchUnMatched) {
        throw new Error(`Placeholder:${matchUnMatched && matchUnMatched[0]} still existed.

Probably, message's data key is mismatch
`);
    }
    return output;
};

const getMatchedLocaleMessage = (locale: SecretLintRuleLocaleTag, locales: SecretLintRuleLocalizeMessageMulti) => {
    const localKeys = Object.keys(locales);
    const matchLocale = localKeys.find(key => {
        return key === locale;
    });
    if (matchLocale) {
        return matchLocale;
    }
    const [lang] = locale.split("-");
    if (!lang) {
        return DEFAULT_LOCAL;
    }
    // en-US => en
    const fallbackMatchLocal = localKeys.find(key => {
        return key === lang;
    });
    if (fallbackMatchLocal) {
        return fallbackMatchLocal;
    }
    return DEFAULT_LOCAL;
};

const applyOption = (message: string, options?: object): string => {
    if (!options) {
        return message;
    }
    /**
     * {{Key}} => Value
     * @param message
     * @param data
     */

    return formatMessagePlaceholder(message, options);
};
export const createTranslator: createRuleMessageTranslator = <T extends SecretLintRuleLocalizeMessages>(
    messages: T,
    options?: SecretLintRuleMessageTranslatorOptions
) => {
    return <Data extends {}>(messageId: keyof T, data?: Data): SecretLintRuleTranslatorResult<Data> => {
        const messageObject: SecretLintRuleLocalizeMessageMulti | string | undefined = messages[messageId];
        if (!messageObject) {
            throw new Error(`messages:${messageId} is missing in messages.`);
        }
        // if messages is string, use it.
        if (typeof messageObject === "string") {
            if (typeof messageId !== "string") {
                throw new Error(`message's key:${messageId} should be string`);
            }
            return {
                message: applyOption(messageObject, data),
                messageId: messageId,
                data
            };
        }
        // if messages is object, pick message that is matched locale from messages.
        const defaultLocal = options && options.defaultLocale ? options.defaultLocale : DEFAULT_LOCAL;
        const locale = getMatchedLocaleMessage(defaultLocal, messageObject);
        const localizedMessage = messageObject[locale];
        if (!localizedMessage) {
            if (messageObject[DEFAULT_LOCAL]) {
                throw new Error(`messages${messageId}.${locale} is missing in messages.`);
            }
            throw new Error(`message's key:${messageId}.${DEFAULT_LOCAL} should be defined in messages.`);
        }
        if (typeof messageId !== "string") {
            throw new Error(`message's key:${messageId}.${DEFAULT_LOCAL} should be string`);
        }
        return {
            message: applyOption(localizedMessage, data),
            messageId: messageId,
            data
        };
    };
};
