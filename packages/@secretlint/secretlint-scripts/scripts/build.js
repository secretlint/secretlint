// LICENSE : MIT
"use strict";
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = "production";
const spawn = require("cross-spawn");
const paths = require("../configs/paths");
const args = process.argv.slice(2);
const tscCommand = ["tsc", "-p", paths.appTsConfig, ...args].join(" ");
const child = spawn(tscCommand, {
    shell: true
});
child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);
child.on("error", function(error) {
    console.error(error);
});
child.on("close", function(code) {
    process.exit(code);
});
