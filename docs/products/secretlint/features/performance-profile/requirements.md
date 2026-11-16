# Performance profile

[日本語](requirements.ja.md)

## About this document

The performance profile shows where the time of a run is spent, so that a slow run can be explained and a slow rule can be found.
The parent Product is [Secretlint](../../product.md).

### Scope

- The summary that `--profile` prints: phases, rules, patterns, and files
- The summary as JSON
- The cost of the profile for a run with it and a run without it
- The totals that a program gets from the profiler

### Out of scope

- How fast Secretlint lints. This feature measures it and does not define it.
- A CPU profile of the JavaScript engine, such as `node --cpu-prof`. It shows functions, and this feature shows the work of Secretlint: phases, rules, and patterns.
- The lint results and the exit status. They belong to [Result output](../result-output/requirements.md).
- Measuring the run time many times to get stable numbers, with warm-up runs or by repeating the lint in one process. A benchmark tool such as hyperfine does it. The profile explains one run.

## User stories

### See where the time of a run goes

As a developer of Secretlint or a user with a slow run, I want the time of each phase of a run so that I know which part to look at: loading the configuration, searching files, reading files, the scan that all rules share, or formatting.

**Acceptance criteria:**

Scenario: When `--profile` is specified, the summary shows the time of each phase

- Given: A directory has files to lint and a configuration.
- When: The developer runs `secretlint "**/*" --profile`.
- Then: The standard output has the summary and no lint results. The first line has the total time and the number of the linted files. The summary has a row for each phase with its total time, its percentage of the total time, and how many times it ran.

Scenario: When the number of files grows, the size of the summary does not grow

- Given: One directory has 10 files and another has 10,000 files.
- When: The developer runs `secretlint "**/*" --profile` in each directory.
- Then: Both summaries have the same sections, and each section has at most 10 rows for rules, patterns, and files.

### Find the rule or the pattern that costs time

As an author of a rule, I want the time of each rule and each pattern, with how many times a pattern ran and how many matches it found, so that I can find a pattern that runs too often and make its keywords more specific.

**Acceptance criteria:**

Scenario: When a rule with patterns runs, the summary shows each pattern that ran

- Given: A file has a keyword of a pattern of an enabled rule.
- When: The developer runs `secretlint` for the file with `--profile`.
- Then: The summary has a row for the pattern with the id of its rule, the index of the pattern in the rule, and its regular expression. The row has the time, the number of runs, the number of matches, and the time and the number of the tests of lines before the run.

Scenario: When a rule is used with a short id in the configuration, the rule and its patterns have the same id

- Given: The configuration enables a built-in rule with a short id such as `@secretlint/aws`.
- When: The developer runs `secretlint` with `--profile`.
- Then: The row of the rule and the rows of its patterns show the id of the rule itself, `@secretlint/secretlint-rule-aws`.

Scenario: When no file has a keyword of a pattern, the pattern is not in the summary

- Given: No linted file has a keyword of a pattern.
- When: The developer runs `secretlint` with `--profile`.
- Then: The summary has no row for the pattern. The time of looking for its keywords is in the phase of the keyword scan, which all rules share.

### Read the profile from a program or an AI agent

As an AI agent or a script that investigates performance, I want all numbers of the profile as JSON so that I can compare runs and choose what to improve without parsing a table.

**Acceptance criteria:**

Scenario: When `--profile` and `--format json` are specified, the summary is JSON with all rules and patterns

- Given: A directory has files to lint and a configuration.
- When: The agent runs `secretlint "**/*" --profile --format json`.
- Then: The standard output is one JSON object that has `total`, `files`, `phases`, `rules`, `patterns`, and `slowestFiles`. `rules` and `patterns` have every rule and pattern that ran, in the order of the time. `slowestFiles` has at most 10 files.

Scenario: When `--profile` and `--output` are specified, the lint results go to the file and the summary to the standard output

- Given: A directory has files to lint and a configuration.
- When: The developer runs `secretlint "**/*" --profile --output result.txt`.
- Then: The file has the lint results in the format of `--format`. The standard output has the summary only.

### Pay nothing when the profile is not used

As a user who does not look at the profile, I want a run without `--profile` to be as fast as a run of Secretlint without this feature.

**Acceptance criteria:**

Scenario: When `--profile` is not specified, nothing is recorded and no summary is printed

- Given: A directory has files to lint and a configuration.
- When: The user runs `secretlint "**/*"`.
- Then: The standard output has only the lint results. The profiler has no totals.

Scenario: When `--profile` is not specified, the run time does not change by this feature

- Given: Two builds of Secretlint differ only in the code of this feature, and a directory has thousands of files.
- When: Each build lints the directory many times without `--profile`, in turns.
- Then: The difference of the median run times is within the difference between two series of runs of the same build.

## KPIs

None. No metric is defined for this feature.

