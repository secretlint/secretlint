import assert from "node:assert";
import { results as baseResults } from "./snapshots/input.js";

// OSC 8 hyperlink escape sequence that terminal-link outputs
const HYPERLINK_ESCAPE = "\u001B]8;;";
const results = baseResults.map((result) => ({
    ...result,
    messages: result.messages.map((message) => ({
        ...message,
        docsUrl: "https://example.com/docs",
    })),
}));

// color: true is required because the stylish formatter strips escape sequences when color is disabled
describe("@secretlint/formatter terminalLink option", () => {
    let loadFormatter: typeof import("../src/index.js").loadFormatter;
    beforeAll(async () => {
        // terminal-link detects hyperlink support at import time
        process.env.FORCE_HYPERLINK = "1";
        ({ loadFormatter } = await import("../src/index.js"));
    });
    afterAll(() => {
        delete process.env.FORCE_HYPERLINK;
    });
    it("outputs terminal links when terminalLink is true", async () => {
        const formatter = await loadFormatter({
            color: true,
            formatterName: "stylish",
            terminalLink: true,
        });
        assert.ok(formatter.format(results).includes(HYPERLINK_ESCAPE));
    });
    it("does not output terminal links when terminalLink is false", async () => {
        const formatter = await loadFormatter({
            color: true,
            formatterName: "stylish",
            terminalLink: false,
        });
        assert.ok(!formatter.format(results).includes(HYPERLINK_ESCAPE));
    });
    it("does not output terminal links when terminalLink is not specified", async () => {
        const formatter = await loadFormatter({
            color: true,
            formatterName: "stylish",
        });
        assert.ok(!formatter.format(results).includes(HYPERLINK_ESCAPE));
    });
    it("does not output terminal links for non human-readable format", async () => {
        const formatter = await loadFormatter({
            color: true,
            formatterName: "json",
            terminalLink: true,
        });
        assert.ok(!formatter.format(results).includes(HYPERLINK_ESCAPE));
    });
});
