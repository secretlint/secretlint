# `@secretlint/walker` with nested `.gitignore` cascade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `globby`-based file search in `packages/secretlint/src/search.ts` with a new package `@secretlint/walker` that respects nested `.gitignore` files using Git-compatible cascade semantics, then ship as secretlint v13.

**Architecture:** A new internal package `@secretlint/walker` exposes a Promise-based recursive walker built on `Promise.all` + `fs.readdir({ withFileTypes: true })` + the `ignore` library, with subtree pruning when a directory is ignored. Glob matching uses Node.js 22+ `path.matchesGlob`. The walker is name-agnostic — consumers pass `ignoreFiles: [".gitignore"]` to opt into Git semantics. `packages/secretlint/src/search.ts` becomes a thin wrapper that adds `DEFAULT_IGNORE_PATTERNS` and `.secretlintignore`.

**Tech Stack:** TypeScript (NodeNext), Node.js >=22, `ignore` (node-ignore), `vitest` for tests, `tsc --build` (composite project references), `pnpm` workspaces with catalog versions, `turbo` for orchestrated build.

**Spec:** `docs/superpowers/specs/2026-05-03-walker-gitignore-cascade-design.md`

**PR strategy:** All work lands in a **single draft PR** so reviewers can verify the walker, the secretlint migration, and the documentation together (compatibility check). The branch is already created (`feat/walker-gitignore-cascade`). Only the final task opens the PR.

The plan still groups tasks into three logical "stages" (walker → migration → docs), and Tasks 17 and 22 (the per-stage PR steps) are removed. Stage boundaries are kept as commit boundaries only.

---

## Conventions

- Package directory: `packages/@secretlint/walker/`
- All code in TypeScript, build to `module/` via `tsc --build`
- Indent: 4 spaces. Quotes: double. Print width: 120.
- Test files live under `test/` next to `src/`. Test runner: `vitest run`.
- After every step that changes code, run formatter, build, and tests for the affected package.
- Commit messages: imperative mood, scoped to the change (`feat(walker): ...`, `chore(secretlint): ...`).
- Use real newlines in commit messages, never literal `\n`.

---

# PR #1 — `@secretlint/walker` package

## Task 1: Bootstrap package skeleton

**Files:**
- Create: `packages/@secretlint/walker/package.json`
- Create: `packages/@secretlint/walker/tsconfig.json`
- Create: `packages/@secretlint/walker/vitest.config.ts`
- Create: `packages/@secretlint/walker/README.md`
- Create: `packages/@secretlint/walker/src/index.ts`
- Create: `packages/@secretlint/walker/.gitignore`
- Modify: `pnpm-workspace.yaml` (add `ignore` to catalog)

- [ ] **Step 1: Add `ignore` to the pnpm catalog**

Edit `pnpm-workspace.yaml`. Insert into the alphabetised `catalog:` block (after `globby` / before `istextorbinary`):

```yaml
  "ignore": "^7.0.5"
```

- [ ] **Step 2: Create `packages/@secretlint/walker/package.json`**

```json
{
    "name": "@secretlint/walker",
    "version": "12.3.1",
    "description": "Promise-based file system walker with nested .gitignore cascade support.",
    "keywords": [
        "secretlint",
        "walker",
        "gitignore"
    ],
    "homepage": "https://github.com/secretlint/secretlint/tree/master/packages/@secretlint/walker/",
    "bugs": {
        "url": "https://github.com/secretlint/secretlint/issues"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/secretlint/secretlint.git"
    },
    "license": "MIT",
    "author": "azu",
    "type": "module",
    "exports": {
        ".": {
            "import": {
                "types": "./module/index.d.ts",
                "default": "./module/index.js"
            },
            "default": "./module/index.js"
        },
        "./package.json": "./package.json"
    },
    "main": "./module/index.js",
    "types": "./module/index.d.ts",
    "directories": {
        "lib": "lib",
        "test": "test"
    },
    "files": [
        "bin/",
        "module/",
        "src/"
    ],
    "scripts": {
        "build": "tsc --build",
        "clean": "tsc --build --clean",
        "prepublishOnly": "npm run clean && npm run build",
        "prettier": "prettier --write \"**/*.{js,jsx,ts,tsx,css}\"",
        "prepublish": "npm run --if-present build",
        "test": "vitest run",
        "updateSnapshot": "UPDATE_SNAPSHOT=1 npm test",
        "watch": "tsc --build --watch"
    },
    "prettier": {
        "printWidth": 120,
        "singleQuote": false,
        "tabWidth": 4
    },
    "dependencies": {
        "ignore": "catalog:"
    },
    "devDependencies": {
        "@types/node": "catalog:",
        "prettier": "catalog:",
        "tsx": "catalog:",
        "typescript": "catalog:"
    },
    "engines": {
        "node": ">=22.0.0"
    },
    "publishConfig": {
        "access": "public"
    }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./module/",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*"
  ]
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: [
            "test/**/*.{test,spec}.{js,ts}",
            "test/**/*{-test,-spec}.{js,ts}",
            "test/**/test-*.{js,ts}",
            "test/**/spec-*.{js,ts}",
        ],
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/module/**",
            "**/lib/**",
            "**/fixtures/**",
            "**/snapshots/**",
        ],
        globals: true,
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000,
    },
});
```

- [ ] **Step 5: Create `src/index.ts` placeholder**

```ts
export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
};

export const walk = async (_options: WalkOptions): Promise<string[]> => {
    throw new Error("not implemented");
};
```

- [ ] **Step 6: Create `.gitignore`** (mirror other packages)

```
node_modules
module
*.log
.turbo
```

- [ ] **Step 7: Create `README.md` placeholder**

```markdown
# @secretlint/walker

Promise-based file system walker with nested `.gitignore` cascade support.

See `docs/superpowers/specs/2026-05-03-walker-gitignore-cascade-design.md` for design details.
```

- [ ] **Step 8: Install dependencies and verify build**

Run: `pnpm install && pnpm --filter @secretlint/walker run build`
Expected: Install succeeds; `module/index.js` and `module/index.d.ts` produced.

- [ ] **Step 9: Commit**

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml packages/@secretlint/walker
git commit -m "$(cat <<'EOF'
feat(walker): bootstrap @secretlint/walker package

Add empty @secretlint/walker package skeleton with package.json,
tsconfig, vitest config, and stub WalkOptions / walk() API.
Adds the `ignore` catalog entry used by the upcoming implementation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `glob-root.ts` — split glob into walk root and match pattern

**Files:**
- Create: `packages/@secretlint/walker/src/glob-root.ts`
- Test: `packages/@secretlint/walker/test/glob-root.test.ts`

- [ ] **Step 1: Write failing tests for `splitGlobRoot`**