## Functional requirements

### Summary of a run

**Overview:** Prints a summary of where the time of the run was spent, instead of the lint results.

**Input:** `--profile`, with the files or the STDIN content to lint. `--format` selects the format of the summary: `json` is JSON, and any other value is text.

**Output:** The summary on the standard output. The lint results are not printed. The exit status is the one of the lint.

#### Applicable conditions

##### What `--profile` changes

A run with `--profile` is for looking at the profile, so the standard output has one document: the summary.
The lint still runs to its end, including the formatter, so the summary has the time of formatting.
With `--output`, the lint results are written to the file as without `--profile`.

##### Sections of the summary

| Section | A row is | Values of a row | Rows in text | Rows in JSON |
| --- | --- | --- | --- | --- |
| Phases | A phase of the run | Total time, percentage of the total time of the command, count | All phases that ran | All phases that ran |
| Threads | A thread that read files, when worker threads were used: the main thread, or a worker thread | Time of the thread, number of files that it read | All | All |
| Rules | A rule that ran for a file | Total time, number of files | 10 with the longest time | All |
| Patterns | A pattern that ran or was tested for a line | Total time, time and number of runs, number of matches, time and number of line tests | 10 with the longest time | All |
| Keywords with a guard | A keyword with a guard that was found | Number of the places where the keyword was found, number of the places where its guard was met | 10 with the most places | All |
| Files | A linted file | Time of the lint of the file, without reading it | 10 with the longest time | 10 with the longest time |

A phase can run in another phase, and the summary shows it with the indent of the name (text) or with `depth` (JSON). The time of a phase includes the phases in it.

##### Keywords with a guard

A keyword with a guard is shown as the keyword and its guard, such as `00 [0-9A-Za-z_-]{40,}`. The keyword is in lower case, and the set is written in the order of the characters.
The patterns of the keyword run only for the places where the guard was met. A guard whose two numbers are close drops few places, so a rule author sees a guard that is too loose here.
The section is not shown when no keyword with a guard was found.

##### Shared cost

Secretlint looks for the keywords of all rules in one scan of the content. The time of this scan is a phase, and it is not divided between the rules.

##### Threads

When the lint of many files takes long, worker threads read files and look for keywords, and the main thread runs the rules.
The summary then shows each thread with its time and the number of the files that it read. The section is not shown when no worker thread started.
The lint runs in the same way with and without `--profile`.
The time of reading a file and of the keyword scan in the phases is only the work of the main thread. The work of the workers is in this section.
The Patterns section includes the tests of lines that the workers did, and the Keywords with a guard section includes the places that the workers found.
The number of files in the first line of the summary is the number of the files of the run. A file that no rule runs for is not in the Files section.

##### Text of the summary

A time is in milliseconds with two decimals.
A file path under the current working directory starts with `<cwd>`.
A regular expression longer than 80 characters is cut and ends with `...`.
Terminal control sequences and control characters in file paths, rule ids, and regular expressions are removed.

#### Exceptional behavior

##### The command fails

The summary is printed to the standard output with what was recorded until the failure, and the error follows on the standard error.

### Cost of the profile

**Overview:** The profile costs almost nothing when it is off, and little when it is on.

**Input:** A run with or without `--profile`.

**Output:** None. It is a limit on the run time.

#### Applicable conditions

##### The profile is off

A run without `--profile` has almost no performance loss from this feature: the run time is the same as without the code of this feature, within the noise of measurement.
The profile is off unless `--profile` is specified, or a program enables the profiler.

##### The profile is on

The times in the summary are for explaining a normal run, so a run with `--profile` must stay close to a run without it.
A run with `--profile` can take a few percent longer than a run without it. Reading the clock for each file and each pattern has a cost, and it is accepted.

### Totals for a program

**Overview:** A program that runs Secretlint as a library gets the same totals that the summary is made from.

**Input:** The program enables the profiler, or passes `profile: true` when it creates the engine of `@secretlint/node`, and lints.

**Output:** A list of totals. A total has a type (what was measured), an id (a file path, a rule id, or the id of a pattern; none for a phase without a target), a count, the total time, and the longest time of one record.

#### Applicable conditions

The profiler keeps totals only, so the size of the list depends on the number of types, rules, patterns, and files, not on how many times they ran.
Disabling the profiler clears the totals.

## Data requirements

### Required data

- **Total of a type and an id:** count, total time, and the longest time. It is kept in memory during the process.

### Relationships

A total of a pattern has the id of its rule in its id.

### Personal information

None is collected. The summary has file paths and regular expressions of rules, and no content of a file.

## External service dependencies

None.

## Security considerations

A file name can have any character, and the summary prints file paths to a terminal. The text of the summary removes terminal control sequences and control characters, so a file name can not rewrite the output of the terminal.
The summary never has the content of a file or a matched value.

## Open questions

None.
