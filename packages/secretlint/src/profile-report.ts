import path from "node:path";
import { stripVTControlCharacters } from "node:util";
import type { SecretLintProfilerStat, SecretLintProfilerStatType } from "@secretlint/profiler";

export type SecretLintProfileReportPhase = {
    /**
     * The type of the profiler: `{package}>{what it does}`
     */
    name: string;
    /**
     * The depth in the phases: a phase runs in the nearest phase above it with a smaller depth
     */
    depth: number;
    /**
     * The total time in milliseconds
     */
    duration: number;
    /**
     * The percentage of the time of the CLI
     */
    percent: number;
    /**
     * How many times it ran
     */
    count: number;
};
export type SecretLintProfileReportRule = {
    ruleId: string;
    /**
     * The total time of the rule in milliseconds: the patterns of the rule, or the handler of the rule
     */
    duration: number;
    /**
     * The number of the files that the rule ran for
     */
    files: number;
};
export type SecretLintProfileReportPattern = {
    ruleId: string;
    /**
     * The index of the pattern in `patterns` of the rule
     */
    index: number;
    /**
     * The regular expression of the pattern
     */
    pattern: string;
    /**
     * `runDuration` + `lineTestDuration` in milliseconds
     */
    duration: number;
    /**
     * The total time of running the pattern and reporting the matches
     */
    runDuration: number;
    /**
     * How many times the pattern ran: for the content of a file, or for a line
     */
    runs: number;
    /**
     * The number of the matches
     */
    matches: number;
    /**
     * The total time of testing the lines that have a keyword of the pattern, before the pattern runs
     */
    lineTestDuration: number;
    /**
     * The number of the tested lines
     */
    lineTests: number;
};
export type SecretLintProfileReportFile = {
    filePath: string;
    /**
     * The time of the lint of the file in milliseconds. It does not include reading the file
     */
    duration: number;
};
/**
 * The summary of a run for `--profile`.
 * It is small for any number of files, so that a human or an AI agent can read all of it.
 */
export type SecretLintProfileReport = {
    /**
     * The time of the CLI in milliseconds
     */
    total: number;
    /**
     * The number of the linted files
     */
    files: number;
    phases: SecretLintProfileReportPhase[];
    /**
     * All rules that ran, in the order of the time
     */
    rules: SecretLintProfileReportRule[];
    /**
     * All patterns that ran, in the order of the time
     */
    patterns: SecretLintProfileReportPattern[];
    /**
     * The files that took the longest time to lint
     */
    slowestFiles: SecretLintProfileReportFile[];
};

/**
 * The phases in the order of the report, with the depth.
 * A type that is not here is not a phase: it is reported as a rule, a pattern, or a file.
 */
const PHASES: readonly (readonly [type: SecretLintProfilerStatType, depth: number])[] = [
    ["secretlint>cli", 0],
    ["@node>load-config", 1],
    ["@config-loader>load-config-file", 2],
    ["@config-loader>load-packages", 2],
    ["secretlint>search-files", 1],
    ["@node>execute", 1],
    ["@node>read-file", 2],
    ["@core>lint", 2],
    ["@core>setup-rules", 3],
    ["@core>keyword-scan", 3],
    ["@core>line-check", 3],
    ["@core>rule-handler", 3],
    ["@node>format", 2],
];
const SLOWEST_FILES_COUNT = 10;
const round = (ms: number): number => Math.round((ms + Number.EPSILON) * 100) / 100;
const byDuration = <T extends { duration: number }>(a: T, b: T): number => b.duration - a.duration;

/**
 * Create the report from the totals of the profiler
 */