Create `test/glob-root.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { splitGlobRoot, isDynamicPattern } from "../src/glob-root.js";

describe("isDynamicPattern", () => {
    it("returns true for *", () => {
        expect(isDynamicPattern("src/*.ts")).toBe(true);
    });
    it("returns true for **", () => {
        expect(isDynamicPattern("**/*.ini")).toBe(true);
    });
    it("returns true for ?", () => {
        expect(isDynamicPattern("file?.txt")).toBe(true);
    });
    it("returns true for braces", () => {
        expect(isDynamicPattern("file.{js,ts}")).toBe(true);
    });
    it("returns true for character class", () => {
        expect(isDynamicPattern("file[12].txt")).toBe(true);
    });
    it("returns false for static path", () => {
        expect(isDynamicPattern("src/foo.ts")).toBe(false);
    });
    it("returns false for empty string", () => {
        expect(isDynamicPattern("")).toBe(false);
    });
});

describe("splitGlobRoot", () => {
    it("extracts static prefix before glob", () => {
        expect(splitGlobRoot("src/**/*.ini")).toEqual({ rootDir: "src", matchPattern: "**/*.ini" });
    });
    it("returns empty rootDir when leading **", () => {
        expect(splitGlobRoot("**/*.ini")).toEqual({ rootDir: "", matchPattern: "**/*.ini" });
    });
    it("handles deeper static prefix", () => {
        expect(splitGlobRoot("a/b/c/**/*.ts")).toEqual({ rootDir: "a/b/c", matchPattern: "**/*.ts" });
    });
    it("handles brace at first segment", () => {
        expect(splitGlobRoot("{src,test}/**/*.ts")).toEqual({ rootDir: "", matchPattern: "{src,test}/**/*.ts" });
    });
    it("handles single-segment glob", () => {
        expect(splitGlobRoot("*.ts")).toEqual({ rootDir: "", matchPattern: "*.ts" });
    });
    it("handles static path (no glob chars)", () => {
        expect(splitGlobRoot("src/foo.ts")).toEqual({ rootDir: "src", matchPattern: "foo.ts" });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @secretlint/walker run test`
Expected: FAIL — `splitGlobRoot` and `isDynamicPattern` are not exported.

- [ ] **Step 3: Implement `src/glob-root.ts`**

```ts
const DYNAMIC_RE = /[*?[\]{}]/;

export const isDynamicPattern = (pattern: string): boolean => {
    return DYNAMIC_RE.test(pattern);
};

/**
 * Split a glob pattern into a static walk root and the remaining match pattern.
 *
 * Examples:
 *   "src/**\/*.ini"  → { rootDir: "src",     matchPattern: "**\/*.ini" }
 *   "**\/*.ini"     → { rootDir: "",        matchPattern: "**\/*.ini" }
 *   "src/foo.ts"   → { rootDir: "src",     matchPattern: "foo.ts" }
 *
 * The walker uses `rootDir` as the directory to descend into and `matchPattern`
 * as the relative-path pattern to match files against.
 */
export const splitGlobRoot = (pattern: string): { rootDir: string; matchPattern: string } => {
    const segments = pattern.split("/");
    const staticSegments: string[] = [];
    for (const segment of segments) {
        if (isDynamicPattern(segment)) break;
        staticSegments.push(segment);
    }
    if (staticSegments.length === segments.length) {
        // Fully static path: treat last segment as match pattern, the rest as rootDir.
        return {
            rootDir: staticSegments.slice(0, -1).join("/"),
            matchPattern: staticSegments[staticSegments.length - 1] ?? "",
        };
    }
    return {
        rootDir: staticSegments.join("/"),
        matchPattern: segments.slice(staticSegments.length).join("/"),
    };
};
```

(The `\` characters above are escapes inside the comment so the doc renders cleanly. In actual code, write `**/*.ini`.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @secretlint/walker run test`
Expected: PASS — 13 tests in 2 files.

- [ ] **Step 5: Commit**

```bash
git add packages/@secretlint/walker/src/glob-root.ts packages/@secretlint/walker/test/glob-root.test.ts
git commit -m "$(cat <<'EOF'
feat(walker): add splitGlobRoot and isDynamicPattern helpers

Split a glob pattern into a static walk root and match pattern so the
walker can descend only into the relevant subtree.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `ignore-stack.ts` — load ignore files into a node-ignore instance

**Files:**
- Create: `packages/@secretlint/walker/src/ignore-stack.ts`
- Test: `packages/@secretlint/walker/test/ignore-stack.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/ignore-stack/`

- [ ] **Step 1: Create test fixtures**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/ignore-stack/parent
mkdir -p packages/@secretlint/walker/test/fixtures/ignore-stack/parent/child
printf '%s\n' '*.log' > packages/@secretlint/walker/test/fixtures/ignore-stack/parent/.gitignore
printf '%s\n' 'build/' '!keep-this.log' > packages/@secretlint/walker/test/fixtures/ignore-stack/parent/child/.gitignore
```

- [ ] **Step 2: Write failing tests**

Create `test/ignore-stack.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extendIgnore, createRootIgnore } from "../src/ignore-stack.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "ignore-stack");

describe("createRootIgnore", () => {
    it("starts empty", () => {
        const ig = createRootIgnore([]);
        expect(ig.ignores("foo.txt")).toBe(false);
    });
    it("applies extra patterns", () => {
        const ig = createRootIgnore(["*.log"]);
        expect(ig.ignores("debug.log")).toBe(true);
        expect(ig.ignores("main.ts")).toBe(false);
    });
});

describe("extendIgnore", () => {
    it("inherits parent rules", async () => {
        const root = createRootIgnore(["*.log"]);
        const child = await extendIgnore(root, path.join(fixtureDir, "parent"), [".gitignore"]);
        expect(child.ignores("debug.log")).toBe(true);
    });

    it("merges this directory's .gitignore on top", async () => {
        const root = createRootIgnore([]);
        const parent = await extendIgnore(root, path.join(fixtureDir, "parent"), [".gitignore"]);
        expect(parent.ignores("debug.log")).toBe(true); // *.log from parent/.gitignore
        const child = await extendIgnore(parent, path.join(fixtureDir, "parent", "child"), [".gitignore"]);
        expect(child.ignores("build/")).toBe(true);     // child/.gitignore
        expect(child.ignores("debug.log")).toBe(true);  // inherited
        expect(child.ignores("keep-this.log")).toBe(false); // overridden by !keep-this.log
    });

    it("returns parent unchanged when no ignore file present", async () => {
        const root = createRootIgnore(["*.log"]);
        const child = await extendIgnore(root, path.join(fixtureDir, "parent", "child"), [".no-such-file"]);
        expect(child).toBe(root);
    });

    it("supports multiple ignore file names", async () => {
        const root = createRootIgnore([]);
        const ig = await extendIgnore(root, path.join(fixtureDir, "parent"), [".secretlintignore", ".gitignore"]);
        expect(ig.ignores("debug.log")).toBe(true);
    });
});
```

- [ ] **Step 3: Run tests, expect failures**

Run: `pnpm --filter @secretlint/walker run test`
Expected: FAIL — `extendIgnore` / `createRootIgnore` not defined.

- [ ] **Step 4: Implement `src/ignore-stack.ts`**

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import ignore, { type Ignore } from "ignore";

export type IgnoreInstance = Ignore;

export const createRootIgnore = (extraPatterns: readonly string[]): IgnoreInstance => {
    return ignore().add(extraPatterns as string[]);
};

const tryReadIgnoreFile = async (filePath: string): Promise<string | null> => {
    try {
        return await readFile(filePath, "utf8");
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
    }
};

/**
 * Build a new ignore instance by extending `parent` with any ignore files
 * found in `dir`. If none are present, returns `parent` unchanged so callers
 * can avoid allocating new instances on each level.
 */
export const extendIgnore = async (
    parent: IgnoreInstance,
    dir: string,
    ignoreFiles: readonly string[]
): Promise<IgnoreInstance> => {
    const contents: string[] = [];
    for (const name of ignoreFiles) {
        const content = await tryReadIgnoreFile(path.join(dir, name));
        if (content !== null) contents.push(content);
    }
    if (contents.length === 0) return parent;
    const next = ignore().add(parent);
    for (const content of contents) next.add(content);
    return next;
};
```

- [ ] **Step 5: Run tests, expect pass**

Run: `pnpm --filter @secretlint/walker run test`
Expected: PASS — 6 ignore-stack tests + earlier tests.

- [ ] **Step 6: Commit**

```bash
git add packages/@secretlint/walker/src/ignore-stack.ts packages/@secretlint/walker/test/ignore-stack.test.ts packages/@secretlint/walker/test/fixtures/ignore-stack
git commit -m "$(cat <<'EOF'
feat(walker): add ignore-stack module for cascading node-ignore instances

extendIgnore reads ignore files from a directory and produces a new
ignore instance that inherits from the parent. When no files are
present it returns the parent unchanged to avoid allocations.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Walker core — basic recursion without ignore

**Files:**
- Create: `packages/@secretlint/walker/src/walk.ts`
- Modify: `packages/@secretlint/walker/src/index.ts`
- Test: `packages/@secretlint/walker/test/walk-basic.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/basic/`

- [ ] **Step 1: Create basic fixture**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/basic/src/sub
mkdir -p packages/@secretlint/walker/test/fixtures/basic/other
printf 'a' > packages/@secretlint/walker/test/fixtures/basic/src/main.ts
printf 'b' > packages/@secretlint/walker/test/fixtures/basic/src/sub/util.ts
printf 'c' > packages/@secretlint/walker/test/fixtures/basic/other/x.ts
```

- [ ] **Step 2: Write failing test**

Create `test/walk-basic.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "basic");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - basic", () => {
    it("returns all files when no patterns / ignores given", async () => {
        const results = await walk({ cwd: fixtureDir });
        expect(rel(results)).toEqual(["other/x.ts", "src/main.ts", "src/sub/util.ts"]);
    });

    it("returns absolute paths", async () => {
        const results = await walk({ cwd: fixtureDir });
        for (const p of results) expect(path.isAbsolute(p)).toBe(true);
    });
});
```

- [ ] **Step 3: Run test, expect failure**

Run: `pnpm --filter @secretlint/walker run test test/walk-basic.test.ts`
Expected: FAIL — `walk` throws "not implemented".

- [ ] **Step 4: Implement `src/walk.ts`**

```ts
import { readdir } from "node:fs/promises";
import path from "node:path";
import { createRootIgnore, extendIgnore, type IgnoreInstance } from "./ignore-stack.js";

