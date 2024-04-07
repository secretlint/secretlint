#!/usr/bin/env bash
set -euo pipefail
# cross compile using deno
#       --target <target>
#          Target OS architecture
#
#          [possible values: x86_64-unknown-linux-gnu, x86_64-pc-windows-msvc, x86_64-apple-darwin, aarch64-apple-darwin]

distDir="dist"
binaryName="secretlint"
secretlintVersion=$(jq -r .version ../../lerna.json)
platforms=("x86_64-unknown-linux-gnu" "x86_64-pc-windows-msvc" "x86_64-apple-darwin" "aarch64-apple-darwin")
# read lerna.json's version
for ((i=0; i<${#platforms[@]}; ++i));
do
  echo "Building for ${platforms[$i]}"
  # secretlint-{version}-{platform}
  outputFilePath="${distDir}/${binaryName}-${secretlintVersion}-${platforms[$i]}"
  deno compile --no-lock --allow-read --allow-sys --allow-env --allow-write --target "${platforms[$i]}" --output "$outputFilePath" src/entry.ts
done
