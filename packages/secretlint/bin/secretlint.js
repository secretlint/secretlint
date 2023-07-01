#!/usr/bin/env node
import { run, cli } from "../module/cli.js";

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
    process.exit(1);
}
