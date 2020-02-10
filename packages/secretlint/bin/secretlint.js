#!/usr/bin/env node
require("../lib/cli")
    .run()
    .then(
        reuslt => {
            console.log(reuslt);
            process.exit(0);
        },
        error => {
            console.error(error);
            process.exit(1);
        }
    );
