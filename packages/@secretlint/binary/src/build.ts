import fs from "fs";
import path from "path";
import { compileSecretLint } from "./index";
// placeholder
// @ts-ignore
import preset from "@secretlint/secretlint-rule-preset-recommend";

try {
    fs.rmdirSync(path.join(__dirname, "../dist/"), {
        recursive: true
    });
    fs.mkdirSync(path.join(__dirname, "../dist/"), {
        recursive: true
    });
} catch (error) {
    // nope
}
compileSecretLint({
    input: path.join(__dirname, "entry.js"),
    output: path.join(__dirname, "../dist/secretlint")
})
    .then(() => {
        console.log("success");
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
