#!/usr/bin/env node
// Check that links into this repository point to files that exist.
//
// - Absolute links: https://github.com/secretlint/secretlint/{blob,tree,raw}/{master,HEAD}/<path>
//   and https://raw.githubusercontent.com/secretlint/secretlint/{master,HEAD}/<path>
//   in any tracked text file (docs, sources, package.json, ...).
//   These URLs are shipped in npm packages (e.g. rule `docs.url`), so deleting or moving
//   the target breaks every released version that contains the URL.
// - Relative links in Markdown files: [text](./path) and [text](../path)
//
// It does not use the network and does not check #anchors.
// Usage: node scripts/check-links.mts (Node.js runs it by stripping the types; no build step)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
process.chdir(root);

// Files that are not ours or are history: they are not checked.
const IGNORED: RegExp[] = [
    /(^|\/)CHANGELOG\.md$/,
    /^archieves\//,
    /^examples\/benchmark\/targets\//,
    /(^|\/)node_modules\//,
    /(^|\/)test\/(snapshots|fixtures)\//,
    /(^|\/)snapshots\//
];
const TEXT_EXTENSIONS = new Set([".md", ".ts", ".mts", ".cts", ".js", ".mjs", ".cjs", ".json", ".yml", ".yaml"]);

const ABSOLUTE_LINK =
    /https:\/\/(?:github\.com\/secretlint\/secretlint\/(?:blob|tree|raw)|raw\.githubusercontent\.com\/secretlint\/secretlint)\/(?:master|HEAD)\/([^\s"'`)>\]#?]*)/g;
const MARKDOWN_LINK = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter((file) => file && TEXT_EXTENSIONS.has(path.extname(file)) && !IGNORED.some((re) => re.test(file)));

const decode = (value: string): string => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};
// Template placeholders like {{ inputs.name }} or <name> are not real paths.
const isPlaceholder = (value: string): boolean => /\{\{|<|%3C/i.test(value);
const lineOf = (text: string, index: number): number => text.slice(0, index).split("\n").length;

const errors: string[] = [];
for (const file of files) {
    if (!fs.existsSync(file)) {
        continue; // deleted in the working tree
    }
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(ABSOLUTE_LINK)) {
        const target = decode(match[1] ?? "").replace(/\/$/, "");
        if (isPlaceholder(match[1] ?? "") || target === "") {
            continue;
        }
        if (!fs.existsSync(target)) {
            errors.push(`${file}:${lineOf(text, match.index ?? 0)}: ${match[0]} -> ${target} does not exist`);
        }
    }
    if (path.extname(file) !== ".md") {
        continue;
    }
    // Do not read links in code blocks or inline code.
    const prose = text.replace(/```[\s\S]*?```|`[^`\n]*`/g, (code) => code.replace(/[^\n]/g, " "));
    for (const match of prose.matchAll(MARKDOWN_LINK)) {
        const link = match[1] ?? "";
        if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith("#") || link.startsWith("//")) {
            continue;
        }
        const linkPath = decode(link.split("#")[0]?.split("?")[0] ?? "");
        if (linkPath === "" || isPlaceholder(linkPath)) {
            continue;
        }
        const linkTarget = linkPath.startsWith("/") ? linkPath.slice(1) : path.join(path.dirname(file), linkPath);
        if (!fs.existsSync(linkTarget)) {
            errors.push(`${file}:${lineOf(text, match.index ?? 0)}: ${link} -> ${linkTarget} does not exist`);
        }
    }
}

if (errors.length > 0) {
    console.error(`Found ${errors.length} link(s) to files that do not exist:\n`);
    console.error(errors.join("\n"));
    console.error("\nIf you moved or deleted a file, update the links to it.");
    process.exit(1);
}
console.log(`Checked links in ${files.length} files.`);
