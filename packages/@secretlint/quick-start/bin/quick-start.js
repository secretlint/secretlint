#!/usr/bin/env node

try {
    const { quickStart } = await import("../module/index.js");
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
    process.exit(2); // fatal error
}
