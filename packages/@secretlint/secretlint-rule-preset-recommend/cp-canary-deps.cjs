const path = require("node:path");
const fs = require("node:fs");
// copy devDependencies to package.json from canary
const canaryPackageJSON = require("../secretlint-rule-preset-canary/package.json");
const canaryDevDependencies = canaryPackageJSON.devDependencies;
const recommendedPackageJSON = require("./package.json");
// update devDependencies
recommendedPackageJSON.devDependencies = Object.assign({}, recommendedPackageJSON.devDependencies, canaryDevDependencies);
// write package.json
fs.writeFileSync(path.join(__dirname, "package.json"), JSON.stringify(recommendedPackageJSON, null, 2));