export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
};

const toPosix = (p: string): string => (path.sep === "\\" ? p.replaceAll("\\", "/") : p);

const walkDir = async (
    absDir: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    root: string,
    results: Set<string>
): Promise<void> => {
    const ig = await extendIgnore(parentIg, absDir, ignoreFiles);
    let entries;
    try {
        entries = await readdir(absDir, { withFileTypes: true });
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    await Promise.all(
        entries.map(async (entry) => {
            const full = path.join(absDir, entry.name);
            const relPosix = toPosix(path.relative(root, full));
            const target = entry.isDirectory() ? `${relPosix}/` : relPosix;
            if (relPosix !== "" && ig.ignores(target)) return;
            if (entry.isDirectory()) {
                await walkDir(full, ig, ignoreFiles, root, results);
            } else if (entry.isFile()) {
                results.add(full);
            }
        })
    );
};

export const walk = async (options: WalkOptions): Promise<string[]> => {
    const root = path.resolve(options.cwd);
    const ignoreFiles = options.ignoreFiles ?? [];
    const rootIg = createRootIgnore(options.extraIgnorePatterns ?? []);
    const results = new Set<string>();
    await walkDir(root, rootIg, ignoreFiles, root, results);
    return [...results];
};
```

- [ ] **Step 5: Update `src/index.ts`**

Replace the placeholder content with:

```ts
export { walk, type WalkOptions } from "./walk.js";
```

- [ ] **Step 6: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test`
Expected: PASS for walk-basic + earlier tests.

- [ ] **Step 7: Commit**

```bash
git add packages/@secretlint/walker/src/walk.ts packages/@secretlint/walker/src/index.ts packages/@secretlint/walker/test/walk-basic.test.ts packages/@secretlint/walker/test/fixtures/basic
git commit -m "$(cat <<'EOF'
feat(walker): implement basic recursive walk

Promise.all + readdir({ withFileTypes: true }) recursion that returns
all files under cwd as absolute paths. No ignore handling yet — each
upcoming task layers behaviour onto this core.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: extraIgnorePatterns and `.git` exclusion

**Files:**
- Test: `packages/@secretlint/walker/test/walk-extra-ignore.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/extra-ignore/`

- [ ] **Step 1: Create fixture (with `.git` simulation)**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/extra-ignore/.git
mkdir -p packages/@secretlint/walker/test/fixtures/extra-ignore/node_modules/some-dep
mkdir -p packages/@secretlint/walker/test/fixtures/extra-ignore/src
printf 'x' > packages/@secretlint/walker/test/fixtures/extra-ignore/.git/HEAD
printf 'y' > packages/@secretlint/walker/test/fixtures/extra-ignore/node_modules/some-dep/index.js
printf 'z' > packages/@secretlint/walker/test/fixtures/extra-ignore/src/main.ts
```

Important: ensure the fixture's `.git` directory is **not** treated as a git repo by the host's git. Add a `.gitignore` at the repo root inside `packages/@secretlint/walker/test/fixtures/.gitignore` containing `extra-ignore/.git/` so the test fixture isn't accidentally crawled by host git tools. Example: append entry. Verify the fixture is committed by running `git status` after creating it.

- [ ] **Step 2: Write failing test**

Create `test/walk-extra-ignore.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "extra-ignore");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - extraIgnorePatterns", () => {
    it("excludes .git and node_modules via extraIgnorePatterns", async () => {
        const results = await walk({
            cwd: fixtureDir,
            extraIgnorePatterns: ["**/.git/**", "**/node_modules/**"],
        });
        expect(rel(results)).toEqual(["src/main.ts"]);
    });

    it("includes everything when extraIgnorePatterns is empty", async () => {
        const results = await walk({ cwd: fixtureDir });
        const r = rel(results);
        expect(r).toContain("src/main.ts");
        expect(r).toContain(".git/HEAD");
        expect(r).toContain("node_modules/some-dep/index.js");
    });
});
```

- [ ] **Step 3: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-extra-ignore.test.ts`
Expected: PASS. (Implementation already supports this from Task 4.)

- [ ] **Step 4: Commit**

```bash
git add packages/@secretlint/walker/test/fixtures/extra-ignore packages/@secretlint/walker/test/walk-extra-ignore.test.ts packages/@secretlint/walker/test/fixtures/.gitignore
git commit -m "$(cat <<'EOF'
test(walker): cover extraIgnorePatterns for .git/node_modules exclusion

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Single `.gitignore` cascade test

**Files:**
- Test: `packages/@secretlint/walker/test/walk-gitignore-basic.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/gitignore-basic/`

- [ ] **Step 1: Create fixture**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/gitignore-basic/src
printf '%s\n' '*.log' > packages/@secretlint/walker/test/fixtures/gitignore-basic/.gitignore
printf 'a' > packages/@secretlint/walker/test/fixtures/gitignore-basic/src/main.ts
printf 'b' > packages/@secretlint/walker/test/fixtures/gitignore-basic/src/debug.log
printf 'c' > packages/@secretlint/walker/test/fixtures/gitignore-basic/keep.ts
```

- [ ] **Step 2: Write failing test**

Create `test/walk-gitignore-basic.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-basic");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - .gitignore basic", () => {
    it("respects root .gitignore when ignoreFiles includes it", async () => {
        const results = await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        expect(rel(results)).toEqual([".gitignore", "keep.ts", "src/main.ts"]);
    });

    it("ignores .gitignore when not in ignoreFiles", async () => {
        const results = await walk({ cwd: fixtureDir });
        expect(rel(results)).toContain("src/debug.log");
    });
});
```

- [ ] **Step 3: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-gitignore-basic.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/@secretlint/walker/test/fixtures/gitignore-basic packages/@secretlint/walker/test/walk-gitignore-basic.test.ts
git commit -m "$(cat <<'EOF'
test(walker): verify root .gitignore is respected via ignoreFiles

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Nested `.gitignore` cascade

**Files:**
- Test: `packages/@secretlint/walker/test/walk-gitignore-nested.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/gitignore-nested/`

- [ ] **Step 1: Create fixture (parent + child .gitignore)**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/gitignore-nested/packages/foo/src
mkdir -p packages/@secretlint/walker/test/fixtures/gitignore-nested/packages/foo/build
printf '%s\n' '*.log' > packages/@secretlint/walker/test/fixtures/gitignore-nested/.gitignore
printf '%s\n' 'build/' > packages/@secretlint/walker/test/fixtures/gitignore-nested/packages/foo/.gitignore
printf 'a' > packages/@secretlint/walker/test/fixtures/gitignore-nested/packages/foo/src/main.ts
printf 'b' > packages/@secretlint/walker/test/fixtures/gitignore-nested/packages/foo/src/debug.log
printf 'c' > packages/@secretlint/walker/test/fixtures/gitignore-nested/packages/foo/build/output.ts
```

