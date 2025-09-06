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
cd -
