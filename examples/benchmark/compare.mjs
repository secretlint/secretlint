#!/usr/bin/env node
// Compare two builds of Secretlint (base and head) on fixed sets of files.
// See docs/products/secretlint/features/change-comparison/
// This script uses only the built-in modules of Node.js, so it runs without installing a package.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const BENCHMARK_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(BENCHMARK_DIR, "../..");
const SET_NAMES = ["small", "medium", "large", "huge"];
const SMALL_RUNS = 10;
const SLOWER_RATIO = 1.3;
const FASTER_RATIO = 0.77;
const MAX_FINDING_ROWS = 50;

class CompareError extends Error {}

const log = (message) => {
    process.stderr.write(`[compare] ${message}\n`);
};

/**
 * Run a command. Its output goes to stderr, so stdout has only the Markdown of this script.
 */
const run = (command, args, { cwd, capture = false, env } = {}) => {
    const result = spawnSync(command, args, {
        cwd,
        env: env ? { ...process.env, ...env } : process.env,
        encoding: "utf8",
        maxBuffer: 1024 * 1024 * 1024,
        stdio: capture ? ["ignore", "pipe", "pipe"] : ["ignore", 2, 2]
    });
    if (result.error) {
        throw new CompareError(`${command} ${args.join(" ")}: ${result.error.message}`);
    }
    return result;
};

const runOrFail = (description, command, args, options) => {
    const result = run(command, args, options);
    if (result.status !== 0) {
        const detail = options?.capture ? `\n${result.stderr}` : "";
        throw new CompareError(`${description} failed (exit status ${result.status})${detail}`);
    }
    return result;
};

const git = (args, cwd = REPO_ROOT) => runOrFail(`git ${args[0]}`, "git", args, { cwd, capture: true }).stdout.trim();

const tryGit = (args, cwd = REPO_ROOT) => {
    const result = run("git", args, { cwd, capture: true });
    return result.status === 0 ? result.stdout.trim() : undefined;
};

const commandExists = (command) => {
    const result = spawnSync(command, ["--version"], { stdio: "ignore" });
    return !result.error && result.status === 0;
};

const parseOptions = () => {
    const { values } = parseArgs({
        options: {
            base: { type: "string" },
            set: { type: "string" },
            runs: { type: "string" },
            json: { type: "string", default: "compare-result.json" },
            "cache-dir": { type: "string" },
            "no-build": { type: "boolean", default: false },
            help: { type: "boolean", default: false }
        }
    });
    if (values.help) {
        process.stdout.write(
            [
                "Usage: pnpm run compare [options]",
                "",
                "  --base <ref>        base Git ref or commit (default: origin/master, else master)",
                `  --set <names>       sets separated by commas: ${SET_NAMES.join(",")} (default: all)`,
                "  --runs <n>          runs of each build for hyperfine (default: per set)",
                "  --json <path>       path of the JSON output (default: compare-result.json)",
                "  --cache-dir <dir>   where the base build and the sets are kept",
                "  --no-build          do not build the head",
                ""
            ].join("\n")
        );
        process.exit(0);
    }
    const sets = values.set ? values.set.split(",").map((name) => name.trim()) : SET_NAMES;
    for (const name of sets) {
        if (!SET_NAMES.includes(name)) {
            throw new CompareError(`Unknown set: ${name}. Sets: ${SET_NAMES.join(", ")}`);
        }
    }
    const runs = values.runs === undefined ? undefined : Number(values.runs);
    if (runs !== undefined && !(Number.isInteger(runs) && runs >= 2)) {
        throw new CompareError(`--runs must be an integer of 2 or more: ${values.runs}`);
    }
    const cacheDir =
        values["cache-dir"] ??
        path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache"), "secretlint-compare");
    return {
        base: values.base,
        sets,
        runs,
        jsonPath: path.resolve(values.json),
        cacheDir: path.resolve(cacheDir),
        build: !values["no-build"]
    };
};

