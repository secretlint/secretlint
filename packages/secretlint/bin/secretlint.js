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
    const { run, cli } = await import("../module/cli.js");
    const { exitStatus, stderr, stdout, notices } = await run(cli.input, cli.flags);
    // notices are not lint results, so they go to stderr and stdout keeps only the results
    for (const notice of notices ?? []) {
        console.error(notice);
    }
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