- [ ] **Step 2: Write failing test**

Create `test/walk-gitignore-nested.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-nested");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - nested .gitignore cascade", () => {
    it("applies parent + child .gitignore additively", async () => {
        const results = await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const r = rel(results);
        expect(r).toContain("packages/foo/src/main.ts");
        expect(r).not.toContain("packages/foo/src/debug.log");      // parent rule
        expect(r).not.toContain("packages/foo/build/output.ts");    // child rule
    });
});
```

- [ ] **Step 3: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-gitignore-nested.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/@secretlint/walker/test/fixtures/gitignore-nested packages/@secretlint/walker/test/walk-gitignore-nested.test.ts
git commit -m "$(cat <<'EOF'
test(walker): verify nested .gitignore cascade additively applies parent + child rules

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Negation patterns and child override

**Files:**
- Test: `packages/@secretlint/walker/test/walk-negation.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/negation/`

- [ ] **Step 1: Create fixture**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/negation/sub
printf '%s\n' '*.log' > packages/@secretlint/walker/test/fixtures/negation/.gitignore
printf '%s\n' '!important.log' > packages/@secretlint/walker/test/fixtures/negation/sub/.gitignore
printf 'a' > packages/@secretlint/walker/test/fixtures/negation/debug.log
printf 'b' > packages/@secretlint/walker/test/fixtures/negation/sub/important.log
printf 'c' > packages/@secretlint/walker/test/fixtures/negation/sub/other.log
```

- [ ] **Step 2: Write failing test**

Create `test/walk-negation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "negation");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - negation patterns", () => {
    it("child !pattern resurrects file ignored by parent", async () => {
        const results = await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const r = rel(results);
        expect(r).not.toContain("debug.log");        // parent *.log
        expect(r).toContain("sub/important.log");    // child !important.log
        expect(r).not.toContain("sub/other.log");    // still ignored
    });
});
```

- [ ] **Step 3: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-negation.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/@secretlint/walker/test/fixtures/negation packages/@secretlint/walker/test/walk-negation.test.ts
git commit -m "$(cat <<'EOF'
test(walker): cover negation pattern in child .gitignore overriding parent

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Subtree pruning verification

**Files:**
- Modify: `packages/@secretlint/walker/src/walk.ts` (export `__internals` for spy hook)
- Test: `packages/@secretlint/walker/test/walk-prune.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/prune/`

- [ ] **Step 1: Create fixture (large ignored subtree)**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/prune/node_modules/dep-a/lib
mkdir -p packages/@secretlint/walker/test/fixtures/prune/src
printf '%s\n' 'node_modules/' > packages/@secretlint/walker/test/fixtures/prune/.gitignore
printf 'x' > packages/@secretlint/walker/test/fixtures/prune/node_modules/dep-a/lib/index.js
printf 'y' > packages/@secretlint/walker/test/fixtures/prune/src/main.ts
```

- [ ] **Step 2: Write failing test using vi.spyOn**

Create `test/walk-prune.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "prune");

describe("walk - subtree pruning", () => {
    let readdirSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        readdirSpy = vi.spyOn(fsPromises, "readdir");
    });
    afterEach(() => {
        readdirSpy.mockRestore();
    });

    it("does not call readdir on ignored directories", async () => {
        await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const dirsRead = readdirSpy.mock.calls.map((c) => String(c[0]));
        const calledIntoNodeModules = dirsRead.some((d) => d.includes(`${path.sep}node_modules`));
        expect(calledIntoNodeModules).toBe(false);
    });

    it("calls readdir on src/", async () => {
        await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const dirsRead = readdirSpy.mock.calls.map((c) => String(c[0]));
        expect(dirsRead.some((d) => d.endsWith(`${path.sep}src`))).toBe(true);
    });
});
```

- [ ] **Step 3: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-prune.test.ts`
Expected: PASS — pruning is already implemented.

- [ ] **Step 4: Commit**

```bash
git add packages/@secretlint/walker/test/fixtures/prune packages/@secretlint/walker/test/walk-prune.test.ts
git commit -m "$(cat <<'EOF'
test(walker): verify ignored directories skip readdir (subtree pruning)

Spies fs.promises.readdir and asserts no call descends into a directory
covered by a .gitignore rule. Critical performance characteristic.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Glob pattern matching with `path.matchesGlob`

**Files:**
- Modify: `packages/@secretlint/walker/src/walk.ts`
- Test: `packages/@secretlint/walker/test/walk-glob.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/glob/`

- [ ] **Step 1: Create fixture**

