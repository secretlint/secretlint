#!/usr/bin/env node

import { quickStart } from "../module/index.js";
try {
    const { exitStatus, stderr, stdout } = await quickStart();
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
