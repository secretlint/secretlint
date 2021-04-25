const path = require("path");
const { execFileSync } = require("child_process");
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();
const TARGET_DIR = path.join(__dirname, "targets");
const secretlintBin = require.resolve(".bin/secretlint");
suite
    .add("run secretlint for textling.github.io", () => {
        execFileSync(secretlintBin, [`${TARGET_DIR}/textlint.github.io/**/*`], {
            cwd: __dirname
        });
    })
    .add("run secretlint for js-primer", () => {
        execFileSync(secretlintBin, [`${TARGET_DIR}/js-primer/**/*`], {
            cwd: __dirname
        });
    })
    .on("cycle", (event) => {
        console.log(String(event.target));
    })
    .run();
