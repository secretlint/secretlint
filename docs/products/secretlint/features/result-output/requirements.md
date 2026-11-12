# Result output

[日本語](requirements.ja.md)

## About this document

Result output shows the results of a lint in the format that the user chooses, writes them to the standard output or to a file, and sets the exit status of the command.
The parent Product is [Secretlint](../../product.md).

### Scope

- Choosing a formatter with `--format`
- The formatters that come with Secretlint, and formatters that a user adds
- The content of the JSON output
- Writing the output to the standard output or to a file with `--output`
- The exit status of the command
- Color, terminal links, and control characters in the output for a terminal

### Out of scope

- Masking of secret values in messages. It belongs to the feature "Secret masking in results".
- The `mask-result` formatter. It belongs to [File masking](../file-masking/requirements.md).
- The layout of each formatter for people, such as `stylish` and `table`, and the content of the SARIF output. They are not yet written.
- Messages about problems of the configuration file that are shown together with lint results. They are not yet written.
- The output of `--profile`.

## User stories

### Read results in a terminal

As a developer, I want to see where each secret is and why it was reported so that I can remove it before the commit.

**Acceptance criteria:**

Scenario: When a file has a secret, the output shows its place and the command fails

- Given: A file has a value that an enabled rule reports as an error.
- When: The developer runs `secretlint` for the file without `--format`.
- Then: The standard output shows the file path, the line and column, the severity, the message with its message ID, and the rule ID, in the `stylish` format. The exit status is 1.

Scenario: When no file has a secret, the output is empty and the command succeeds

- Given: No file has a value that an enabled rule reports.
- When: The developer runs `secretlint` for the files without `--format`.
- Then: The standard output is empty. The exit status is 0.

Scenario: When the results have only warnings or info messages, the command succeeds

- Given: A file has a value that an enabled rule reports as a warning, and no value that is reported as an error.
- When: The developer runs `secretlint` for the file.
- Then: The standard output shows the warning. The exit status is 0.

Scenario: When a file name has terminal control characters, the output does not include them

- Given: A file has a secret, and its name includes an escape sequence that changes the terminal title.
- When: The developer runs `secretlint` for the file with a formatter for people, such as `stylish`.
- Then: The output shows the file name without the control characters, and the terminal title does not change.

### Read results from a program

As a CI and repository maintainer or an AI agent, I want the results as JSON so that a program can read them.

**Acceptance criteria:**

Scenario: When `--format=json` is specified, the output is a JSON array with one item for each linted file

- Given: Two files are linted. One has a secret and the other has none.
- When: The user runs `secretlint` for the files with `--format=json`.
- Then: The standard output is one JSON array with two items. Each item has the file path, the content type, and the list of messages. The item of the file without a secret has an empty list of messages.

Scenario: When `--format=json` is specified, each item of a text file includes the content of the file

- Given: Two text files are linted. One has a secret and the other has none.
- When: The user runs `secretlint` for the files with `--format=json`.
- Then: Each of the two items has the whole content of its file as `sourceContent`. The secret in the content is not masked, even when the secret in the messages is masked.

Scenario: When a binary file is linted with `--format=json`, its item does not include the content

- Given: A binary file is linted.
- When: The user runs `secretlint` for the file with `--format=json`.
- Then: The item of the file has the content type `binary` and has no `sourceContent`.

### Save results to a file

As a CI and repository maintainer, I want to write the results to a file so that another tool can read the report later.

**Acceptance criteria:**

Scenario: When `--output` is specified, the results are written to the file and the command succeeds

- Given: A file has a secret that is reported as an error.
- When: The user runs `secretlint` for the file with `--format=json --output=report.json`.
- Then: `report.json` has the JSON output. The standard output is empty. The exit status is 0.

### Use another formatter

As a CI and repository maintainer or a tool integrator, I want to use a formatter that does not come with Secretlint so that the results fit my tool.

**Acceptance criteria:**

Scenario: When `--format` is a package name, the formatter of the package creates the output

