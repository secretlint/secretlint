#!/usr/bin/env node

require("ts-node").register();
const output = require("../lib/cli").run();
console.log(output);
