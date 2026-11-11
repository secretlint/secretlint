import assert from "node:assert";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { text } from "node:stream/consumers";
import { fileURLToPath } from "node:url";

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binPath = path.join(packageDirectory, "bin", "secretlint.js");

describe("secretlint bin", () => {
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
