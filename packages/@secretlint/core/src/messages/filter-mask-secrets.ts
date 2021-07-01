import { SecretLintAllMessages } from "./MessageProcessManager";

export type AllowMessage = {
    ruleId: string;
    messageId: string;
};

// mask all properties with *** deeply
// These properties are object, array, or others
const deepMask = (object: Record<string, any>): Record<string, any> => {
    for (const key of Object.keys(object)) {
        if (typeof object[key] === "object") {
            object[key] = deepMask(object[key]);
        } else if (Array.isArray(object[key])) {
            object[key] = object[key].map(deepMask);
        } else {
            object[key] = mask(object[key]);
        }
    }
    return object;
};

const mask = <T>(value: T): T => {
    if (typeof value === "string") {
        return "*".repeat(value.length - 1) as unknown as T;
    }
    return value;
};
// mask all data values for hide secret value
// https://github.com/secretlint/secretlint/issues/176
export const filterMaskSecretsData = (messages: SecretLintAllMessages[] = []): SecretLintAllMessages[] => {
    return messages.map((message) => {
        if (message.type !== "message") {
            return message;
        }
        return {
            ...message,
            ...(message.data
                ? {
                      data: deepMask(message.data),
                  }
                : {}),
        };
    });
};
