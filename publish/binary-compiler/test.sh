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

# Verify that large JSON output is fully flushed before the process exits.
node -e 'process.stdout.write("AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYSECRETSKEY\n" + "a".repeat(2 * 1024 * 1024))' > large-input.txt
set +e
./secretlint large-input.txt --format=json | node -e '
const fs = require("node:fs");
const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
    try {
        const results = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        const expectedSource = fs.readFileSync("large-input.txt", "utf8");
        if (results.length !== 1 || results[0].sourceContent !== expectedSource) {
            throw new Error("source content does not match");
        }
    } catch {
        console.error("secretlint JSON output was truncated");
        process.exitCode = 1;
    }
});
'
pipeline_status=("${PIPESTATUS[@]}")
set -e
if [ "${pipeline_status[0]}" -ne 1 ] || [ "${pipeline_status[1]}" -ne 0 ]; then
    echo "❌ Large piped JSON output test failed"
    exit 1
fi
cd -
