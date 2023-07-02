#!/usr/bin/env node
import { run, cli } from "../module/cli.js";

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
    const { exitStatus, stderr, stdout } = await run(cli.input, cli.flags);
    if (stdout) {
        console.log(stdout);
    }
    if (stderr) {
        console.error(stderr);
    }
    process.exit(exitStatus);
} catch (error) {
    console.error(error);
    process.exit(2); // fatal error
}