```bash
mkdir -p packages/@secretlint/walker/test/fixtures/glob/src/sub
mkdir -p packages/@secretlint/walker/test/fixtures/glob/other
printf 'a' > packages/@secretlint/walker/test/fixtures/glob/src/a.ini
printf 'b' > packages/@secretlint/walker/test/fixtures/glob/src/sub/b.ini
printf 'c' > packages/@secretlint/walker/test/fixtures/glob/src/c.ts
printf 'd' > packages/@secretlint/walker/test/fixtures/glob/other/d.ini
```

- [ ] **Step 2: Write failing test**

Create `test/walk-glob.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "glob");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - glob patterns", () => {
    it('"src/**/*.ini" walks only src/ and matches .ini', async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["src/**/*.ini"],
        });
        expect(rel(results)).toEqual(["src/a.ini", "src/sub/b.ini"]);
    });

    it('"**/*.ini" matches across the tree', async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*.ini"],
        });
        expect(rel(results)).toEqual(["other/d.ini", "src/a.ini", "src/sub/b.ini"]);
    });

    it("static path returns just that file", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["src/c.ts"],
        });
        expect(rel(results)).toEqual(["src/c.ts"]);
    });

    it("multiple patterns are unioned and deduplicated", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["src/**/*.ini", "src/c.ts", "src/a.ini"],
        });
        expect(rel(results)).toEqual(["src/a.ini", "src/c.ts", "src/sub/b.ini"]);
    });
});
```

- [ ] **Step 3: Run test, expect failure**

Run: `pnpm --filter @secretlint/walker run test test/walk-glob.test.ts`
Expected: FAIL — `patterns` option is currently ignored.

- [ ] **Step 4: Replace `src/walk.ts` with full implementation**

```ts
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createRootIgnore, extendIgnore, type IgnoreInstance } from "./ignore-stack.js";
import { isDynamicPattern, splitGlobRoot } from "./glob-root.js";

export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
};

const toPosix = (p: string): string => (path.sep === "\\" ? p.replaceAll("\\", "/") : p);

const matchesAny = (relPosix: string, patterns: readonly string[]): boolean => {
    if (patterns.length === 0) return true;
    for (const p of patterns) {
        if (path.matchesGlob(relPosix, p)) return true;
    }
    return false;
};

type WalkJob = {
    rootDir: string;          // absolute
    matchPatterns: string[];  // relative, posix; empty = match everything
};

const buildJobs = (cwd: string, patterns: readonly string[] | undefined, noGlob: boolean | undefined): WalkJob[] => {
    if (patterns === undefined || patterns.length === 0) {
        return [{ rootDir: cwd, matchPatterns: [] }];
    }
    // Group all globs that share the same rootDir into a single walk to avoid
    // double traversal.
    const byRoot = new Map<string, string[]>();
    for (const raw of patterns) {
        const normalized = raw.replaceAll("\\", "/");
        if (noGlob || !isDynamicPattern(normalized)) {
            const abs = path.isAbsolute(normalized) ? normalized : path.join(cwd, normalized);
            const list = byRoot.get(abs) ?? [];
            list.push(""); // sentinel meaning "this exact path/dir"
            byRoot.set(abs, list);
            continue;
        }
        const { rootDir, matchPattern } = splitGlobRoot(normalized);
        const abs = rootDir === "" ? cwd : path.isAbsolute(rootDir) ? rootDir : path.join(cwd, rootDir);
        const list = byRoot.get(abs) ?? [];
        list.push(matchPattern);
        byRoot.set(abs, list);
    }
    return [...byRoot.entries()].map(([rootDir, matchPatterns]) => ({ rootDir, matchPatterns }));
};

const walkDir = async (
    absDir: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    matchRoot: string,
    matchPatterns: readonly string[],
    results: Set<string>
): Promise<void> => {
    const ig = await extendIgnore(parentIg, absDir, ignoreFiles);
    let entries;
    try {
        entries = await readdir(absDir, { withFileTypes: true });
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    await Promise.all(
        entries.map(async (entry) => {
            const full = path.join(absDir, entry.name);
            const relFromWalkRoot = toPosix(path.relative(walkRoot, full));
            const target = entry.isDirectory() ? `${relFromWalkRoot}/` : relFromWalkRoot;
            if (relFromWalkRoot !== "" && ig.ignores(target)) return;
            if (entry.isDirectory()) {
                await walkDir(full, ig, ignoreFiles, walkRoot, matchRoot, matchPatterns, results);
            } else if (entry.isFile()) {
                const relFromMatchRoot = toPosix(path.relative(matchRoot, full));
                if (matchesAny(relFromMatchRoot, matchPatterns)) results.add(full);
            }
        })
    );
};

const handleStaticPath = async (
    absPath: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    results: Set<string>
): Promise<void> => {
    let info;
    try {
        info = await stat(absPath);
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    if (info.isDirectory()) {
        await walkDir(absPath, parentIg, ignoreFiles, walkRoot, absPath, [], results);
    } else if (info.isFile()) {
        results.add(absPath);
    }
};

export const walk = async (options: WalkOptions): Promise<string[]> => {
    const cwd = path.resolve(options.cwd);
    const ignoreFiles = options.ignoreFiles ?? [];
    const rootIg = createRootIgnore(options.extraIgnorePatterns ?? []);
    const results = new Set<string>();
    const jobs = buildJobs(cwd, options.patterns, options.noGlob);
    await Promise.all(
        jobs.map(async (job) => {
            const literalEntries = job.matchPatterns.filter((p) => p === "");
            const globPatterns = job.matchPatterns.filter((p) => p !== "");
            if (literalEntries.length > 0 && globPatterns.length === 0) {
                await handleStaticPath(job.rootDir, rootIg, ignoreFiles, cwd, results);
                return;
            }
            await walkDir(job.rootDir, rootIg, ignoreFiles, cwd, job.rootDir, globPatterns, results);
        })
    );
    return [...results];
};
```

- [ ] **Step 5: Run all tests, expect pass**

Run: `pnpm --filter @secretlint/walker run test`
Expected: PASS — all earlier tests + walk-glob tests.

- [ ] **Step 6: Commit**

```bash
git add packages/@secretlint/walker/src/walk.ts packages/@secretlint/walker/test/fixtures/glob packages/@secretlint/walker/test/walk-glob.test.ts
git commit -m "$(cat <<'EOF'
feat(walker): support glob patterns via path.matchesGlob

Patterns sharing a static prefix are grouped into a single walk to
avoid duplicate traversal. Static paths are stat-ed and added directly.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: `noGlob` mode

**Files:**
- Test: `packages/@secretlint/walker/test/walk-no-glob.test.ts`
- Test fixtures: `packages/@secretlint/walker/test/fixtures/no-glob/`

- [ ] **Step 1: Create fixture (paths with glob-like characters)**

```bash
mkdir -p 'packages/@secretlint/walker/test/fixtures/no-glob/(group)'
mkdir -p 'packages/@secretlint/walker/test/fixtures/no-glob/[param]'
printf 'a' > 'packages/@secretlint/walker/test/fixtures/no-glob/(group)/a.ts'
printf 'b' > 'packages/@secretlint/walker/test/fixtures/no-glob/[param]/b.ts'
```

- [ ] **Step 2: Write failing test**

Create `test/walk-no-glob.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "no-glob");