const resolveBase = (ref) => {
    const candidates = ref ? [ref] : ["origin/master", "master"];
    for (const candidate of candidates) {
        const commit = tryGit(["rev-parse", "--verify", "--quiet", `${candidate}^{commit}`]);
        if (commit) {
            return { ref: candidate, commit };
        }
    }
    throw new CompareError(`Can not resolve the base: ${candidates.join(" or ")}`);
};

const buildRepository = (description, dir) => {
    log(`building the ${description} in ${dir}`);
    runOrFail(`pnpm install of the ${description}`, "pnpm", ["install", "--frozen-lockfile"], { cwd: dir });
    runOrFail(`pnpm run build of the ${description}`, "pnpm", ["run", "build"], { cwd: dir });
};

const prepareBase = (base, cacheDir) => {
    const dir = path.join(cacheDir, "builds", base.commit);
    const marker = `${dir}.built`;
    if (fs.existsSync(marker) && fs.existsSync(dir)) {
        log(`using the base build in ${dir}`);
        return dir;
    }
    fs.rmSync(marker, { force: true });
    if (fs.existsSync(dir)) {
        tryGit(["worktree", "remove", "--force", dir]);
        fs.rmSync(dir, { recursive: true, force: true });
    }
    tryGit(["worktree", "prune"]);
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    git(["worktree", "add", "--detach", dir, base.commit]);
    buildRepository(`base (${base.commit.slice(0, 7)})`, dir);
    fs.writeFileSync(marker, "");
    return dir;
};

const readSetDefinitions = () => JSON.parse(fs.readFileSync(path.join(BENCHMARK_DIR, "compare-sets.json"), "utf8"));

const prepareSet = (name, definitions, cacheDir) => {
    if (name === "small") {
        return { name, repository: null, commit: null, dir: path.join(BENCHMARK_DIR, "targets"), runs: SMALL_RUNS };
    }
    const definition = definitions[name];
    if (!definition) {
        throw new CompareError(`compare-sets.json has no set: ${name}`);
    }
    const dir = path.join(cacheDir, "sets", `${name}-${definition.commit}`);
    // the marker is outside the directory, so it is not linted
    const marker = `${dir}.ready`;
    if (!(fs.existsSync(marker) && fs.existsSync(dir))) {
        log(`downloading ${definition.repository} at ${definition.commit} (${definition.label})`);
        fs.rmSync(marker, { force: true });
        fs.rmSync(dir, { recursive: true, force: true });
        fs.mkdirSync(dir, { recursive: true });
        git(["init", "--quiet"], dir);
        runOrFail(
            `download of the set ${name}`,
            "git",
            ["fetch", "--quiet", "--depth", "1", "--no-tags", definition.repository, definition.commit],
            { cwd: dir }
        );
        git(["-c", "advice.detachedHead=false", "checkout", "--quiet", "FETCH_HEAD"], dir);
        fs.writeFileSync(marker, "");
    }
    return {
        name,
        repository: definition.repository,
        commit: definition.commit,
        dir,
        runs: definition.runs
    };
};

const secretlintBin = (buildDir) => path.join(buildDir, "packages/secretlint/bin/secretlint.js");
const configPath = () => path.join(BENCHMARK_DIR, ".secretlintrc.json");

/**
 * Lint the set once with --profile: stdout is the profile, and --output gets the lint results.
 */
const lintWithProfile = (buildName, buildDir, set, tmpDir) => {
    const resultsPath = path.join(tmpDir, `${set.name}-${buildName}-results.json`);
    log(`linting ${set.name} with the ${buildName}`);
    const result = run(
        process.execPath,
        [
            secretlintBin(buildDir),
            "**/*",
            "--secretlintrc",
            configPath(),
            "--profile",
            "--format",
            "json",
            "--output",
            resultsPath
        ],
        { cwd: set.dir, capture: true }
    );
    if (result.status !== 0 && result.status !== 1) {
        throw new CompareError(
            `The lint of the set ${set.name} with the ${buildName} failed (exit status ${result.status})\n${result.stderr}`
        );
    }
    let profile;
    let results;
    try {
        profile = JSON.parse(result.stdout);
        results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
    } catch (error) {
        throw new CompareError(`The ${buildName} did not write a profile and results as JSON: ${error.message}`);
    }
    return { profile, findings: toFindings(results, set.dir) };
};

