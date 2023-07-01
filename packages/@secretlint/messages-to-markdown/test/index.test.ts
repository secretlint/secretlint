import { messagesToMarkdown } from "../src/index.js";
import * as example from "./example-rule.js";
import * as assert from "assert";

describe("messages-to-markdown", function () {
    it("should return markdown", function () {
        const markdown = messagesToMarkdown(example.messages, {
            headerLevel: 2,
        });
        assert.strictEqual(
            markdown,
            `## EXAMPLE_MESSAGE
> found secret: {{ID}}

`
        );
    });
});
