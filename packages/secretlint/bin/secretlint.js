#!/usr/bin/env node

// Exit Status
// 0: No Error
// - Not found lint error
// 1: Lint Error
// - Found lint error
// 2: Fatal Error
// Crash secretlint process
// Fail to load config/rule/plugin etc...
// Entry Point
try {
    // if imported code is syntax error, throw error -> exit 2
    // dist/cli.js is the bundle of module/cli.js and its dependencies. See scripts/bundle.mjs
    const { run, cli } = await import("../dist/cli.js");
    const { exitStatus, stderr, stdout } = await run(cli.input, cli.flags);
    if (stdout) {
        console.log(stdout);
    }
    if (stderr) {
        console.error(stderr);
    }
    process.exitCode = exitStatus;
} catch (error) {
    console.error(error);
    process.exitCode = 2; // fatal error
}
