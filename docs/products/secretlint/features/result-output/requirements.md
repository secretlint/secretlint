# Result output

[日本語](requirements.ja.md)

## About this document

Result output shows the results of a lint in the format that the user chooses, writes them to the standard output or to a file, and sets the exit status of the command.
The parent Product is [Secretlint](../../product.md).

### Scope

- Choosing a formatter with `--format`
- The formatters that come with Secretlint, and formatters that a user adds
- The content of the JSON output
- The content of the linted file that a formatter can use
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

Scenario: When `--format=json` is specified, the output does not include the content of the files

- Given: Two text files are linted. One has a secret and the other has none.
- When: The user runs `secretlint` for the files with `--format=json`.
- Then: Neither of the two items has the content of its file, and no item has `sourceContent`. When the secret in the messages is masked, the output does not have the secret value anywhere.

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

### Use the content of the linted file in a formatter

As a tool integrator, I want to get the content of a linted file in my formatter so that the output can show the text around a secret.

**Acceptance criteria:**

Scenario: When a file has messages, a formatter can get the content of the file

- Given: A text file has a secret, and a formatter that a user adds asks for the content of each result by its file path.
- When: The user runs `secretlint` for the file with the formatter.
- Then: The formatter gets the whole content of the file as it was linted. The ranges of the messages point into this content.

Scenario: When a file has no messages, a formatter gets no content for the file

- Given: A text file has no secret, and a formatter that a user adds asks for the content of each result by its file path.
- When: The user runs `secretlint` for the file with the formatter.
- Then: The formatter gets the answer that the content is not available, and it can still output the result of the file.

Scenario: When the STDIN content is linted, a formatter can get the content

- Given: A content is given from STDIN with `--stdinFileName`, and a formatter that a user adds asks for the content by the given file name.
- When: The user runs `secretlint` with the formatter.
- Then: The formatter gets the given content, whether it has messages or not.

Scenario: When a binary file is linted, a formatter gets no content for the file

- Given: A binary file is linted, and a formatter that a user adds asks for the content of each result by its file path.
- When: The user runs `secretlint` for the file with the formatter.
- Then: The formatter gets the answer that the content is not available.

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
A formatter receives the list of results, the color setting, and a way to get the content of a linted file by its file path. It returns the text to output.
The results do not have the content of the files.

##### The content of a linted file

A formatter can get the content of a text file that has at least one message, and the content given from STDIN.
The content is the content that was linted. Secretlint does not read the file again for the formatter.
The content of a text file without messages, the content of a binary file, and the content for the configuration file are not available.
[File masking](../file-masking/requirements.md) is the exception: the `mask-result` formatter gets the content of every linted text file.

##### Output for a terminal

Formatters for people use ANSI colors by default. `--no-color` disables the colors.
`stylish` and `pretty-error` link a message ID to the documentation of the rule on terminals that support links. `--no-terminalLink` disables the links.
Formatters for people remove terminal control characters from file paths, messages, message IDs, and rule IDs.

#### Exceptional behavior

##### The formatter is not found

The command shows an error that names the formatter, and exits with the status 2. No result is output.

### Behavior for each kind of content

**Overview:** What the user gets depends on the kind of the linted content. This table lists every kind.

**Input:** The linted files or the STDIN content.

**Output:** The result of each file, and the content that a formatter can get.

#### Applicable conditions

| Kind of content | Content type in the result | Messages | Content that a formatter can get | Exit status |
| --- | --- | --- | --- | --- |
| Text file with a secret | `text` | The messages of the rules | The whole content | 1 when a message has the severity error, otherwise 0 |
| Text file without a secret | `text` | Empty | Not available | 0 |
| Empty file | `text` | Empty | Not available | 0 |
| Binary file | `binary` | Empty, unless a rule supports binary content | Not available | 0, unless such a rule reports an error |
| STDIN content | `text` | The messages of the rules | The whole content, with or without messages | 1 when a message has the severity error, otherwise 0 |
| Configuration file with a problem | `text` | The messages about the configuration | Not available | Not changed by these messages |

The same applies to every formatter except `mask-result`. [File masking](../file-masking/requirements.md) lists the behavior of `mask-result` for each kind.

An empty file is a text file without a secret.
A file is binary when its extension is one of binary files, such as `.png`, or when its extension is not known and its content looks binary. The extension is checked first, so a file with the extension `.png` is binary even when its content is text.
Most rules support only text, so a binary file has no messages. How the kind is decided and which rules lint which kind belong to the feature "Secret scanning", which is not yet written.

### JSON output

**Overview:** `--format=json` outputs the results as they are, for programs.

**Input:** `--format=json`.

**Output:** One JSON array with one item for each linted file, in the order of linting.

#### Applicable conditions

Each item has the file path (`filePath`), the content type (`sourceContentType`), and the messages (`messages`).
An item does not have the content of the file. A program that needs the text of a range reads the file by the file path.
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

- **Lint result:** The result of linting one file or one content. It has the file path, the content type (text, binary, or unknown), and the messages. It does not have the content.
- **Content of the linted file:** The text that was linted. It is kept during one run only for the files whose content a formatter can get.
- **Message:** One report of a rule. It has the rule ID, the message ID, the message text, the severity, the range and location in the content, the data of the message, and the URL of the documentation.

### Relationships

A lint result has zero or more messages. The range and location of a message point into the content of the linted file with the same file path.

### Personal information

None is collected. The content of a file and a message can include any text that the linted file has.

## External service dependencies

None. The output is created on the machine that runs Secretlint.

## Security considerations

The output can be shown in terminals, CI logs, and the input of AI agents, so it should not expose secrets.
Secret values in messages are masked by default.
The content of a linted file is not masked, so no formatter that comes with Secretlint outputs it, except `mask-result`, which masks it.
A formatter that a user adds and that outputs the content exposes the secrets of the file.
File paths and messages come from linted files, so the output for a terminal must not let them control the terminal.

## Open questions

None.
