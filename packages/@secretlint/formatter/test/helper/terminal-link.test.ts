import assert from "node:assert";
import { supportsHyperlinks } from "../../src/helper/terminal-link.js";

const tty = { isTTY: true };
const supports = (env: Record<string, string>, options: { stream?: { isTTY?: boolean }; argv?: string[] } = {}) => {
    return supportsHyperlinks({
        stream: "stream" in options ? options.stream : tty,
        env,
        argv: options.argv ?? [],
        platform: "linux",
    });
};
describe("supportsHyperlinks", () => {
    it("returns false if the terminal is unknown", () => {
        assert.strictEqual(supports({}), false);
        assert.strictEqual(supports({ TERM: "xterm-256color" }), false);
    });
    it("returns true for the terminals that support hyperlinks", () => {
        assert.strictEqual(supports({ TERM_PROGRAM: "iTerm.app", TERM_PROGRAM_VERSION: "3.5.0" }), true);
        assert.strictEqual(supports({ TERM_PROGRAM: "iTerm.app", TERM_PROGRAM_VERSION: "3.0.0" }), false);
        assert.strictEqual(supports({ TERM_PROGRAM: "vscode", TERM_PROGRAM_VERSION: "1.72.0" }), true);
        assert.strictEqual(supports({ TERM_PROGRAM: "vscode", TERM_PROGRAM_VERSION: "1.71.0" }), false);
        assert.strictEqual(
            supports({ TERM_PROGRAM: "vscode", TERM_PROGRAM_VERSION: "0.4.0", CURSOR_TRACE_ID: "x" }),
            true,
        );
        assert.strictEqual(
            supports({ TERM_PROGRAM: "WezTerm", TERM_PROGRAM_VERSION: "20240203-110809-5046fc22" }),
            true,
        );
        assert.strictEqual(supports({ TERM_PROGRAM: "ghostty" }), true);
        assert.strictEqual(supports({ TERM_PROGRAM: "zed" }), true);
        assert.strictEqual(supports({ VTE_VERSION: "6003" }), true);
        assert.strictEqual(supports({ VTE_VERSION: "4601" }), false);
        assert.strictEqual(supports({ VTE_VERSION: "0.50.0" }), false);
        assert.strictEqual(supports({ TERM: "alacritty" }), true);
        assert.strictEqual(supports({ TERM: "xterm-kitty" }), true);
        assert.strictEqual(supports({ WT_SESSION: "x" }), true);
    });
    it("returns false if the stream is not a TTY", () => {
        assert.strictEqual(supports({ TERM: "xterm-kitty" }, { stream: { isTTY: false } }), false);
        assert.strictEqual(supports({ TERM: "xterm-kitty" }, { stream: undefined }), false);
    });
    it("returns false on CI", () => {
        assert.strictEqual(supports({ TERM: "xterm-kitty", CI: "true" }), false);
        assert.strictEqual(supports({ TERM: "xterm-kitty", TEAMCITY_VERSION: "1" }), false);
    });
    it("returns false if colors are disabled", () => {
        assert.strictEqual(supports({ TERM: "xterm-kitty" }, { argv: ["--no-color"] }), false);
        assert.strictEqual(supports({ TERM: "xterm-kitty", FORCE_COLOR: "0" }), false);
        assert.strictEqual(supports({ TERM: "dumb", TERM_PROGRAM: "ghostty" }), false);
    });
    it("follows FORCE_HYPERLINK", () => {
        assert.strictEqual(supports({ FORCE_HYPERLINK: "1" }, { stream: { isTTY: false } }), true);
        assert.strictEqual(supports({ FORCE_HYPERLINK: "0", TERM: "xterm-kitty" }), false);
    });
    it("follows the hyperlink flags", () => {
        assert.strictEqual(supports({ TERM: "xterm-kitty" }, { argv: ["--no-hyperlink"] }), false);
        assert.strictEqual(supports({ TERM: "xterm-kitty" }, { argv: ["--hyperlink=never"] }), false);
        assert.strictEqual(supports({}, { argv: ["--hyperlink=always"], stream: { isTTY: false } }), true);
    });
    it("returns true on Netlify", () => {
        assert.strictEqual(supports({ NETLIFY: "true" }, { stream: { isTTY: false } }), true);
    });
});
