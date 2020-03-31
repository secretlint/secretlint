import assert from "assert";
import { createTranslator } from "../../src/helper/SecretLintRuleMessageTranslator";

describe("SecretLintRuleMessageTranslator", function () {
    it("translate message with defaultLocale", () => {
        const messages = {
            messageId: {
                en: "english message",
                ja: "japanese message",
            },
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        const result = translate("messageId");
        assert.deepStrictEqual(result, {
            data: undefined,
            message: messages.messageId.en,
            messageId: "messageId",
        });
    });
    it("translate message with data and get replaced placeholder", () => {
        const messages = {
            messageId: "{{key}} message",
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
            messageId: "{{key}} message",
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
    it("throw error when some data is missing unless placeholder is defined", () => {
        const messages = {
            messageId: "{{key}} message",
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        assert.throws(() => {
            translate("messageId", {
                not: true,
            });
        });
    });
    it("throw error when data prop is missing unless placeholder is defined", () => {
        const messages = {
            messageId: "{{key}} message",
        };
        const translate = createTranslator(messages, {
            defaultLocale: "en",
        });
        assert.throws(() => {
            translate("messageId");
        });
    });
});
