#!/usr/bin/env node
require("../lib/cli")
    .run()
    .then(
        result => {
            console.log(result);
            process.exit(0);
        },
        error => {
            console.error(error);
            process.exit(1);
        }
    );
