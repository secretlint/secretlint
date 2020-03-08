import fs from "fs";
import os from "os";
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
const OS_SUFFIX = `${os.type()}_${os.arch()}`;
compileSecretLint({
    input: path.join(__dirname, "entry.js"),
    output: path.join(__dirname, `../dist/secretlint_${OS_SUFFIX}`)
})
    .then(() => {
        console.log("success");
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
