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
const run = (command, args, { cwd, capture = false, env, shell = false } = {}) => {
    const result = spawnSync(command, args, {
        cwd,
        shell,
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

/**
 * Run pnpm with fixed arguments.
 * On Windows, pnpm is usually a .cmd file, and Node.js runs a .cmd file only through a shell.
 * The arguments are fixed strings, so the shell does not see any input of the user.
 */
const pnpm = (description, args, cwd) =>
    runOrFail(description, "pnpm", args, { cwd, shell: process.platform === "win32" });

const buildRepository = (description, dir) => {
    log(`building the ${description} in ${dir}`);
    pnpm(`pnpm install of the ${description}`, ["install", "--frozen-lockfile"], dir);
    pnpm(`pnpm run build of the ${description}`, ["run", "build"], dir);
};

/**
 * Prepare an entry of the cache while no other comparison prepares the same entry.
 * The lock is a directory, because making a directory is atomic.
 * The script never removes a lock that it did not make, so two comparisons never prepare the same entry.
 * A lock left by a comparison that was killed is removed by the user.
 */
const withCacheLock = (dir, prepare) => {
    const lockDir = `${dir}.lock`;
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    try {
        fs.mkdirSync(lockDir);
    } catch (error) {
        if (error.code !== "EEXIST") {
            throw error;
        }
        const pidFile = path.join(lockDir, "pid");
        const pid = fs.existsSync(pidFile) ? fs.readFileSync(pidFile, "utf8").trim() : "unknown";
        throw new CompareError(
            [
                `Another comparison (process ${pid}) is preparing ${dir}.`,
                "Run again after it ends.",
                `If no comparison is running, a comparison was stopped while it prepared the entry: remove ${lockDir} and run again.`
            ].join(" ")
        );
    }
    try {
        fs.writeFileSync(path.join(lockDir, "pid"), String(process.pid));
        return prepare();
    } finally {
        fs.rmSync(lockDir, { recursive: true, force: true });
    }
};

const prepareBase = (base, cacheDir) => {
    const dir = path.join(cacheDir, "builds", base.commit);
    const marker = `${dir}.built`;
    const isReady = () => fs.existsSync(marker) && fs.existsSync(dir);
    if (isReady()) {
        log(`using the base build in ${dir}`);
        return dir;
    }
    withCacheLock(dir, () => {
        // check again: another comparison may have built it before this one got the lock
        if (isReady()) {
            return;
        }
        fs.rmSync(marker, { force: true });
        if (fs.existsSync(dir)) {
            tryGit(["worktree", "remove", "--force", dir]);
            fs.rmSync(dir, { recursive: true, force: true });
        }
        tryGit(["worktree", "prune"]);
        git(["worktree", "add", "--detach", dir, base.commit]);
        buildRepository(`base (${base.commit.slice(0, 7)})`, dir);
        fs.writeFileSync(marker, "");
    });
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
    const isReady = () => fs.existsSync(marker) && fs.existsSync(dir);
    if (!isReady()) {
        withCacheLock(dir, () => {
            // check again: another comparison may have downloaded it before this one got the lock
            if (isReady()) {
                return;
            }
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
        });
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
        profiles: { base: base.profile, head: head.profile },
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

/**
 * The profile as `secretlint --profile` prints it, formatted by the formatter of the head.
 * The times of the profile come from one run; the run time above is the measured one.
 */
const sumOf = (items, key) => items.reduce((sum, item) => sum + item[key], 0);

const formatChange = (base, head) => {
    const change = head - base;
    return change === 0 ? "±0" : `${change > 0 ? "+" : ""}${formatCount(change)}`;
};

const markText = (mark) => (mark === "slower" ? " ⚠️ slower" : mark === "faster" ? " faster" : "");

/**
 * One line that says what changed, so a reader does not have to read the tables.
 */
const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

const verdictOf = (result) => {
    const changes = [];
    const { added, removed } = result.findings;
    if (added.length > 0 || removed.length > 0) {
        changes.push(`findings (+${added.length} / -${removed.length})`);
    }
    if (result.patterns.length > 0) {
        changes.push(`pattern work of ${plural(result.patterns.length, "pattern")}`);
    }
    if (result.rules.length > 0) {
        changes.push(`files of ${plural(result.rules.length, "rule")}`);
    }
    if (result.keywordGuards.length > 0) {
        changes.push(plural(result.keywordGuards.length, "keyword guard"));
    }
    if (result.time?.mark === "slower") {
        changes.push(`run time (${result.time.ratio.toFixed(2)}x)`);
    }
    if (changes.length === 0) {
        const time = result.time ? `, run time ${result.time.ratio.toFixed(2)}x` : "";
        return `✅ No change in findings and pattern work${time}.`;
    }
    return `⚠️ Changed: ${changes.join(", ")}.`;
};

const markdownSummaryTable = (result) => {
    const { base, head } = result.profiles;
    const rows = [];
    if (result.time) {
        const { base: baseTime, head: headTime, ratio, mark } = result.time;
        rows.push(
            `| Run time (median of ${headTime.runs} runs) | ${formatMs(baseTime.median)} | ${formatMs(headTime.median)} | **${ratio.toFixed(2)}x**${markText(mark)} |`
        );
    } else {
        rows.push("| Run time | - | - | not measured (hyperfine is not installed) |");
    }
    const countRow = (title, baseValue, headValue) =>
        `| ${title} | ${formatCount(baseValue)} | ${formatCount(headValue)} | ${formatChange(baseValue, headValue)} |`;
    rows.push(
        countRow("Findings", result.findings.base, result.findings.head),
        countRow("Files", base.files, head.files),
        countRow("Pattern runs", sumOf(base.patterns, "runs"), sumOf(head.patterns, "runs")),
        countRow("Pattern matches", sumOf(base.patterns, "matches"), sumOf(head.patterns, "matches")),
        countRow(
            "Keywords found by a guard",
            sumOf(base.keywordGuards ?? [], "found"),
            sumOf(head.keywordGuards ?? [], "found")
        )
    );
    return ["| | Base | Head | Change |", "| --- | ---: | ---: | ---: |", ...rows, ""];
};

const markdownChanges = (result) => {
    const lines = [];
    if (result.patterns.length > 0) {
        const counts = (value) => (value ? `${formatCount(value.runs)} / ${formatCount(value.matches)}` : "-");
        lines.push(
            "**Patterns with a change** (runs / matches)",
            "",
            "| Pattern | Base | Head |",
            "| --- | ---: | ---: |",
            ...result.patterns.map(
                (pattern) => `| ${escapeCell(pattern.id)} | ${counts(pattern.base)} | ${counts(pattern.head)} |`
            ),
            ""
        );
    }
    if (result.rules.length > 0) {
        lines.push(
            "**Rules with a change** (files that the rule checked)",
            "",
            "| Rule | Base | Head |",
            "| --- | ---: | ---: |",
            ...result.rules.map(
                (rule) => `| ${escapeCell(rule.id)} | ${formatCount(rule.base)} | ${formatCount(rule.head)} |`
            ),
            ""
        );
    }
    if (result.keywordGuards.length > 0) {
        lines.push(
            "**Keyword guards with a change** (found / met the guard)",
            "",
            "| Keyword | Base | Head |",
            "| --- | ---: | ---: |",
            ...result.keywordGuards.map(
                (guard) => `| ${escapeCell(guard.id)} | ${guardCounts(guard.base)} | ${guardCounts(guard.head)} |`
            ),
            ""
        );
    }
    lines.push(...markdownFindings("Findings only in the head", result.findings.added));
    lines.push(...markdownFindings("Findings only in the base", result.findings.removed));
    return lines;
};

const TOP_PROFILE_ROWS = 10;
const DEFAULT_REPOSITORY_URL = "https://github.com/secretlint/secretlint";

/**
 * The URL of this repository: the repository of the workflow in CI, else secretlint/secretlint.
 * A commit of a pull request from a fork can be opened in the base repository too.
 */
const repositoryUrl = () =>
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
        : DEFAULT_REPOSITORY_URL;

const commitLink = (repository, commit) => `[\`${shortCommit(commit)}\`](${repository}/commit/${commit})`;

// a time of one run changes by a few milliseconds between runs, so a smaller change is not marked
const MIN_MARKED_CHANGE_MS = 5;

/**
 * The change of a time of one run: the ratio, with ⚠️ when the head is much slower.
 */
const timeChangeCell = (base, head) => {
    if (base === undefined) {
        return "new";
    }
    // the ratio of times under 1 ms is noise
    if (Math.max(base, head) < 1) {
        return "";
    }
    const ratio = head / base;
    const text = `${ratio.toFixed(2)}x`;
    return ratio >= SLOWER_RATIO && head - base >= MIN_MARKED_CHANGE_MS ? `**${text}** ⚠️` : text;
};

const timeCell = (value) => (value === undefined ? "-" : formatMs(value));
const countCell = (value) => (value === undefined ? "-" : formatCount(value));

/**
 * The top rows of the head, with the same rows of the base beside them.
 */
const topRowsOf = (baseItems, headItems, keyOf) => {
    const baseByKey = new Map(baseItems.map((item) => [keyOf(item), item]));
    return [...headItems]
        .sort((a, b) => b.duration - a.duration)
        .slice(0, TOP_PROFILE_ROWS)
        .map((head) => ({ head, base: baseByKey.get(keyOf(head)) }));
};

const topTitle = (title, shown, all) =>
    all > shown ? `${title} (top ${shown} of ${all} by the time of the head)` : title;

/**
 * The profile of the base and the head in one place: `secretlint --profile` of each build, side by side.
 * The times come from one profiled run of each build and are only for reading;
 * the run time of the summary is the measured one.
 */
const markdownProfile = (result, setDir) => {
    const { base, head } = result.profiles;
    const lines = [
        "<details open><summary><b>Profile</b> (<code>secretlint --profile</code>, one run of each build)</summary>",
        "",
        `Total: base ${formatMs(base.total)}, head ${formatMs(head.total)}. ⚠️ marks a time of the head that is ${SLOWER_RATIO}x or more and ${MIN_MARKED_CHANGE_MS} ms or more slower. A time of one run changes between runs, so check a mark with the run time above.`,
        ""
    ];
    const basePhases = new Map(base.phases.map((phase) => [`${phase.depth}:${phase.name}`, phase]));
    lines.push(
        "| Phase | Base | Head | Change | Count (base / head) |",
        "| --- | ---: | ---: | ---: | ---: |",
        ...head.phases.map((phase) => {
            const basePhase = basePhases.get(`${phase.depth}:${phase.name}`);
            const name = `${"&nbsp;&nbsp;".repeat(phase.depth)}${escapeCell(phase.name)}`;
            return `| ${name} | ${timeCell(basePhase?.duration)} | ${formatMs(phase.duration)} | ${timeChangeCell(basePhase?.duration, phase.duration)} | ${countCell(basePhase?.count)} / ${formatCount(phase.count)} |`;
        }),
        ""
    );
    const rules = topRowsOf(base.rules, head.rules, (rule) => rule.ruleId);
    if (rules.length > 0) {
        lines.push(
            `| ${topTitle("Rule", rules.length, head.rules.length)} | Base | Head | Change | Files (base / head) |`,
            "| --- | ---: | ---: | ---: | ---: |",
            ...rules.map(
                ({ base: baseRule, head: headRule }) =>
                    `| ${escapeCell(headRule.ruleId)} | ${timeCell(baseRule?.duration)} | ${formatMs(headRule.duration)} | ${timeChangeCell(baseRule?.duration, headRule.duration)} | ${countCell(baseRule?.files)} / ${formatCount(headRule.files)} |`
            ),
            ""
        );
    }
    const patternKey = (pattern) => `${pattern.ruleId}#${pattern.index}`;
    const patterns = topRowsOf(base.patterns, head.patterns, patternKey);
    if (patterns.length > 0) {
        lines.push(
            `| ${topTitle("Pattern", patterns.length, head.patterns.length)} | Base | Head | Change | Runs (base / head) | Matches (base / head) |`,
            "| --- | ---: | ---: | ---: | ---: | ---: |",
            ...patterns.map(
                ({ base: basePattern, head: headPattern }) =>
                    `| ${escapeCell(patternKey(headPattern))} | ${timeCell(basePattern?.duration)} | ${formatMs(headPattern.duration)} | ${timeChangeCell(basePattern?.duration, headPattern.duration)} | ${countCell(basePattern?.runs)} / ${formatCount(headPattern.runs)} | ${countCell(basePattern?.matches)} / ${formatCount(headPattern.matches)} |`
            ),
            ""
        );
    }
    const relative = (filePath) => path.relative(setDir, filePath).split(path.sep).join("/");
    // the base lists only its own slowest files, so the files are shown for the head only
    const files = head.slowestFiles.slice(0, TOP_PROFILE_ROWS);
    if (files.length > 0) {
        lines.push(
            `| ${files.length < head.files ? `Slowest files of the head (top ${files.length} of ${formatCount(head.files)})` : "Files of the head"} | Head |`,
            "| --- | ---: |",
            ...files.map((file) => `| ${escapeCell(relative(file.filePath))} | ${formatMs(file.duration)} |`),
            ""
        );
    }
    lines.push("</details>", "");
    return lines;
};

const markdownSet = (result, sets) => {
    const definition = sets.find((set) => set.name === result.name);
    const source = result.repository
        ? `${result.repository.replace("https://github.com/", "")} ${definition?.label ?? ""} (${commitLink(result.repository, result.commit)})`
        : "examples/benchmark/targets";
    return [
        `### ${result.name}: ${source}, ${formatCount(result.profiles.head.files)} files`,
        "",
        verdictOf(result),
        "",
        ...markdownSummaryTable(result),
        ...markdownChanges(result),
        ...markdownProfile(result, definition.dir)
    ];
};

const toMarkdown = (compareResult, sets) => {
    const repository = repositoryUrl();
    const head = `${commitLink(repository, compareResult.head.commit)}${compareResult.head.dirty ? " with uncommitted changes" : ""}`;
    return [
        "## Profile and benchmark: base vs head",
        "",
        `Base: ${escapeCell(compareResult.base.ref)} ${commitLink(repository, compareResult.base.commit)}, head: ${head}`,
        "",
        ...compareResult.sets.flatMap((result) => markdownSet(result, sets))
    ].join("\n");
};

const main = async () => {
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
    await main();
} catch (error) {
    process.stderr.write(`[compare] ${error instanceof CompareError ? error.message : error.stack}\n`);
    process.exit(2);
}
