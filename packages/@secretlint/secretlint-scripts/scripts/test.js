// LICENSE : MIT
"use strict";
process.env.NODE_ENV = "test";
const spawn = require("cross-spawn");
const args = process.argv.slice(2);
const mocha = require.resolve(".bin/mocha");
// mocha
const tsNodeRegister = require.resolve("../configs/ts-node-register.js");
const mochaCommand = [mocha, "--require", `"${tsNodeRegister}"`, "--timeout", "10000"]
    .concat(["--watch-extensions", "ts"])
    .concat([`"test/**/*.{js,ts}"`])
    .concat(args)
    .join(" ");
// tsc type-check
const child = spawn(mochaCommand, {
    shell: true
});
child.stderr.on("data", function(data) {
    process.stderr.write(data);
});
child.stdout.on("data", function(data) {
    process.stdout.write(data);
});
child.on("error", function(error) {
    console.error(error);
});
child.on("close", function(code) {
    process.exit(code);
});
