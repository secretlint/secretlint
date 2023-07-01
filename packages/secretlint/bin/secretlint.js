#!/usr/bin/env node
import { run } from "../module/cli.js";

// Entry Point
try {
    const { exitStatus, stderr, stdout } = await run(cli.input, flags);
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
