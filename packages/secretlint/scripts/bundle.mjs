// Bundle the CLI into a file: dist/cli.js
//
// `bin/secretlint.js` runs the bundle, because resolving and loading a file for each module takes
// about half of the time of linting a few files. The bundle has the code of the dependencies of the CLI.
// The rules and formatters that are not built in are still loaded with `import()` at runtime.
//
// `module/` is not bundled: it is for the users of the API (`import "secretlint"`).
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(packageDirectory, "dist");
const NODE_MODULES = "node_modules/";

/**
 * Return the directory of the package that has the file, or undefined if the file is not in node_modules.
 * For example, ".../node_modules/@scope/name/lib/index.js" is ".../node_modules/@scope/name".
 */
const getThirdPartyPackageDirectory = (filePath) => {
    const posixPath = filePath.split(path.sep).join("/");
    const index = posixPath.lastIndexOf(NODE_MODULES);
    if (index === -1) {
        return undefined;
    }
    const [first, second] = posixPath.slice(index + NODE_MODULES.length).split("/");
    const packageName = first.startsWith("@") ? `${first}/${second}` : first;
    return posixPath.slice(0, index + NODE_MODULES.length) + packageName;
};

/**
 * Create the text of the licenses of the bundled packages that are not a package of this repository.
 */
const createThirdPartyLicenses = (inputFilePaths) => {
    const packageDirectories = new Set();
    for (const inputFilePath of inputFilePaths) {
        const directory = getThirdPartyPackageDirectory(inputFilePath);
        if (directory !== undefined) {
            packageDirectories.add(directory);
        }
    }
    const sections = [...packageDirectories]
        .map((directory) => {
            const pkg = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf-8"));
            const licenseFileName = fs.readdirSync(directory).find((name) => /^licen[cs]e/i.test(name));
            if (licenseFileName === undefined) {
                throw new Error(`Not found the license file of the bundled package: ${pkg.name}`);
            }
            const licenseText = fs.readFileSync(path.join(directory, licenseFileName), "utf-8").trim();
            return { name: pkg.name, text: `${pkg.name}@${pkg.version}\nLicense: ${pkg.license}\n\n${licenseText}\n` };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    const header = "dist/cli.js includes the code of the following packages.\n";
    return [header, ...sections.map((section) => section.text)].join(`\n${"-".repeat(80)}\n\n`);
};

const result = await build({
    entryPoints: [path.join(packageDirectory, "module/cli.js")],
    outfile: path.join(outputDirectory, "cli.js"),
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    // The bundle is not minified, so a stack trace is readable without a source map
    minify: false,
    legalComments: "none",
    metafile: true,
    absWorkingDir: packageDirectory,
    logLevel: "warning",
    alias: {
        // The packages load js-yaml via `require` and `import`.
        // Use one file for both, so the bundle does not have two copies of js-yaml
        "js-yaml": require.resolve("js-yaml"),
    },
    banner: {
        // The bundled CommonJS packages call `require` for the built-in modules of Node.js
        js: `import { createRequire as __secretlintCreateRequire } from "node:module";\nconst require = __secretlintCreateRequire(import.meta.url);`,
    },
});
const inputFilePaths = Object.keys(result.metafile.inputs).map((input) => path.resolve(packageDirectory, input));
fs.writeFileSync(
    path.join(outputDirectory, "THIRD-PARTY-LICENSES.txt"),
    createThirdPartyLicenses(inputFilePaths),
    "utf-8",
);