export const createProfileReport = (stats: readonly SecretLintProfilerStat[]): SecretLintProfileReport => {
    const statsOfType = (type: SecretLintProfilerStatType): SecretLintProfilerStat[] => {
        return stats.filter((stat) => stat.type === type);
    };
    const totalOf = (type: SecretLintProfilerStatType): { duration: number; count: number } => {
        return statsOfType(type).reduce(
            (total, stat) => ({ duration: total.duration + stat.duration, count: total.count + stat.count }),
            { duration: 0, count: 0 },
        );
    };
    const total = totalOf("secretlint>cli").duration;
    const phases = PHASES.flatMap(([type, depth]): SecretLintProfileReportPhase[] => {
        const { duration, count } = totalOf(type);
        if (count === 0) {
            return [];
        }
        return [
            {
                name: type,
                depth,
                duration: round(duration),
                percent: total > 0 ? Math.round((duration / total) * 1000) / 10 : 0,
                count,
            },
        ];
    });
    const rules = statsOfType("@core>rule-handler")
        .map((stat): SecretLintProfileReportRule => {
            return { ruleId: stat.id ?? "", duration: round(stat.duration), files: stat.count };
        })
        .sort(byDuration);
    const patterns = new Map<string, SecretLintProfileReportPattern>();
    const patternOf = (id: string): SecretLintProfileReportPattern => {
        const existing = patterns.get(id);
        if (existing) {
            return existing;
        }
        // The id of a pattern is `{rule id}#{index} {pattern}`
        const matched = /^(.*?)#(\d+) (.*)$/s.exec(id);
        const pattern: SecretLintProfileReportPattern = {
            ruleId: matched?.[1] ?? id,
            index: Number(matched?.[2] ?? 0),
            pattern: matched?.[3] ?? "",
            duration: 0,
            runDuration: 0,
            runs: 0,
            matches: 0,
            lineTestDuration: 0,
            lineTests: 0,
        };
        patterns.set(id, pattern);
        return pattern;
    };
    for (const stat of stats) {
        if (stat.id === undefined) {
            continue;
        }
        if (stat.type === "@core>pattern") {
            const pattern = patternOf(stat.id);
            pattern.runDuration = stat.duration;
            pattern.runs = stat.count;
        } else if (stat.type === "@core>pattern-match") {
            patternOf(stat.id).matches = stat.count;
        } else if (stat.type === "@core>pattern-line-test") {
            const pattern = patternOf(stat.id);
            pattern.lineTestDuration = stat.duration;
            pattern.lineTests = stat.count;
        }
    }
    const sortedPatterns = [...patterns.values()]
        .map((pattern) => {
            return {
                ...pattern,
                duration: round(pattern.runDuration + pattern.lineTestDuration),
                runDuration: round(pattern.runDuration),
                lineTestDuration: round(pattern.lineTestDuration),
            };
        })
        .sort(byDuration);
    const files = statsOfType("@core>lint");
    const slowestFiles = files
        .map((stat): SecretLintProfileReportFile => ({ filePath: stat.id ?? "", duration: round(stat.duration) }))
        .sort(byDuration)
        .slice(0, SLOWEST_FILES_COUNT);
    return {
        total: round(total),
        files: files.length,
        phases,
        rules,
        patterns: sortedPatterns,
        slowestFiles,
    };
};

const TOP_COUNT = 10;
const MAX_PATTERN_LENGTH = 80;
type Column = { title: string; align: "left" | "right" };
/**
 * Remove terminal control sequences and control characters from a cell.
 * A file path and a pattern can have any character: for example, a file named with ESC sequences.
 * Printing them as-is lets the input rewrite the terminal output. A line break and a tab also break the table.
 */
const sanitizeCell = (text: string): string => {
    return stripVTControlCharacters(text).replace(/[\x00-\x1f\x7f-\x9f]/g, "");
};
const formatTable = (columns: readonly Column[], unsafeRows: readonly (readonly string[])[]): string[] => {
    const rows = unsafeRows.map((row) => row.map(sanitizeCell));
    const widths = columns.map((column, index) => {
        return Math.max(column.title.length, ...rows.map((row) => (row[index] as string).length));
    });
    const formatRow = (cells: readonly string[]): string => {
        return cells
            .map((cell, index) => {
                const width = widths[index] as number;
                const isLast = index === cells.length - 1;
                if ((columns[index] as Column).align === "right") {
                    return cell.padStart(width);
                }
                // do not pad the last column
                return isLast ? cell : cell.padEnd(width);
            })
            .join("  ");
    };
    return [formatRow(columns.map((column) => column.title)), ...rows.map(formatRow)];
};
/**
 * Replace `cwd` at the start of the file path with "<cwd>".
 * On Windows, the file path of a searched file uses "/" and `cwd` uses "\\", so compare them with "/".
 */
