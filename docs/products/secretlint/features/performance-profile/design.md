# Performance profile design

[日本語](design.ja.md)

## About this document

This document describes how the [Performance profile](requirements.md) of [Secretlint](../../product.md) is realized.

### Audience

People and agents who add a measured point, change the summary, or change code that runs for each file or each pattern.

### Prerequisites

The Requirements of this feature. The flow of a lint: the command searches files, the engine reads each file, and the core scans the content for the keywords of all rules and runs the patterns and the rules.

### Outside this document

How the keyword scan and the patterns work. How formatters output the lint results.

## Implementation approach

### One shared profiler that keeps totals

`@secretlint/profiler` exports one profiler instance, and every package records to it. The command, the engine, the configuration loader, and the core do not pass a profiler to each other.

The profiler keeps a total for each pair of a type and an id: the count, the total time, and the longest time. It does not keep each record.
A run records for each file and each run of a pattern, so keeping each record would grow with the number of files, and creating an object for each record would cost time that the profile would then show.

The profiler is disabled by default. The command enables it for `--profile`, and the engine enables it for `profile: true`.

### Two ways to record

- **A pair of marks** for a phase that runs once or a few times, such as loading the configuration. The code marks the start and the end with the type, and the profiler finds the start by the type and the id.
- **A start time and a record** for code that runs for each file or each pattern, or that can run again before it ends. The code reads the clock, does the work, and records the type, the id, and the start time. Each call has its own start time, so lints that overlap are all recorded.

### Cost when the profiler is disabled

Code that runs for each file or each pattern checks whether the profiler is enabled before it reads the clock or creates anything. The only cost of a disabled profiler there is this check of a boolean.
The id of a pattern is a string that is created once with the lint plan, not for each run.
A pair of marks is used only where it runs a few times in a run, because it creates an object for each mark.

When a change adds a measured point to code that runs for each file or each pattern, compare a run without `--profile` before and after the change, as the Requirements describe.

### What is measured

| Type | Id | Recorded by | Meaning |
| --- | --- | --- | --- |
| `secretlint>cli` | | command | The command |
| `secretlint>search-files` | | command | Search the files to lint |
| `@node>load-config` | | engine | Load the configuration. It includes the `@config-loader>*` types |
| `@node>execute` | | engine | Lint the files and format the results |
| `@node>files` | | engine | The number of the files of the run, added after the lint of the files ends. It has no time |
| `@node>keyword-scan-thread` | thread name | engine | The time of a thread and the files that it read, when worker threads were used. A worker measures them and the engine adds them with `addTotal()` |
| `@node>read-file` | | engine | Read a file |
| `@node>format` | | engine | Format the results |
| `@core>lint` | file path | core | Lint a content |
| `@core>setup-rules` | | core | Create the lint plan. It runs once for a configuration |
| `@core>keyword-scan` | | core | Scan the content for the keywords of all rules |
| `@core>keyword-guard` | keyword and guard | core | The places where a keyword with a guard was found. It has no time. When worker threads were used, it includes the places of the workers: a worker counts them and the engine adds them with `count()` |
| `@core>keyword-guard-met` | keyword and guard | core | The places where the guard of the keyword was met. It has no time |
| `@core>line-check` | | core | Test the lines that have a keyword. It includes `@core>pattern-line-test` |
| `@core>pattern-line-test` | pattern id | core | Test a line with a pattern. When worker threads were used, it includes the tests of the workers: a worker measures them and the engine adds them with `addTotal()`. They are not in `@core>line-check`, which is the time of the main thread |
| `@core>pattern` | pattern id | core | Run a pattern and report the matches |
| `@core>pattern-match` | pattern id | core | The number of matches. It has no time |
| `@core>rule-handler` | rule id | core | Run a rule for a content: its patterns, or its handler |

The id of a pattern is `{rule id}#{index of the pattern in the rule} {regular expression}`. A pattern has no name, so the regular expression identifies it for a reader.
The rule id is the id of the rule itself, not the id written in the configuration, so a short id in the configuration gives the same rows.

When the content is decoded only for the keyword scan, the content is decoded before the clock is read, so the time of the scan does not include the decoding.

### The summary

The command creates the summary from the totals when the lint ends, and returns it as its output in place of the output of the formatter. The formatter still runs, and its output is used only for `--output`.
Creating the summary and formatting it as text are two steps: the first gives the object that `--format json` prints, and the second gives the tables.
The order and the depth of the phases are a fixed list in the command. A type that is not in the list is not a phase.

The text removes terminal control sequences and control characters from every cell of the tables. JSON escapes them.

## Architecture and sequence diagrams

A diagram is not needed. Each package records to the shared profiler, and the command reads the totals once at the end.

## Data model and ER diagrams

A total is `{ type, id, count, duration, maxDuration }`. `id` is `undefined` for a type without a target. Times are in milliseconds.

The summary is `{ total, files, phases, rules, patterns, slowestFiles }`:

- `phases`: `{ name, depth, duration, percent, count }`
- `rules`: `{ ruleId, duration, files }`
- `patterns`: `{ ruleId, index, pattern, duration, runDuration, runs, matches, lineTestDuration, lineTests }`. `duration` is `runDuration + lineTestDuration`
- `keywordGuards`: `{ keyword, found, met }`, in the order of `found`
- `slowestFiles`: `{ filePath, duration }`

## APIs and interfaces

- Command: `--profile`. `--format json` selects the JSON summary, and any other value selects the text.
- Engine: `profile` option of `createEngine()`. `true` enables the profiler, `false` disables it, and without the option the state of the profiler is not changed.
- Profiler (`@secretlint/profiler`): `secretLintProfiler.setEnabled()`, `isEnabled`, `getStats()` for readers, and `mark()`, `now()`, `record()`, `count()` for the packages of Secretlint that record.

## External service integration

None.

## Data handling

The totals are in the memory of the process. They are cleared when the profiler is disabled. Nothing is written to a file.

## Authentication and authorization notes

None.

## Security considerations

The summary has file paths, rule ids, and regular expressions. The text removes terminal control sequences and control characters from them, as the Requirements describe.
The profiler receives no content of a file and no matched value.

## Deployment notes

None.

## Alternatives considered

### `performance.mark()` and `PerformanceObserver`

The profiler would mark the start and the end of each work with the Performance API, and collect measures with an observer.
It was the design before. It was not chosen because a mark and an entry for each file made a run with `--profile` 41% slower on 7,220 files, and the output was a line for each file.

### Keep each record and summarize when printing

The profiler would keep a list of all records, and the command would summarize them.
It was not chosen because the list grows with the number of files and runs of patterns, and the summary needs only the totals.

### Divide the time of the keyword scan between the rules

The time of the shared scan would be added to each rule by the number of its keywords.
It was not chosen because the scan is one pass for all keywords, and its time does not change in proportion to the keywords of one rule. A divided number would look like the cost of a rule, and removing the rule would not save that time.

### Print the summary with the lint results

The summary before the lint results on the standard output, or the summary on the standard error, would keep the lint results.
It was not chosen because a run with `--profile` is for the profile: two documents on one output can not be parsed as JSON, and no reader needs both.

### A separate option for the format of the summary

An option such as `--profile=json` would leave `--format` for the lint results.
It was not chosen because the lint results are not printed with `--profile`, so `--format` has no other meaning there, and one option for the format is simpler than two.

### Use only a CPU profile of the JavaScript engine

`node --cpu-prof` and a tool that summarizes it would replace this feature.
It was not chosen as the only way because rules are data and the core runs them: a CPU profile shows the functions of the core, not the rule or the pattern. It is still the tool for looking inside a phase.

## Open questions

None.
