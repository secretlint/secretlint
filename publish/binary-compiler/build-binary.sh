#!/usr/bin/env bash
set -euo pipefail
# cross compile using bun
# https://bun.sh/docs/bundler/executables
# --target	Operating System	Architecture	Modern	Baseline
#  #bun-linux-x64	Linux	x64	✅	✅
#  #bun-linux-arm64	Linux	arm64	✅	N/A
#  #bun-windows-x64	Windows	x64	✅	✅
#  #bun-darwin-x64	macOS	x64	✅	✅
#  #bun-darwin-arm64	macOS	arm64	✅	N/A

distDir="dist"
binaryName="secretlint"
secretlintVersion=$(jq -r .version ../../lerna.json)
platforms=("linux-x64"  "linux-arm64" "windows-x64" "darwin-x64" "darwin-arm64")
rm -rf $distDir

# Generate embedded-version.ts with actual version
echo "// This file is generated at build time" > src/embedded-version.ts
echo "export const EMBEDDED_VERSION = \"$secretlintVersion\";" >> src/embedded-version.ts

# read lerna.json's version
for ((i=0; i<${#platforms[@]}; ++i));
do
  echo "Building for ${platforms[$i]}"
  # secretlint-{version}-{platform}
  outputFilePath="${distDir}/${binaryName}-${secretlintVersion}-${platforms[$i]}"
  bun build --compile --target "bun-${platforms[$i]}" --outfile "$outputFilePath" src/entry.ts
done

# clean up ".*.bun-build" file
# https://github.com/oven-sh/bun/issues/14020
find . -name "*.bun-build" -exec rm -f {} \;

# generate sha1sum
cd $distDir
checkSumFile="$binaryName-$secretlintVersion-sha256sum.txt"
sha256sum $binaryName-* > "$checkSumFile"
