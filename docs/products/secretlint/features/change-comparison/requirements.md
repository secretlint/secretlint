# Change comparison

[日本語](requirements.ja.md)

## About this document

The change comparison runs two builds of Secretlint, the base (such as `master`) and the head (a pull request), on the same files, and shows the differences: the work of each pattern, the findings, and the run time.
It lets the author, an AI agent, and a reviewer notice a large change from a new rule or a changed rule before the change is merged.
One script does the comparison. A developer and an AI agent run it locally, and CI runs the same script for each pull request and puts its output in the job summary.
The parent Product is [Secretlint](../../product.md). The numbers of a run come from [Performance profile](../performance-profile/requirements.md).

### Scope

- The comparison script: its inputs, the sets of files it uses, and its output as Markdown and JSON
- The CI job that runs the script for a pull request, including a pull request from a fork
- The instruction for AI agents to run the script and to put its output in the pull request

### Out of scope

- Deciding if a change is acceptable. The comparison shows differences; a person decides.
- Failing CI because of a difference. CI shows the result and does not fail on it.
- A comment on the pull request and a history of results on `master`. They can be added later on top of the output of this feature.
- Measuring the run time many times by Secretlint itself. A benchmark tool such as hyperfine does it.
- The existing benchmark of `master` (`benchmark.yml`).

## User stories

### See what a rule change does before opening a pull request

As an author of a rule or an AI agent that changes a rule, I want one command that compares my branch with `master` so that I can put the differences in the description of the pull request.

**Acceptance criteria:**

Scenario: When the head adds a pattern, the output shows the work of the new pattern

- Given: The head adds a rule with a pattern that `master` does not have, and the base is `master`.
- When: The author runs the comparison script with the small set of files.
- Then: The Markdown output has a row for the new pattern with its number of runs, matches, and line tests in the base (none) and in the head.

Scenario: When the head does not change the lint, the output says that nothing changed

- Given: The head changes only documentation.
- When: The author runs the comparison script.
- Then: The output says that the work of the patterns and the findings are the same, and it shows the run time of the base and the head without a warning.

### Notice a large change in a pull request from someone else

As a maintainer who reviews a pull request from a fork, I want CI to run the comparison so that I do not need to build and benchmark the pull request locally.

**Acceptance criteria:**

Scenario: When a pull request changes the code of the lint, CI puts the comparison in the job summary

- Given: A pull request from a fork changes a built-in rule.
- When: CI runs for the pull request.
- Then: The job summary has the Markdown output of the comparison, and the run has the JSON output as an artifact. CI passes or fails only by the other checks.

Scenario: When the code of a pull request is malicious, it gets no secret and no write access

- Given: A pull request from a fork changes the comparison script to print the environment and to push to the repository.
- When: CI runs the comparison for the pull request.
- Then: The job has no secret of the repository and a token that can only read. The push fails, and nothing outside the run is changed.

Scenario: When a pull request changes only files that do not affect the lint, the comparison does not run

- Given: A pull request changes only Markdown files under `docs/`.
- When: CI runs for the pull request.
- Then: The comparison job is skipped.

### Read the comparison from an AI agent

As an AI agent that reviews a pull request or investigates a slowdown, I want the comparison as JSON so that I can read the numbers without parsing a table.

**Acceptance criteria:**

Scenario: When the comparison finishes, the JSON has the base, the head, and the differences

- Given: The comparison has run.
- When: The agent reads the JSON output.
- Then: The JSON has the commits of the base and the head, the set of files, the work of each pattern in each build, the findings that only one build has, and the run times.

### Measure on a large repository

As a developer of the core, I want to run the comparison on repositories of about 1,000, 7,000, 20,000, and 100,000 files so that I can see how a change scales.

**Acceptance criteria:**

Scenario: When a larger set is selected, the script prepares the repository at a fixed commit

- Given: The set of about 100,000 files (the Linux kernel) is selected and is not on the machine.
- When: The developer runs the comparison script with that set.
- Then: The script downloads the repository at the commit that the script defines, and the next run uses the downloaded files without downloading them again.

## KPIs

None. No metric is defined for this feature.

## Functional requirements

### Comparison script

**Overview:** Builds or uses two builds of Secretlint, runs both on the same set of files, and writes the differences.

**Input:** The base (a Git ref, `master` by default), the head (the working tree by default), and the set of files.

**Output:** Markdown on the standard output, and JSON in a file.

