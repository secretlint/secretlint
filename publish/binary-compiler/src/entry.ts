// preload for embedded binary
import * as preset from "@secretlint/secretlint-rule-preset-recommend";
import * as pattern from "@secretlint/secretlint-rule-pattern";
import * as sarif from "@secretlint/secretlint-formatter-sarif";
import { loadFormatter, getFormatterList } from "@secretlint/formatter";
import { cli, run } from "secretlint/cli";
import { plugin, type PluginBuilder } from "bun";
import * as fs from "node:fs";
import * as path from "node:path";

const mocks = {
    "@secretlint/secretlint-rule-preset-recommend": preset,
    "@secretlint/secretlint-rule-pattern": pattern,
    "@secretlint/secretlint-formatter-sarif": sarif
};
const mockNames = Object.keys(mocks);
await plugin({
    name: "secretlint",
    setup(build: PluginBuilder): void | Promise<void> {
        // require.resolve hooks
        build.onResolve({ filter: /@secretlint/ }, (args) => {
            // if match the path with mocks, return mock name
            const match = args.path.match(/(@secretlint\/[^/]*)/);
            if (match && mockNames.includes(match[1])) {
                // return `secretlint:${name}` instead of file path
                return {
                    path: match[1],
                    namespace: "secretlint"
                };
            }
            // if not match, return original path
            return args;
        });
        // require/import/dynamic import hooks
        Object.entries(mocks).forEach(([name, mock]) => {
            // build.module will return mock object
            build.module(`${name}`, () => {
                return {
                    exports: mock,
                    loader: "object"
                };
            });
            // build.onResolve will return `secretlint:${name}` instead of file path
            build.module(`secretlint:${name}`, () => {
                return {
                    exports: mock,
                    loader: "object"
                };
            });
        });
    }
});
// preload formatter
for (const formatter of getFormatterList()) {
    await loadFormatter({
        formatterName: formatter.name
    });
}
// --init override
if (cli.flags.init) {
    // write .secretlintrc.json
    fs.writeFileSync(
        path.join(process.cwd(), ".secretlintrc.json"),
        JSON.stringify(
            {
                rules: [
                    {
                        id: "@secretlint/secretlint-rule-preset-recommend"
                    },
                    {
                        id: "@secretlint/secretlint-rule-pattern"
                    }
                ]
            },
            null,
            4
        )
    );
    console.log("Create .secretlintrc.json");
    process.exit(0);
}
// secretlint CLI wrapper
// TODO: --version does not work because package.json is not bundled
run(cli.input, cli.flags).then(
    ({ exitStatus, stderr, stdout }) => {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.error(stderr);
        }
        process.exit(exitStatus);
    },
    (error) => {
        console.error(error);
        process.exit(1);
    }
);
