import { createEngine } from "../src";
import path = require("path");

describe("createEngine", function() {
    it("should create enat and execute on files", async () => {
        const engine = await createEngine({
            color: true,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish"
        });
        const output = await engine.executeOnFiles([path.join(__dirname, "fixtures/SECRET.txt")]);
        console.log(output);
    });
});
