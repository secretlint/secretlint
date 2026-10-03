import "./secretlint-resolver-hooks.js"; // hooks for secretlint
import { cli, run } from "secretlint/cli";
import * as fs from "node:fs";
import * as path from "node:path";

const writeOutput = async (output: string, destination: "stdout" | "stderr") => {
    const writer = (destination === "stdout" ? Bun.stdout : Bun.stderr).writer();
    writer.write(output);
    await writer.end();
};

// --init override
// The binary bundles the recommended rules, so it writes a fixed config instead of reading package.json.
// Keep the same cwd handling and existing-config check as the Node CLI's runConfigCreator.
if (cli.flags.init) {
    const cwd = cli.flags.cwd;
    const existingConfigFiles = fs.readdirSync(cwd).filter((name) => name.startsWith(".secretlintrc"));
    if (existingConfigFiles.length > 0) {
        await writeOutput("secretlint config file is already existed.\n", "stderr");
        process.exit(1);
    }
    const configFilePath = path.join(cwd, ".secretlintrc.json");
    fs.writeFileSync(
        configFilePath,
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
    console.log(`Create ${configFilePath}`);
    process.exit(0);
}
// Handle --version flag specifically for binary
if (cli.flags.version) {
    // Version is embedded at compile time via environment variable inlining
    console.log(process.env.SECRETLINT_VERSION || "unknown");
    process.exit(0);
}
// secretlint CLI wrapper
try {
    const { exitStatus, stderr, stdout } = await run(cli.input, cli.flags);
    if (stdout) {
        await writeOutput(`${stdout}\n`, "stdout");
    }
    if (stderr) {
        const errorMessage = stderr.stack ?? stderr.message;
        await writeOutput(`${errorMessage}\n`, "stderr");
    }
    process.exit(exitStatus);
} catch (error) {
    const errorMessage = error instanceof Error ? (error.stack ?? error.message) : String(error);
    await writeOutput(`${errorMessage}\n`, "stderr");
    process.exit(1);
}