/**
 * Only the rule id, the message id, the file, and the line: the message can contain the secret.
 */
const toFindings = (results, setDir) => {
    const findings = [];
    for (const result of results) {
        const file = path.relative(setDir, result.filePath).split(path.sep).join("/");
        for (const message of result.messages) {
            findings.push({
                ruleId: message.ruleId,
                messageId: message.messageId,
                file,
                line: message.loc?.start?.line ?? 0
            });
        }
    }
    return findings;
};

const shellQuote = (value) => `'${String(value).replaceAll("'", "'\\''")}'`;

const measureTime = (baseDir, headDir, set, runs, tmpDir) => {
    const timePath = path.join(tmpDir, `${set.name}-time.json`);
    const command = (buildDir) =>
        [
            process.execPath,
            secretlintBin(buildDir),
            "**/*",
            "--secretlintrc",
            configPath(),
            "--format",
            "json",
            "--output",
            os.devNull
        ]
            .map(shellQuote)
            .join(" ");
    log(`measuring ${set.name} with hyperfine (${runs} runs of each build)`);
    runOrFail(
        `hyperfine for the set ${set.name}`,
        "hyperfine",
        [
            "--ignore-failure",
            "--warmup",
            "1",
            "--runs",
            String(runs),
            "--style",
            "basic",
            "--export-json",
            timePath,
            "--command-name",
            "base",
            command(baseDir),
            "--command-name",
            "head",
            command(headDir)
        ],
        { cwd: set.dir }
    );
    const { results } = JSON.parse(fs.readFileSync(timePath, "utf8"));
    const stats = (entry) => ({
        median: entry.median * 1000,
        mean: entry.mean * 1000,
        stddev: (entry.stddev ?? 0) * 1000,
        runs: entry.times.length
    });
    const base = stats(results[0]);
    const head = stats(results[1]);
    const ratio = head.median / base.median;
    const mark = ratio >= SLOWER_RATIO ? "slower" : ratio <= FASTER_RATIO ? "faster" : null;
    return { base, head, ratio, mark };
};

const patternCounts = (profile) =>
    new Map(
        (profile.patterns ?? []).map((pattern) => [
            `${pattern.ruleId}#${pattern.index}`,
            {
                pattern: pattern.pattern,
                // Line tests are not compared: with worker threads, their number depends on
                // which thread reads which file, so it changes between runs of the same build
                counts: { runs: pattern.runs, matches: pattern.matches }
            }
        ])
    );

const sameJSON = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const diffPatterns = (baseProfile, headProfile) => {
    const base = patternCounts(baseProfile);
    const head = patternCounts(headProfile);
    const ids = [...new Set([...base.keys(), ...head.keys()])].sort();
    return ids.flatMap((id) => {
        const b = base.get(id);
        const h = head.get(id);
        if (b && h && sameJSON(b.counts, h.counts)) {
            return [];
        }
        return [{ id, pattern: (h ?? b).pattern, base: b?.counts ?? null, head: h?.counts ?? null }];
    });
};

const diffByKey = (baseItems, headItems, keyOf, valueOf) => {
    const base = new Map(baseItems.map((item) => [keyOf(item), valueOf(item)]));
    const head = new Map(headItems.map((item) => [keyOf(item), valueOf(item)]));
    const keys = [...new Set([...base.keys(), ...head.keys()])].sort();
    return keys.flatMap((key) => {
        const b = base.get(key) ?? null;
        const h = head.get(key) ?? null;
        return sameJSON(b, h) ? [] : [{ id: key, base: b, head: h }];
    });
};

const findingKey = (finding) => `${finding.ruleId}\0${finding.messageId}\0${finding.file}\0${finding.line}`;