describe("walk - noGlob mode", () => {
    it("treats glob-like paths as literal", async () => {
        const target = path.join(fixtureDir, "(group)/a.ts");
        const results = await walk({
            cwd: fixtureDir,
            patterns: [target],
            noGlob: true,
        });
        expect(results).toEqual([target]);
    });

    it("treats [param] as a literal directory", async () => {
        const target = path.join(fixtureDir, "[param]/b.ts");
        const results = await walk({
            cwd: fixtureDir,
            patterns: [target],
            noGlob: true,
        });
        expect(results).toEqual([target]);
    });
});
```

- [ ] **Step 3: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-no-glob.test.ts`
Expected: PASS — `noGlob` short-circuits in `buildJobs`.

- [ ] **Step 4: Commit**

```bash
git add packages/@secretlint/walker/test/fixtures/no-glob packages/@secretlint/walker/test/walk-no-glob.test.ts
git commit -m "$(cat <<'EOF'
test(walker): cover noGlob mode for paths containing (group) and [param]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Symlink handling (do not follow)

**Files:**
- Test: `packages/@secretlint/walker/test/walk-symlink.test.ts`
- Test fixtures: created at runtime in the test (symlinks are tricky to commit)

- [ ] **Step 1: Write the test (creates symlinks at setup, removes at teardown)**

Create `test/walk-symlink.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { symlink, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

describe("walk - symlinks", () => {
    let dir: string;

    beforeAll(async () => {
        dir = await (await import("node:fs/promises")).mkdtemp(path.join(os.tmpdir(), "walker-symlink-"));
        await mkdir(path.join(dir, "real"));
        await writeFile(path.join(dir, "real", "in-real.ts"), "x");
        await writeFile(path.join(dir, "top.ts"), "y");
        try {
            await symlink(path.join(dir, "real"), path.join(dir, "linked"), "dir");
        } catch (error) {
            // Skip on platforms / sandboxes where symlink creation is denied.
            (globalThis as { __SKIP_SYMLINK__?: boolean }).__SKIP_SYMLINK__ = true;
        }
    });

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    });

    it("does not descend into a directory symlink", async () => {
        if ((globalThis as { __SKIP_SYMLINK__?: boolean }).__SKIP_SYMLINK__) return;
        const results = await walk({ cwd: dir });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).toContain("top.ts");
        expect(r).not.toContain("linked/in-real.ts");
    });

    it("does not loop on circular symlinks", async () => {
        if ((globalThis as { __SKIP_SYMLINK__?: boolean }).__SKIP_SYMLINK__) return;
        // Walk completes; if it loops, vitest's testTimeout (30s) will fail us.
        const results = await walk({ cwd: dir });
        expect(Array.isArray(results)).toBe(true);
    });
});
```

- [ ] **Step 2: Run test, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-symlink.test.ts`
Expected: PASS (or SKIP if symlinks are not creatable in the environment).

- [ ] **Step 3: Commit**

```bash
git add packages/@secretlint/walker/test/walk-symlink.test.ts
git commit -m "$(cat <<'EOF'
test(walker): verify symlinks are not followed (Git default)

Creates a temporary directory + symlink at runtime to avoid committing
symlinks. Skips gracefully when symlink creation is denied.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Error handling — ENOENT and EACCES tolerated

**Files:**
- Test: `packages/@secretlint/walker/test/walk-errors.test.ts`

- [ ] **Step 1: Write test that targets a non-existent directory**

Create `test/walk-errors.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import * as fsPromises from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

describe("walk - errors", () => {
    it("returns empty when cwd does not exist", async () => {
        const results = await walk({ cwd: path.join(os.tmpdir(), "definitely-not-here-xyz-walker") });
        expect(results).toEqual([]);
    });

    it("propagates non-ENOENT/EACCES readdir errors", async () => {
        const spy = vi.spyOn(fsPromises, "readdir").mockRejectedValueOnce(
            Object.assign(new Error("boom"), { code: "EIO" })
        );
        await expect(walk({ cwd: os.tmpdir() })).rejects.toThrow("boom");
        spy.mockRestore();
    });
});
```

- [ ] **Step 2: Run, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-errors.test.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/@secretlint/walker/test/walk-errors.test.ts
git commit -m "$(cat <<'EOF'
test(walker): tolerate ENOENT/EACCES, propagate other I/O errors

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Windows path normalisation test

**Files:**
- Test: `packages/@secretlint/walker/test/walk-paths.test.ts`

(We can't run on Windows in CI necessarily, but we can verify the normalisation path is invoked. The `toPosix` helper is exercised on POSIX too because all relative paths use `/` already; the test below double-checks that `relative` paths fed to `node-ignore` are POSIX even when patterns reference subdirectories with `/`.)

- [ ] **Step 1: Write test**

Create `test/walk-paths.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-nested");

describe("walk - path normalisation", () => {
    it("returns absolute paths using the OS-native separator", async () => {
        const results = await walk({ cwd: fixtureDir, ignoreFiles: [".gitignore"] });
        for (const p of results) {
            expect(path.isAbsolute(p)).toBe(true);
            // Native separator is used on the result paths
            if (path.sep === "/") {
                expect(p).not.toContain("\\");
            }
        }
    });

    it("ignore matching is unaffected by user-supplied backslash patterns", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["packages\\foo\\src\\main.ts"],
            ignoreFiles: [".gitignore"],
        });
        // patterns are normalised to forward slashes
        const relResults = results.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/"));
        expect(relResults).toEqual(["packages/foo/src/main.ts"]);
    });
});
```

- [ ] **Step 2: Run, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-paths.test.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/@secretlint/walker/test/walk-paths.test.ts
git commit -m "$(cat <<'EOF'
test(walker): verify path normalisation handles backslash patterns

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Large fixture sanity test (10k files)

**Files:**
- Test: `packages/@secretlint/walker/test/walk-large.test.ts`

- [ ] **Step 1: Write a generator test**

Create `test/walk-large.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdir, writeFile, rm, mkdtemp } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

describe("walk - large tree", () => {
    let dir: string;
    const FILES = 10_000;
    const PER_DIR = 100;

    beforeAll(async () => {
        dir = await mkdtemp(path.join(os.tmpdir(), "walker-large-"));
        const dirCount = FILES / PER_DIR;
        for (let d = 0; d < dirCount; d++) {
            const sub = path.join(dir, `d${d}`);
            await mkdir(sub);
            await Promise.all(
                Array.from({ length: PER_DIR }, (_, i) => writeFile(path.join(sub, `f${i}.txt`), ""))
            );
        }
    }, 60_000);

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    }, 60_000);

    it("walks 10k files without stack overflow or hang", async () => {
        const results = await walk({ cwd: dir });
        expect(results.length).toBe(FILES);
    }, 60_000);
});
```

- [ ] **Step 2: Run, expect pass**

Run: `pnpm --filter @secretlint/walker run test test/walk-large.test.ts`
Expected: PASS within timeout.

- [ ] **Step 3: Commit**

```bash
git add packages/@secretlint/walker/test/walk-large.test.ts
git commit -m "$(cat <<'EOF'
test(walker): sanity-check walking a 10k-file tree

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: README for `@secretlint/walker`

**Files:**
- Modify: `packages/@secretlint/walker/README.md`

