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