const compareFinding = (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.ruleId.localeCompare(b.ruleId);

/**
 * Compare the findings as multisets
 */
const diffFindings = (baseFindings, headFindings) => {
    const counts = new Map();
    for (const finding of baseFindings) {
        const key = findingKey(finding);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const added = [];
    for (const finding of headFindings) {
        const key = findingKey(finding);
        const count = counts.get(key) ?? 0;
        if (count > 0) {
            counts.set(key, count - 1);
        } else {
            added.push(finding);
        }
    }
    const removed = [];
    const rest = new Map(counts);
    for (const finding of baseFindings) {
        const key = findingKey(finding);
        const count = rest.get(key) ?? 0;
        if (count > 0) {
            rest.set(key, count - 1);
            removed.push(finding);
        }
    }
    return {
        added: added.sort(compareFinding),
        removed: removed.sort(compareFinding),
        base: baseFindings.length,
        head: headFindings.length
    };
};

const compareSet = ({ set, baseDir, headDir, runs, hasHyperfine, tmpDir }) => {
    const base = lintWithProfile("base", baseDir, set, tmpDir);
    const head = lintWithProfile("head", headDir, set, tmpDir);
    return {
        name: set.name,
        repository: set.repository,
        commit: set.commit,
        files: { base: base.profile.files, head: head.profile.files },
        patterns: diffPatterns(base.profile, head.profile),
        rules: diffByKey(
            base.profile.rules ?? [],
            head.profile.rules ?? [],
            (rule) => rule.ruleId,
            (rule) => rule.files
        ),
        keywordGuards: diffByKey(
            base.profile.keywordGuards ?? [],
            head.profile.keywordGuards ?? [],
            (guard) => guard.keyword,
            (guard) => ({ found: guard.found, met: guard.met })
        ),
        findings: diffFindings(base.findings, head.findings),
        time: hasHyperfine ? measureTime(baseDir, headDir, set, runs ?? set.runs, tmpDir) : null
    };
};

// Markdown

const escapeCell = (value) =>
    String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("|", "\\|")
        .replaceAll("`", "'")
        .replace(/[\r\n]+/g, " ");

const formatCount = (value) => (value === null || value === undefined ? "-" : value.toLocaleString("en-US"));
const formatMs = (value) => `${value.toFixed(1)} ms`;
const shortCommit = (commit) => (commit ? commit.slice(0, 10) : "");

const markdownFindings = (title, findings) => {
    if (findings.length === 0) {
        return [];
    }
    const rows = findings.slice(0, MAX_FINDING_ROWS).map((finding) => {
        return `| ${escapeCell(finding.ruleId)} | ${escapeCell(finding.messageId)} | ${escapeCell(finding.file)}:${finding.line} |`;
    });
    const more =
        findings.length > MAX_FINDING_ROWS
            ? [`\n${findings.length - MAX_FINDING_ROWS} more rows are in the JSON.`]
            : [];
    return [
        `**${title}** (${findings.length})`,
        "",
        "| Rule | Message ID | Location |",
        "| --- | --- | --- |",
        ...rows,
        ...more,
        ""
    ];
};

const guardCounts = (value) => (value ? `${formatCount(value.found)} / ${formatCount(value.met)}` : "-");

const markdownSet = (result, sets) => {
    const definition = sets.find((set) => set.name === result.name);
    const source = result.repository
        ? `${result.repository.replace("https://github.com/", "")} ${definition?.label ?? ""} (${shortCommit(result.commit)})`
        : "examples/benchmark/targets";
    const lines = [`### ${result.name}: ${source}`, ""];
    lines.push(
        result.files.base === result.files.head
            ? `Files: ${formatCount(result.files.head)}`
            : `Files: base ${formatCount(result.files.base)}, head ${formatCount(result.files.head)}`,
        ""
    );
    if (result.time) {
        const { base, head, ratio, mark } = result.time;
        const markText = mark === "slower" ? " ⚠️ slower" : mark === "faster" ? " faster" : "";
        lines.push(
            `Run time (median of ${head.runs} runs): base ${formatMs(base.median)}, head ${formatMs(head.median)}, ratio **${ratio.toFixed(2)}**${markText}`,
            ""
        );
    } else {
        lines.push("Run time: not measured (hyperfine is not installed)", "");
    }
    if (result.patterns.length === 0) {
        lines.push("No change in pattern work.", "");
    } else {
        lines.push(
            "**Pattern work** (runs / matches)",
            "",
            "| Pattern | Base | Head |",
            "| --- | --- | --- |",
            ...result.patterns.map((pattern) => {
                const counts = (value) => (value ? `${formatCount(value.runs)} / ${formatCount(value.matches)}` : "-");
                return `| ${escapeCell(pattern.id)} | ${counts(pattern.base)} | ${counts(pattern.head)} |`;
            }),
            ""
        );
    }
    if (result.rules.length > 0) {
        lines.push(
            "**Files of each rule**",
            "",
            "| Rule | Base | Head |",
            "| --- | --- | --- |",
            ...result.rules.map(
                (rule) => `| ${escapeCell(rule.id)} | ${formatCount(rule.base)} | ${formatCount(rule.head)} |`
            ),
            ""
        );
    }
    if (result.keywordGuards.length > 0) {
        lines.push(
            "**Keywords with a guard** (found / met the guard)",
            "",
            "| Keyword | Base | Head |",
            "| --- | --- | --- |",
            ...result.keywordGuards.map(
                (guard) => `| ${escapeCell(guard.id)} | ${guardCounts(guard.base)} | ${guardCounts(guard.head)} |`
            ),
            ""
        );
    }
    const { added, removed } = result.findings;
    if (added.length === 0 && removed.length === 0) {
        lines.push(`No change in findings (${formatCount(result.findings.head)}).`, "");
    } else {
        lines.push(
            `Findings: base ${formatCount(result.findings.base)}, head ${formatCount(result.findings.head)}`,
            "",
            ...markdownFindings("Only in the head", added),
            ...markdownFindings("Only in the base", removed)
        );
    }
    return lines;
};

const toMarkdown = (compareResult, sets) => {
    const head = `${shortCommit(compareResult.head.commit)}${compareResult.head.dirty ? " with uncommitted changes" : ""}`;
    return [
        "## Secretlint change comparison",
        "",
        `Base: ${escapeCell(compareResult.base.ref)} (${shortCommit(compareResult.base.commit)}), head: ${head}`,
        "",
        ...compareResult.sets.flatMap((result) => markdownSet(result, sets))
    ].join("\n");
};

const main = () => {
    const options = parseOptions();
    const base = resolveBase(options.base);
    const head = { commit: git(["rev-parse", "HEAD"]), dirty: git(["status", "--porcelain"]) !== "" };
    const hasHyperfine = commandExists("hyperfine");
    if (!hasHyperfine) {
        log("hyperfine is not installed: the run time is not measured");
    }
    const definitions = readSetDefinitions();
    const sets = options.sets.map((name) => prepareSet(name, definitions, options.cacheDir));
    const baseDir = prepareBase(base, options.cacheDir);
    if (options.build) {
        buildRepository("head", REPO_ROOT);
    }
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-compare-"));
    try {
        const results = sets.map((set) =>
            compareSet({ set, baseDir, headDir: REPO_ROOT, runs: options.runs, hasHyperfine, tmpDir })
        );
        const compareResult = { base, head, sets: results };
        const setsWithLabel = sets.map((set) => ({ ...set, label: definitions[set.name]?.label }));
        fs.writeFileSync(options.jsonPath, `${JSON.stringify(compareResult, null, 2)}\n`);
        process.stdout.write(`${toMarkdown(compareResult, setsWithLabel)}\n`);
        log(`wrote ${options.jsonPath}`);
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
};

try {
    main();
} catch (error) {
    process.stderr.write(`[compare] ${error instanceof CompareError ? error.message : error.stack}\n`);
    process.exit(2);
}
