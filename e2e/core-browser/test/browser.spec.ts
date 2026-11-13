import { test, expect, type Page } from "@playwright/test";
// `window.secretlint` type
import type {} from "../src/index.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "http://secretlint.test";
// The pages of this origin have a Content Security Policy that does not allow WebAssembly
const CSP_ORIGIN = "http://csp.secretlint.test";
const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "text/javascript"
};

const openPage = async (page: Page, origin: string) => {
    // Serve dist/ (the build of Vite) from the disk, without a web server
    await page.route(`${origin}/**`, async (route) => {
        const { pathname } = new URL(route.request().url());
        const filePath = path.join(rootDir, "dist", pathname === "/" ? "index.html" : pathname);
        try {
            await route.fulfill({
                body: await fs.readFile(filePath),
                contentType: contentTypes[path.extname(filePath)] ?? "application/octet-stream",
                headers: origin === CSP_ORIGIN ? { "Content-Security-Policy": "script-src 'self'" } : undefined
            });
        } catch {
            await route.fulfill({ status: 404 });
        }
    });
    // A module that can not be loaded in browsers (e.g. a static import of `node:path`) is a console error
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
        if (message.type() === "error") {
            errors.push(message.text());
        }
    });
    await page.goto(`${origin}/`);
    const ready = await page
        .waitForFunction(() => document.body.dataset.ready === "true", null, { timeout: 5000 })
        .then(() => true)
        .catch(() => false);
    expect(ready, `secretlint is not loaded in the browser:\n${errors.join("\n")}`).toBe(true);
};

test.beforeEach(async ({ page }) => {
    await openPage(page, ORIGIN);
});

// Fake secrets: they match the format of the rules, but they are not real
const AWS_SECRET_ACCESS_KEY = ["wJalrXUtnFEMI", "K7MDENG", "bPxRfiCYSECRETSKEY"].join("/");
const GITHUB_TOKEN = ["ghp_", "wWPw5k4aXcaT4fNP0UcnZwJUVFk6LO0pINUx"].join("");

for (const useBytes of [false, true]) {
    test.describe(useBytes ? "content + contentBytes" : "content", () => {
        test("reports secrets with the recommend preset", async ({ page }) => {
            const content = `AWS_SECRET_ACCESS_KEY = ${AWS_SECRET_ACCESS_KEY}\nGITHUB_TOKEN = ${GITHUB_TOKEN}\n`;
            const result = await page.evaluate(
                ({ content, useBytes }) => window.secretlint.lint(content, { useBytes }),
                { content, useBytes }
            );
            expect(
                result.messages.map((message) => [message.ruleId, message.messageId, message.loc.start.line])
            ).toEqual([
                ["@secretlint/secretlint-rule-aws", "AWSSecretAccessKey", 1],
                ["@secretlint/secretlint-rule-github", "GITHUB_TOKEN", 2]
            ]);
        });

        test("reports a GCP service account key JSON with its file name", async ({ page }) => {
            // `private_key` only needs the header of a private key to match the gcp rule
            const content = JSON.stringify({
                type: "service_account",
                private_key_id: "0123456789abcdef0123456789abcdef01234567",
                private_key: ["-----BEGIN", "PRIVATE KEY-----\nfake\n-----END", "PRIVATE KEY-----\n"].join(" ")
            });
            const result = await page.evaluate(
                ({ content, useBytes }) =>
                    window.secretlint.lint(content, { filePath: "C:\\keys\\sa-key.json", useBytes }),
                { content, useBytes }
            );
            const gcpMessages = result.messages.filter(
                (message) => message.ruleId === "@secretlint/secretlint-rule-gcp"
            );
            expect(gcpMessages.map((message) => [message.messageId, message.message])).toEqual([
                ["PrivateKeyJSON", "found GCP Service Account's private key(json): sa-key.json"]
            ]);
        });

        test("reports nothing for a content without secrets", async ({ page }) => {
            const result = await page.evaluate(
                ({ useBytes }) => window.secretlint.lint("const answer = 42;\n", { useBytes }),
                { useBytes }
            );
            expect(result.messages).toEqual([]);
        });
    });
}

// The keyword scan of bytes uses WebAssembly for a long content. The result does not depend on it.
test.describe("long content as bytes", () => {
    const filler = "const answer = 42; // nothing to report on this line\n".repeat(200);
    const content = `${filler}GITHUB_TOKEN = ${GITHUB_TOKEN}\n${filler}AWS_SECRET_ACCESS_KEY = ${AWS_SECRET_ACCESS_KEY}\n`;
    const lintLongContent = async (page: Page) => {
        const result = await page.evaluate(({ content }) => window.secretlint.lint(content, { useBytes: true }), {
            content
        });
        return result.messages.map((message) => [message.ruleId, message.messageId, message.loc.start.line]);
    };
    const expected = [
        ["@secretlint/secretlint-rule-github", "GITHUB_TOKEN", 201],
        ["@secretlint/secretlint-rule-aws", "AWSSecretAccessKey", 402]
    ];

    test("reports secrets when WebAssembly is available", async ({ page }) => {
        expect(await page.evaluate(() => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0])))).toBe(
            true
        );
        expect(await lintLongContent(page)).toEqual(expected);
    });

    test("reports the same secrets when the Content Security Policy does not allow WebAssembly", async ({ page }) => {
        await openPage(page, CSP_ORIGIN);
        const canCompile = await page.evaluate(() => {
            try {
                new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]));
                return true;
            } catch {
                return false;
            }
        });
        expect(canCompile).toBe(false);
        expect(await lintLongContent(page)).toEqual(expected);
    });
});
