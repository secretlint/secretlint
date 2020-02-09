import { createLinter } from "../src";
import path = require("path");

describe("createLinter", function() {
    it("should create linter and lint it", async () => {
        const lint = await createLinter({
            color: true,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish"
        });
        const output = await lint([path.join(__dirname, "fixtures/SECRET.txt")]);
        console.log(output);
    });
});
