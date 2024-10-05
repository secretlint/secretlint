#!/usr/bin/env bash
set -euo pipefail
# Get current architecture
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
CURRENT_VERSION=$(jq -r .version ../../lerna.json)
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
# Run the dist binary
${TMP_DIR}/secretlint --version
${TMP_DIR}/secretlint --help
# run "**/*" test
${TMP_DIR}/secretlint "**/*"
