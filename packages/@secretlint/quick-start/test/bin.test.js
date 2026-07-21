import assert from "node:assert";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { text } from "node:stream/consumers";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binPath = path.join(packageDirectory, "bin", "quick-start.js");

test("quick-start does not truncate large JSON output piped to another process", async () => {
    const input = `AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYSECRETSKEY\n${"a".repeat(2 * 1024 * 1024)}`;
    const child = spawn(process.execPath, [binPath, "--stdinFileName=input.txt", "--format=json"], {
        cwd: packageDirectory,
        env: {
            ...process.env,
            // Make the package-local preset visible when testing from the pnpm workspace.
            NODE_PATH: path.join(packageDirectory, "node_modules"),
        },
        stdio: "pipe",
    });
    const closePromise = once(child, "close");
    const stdoutPromise = text(child.stdout);
    const stderrPromise = text(child.stderr);
    child.stdin.end(input);

    const [[exitCode, signal], stdout, stderr] = await Promise.all([closePromise, stdoutPromise, stderrPromise]);

    assert.strictEqual(signal, null);
    assert.strictEqual(exitCode, 1, stderr);
    assert.ok(Buffer.byteLength(stdout) > 1024 * 1024, "stdout should contain more than 1 MiB");
    const results = JSON.parse(stdout);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].sourceContent, input);
    assert.ok(results[0].messages.length > 0);
});
