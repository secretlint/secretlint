const path = require("path");
const { execFileSync } = require("child_process");
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();
const TARGET_DIR = path.join(__dirname, "targets");
const secretlintBin = require.resolve(".bin/secretlint");
const output = execFileSync(secretlintBin, [`${TARGET_DIR}/textlint.github.io/**/*`, "--profile"], {
    cwd: __dirname
});
console.log(output.toString());