const replaceCwd = (filePath: string, cwd: string, separator: string): string => {
    const normalize = (text: string) => (separator === "\\" ? text.replaceAll("\\", "/") : text);
    // without the separator at the end, so that the next character of the file path is checked
    const normalizedCwd = normalize(cwd).replace(/\/+$/, "");
    const normalizedFilePath = normalize(filePath);
    if (normalizedCwd.length === 0 || !normalizedFilePath.startsWith(normalizedCwd)) {
        return filePath;
    }
    // "/cwd-backup/file" is not in "/cwd"
    const rest = filePath.slice(normalizedCwd.length);
    const isInCwd = rest.length === 0 || normalize(rest).startsWith("/");
    return isInCwd ? `<cwd>${rest}` : filePath;
};
const ms = (duration: number): string => duration.toFixed(2);
const topTitle = (title: string, shown: number, all: number): string => {
    return all > shown ? `${title} (top ${shown} of ${all})` : title;
};

/**
 * Format the report as text.
 * It shows the top of the rules, the patterns, and the files. `--format json` outputs all of them.
 */
export const formatProfileReport = (
    report: SecretLintProfileReport,
    options: {
        cwd: string;
        /**
         * The separator of the file paths of the platform. Default: `path.sep`
         */
        pathSeparator?: string;
    },
): string => {
    const pathSeparator = options.pathSeparator ?? path.sep;
    const lines: string[] = [];
    lines.push(`secretlint profile: ${ms(report.total)}ms, ${report.files} files`);
    lines.push("");
    lines.push(
        ...formatTable(
            [
                { title: "Phase", align: "left" },
                { title: "Time(ms)", align: "right" },
                { title: "%", align: "right" },
                { title: "Count", align: "right" },
            ],
            report.phases.map((phase) => [
                `${"  ".repeat(phase.depth)}${phase.name}`,
                ms(phase.duration),
                phase.percent.toFixed(1),
                String(phase.count),
            ]),
        ),
    );
    const rules = report.rules.slice(0, TOP_COUNT);
    if (rules.length > 0) {
        lines.push("");
        lines.push(
            ...formatTable(
                [
                    { title: "Time(ms)", align: "right" },
                    { title: "Files", align: "right" },
                    { title: topTitle("Rule", rules.length, report.rules.length), align: "left" },
                ],
                rules.map((rule) => [ms(rule.duration), String(rule.files), rule.ruleId]),
            ),
        );
    }
    const patterns = report.patterns.slice(0, TOP_COUNT);
    if (patterns.length > 0) {
        lines.push("");
        lines.push(
            ...formatTable(
                [
                    { title: "Time(ms)", align: "right" },
                    { title: "Run(ms)", align: "right" },
                    { title: "Runs", align: "right" },
                    { title: "Matches", align: "right" },
                    { title: "LineTest(ms)", align: "right" },
                    { title: "LineTests", align: "right" },
                    { title: topTitle("Pattern", patterns.length, report.patterns.length), align: "left" },
                ],
                patterns.map((pattern) => {
                    const source =
                        pattern.pattern.length > MAX_PATTERN_LENGTH
                            ? `${pattern.pattern.slice(0, MAX_PATTERN_LENGTH)}...`
                            : pattern.pattern;
                    return [
                        ms(pattern.duration),
                        ms(pattern.runDuration),
                        String(pattern.runs),
                        String(pattern.matches),
                        ms(pattern.lineTestDuration),
                        String(pattern.lineTests),
                        `${pattern.ruleId}#${pattern.index} ${source}`,
                    ];
                }),
            ),
        );
    }
    if (report.slowestFiles.length > 0) {
        lines.push("");
        lines.push(
            ...formatTable(
                [
                    { title: "Time(ms)", align: "right" },
                    { title: topTitle("File", report.slowestFiles.length, report.files), align: "left" },
                ],
                report.slowestFiles.map((file) => [
                    ms(file.duration),
                    replaceCwd(file.filePath, options.cwd, pathSeparator),
                ]),
            ),
        );
    }
    return lines.join("\n");
};
