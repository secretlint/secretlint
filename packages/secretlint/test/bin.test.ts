import assert from "node:assert";
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { text } from "node:stream/consumers";
import { fileURLToPath } from "node:url";

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binPath = path.join(packageDirectory, "bin", "secretlint.js");

const runBin = async (args: string[]) => {
    const child = spawn(process.execPath, [binPath, ...args], {
        cwd: packageDirectory,
        stdio: ["ignore", "pipe", "pipe"],
    });
    const [[exitCode], stdout, stderr] = await Promise.all([
        once(child, "close"),
        text(child.stdout),
        text(child.stderr),
    ]);
    return { exitCode, stdout, stderr };
};

describe("secretlint bin", () => {
    it("outputs the version of the package", async () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(packageDirectory, "package.json"), "utf-8"));
        const { exitCode, stdout, stderr } = await runBin(["--version"]);
        assert.strictEqual(exitCode, 0, stderr);
        assert.strictEqual(stdout, `${pkg.version}\n`);
    });
    it("lints a file with a built-in preset", async () => {
        const secretlintrcJSON = JSON.stringify({
            rules: [{ id: "@secretlint/secretlint-rule-preset-recommend" }],
        });
        const { exitCode, stdout, stderr } = await runBin([
            `--secretlintrcJSON=${secretlintrcJSON}`,
            "test/fixtures/package.json",
        ]);
        assert.strictEqual(exitCode, 0, stderr);
        assert.strictEqual(stdout, "");
    });
    it("loads a rule and a formatter that are not built in", async () => {
        const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-bin-"));
        try {
            const formatterFilePath = path.join(temporaryDirectory, "formatter.mjs");
            fs.writeFileSync(
                formatterFilePath,
                "export default (results) => results.flatMap((result) => result.messages.map((message) => message.ruleId)).join();",
            );
            const targetFilePath = path.join(temporaryDirectory, "input.txt");
            fs.writeFileSync(targetFilePath, "SECRET");
            const secretlintrcJSON = JSON.stringify({
                rules: [{ id: "@secretlint/secretlint-rule-example" }],
            });
            const { exitCode, stdout, stderr } = await runBin([
                `--secretlintrcJSON=${secretlintrcJSON}`,
                `--format=${formatterFilePath}`,
                targetFilePath,
            ]);
            assert.strictEqual(exitCode, 1, stderr);
            assert.strictEqual(stdout, "@secretlint/secretlint-rule-example\n");
        } finally {
            fs.rmSync(temporaryDirectory, { recursive: true, force: true });
        }
    });
    it("does not truncate large output piped to another process", async () => {
        const input = `SECRET\n${"a".repeat(2 * 1024 * 1024)}`;
        const secretlintrcJSON = JSON.stringify({
            rules: [
                {
                    id: "@secretlint/secretlint-rule-example",
                },
            ],
        });
        const child = spawn(
            process.execPath,
            [binPath, "--stdinFileName=input.txt", "--format=mask-result", `--secretlintrcJSON=${secretlintrcJSON}`],
            {
                cwd: packageDirectory,
                stdio: "pipe",
            },
        );
        const closePromise = once(child, "close");
        const stdoutPromise = text(child.stdout);
        const stderrPromise = text(child.stderr);
        child.stdin.end(input);

        const [[exitCode, signal], stdout, stderr] = await Promise.all([closePromise, stdoutPromise, stderrPromise]);

        assert.strictEqual(signal, null);
        assert.strictEqual(exitCode, 1, stderr);
        assert.ok(Buffer.byteLength(stdout) > 1024 * 1024, "stdout should contain more than 1 MiB");
        // mask-result outputs the whole content, and the secret is masked
        assert.strictEqual(stdout, `${input.replace("SECRET", "******")}\n`);
    });
});
