# File masking

[日本語](requirements.ja.md)

## About this document

File masking outputs the content of a file with its secrets replaced by `*`, so that the content can be shared or saved without the secrets.
The parent Product is [Secretlint](../../product.md).

### Scope

- The output of the `mask-result` formatter
- Masking a file in place with `--output`
- Files that can not be masked

### Out of scope

- Masking of secret values in messages. It belongs to the feature "Secret masking in results".
- How a formatter is chosen, and the exit status of the command. They belong to [Result output](../result-output/requirements.md).

## User stories

### Get the content without secrets

As a developer, I want the content of a file with its secrets masked so that I can share or keep the file, such as a shell history.

**Acceptance criteria:**

Scenario: When a file has a secret, the output is the content with the secret replaced by `*`

- Given: A text file has a value that an enabled rule reports.
- When: The developer runs `secretlint` for the file with `--format=mask-result`.
- Then: The standard output is the content of the file, and each character of the reported value is replaced by `*`. The other characters and the length of the content are the same as the file.

Scenario: When a file has no secret, the output is the content as it is

- Given: A text file has no value that an enabled rule reports, and it is not empty.
- When: The developer runs `secretlint` for the file with `--format=mask-result`.
- Then: The standard output is the content of the file without any change.

Scenario: When `--output` is the same file, the file is replaced by the masked content

- Given: A text file `.zsh_history` has a secret.
- When: The developer runs `secretlint .zsh_history --format=mask-result --output=.zsh_history`.
- Then: `.zsh_history` has the masked content. The standard output is empty.

Scenario: When several files are linted, the output is the masked contents joined in the order of linting

- Given: Two text files are linted.
- When: The developer runs `secretlint` for the files with `--format=mask-result`.
- Then: The standard output is the masked content of the first file followed by the masked content of the second file, without a separator.

Scenario: When a binary file is linted, the command fails without output

- Given: A binary file is one of the linted files.
- When: The developer runs `secretlint` for the files with `--format=mask-result`.
- Then: The standard error shows that a binary file is not supported. No masked content is output. The exit status is 2.

Scenario: When an empty file is linted, the command fails without output

- Given: An empty file is one of the linted files.
- When: The developer runs `secretlint` for the files with `--format=mask-result`.
- Then: The standard error shows that `sourceContent` is not found. No masked content is output. The exit status is 2.

## KPIs

None. No metric is defined for this feature.

## Functional requirements

### Masked output

**Overview:** Outputs the content of each linted file with the reported values masked.

**Input:** `--format=mask-result`, and the files or the STDIN content to lint.

**Output:** The masked contents of all linted files as one text.

#### Applicable conditions

A reported value is the range of a message. Every message is used, whatever its severity is.
Each character of the range is replaced by one `*`, so the length of the content does not change.
The content of every linted file is output, whether the file has messages or not.
Messages about problems of the configuration file are not output with `mask-result`.

#### Exceptional behavior

##### A binary file

The command fails with an error, and outputs nothing for all files.

##### An empty file

The command fails with an error, and outputs nothing for all files.

## Data requirements

### Required data

- **Content of the linted file:** The whole content of each linted text file, as it was linted.
- **Ranges of messages:** The start and end of each reported value in the content.

### Relationships

Each range points into the content of the same file.

### Personal information

None is collected. The output has the same text as the linted file, except the masked values.

## External service dependencies

None.

## Security considerations

The output must be the content that the rules checked. If the output had newer content of the file, a secret that no rule checked could be output without masking.
A value that no enabled rule reports stays in the output as it is.

## Open questions

None.