- Given: A formatter package, such as `@secretlint/secretlint-formatter-sarif`, is installed.
- When: The user runs `secretlint` with `--format=@secretlint/secretlint-formatter-sarif`.
- Then: The standard output is the text that the formatter of the package returns for the results.

Scenario: When `--format` is a file path, the formatter of the file creates the output

- Given: A JavaScript file exports a formatter as its default export.
- When: The user runs `secretlint` with the path of the file as `--format`.
- Then: The standard output is the text that the formatter returns for the results.

Scenario: When the formatter is not found, the command fails with an error that names the formatter

- Given: No formatter has the name `unknown-name`.
- When: The user runs `secretlint` with `--format=unknown-name`.
- Then: The standard error shows that the formatter `unknown-name` could not be found. The exit status is 2.

## KPIs

None. No metric is defined for this feature.

## Functional requirements

### Formatter selection

**Overview:** The user chooses how the results are formatted.

**Input:** The name of a formatter with `--format`. The default is `stylish`.

**Output:** The results as one text in the format of the formatter.

#### Applicable conditions

##### Formatters that come with Secretlint

`checkstyle`, `compact`, `github`, `jslint-xml`, `junit`, `pretty-error`, `stylish`, `tap`, `unix`, `json`, `mask-result`, and `table` can be used without installing a package.
`secretlint --help` lists them.

##### Formatters that a user adds

`--format` accepts a path of a file, or a name of an installed package.
A package name can be the full name, or the name without the prefix `secretlint-formatter-`.
A formatter receives the list of results and the color setting, and returns the text to output.

##### Output for a terminal

Formatters for people use ANSI colors by default. `--no-color` disables the colors.
`stylish` and `pretty-error` link a message ID to the documentation of the rule on terminals that support links. `--no-terminalLink` disables the links.
Formatters for people remove terminal control characters from file paths, messages, message IDs, and rule IDs.

#### Exceptional behavior

##### The formatter is not found

The command shows an error that names the formatter, and exits with the status 2. No result is output.

### JSON output

**Overview:** `--format=json` outputs the results as they are, for programs.

**Input:** `--format=json`.

**Output:** One JSON array with one item for each linted file, in the order of linting.

#### Applicable conditions

Each item has the file path (`filePath`), the content type (`sourceContentType`), and the messages (`messages`).
An item of a text file also has the whole content of the file (`sourceContent`), whether the file has messages or not.
The content is the content that was linted, and secrets in it are not masked.
Each message has the rule ID, the message ID, the message text, the severity, the range and location in the content, and the URL of the documentation when the rule has one.

### Output destination and exit status

**Overview:** The results go to the standard output or to a file, and the exit status tells whether an error was found.

**Input:** `--output` with a file path, or nothing.

**Output:** The formatted results, and the exit status.

#### Applicable conditions

| Condition | Standard output | Exit status |
| --- | --- | --- |
| No message with the severity error | The formatted results | 0 |
| At least one message with the severity error | The formatted results | 1 |
| `--output` is specified | Nothing. The formatted results are written to the file | 0 |

#### Exceptional behavior

##### A fatal error occurs

When the lint or the formatter throws an error, the command shows the error on the standard error and exits with the status 2.

## Data requirements

### Required data

- **Lint result:** The result of linting one file or one content. It has the file path, the content type (text, binary, or unknown), the messages, and the content of the file when the content type is text.
- **Message:** One report of a rule. It has the rule ID, the message ID, the message text, the severity, the range and location in the content, the data of the message, and the URL of the documentation.

### Relationships

A lint result has zero or more messages. The range and location of a message point into the content of its lint result.

### Personal information

None is collected. The content of a file and a message can include any text that the linted file has.

## External service dependencies

None. The output is created on the machine that runs Secretlint.

## Security considerations

The output can be shown in terminals, CI logs, and the input of AI agents, so it should not expose secrets.
Secret values in messages are masked by default.
The JSON output includes the content of each text file without masking, so it exposes the secrets of the linted files to everything that reads the output.
File paths and messages come from linted files, so the output for a terminal must not let them control the terminal.

## Open questions

None.
