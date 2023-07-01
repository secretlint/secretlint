import assert from "node:assert";
import { createTranslator } from "../../src/helper/SecretLintRuleMessageTranslator.js";

describe("SecretLintRuleMessageTranslator", function () {
    it("translate message with defaultLocale", () => {
        const messages = {
            messageId: {
                en: () => "english message",
                ja: () => "japanese message",
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        const result = translate("messageId");
        assert.deepStrictEqual(result, {
            data: undefined,
            message: messages.messageId.en(),
            messageId: "messageId",
        });
    });
    it("translate message with data and get replaced placeholder", () => {
        const messages = {
            messageId: {
                en: (props: { key: string }) => `${props.key} message`,
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        const result = translate("messageId", {
            key: "important",
        });
        assert.deepStrictEqual(result, {
            data: {
                key: "important",
            },
            message: "important message",
            messageId: "messageId",
        });
    });
    it("translate message that include template like string", () => {
        const messages = {
            messageId: {
                en: (props: { key: string }) => `${props.key} message`,
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        const result = translate("messageId", {
            key: "Its {{user-defined}}",
        });
        assert.deepStrictEqual(result, {
            data: {
                key: "Its {{user-defined}}",
            },
            message: "Its {{user-defined}} message",
            messageId: "messageId",
        });
    });
    it("translate message that include multiple template like string", () => {
        const messages = {
            messageId: {
                en: (props: { v1: string; v2: string; v3: string }) => `${props.v1} ${props.v2} ${props.v3} message`,
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        const result = translate("messageId", {
            v1: "1",
            v2: "2",
            v3: "3",
        });
        assert.deepStrictEqual(result, {
            data: {
                v1: "1",
                v2: "2",
                v3: "3",
            },
            message: "1 2 3 message",
            messageId: "messageId",
        });
    });
    it("should not translate message of data's value", () => {
        const messages = {
            messageId: {
                en: (props: { v1: string; v2: string; v3: string }) => `${props.v1} ${props.v2} ${props.v3} message`,
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        const result = translate("messageId", {
            v1: "{{v1}} {{v2}} {{v3}}",
            v2: "{{v1}} {{v2}} {{v3}}",
            v3: "{{v1}} {{v2}} {{v3}}",
        });
        assert.deepStrictEqual(result, {
            data: {
                v1: "{{v1}} {{v2}} {{v3}}",
                v2: "{{v1}} {{v2}} {{v3}}",
                v3: "{{v1}} {{v2}} {{v3}}",
            },
            message: "{{v1}} {{v2}} {{v3}} {{v1}} {{v2}} {{v3}} {{v1}} {{v2}} {{v3}} message",
            messageId: "messageId",
        });
    });
    it("throw error when data prop is missing unless placeholder is defined", () => {
        const messages = {
            messageId: {
                en: (props: { key: string }) => `${props.key} message`,
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        assert.throws(() => {
            translate("messageId");
        });
    });
});
