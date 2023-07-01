#!/usr/bin/env node

import { register } from "ts-node";
import { run } from "../module/cli";
register();
const output = run();
console.log(output);
