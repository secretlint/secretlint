#!/usr/bin/env bash
set -euo pipefail
# Get current architecture
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
CURRENT_VERSION=$(jq -r .version ../../package.json)
# Map architecture to the expected format
case "$ARCH" in
    x86_64)
        ARCH="x64"
        ;;
    aarch64)
        ARCH="arm64"
        ;;
    arm64)
        ARCH="arm64"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

TMP_DIR=$(mktemp -d)
# move binary to tmp
cp ./dist/secretlint-${CURRENT_VERSION}-${OS}-${ARCH} ${TMP_DIR}/secretlint
cd ${TMP_DIR}
# init
./secretlint --init
# --init should not overwrite an existing config
CONFIG_BEFORE=$(cat .secretlintrc.json)
set +e
INIT_STDERR=$(./secretlint --init 2>&1 >/dev/null)
INIT_STATUS=$?
set -e
if [ "$INIT_STATUS" -ne 1 ] || [ "$INIT_STDERR" != "secretlint config file is already existed." ]; then
    echo "❌ --init with an existing config should exit 1 with an error (status: $INIT_STATUS, stderr: $INIT_STDERR)"
    exit 1
fi
if [ "$(cat .secretlintrc.json)" != "$CONFIG_BEFORE" ]; then
    echo "❌ --init modified an existing config"
    exit 1
fi
# --init should respect --cwd
mkdir init-target
./secretlint --init --cwd init-target
if [ ! -f init-target/.secretlintrc.json ]; then
    echo "❌ --init --cwd did not create config in the target directory"
    exit 1
fi
if [ "$(cat .secretlintrc.json)" != "$CONFIG_BEFORE" ]; then
    echo "❌ --init --cwd modified the config in the current directory"
    exit 1
fi
rm -rf init-target
# Run the dist binary
./secretlint --version
# Test that version matches expected version
VERSION_OUTPUT=$(./secretlint --version)
if [ "$VERSION_OUTPUT" = "$CURRENT_VERSION" ]; then
    echo "✅ Version check passed: $VERSION_OUTPUT"
else
    echo "❌ Version mismatch - expected: $CURRENT_VERSION, got: $VERSION_OUTPUT"
    exit 1
fi
./secretlint --help
# run "**/*" test
./secretlint "**/*"

# Verify that large output is fully flushed before the process exits.
# mask-result outputs the whole content of the file. JSON output does not have the content.
node -e 'process.stdout.write("AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYSECRETSKEY\n" + "a".repeat(2 * 1024 * 1024))' > large-input.txt
set +e
./secretlint large-input.txt --format=mask-result | node -e '
const fs = require("node:fs");
const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
    const output = Buffer.concat(chunks).toString("utf8");
    const expectedSource = fs.readFileSync("large-input.txt", "utf8");
    // The secret is masked, and the length of the content is not changed
    const outputContent = output.endsWith("\n") ? output.slice(0, -1) : output;
    if (outputContent.length !== expectedSource.length || !outputContent.endsWith("a".repeat(2 * 1024 * 1024))) {
        console.error("secretlint output was truncated");
        process.exitCode = 1;
    }
});
'
pipeline_status=("${PIPESTATUS[@]}")
set -e
if [ "${pipeline_status[0]}" -ne 1 ] || [ "${pipeline_status[1]}" -ne 0 ]; then
    echo "❌ Large piped output test failed"
    exit 1
fi
rm large-input.txt

# Verify that the binary has the worker thread that scans files for keywords.
# Many large files make the scan long enough to start a worker.
mkdir many-files
node -e '
const fs = require("node:fs");
const content = "lorem ipsum dolor sit amet\n".repeat(10000);
for (let i = 0; i < 1200; i++) {
    fs.writeFileSync(`many-files/file-${i}.txt`, content);
}
fs.writeFileSync("many-files/secret.txt", "AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYSECRETSKEY\n");
'
set +e
DEBUG=@secretlint/node ./secretlint "many-files/**/*" >worker-stdout.txt 2>worker-stderr.txt
WORKER_STATUS=$?
set -e
if [ "$WORKER_STATUS" -ne 1 ] || ! grep -q "secret.txt" worker-stdout.txt; then
    echo "❌ The lint with a keyword scan worker did not report the secret (status: $WORKER_STATUS)"
    exit 1
fi
if grep -q "keyword scan worker error\|keyword scan worker can not start" worker-stderr.txt; then
    echo "❌ The keyword scan worker failed in the binary"
    grep -m 3 "keyword scan worker" worker-stderr.txt
    exit 1
fi
if ! grep -qE "keyword scan workers: [1-9]" worker-stderr.txt; then
    echo "❌ The keyword scan worker did not start in the binary"
    exit 1
fi
echo "✅ Keyword scan worker check passed"
rm -rf many-files worker-stdout.txt worker-stderr.txt
cd -