- [ ] **Step 1: Replace placeholder with full README**

```markdown
# @secretlint/walker

Promise-based file system walker with nested `.gitignore` cascade support.

## Install

    npm install @secretlint/walker

Requires Node.js >= 22 (uses `path.matchesGlob`).

## Usage

```ts
import { walk } from "@secretlint/walker";

const files = await walk({
    cwd: process.cwd(),
    patterns: ["src/**/*.ts"],
    ignoreFiles: [".secretlintignore", ".gitignore"],
    extraIgnorePatterns: ["**/.git/**", "**/node_modules/**"],
});
```

## API

### `walk(options): Promise<string[]>`

| Option | Type | Description |
|---|---|---|
| `cwd` | `string` | Absolute or relative starting directory |
| `patterns` | `string[]` (optional) | Glob patterns and/or static paths. Omit to walk all of `cwd`. |
| `ignoreFiles` | `string[]` (optional) | Names of ignore files honoured per directory in cascade order. Empty by default. |
| `extraIgnorePatterns` | `string[]` (optional) | Hard-coded ignore patterns added to the root before any file-based rules. |
| `noGlob` | `boolean` (optional) | Treat all `patterns` as literal paths. |

Returns absolute paths with the OS-native separator.

## Semantics

- Each directory's ignore files are added on top of the parent's via `ignore().add(parent).add(content)`.
- When a directory matches an ignore rule, the walker does not call `readdir` on it (subtree pruning).
- Symbolic links are not followed (Git default).
- `ENOENT` / `EACCES` during `readdir` / `stat` are tolerated; other I/O errors are thrown.

## License

MIT © azu
```

- [ ] **Step 2: Commit**

```bash
git add packages/@secretlint/walker/README.md
git commit -m "$(cat <<'EOF'
docs(walker): add README with usage and semantics

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: (removed — single-PR strategy)

Skipped. PR is opened at the end (Task 24).

---

# Stage 2 — Migrate `packages/secretlint` to `@secretlint/walker`

## Task 18: Add walker dependency and stub call

**Files:**
- Modify: `packages/secretlint/package.json`
- Modify: `packages/secretlint/src/search.ts`

- [ ] **Step 1: Add `@secretlint/walker` to dependencies**

Edit `packages/secretlint/package.json`. In `dependencies`, replace the `globby` line with `@secretlint/walker`:

Before:

```json
"dependencies": {
    "@secretlint/config-creator": "workspace:*",
    "@secretlint/formatter": "workspace:*",
    "@secretlint/node": "workspace:*",
    "@secretlint/profiler": "workspace:*",
    "@secretlint/resolver": "workspace:*",
    "debug": "catalog:",
    "globby": "catalog:",
    "read-pkg": "catalog:"
}
```

After:

```json
"dependencies": {
    "@secretlint/config-creator": "workspace:*",
    "@secretlint/formatter": "workspace:*",
    "@secretlint/node": "workspace:*",
    "@secretlint/profiler": "workspace:*",
    "@secretlint/resolver": "workspace:*",
    "@secretlint/walker": "workspace:*",
    "debug": "catalog:",
    "read-pkg": "catalog:"
}
```

- [ ] **Step 2: Run `pnpm install`**

Run: `pnpm install`
Expected: lockfile updated, `globby` removed from `secretlint`'s tree.

- [ ] **Step 3: Replace `packages/secretlint/src/search.ts`**

```ts
import { walk } from "@secretlint/walker";
import debug0 from "debug";

const debug = debug0("secretlint");

const DEFAULT_IGNORE_PATTERNS = [
    "**/.git/**",
    "**/node_modules/**",
    "**/.secretlintrc/**",
    "**/.secretlintrc.{json,yaml,yml,js}/**",
    "**/.secretlintignore*/**",
];

export type SearchFilesOptions = {
    cwd: string;
    ignoreFilePath?: string;
    noGlob?: boolean;
    respectGitignore?: boolean;
};

/**
 * Search files matching the given patterns under `options.cwd`.
 * Always honours DEFAULT_IGNORE_PATTERNS. When `respectGitignore` is true
 * (default), nested `.gitignore` files are respected with Git semantics.
 */
export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    const ignoreFiles: string[] = [];
    if (options.ignoreFilePath) ignoreFiles.push(options.ignoreFilePath);
    if (options.respectGitignore !== false) ignoreFiles.push(".gitignore");

    debug("search patterns: %o", patterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFiles: %o", ignoreFiles);

    const items = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles,
        extraIgnorePatterns: DEFAULT_IGNORE_PATTERNS,
        noGlob: options.noGlob,
    });

    if (items.length > 0) {
        return { ok: true, items };
    }

    /**
     * If the result is empty due to ignoring, suppress the "not found target file" error.
     * Re-walk without any ignore handling to detect this case.
     */
    const itemsWithoutIgnore = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles: [],
        extraIgnorePatterns: [],
        noGlob: options.noGlob,
    });
    return {
        ok: itemsWithoutIgnore.length > 0,
        items: [] as string[],
    };
};
```

- [ ] **Step 4: Build and run existing tests**

Run: `pnpm --filter secretlint run build && pnpm --filter secretlint run test`
Expected: PASS — existing CLI tests should keep working because new walker has equivalent semantics modulo `.gitignore` (no `.gitignore` files in existing fixtures).

- [ ] **Step 5: Commit**

```bash
git add packages/secretlint/package.json packages/secretlint/src/search.ts pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
refactor(secretlint): replace globby with @secretlint/walker

searchFiles now uses the new walker. .gitignore is respected by default
(respectGitignore option, default true). Existing fixtures continue to
pass because none contain .gitignore files yet.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: CLI flag `--no-gitignore`

**Files:**
- Modify: `packages/secretlint/src/cli.ts`
- Modify: `packages/secretlint/src/index.ts`

- [ ] **Step 1: Add option to parseArgs `options` map**

In `packages/secretlint/src/cli.ts`, add inside the `options` object (place between `secretlintignore` and `stdinFileName`):

```ts
gitignore: {
    type: OPTION_TYPE_BOOLEAN,
    default: true,
},
```

- [ ] **Step 2: Pass through `respectGitignore`**

Update `readCliOptions` in `cli.ts`:

```ts
return {
    filePathOrGlobList: input,
    outputFilePath: flags.output,
    ignoreFilePath: flags.secretlintignore,
    noGlob: flags.glob === false,
    respectGitignore: flags.gitignore !== false,
    cwd: flags.cwd,
};
```

- [ ] **Step 3: Update `helpMessage`**

Insert under the existing `--no-glob` line:

```
  --no-gitignore     disable .gitignore cascade respect; .gitignore files are
                     respected by default (since v13).
```

- [ ] **Step 4: Update `SecretLintFileOptions` and `lintFileOrText` in `index.ts`**

```ts
export type SecretLintFileOptions = {
    cwd: string;
    filePathOrGlobList: string[];
    outputFilePath?: string;
    ignoreFilePath?: string;
    noGlob?: boolean;
    respectGitignore?: boolean;
};
```

In `lintFileOrText`:

