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

# Run the dist binary
./dist/secretlint-${CURRENT_VERSION}-${OS}-${ARCH} --version
./dist/secretlint-${CURRENT_VERSION}-${OS}-${ARCH} --help
# run "**/*" test
./dist/secretlint-${CURRENT_VERSION}-${OS}-${ARCH} "*"