#### Applicable conditions

##### What is compared

| Item | Source | Why |
| --- | --- | --- |
| Work of each pattern | The profile of each build: how many times each pattern ran, matched, and tested a line | The same files give the same numbers in each run, so a difference is a change of the code, not noise. A new pattern with many runs and no matches shows that its keywords are too common |
| Findings | The lint results of each build | A rule change that adds many findings is likely to add false positives. Secretlint prefers fewer false positives |
| Run time | Each build runs several times on the same machine, one build after the other | It is the time that a user sees. It changes between runs, so only a large ratio is shown as a warning |

The output does not include the value of a secret: a finding is shown by the rule id, the file, and the line.

##### Sets of files

The sets are repositories at fixed commits, so the base and the head and two runs on different days lint the same files.

| Set | Repository | Files |
| --- | --- | --- |
| small | `examples/benchmark/targets` (in this repository) | about 600 |
| medium | facebook/react | about 7,300 |
| large | microsoft/vscode | about 21,000 |
| huge | torvalds/linux | about 97,000 |

A local run and CI use all sets. A developer can select some of the sets for a quicker local run.
A set that is not on the machine is downloaded at its commit without the history of the repository, so preparing all sets takes a short time once.

The configuration of the lint is the canary preset, so new rules are included.

##### Run time

The script shows the median time of each build and the ratio of the head to the base.
A ratio of 1.3 or more, or 0.77 or less, is marked as a large change. A smaller ratio is shown without a mark, because the run time on a shared machine changes by more than 10% between runs.

#### Exceptional behavior

##### A build fails

The script stops and prints which build failed. No partial comparison is written.

##### The run time can not be measured

The tool that measures the run time is not on the machine. The script compares the work of the patterns and the findings, and it says that the run time was not measured.

### CI job

**Overview:** Runs the comparison script for a pull request and puts the output in the job summary.

**Input:** A pull request that changes the code that the lint runs, its dependencies, or the comparison itself.

**Output:** The job summary with the Markdown output, and an artifact with the JSON output.

#### Applicable conditions

The job runs the code of the pull request without any secret of the repository and with permission only to read the repository, so the code of a pull request from a fork can not get a secret or change the repository.
The base is the base branch of the pull request. CI compares each set in its own job, so the sets run in parallel, and a set that can not run does not hide the results of the other sets. The job summary of each job has the comparison of its set.
The job does not fail because of a difference. It fails only if the comparison can not run.

#### Exceptional behavior

##### The comparison can not run

The job fails with the error, and the other checks of the pull request are not affected.

### Instruction for AI agents

**Overview:** AGENTS.md tells an AI agent to run the comparison script for a change of a rule or of the code of the lint, and to put the Markdown output in the description of the pull request.

## Data requirements

### Required data

- **Comparison result:** the commits of the base and the head, the set of files, the work of each pattern, the findings by rule id, file, and line, and the run times. It is written for each run and is kept as an artifact of CI for the retention period of the repository.
- **Downloaded repositories:** the files of a set at its fixed commit, kept on the machine to be reused.

### Relationships

A comparison result has two profiles of [Performance profile](../performance-profile/requirements.md), one for each build.

### Personal information

None is collected. The result has file paths and rule ids of public repositories, and no value of a secret.

## External service dependencies

- **GitHub Actions**
  - **Related user stories:** Notice a large change in a pull request from someone else; Read the comparison from an AI agent
  - **Reason for dependency:** It runs the comparison for each pull request and keeps the JSON output as an artifact
  - **Contractual and usage decisions:** The job uses the hosted runners that the other checks of the repository use. The comparison runs two builds on four sets in four jobs, so it adds runner time to a pull request that changes the code of the lint
- **GitHub**
  - **Related user stories:** Notice a large change in a pull request from someone else; Measure on a large repository
  - **Reason for dependency:** The sets other than small are public repositories on GitHub, downloaded at their fixed commits
  - **Contractual and usage decisions:** Only public repositories are downloaded. Their files are linted and not redistributed

## Security considerations

The code of a pull request from a fork is run by the CI job, so the job must not have anything that the code can steal or change: no secret of the repository, and a token that can only read.
A job that has a secret or write access, such as one that comments on the pull request, must not run the code of the pull request, and must treat the output of the comparison as untrusted data.
The output must not have the value of a secret, because the job summary and the artifact can be read by anyone who can read the repository.

## Open questions

None.
