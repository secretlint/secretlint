import { SecretLintAllMessages } from "./MessageProcessManager.js";

export type AllowMessage = {
    ruleId: string;
    messageId: string;
};

// mask all properties with *** deeply
// These properties are object, array, or others
const deepMask = (object: Record<string, any>, handler: (value: string) => string) => {
    for (const key of Object.keys(object)) {
        if (typeof object[key] === "object") {
            object[key] = deepMask(object[key], handler);
        } else if (Array.isArray(object[key])) {
            object[key] = object[key].map((item: any) => deepMask(item, handler));
        } else if (typeof object[key] === "string") {
            object[key] = handler(object[key]);
        }
    }
    return object;
};

const createMaskValue = (value: string): string => {
    return "*".repeat(value.length);
};
/**
 * = Masking logics
 * secretlint mask simple string replacement.
 * If a secretlint rule report `"TOKEN_STRING"` as message data, replace all `TOKEN_STRING` with `**********` in messages.
 * ```
 * context.report({
 *   message: t("MESSAGE", {
 *       TOKEN: "TOKEN_STRING", // => replace all "TOKEN_STRING" with  `**********`.
 *   }),
 *   range,
 * });
 * ```
 * This logics may includes false-positve.
 * This is similar to CI logs like Travis CI or GitHub Actions.
 * @param str
 * @param maskedValues
 */
const maskWithValues = (str: string, maskedValues: string[]): string => {
    let result = str;
    for (const maskValue of maskedValues) {
        result = result.replaceAll(maskValue, "*".repeat(maskValue.length));
    }
    return result;
};
// mask all data values for hide secret value
// https://github.com/secretlint/secretlint/issues/176
export const filterMaskSecretsData = (messages: SecretLintAllMessages[] = []): SecretLintAllMessages[] => {
    return messages.map((message) => {
        if (message.type !== "message") {
            return message;
        }
        const maskedValues: string[] = [];
        const maskedData = message.data
            ? deepMask(message.data, (value) => {
                  maskedValues.push(value);
                  return createMaskValue(value);
              })
            : undefined;
        // no mask data
        if (!maskedData) {
            return message;
        }
        const maskedMessage = maskWithValues(message.message, maskedValues);
        return {
            ...message,
            message: maskedMessage,
            data: maskedData,
        };
    });
};