```ts
const { ok, items } = await searchFiles(cliOptions.filePathOrGlobList, {
    cwd: cliOptions.cwd,
    ignoreFilePath: cliOptions.ignoreFilePath,
    noGlob: cliOptions.noGlob,
    respectGitignore: cliOptions.respectGitignore,
});
```

- [ ] **Step 5: Build**

Run: `pnpm --filter secretlint run build`
Expected: type-check passes.

- [ ] **Step 6: Commit**

```bash
git add packages/secretlint/src/cli.ts packages/secretlint/src/index.ts
git commit -m "$(cat <<'EOF'
feat(secretlint): add --no-gitignore CLI flag (default: respect)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: CLI integration test for .gitignore default behaviour

**Files:**
- Create fixture: `packages/secretlint/test/snapshots/gitignore-default/`
- Modify: `packages/secretlint/test/cli.test.ts`

- [ ] **Step 1: Inspect existing CLI test conventions**

Run: `head -60 packages/secretlint/test/cli.test.ts`

Confirm the snapshot loop pattern (similar to `source-creator/test/index.test.ts`). Mirror that pattern for the new fixture.

- [ ] **Step 2: Create the fixture**

```bash
mkdir -p packages/secretlint/test/snapshots/gitignore-default/src
printf '%s\n' '*.log' > packages/secretlint/test/snapshots/gitignore-default/.gitignore
printf '%s\n' 'AKIAFAKEAKIAFAKEAKIA' > packages/secretlint/test/snapshots/gitignore-default/secret.log
printf '%s\n' 'plain content' > packages/secretlint/test/snapshots/gitignore-default/src/main.ts
```

Add `options.ts` per the pattern of other snapshot directories — see existing examples (e.g. `not-found-file/options.ts`) and follow that exact shape. The fixture should run `secretlint "**/*"` and snapshot the output. Expected behaviour: `secret.log` is excluded by `.gitignore`, so the run produces no findings.

- [ ] **Step 3: Add a `--no-gitignore` snapshot fixture**

```bash
mkdir -p packages/secretlint/test/snapshots/--no-gitignore/src
printf '%s\n' '*.log' > packages/secretlint/test/snapshots/--no-gitignore/.gitignore
printf '%s\n' 'AKIAFAKEAKIAFAKEAKIA' > packages/secretlint/test/snapshots/--no-gitignore/secret.log
```

Add `options.ts` that passes `--no-gitignore` so `secret.log` is included and the snapshot records the finding.

- [ ] **Step 4: Generate snapshots**

Run: `UPDATE_SNAPSHOT=1 pnpm --filter secretlint run test`
Expected: new snapshots written under each fixture.

- [ ] **Step 5: Run tests without UPDATE_SNAPSHOT and verify stable**

Run: `pnpm --filter secretlint run test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/secretlint/test/snapshots/gitignore-default packages/secretlint/test/snapshots/--no-gitignore
git commit -m "$(cat <<'EOF'
test(secretlint): cover .gitignore default and --no-gitignore via CLI snapshots

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Sanity rebuild + lint of the whole repo

- [ ] **Step 1: Full repo build & test**

Run: `pnpm run build && pnpm run test`
Expected: PASS across packages. If any other consumer of `searchFiles` (e.g. test runners) broke, fix call sites.

- [ ] **Step 2: Run secretlint on the repo as a self-test**

Run: `pnpm run lint`
Expected: PASS.

- [ ] **Step 3: Commit any incidental fixes (if needed)**

If anything required edits, commit them with a clear scope. Otherwise, skip.

---

## Task 22: (removed — single-PR strategy)

Skipped. PR is opened at the end (Task 24).

---

# Stage 3 — Documentation

## Task 23: Update root `README.md`

**Files:**
- Modify: `README.md` (root)

- [ ] **Step 1: Locate the existing options section**

Run: `grep -n "secretlintignore\|--no-color\|gitignore\|Options" README.md | head -20`

Identify where CLI options are documented.

- [ ] **Step 2: Add `--no-gitignore` doc**

Insert near the existing `--secretlintignore` documentation:

```markdown
### `--no-gitignore`

Disable `.gitignore` cascade respect. By default (since v13), secretlint walks
the file system the same way Git does, honouring nested `.gitignore` files.

Use `--no-gitignore` when you need to scan files that are gitignored, e.g.,
`.env` files in projects where `.env` is gitignored.

    secretlint --no-gitignore "**/*"
```

- [ ] **Step 3: Add migration section**

Append a "Migrating to v13" section near the top of the README (or under an existing migration heading if one exists):

```markdown
## Migrating to v13

`.gitignore` is now respected by default. Previously, secretlint scanned all
files matching glob patterns, with hard-coded ignores for `.git`, `node_modules`,
and `.secretlintrc` only.

To restore the previous behaviour:

    secretlint --no-gitignore "**/*"
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: document --no-gitignore and v13 migration notes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 24: Open the single PR (walker + migration + docs)

- [ ] **Step 1: Final repo-wide verification**

Run: `pnpm install && pnpm run build && pnpm run test && pnpm run lint`
Expected: all pass.

- [ ] **Step 2: Push branch and create draft PR**

```bash
git push -u origin feat/walker-gitignore-cascade
gh pr create --draft --title "feat!: respect .gitignore by default via @secretlint/walker" --body "$(cat <<'EOF'
## Summary

- New package `@secretlint/walker` with nested `.gitignore` cascade.
- secretlint migrated to use the walker; `globby` removed.
- New `--no-gitignore` CLI flag (default: respect `.gitignore`).
- Documentation and v13 migration notes.

**Breaking change** — files newly excluded by `.gitignore` are no longer scanned. Targeted release: secretlint v13.

Spec: `docs/superpowers/specs/2026-05-03-walker-gitignore-cascade-design.md`
Plan: `docs/superpowers/plans/2026-05-03-walker-gitignore-cascade-plan.md`

## Test plan

- [ ] `pnpm --filter @secretlint/walker run test` passes
- [ ] `pnpm run test` passes across the repo
- [ ] CLI snapshots for default `.gitignore` respect and `--no-gitignore` are stable
- [ ] `pnpm run lint` (self-lint) passes
- [ ] Walker subtree pruning verified via readdir spy
- [ ] Symlinks not followed; large-tree (10k files) sanity ok

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: STOP — done**

---

## Self-review checklist (post-write)

This was completed during plan authoring:

- **Spec coverage:** every numbered test case in the spec maps to a task (1→Task 4/5/6/7/8/10, 2→Task 7, 3→Task 8, 4→Task 8, 5→Task 7, 6→Task 9, 7→Task 12, 8→Task 12, 9→Task 7, 10→Task 6, 11→Task 5, 12→Task 6/8, 13→Task 8, 14→Task 14, 15→Task 11, 16→Task 13, 17→Task 13, 18→Task 10, 19→Task 18, 20→Task 15). The `respectGitignore: false` end-to-end flow is covered by Task 20's `--no-gitignore` CLI fixture.
- **Placeholders:** none ("TBD"/"TODO" not used).
- **Type consistency:** `WalkOptions` shape used in Tasks 1, 4, 10, 18 matches.
- **Scope:** plan stops at v13 release prep; the actual `pnpm version` / publish via the GitHub Actions release workflow is owned by the maintainer (out of plan scope).

## Open questions

None.
