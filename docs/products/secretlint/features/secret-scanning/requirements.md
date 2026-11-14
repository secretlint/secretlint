# Secret scanning

[日本語](requirements.ja.md)

## About this document

Secret scanning lints the content of files, of STDIN, or of a source given by a program with the configured rules, and reports the secrets that the rules find.
The parent Product is [Secretlint](../../product.md).

This document is written for the part of the feature that a change needs: what content is linted, how text and binary content are told apart, which rules run for each kind of content, and what a rule receives.

### Scope

- The sources that are linted: files, the STDIN content, and a source that a program passes to `@secretlint/core`
- The content type of a source: text, binary, or unknown
- Which rules run for each content type
- The content and the information about the source that a rule receives
- The same results in Node.js and in browsers
- Looking for the keywords of rules in the content, which decides the rules that run for a source

### Out of scope

- Choosing files from globs and ignore files. It belongs to the feature "File selection".
- Loading the configuration. It belongs to the feature "Configuration loading".
- How each rule decides that a value is a secret. It belongs to the feature "Rules and rule presets".
- Disable comments. They belong to the feature "Ignoring by comment".
- Masking secret values in messages. It belongs to the feature "Secret masking in results".
- Showing the results. It belongs to [Result output](../result-output/requirements.md).
- Text encodings other than UTF-8. The Product limits text to UTF-8.
- How a rule declares keywords and declarative patterns. It belongs to the feature "Rules and rule presets".
- How the declarative patterns of rules are checked after the keywords are found. It is not written yet.

## User stories

### Find a secret in a text file

As a developer, I want the secrets in the text files of a repository to be reported so that I can remove them before the commit.

**Acceptance criteria:**

Scenario: When a text file has a secret, the rule that detects it reports it

- Given: A UTF-8 text file has a value that an enabled rule reports.
- When: The developer runs `secretlint` for the file.
- Then: The result of the file has a message of the rule, with the line and column of the value.

Scenario: When a text file starts with a byte order mark, the location does not count it

- Given: A UTF-8 text file starts with a byte order mark and has a secret on the first line.
- When: The developer runs `secretlint` for the file.
- Then: The column of the message is the same as for the file without the byte order mark.

### Find a secret in a binary file

As a developer, I want a secret that is stored as a binary file, such as a GCP service account key in the PKCS#12 format (`.p12`), to be reported so that I do not commit it.

**Acceptance criteria:**

Scenario: When a `.p12` file is a GCP service account key, the gcp rule reports it in Node.js

- Given: A `.p12` file is a GCP service account key, and the gcp rule is enabled.
- When: The developer runs `secretlint` for the file.
- Then: The result of the file has the `PrivateKeyP12` message of the gcp rule with the file name.

Scenario: When a binary file is linted, the rules for text do not run

- Given: A binary file, such as an image, happens to have bytes that look like a token, and only rules for text are enabled.
- When: The developer runs `secretlint` for the file.
- Then: The result of the file has no message.

### Lint content in a browser

As a tool integrator, I want to lint content with `@secretlint/core` and the recommended preset in a browser so that my tool finds secrets without Node.js.

**Acceptance criteria:**

Scenario: When text content is linted in a browser, the result is the same as in Node.js

- Given: A tool in a browser has text content with a secret, and the recommended preset.
- When: The tool calls `lintSource()` with the content.
- Then: The result has the same messages as the lint of the same content in Node.js.

Scenario: When the bytes of a `.p12` file are linted in a browser, the result is the same as in Node.js

- Given: A tool in a browser has the bytes of a `.p12` file that is a GCP service account key.
- When: The tool calls `lintSource()` with the file name, the bytes, the content type `binary`, and the recommended preset.
- Then: The result has the `PrivateKeyP12` message of the gcp rule, the same as the lint of the file in Node.js.

Scenario: When a `.p12` source is linted without its bytes, nothing is reported and no file is read

- Given: A program has only the content of a `.p12` file as a string, and the gcp rule is enabled.
- When: The program calls `lintSource()` with the file name and the string, without the bytes.
- Then: The result has no message for the file, and no error is thrown. Secretlint does not read the file from the disk, in Node.js or in a browser.

### Lint the STDIN content

As a developer or an AI agent, I want to lint content from STDIN with a file name so that I can check content that is not saved as a file.

**Acceptance criteria:**

Scenario: When content is given from STDIN, it is linted as text with the given file name

- Given: Content with a secret.
- When: The user runs `secretlint --stdinFileName=secret.txt` with the content on STDIN.
- Then: The result has the file name `secret.txt` and the message of the rule.

## KPIs

None for this part of the feature.

## Functional requirements

### Tell the content type of a source

**Overview:** Each source has a content type: text, binary, or unknown. The content type decides which rules run.

**Input:** A file path and the bytes of the file, or the content type that a program gives.

**Output:** The content type of the source, which is also shown in the result.

#### Applicable conditions

##### Files

For a file, Secretlint decides the content type from the file name and the bytes of the file.
A file that is known as binary is binary, a file that is known as text is text, and other files are unknown.

##### STDIN

The STDIN content is always text.

##### A source from a program

A program that calls `@secretlint/core` gives the content type of the source.

### Run the rules for the content type

**Overview:** A rule declares the content types it supports, and it runs only for them.

**Input:** The content type of the source and the enabled rules.

**Output:** The messages of the rules that ran.

#### Applicable conditions

##### Supported content types

A rule lists the content types it supports: `text`, `binary`, or both. A rule that checks both lists both, so the supported types can be read from the rule as they are.
For text content, the rules that list `text` run.
For binary content, the rules that list `binary` run.
A rule that still declares `all` runs for both, as before, so existing custom rules keep working. The rules that Secretlint provides do not use `all`.
For unknown content, all rules run.

##### Rules that check binary content

Among the rules that Secretlint provides, only the gcp rule checks binary content, for `.p12` files.

### Look for the keywords of rules in the content

**Overview:** A rule can declare keywords: words that every secret it reports has. Secretlint looks for the keywords of all enabled rules in the content, and runs a rule only for content that has one of its keywords. This keeps the lint fast, and it does not change the results.

**Input:** The content of a source and the keywords of the enabled rules.

**Output:** The rules and the patterns that run for the source.

#### Applicable conditions

##### The same results

The results are the same as the results of running every rule on the whole content.
Looking for keywords only skips work that reports nothing.

##### Any content

Secretlint does not limit the content that it lints: source code in any language, data, logs, and generated files are all linted.
So looking for keywords does not assume what the content is like, such as which characters are common in it.
It uses only the keywords of the enabled rules.

##### The number of keywords

The number of keywords grows as rules are added.
The time of looking for keywords stays about the same when keywords are added.

##### Content without keywords

For a source that has no keyword, a rule that declares keywords does not run.
A rule or a pattern that declares no keyword runs for every source.

##### Text only

Keywords are used for text content. A rule that runs for binary content runs for every binary source.

##### Nothing to set up

A user does not enable it or configure it.

### Give the source to a rule

**Overview:** A rule receives the content of the source and information about it.

**Input:** The source being linted.

**Output:** What a rule can read: the content as a string, whether it had a byte order mark, the file path, the path of the file on the disk, the file extension, the content type, and conversions between positions and indexes in the content.

#### Applicable conditions

##### The content

The content is the text of the source decoded as UTF-8, without the byte order mark.
For binary content, the content is also the bytes decoded as UTF-8, so bytes that are not valid UTF-8 are replaced and the original bytes can not be read from it.

##### The bytes

A rule also receives the bytes of the source when the caller gives them, for every content type.
For a file linted by the command, the bytes are always given.
For the STDIN content, the bytes are not given.
The bytes are the bytes of the file as they are: for binary content they are the original bytes, and for text they include the byte order mark if the file has one.
The bytes can be read until the lint of the source ends. A rule that keeps them after that copies them.

##### Rules that need the bytes

A rule that checks binary content, such as the gcp rule for `.p12` files, uses the bytes and does not read the file.
So the rule gives the same result in Node.js, in browsers, and in the single-executable binary.

##### The path of the file on the disk

The path of the file on the disk is available when the source is a file and the caller allows it.
The rules that Secretlint provides do not read files from it.

#### Exceptional behavior

##### The bytes are not given

When a rule needs the bytes and the caller does not give them, the rule reports nothing for that check, and the lint does not fail.

## Data requirements

### Required data

- **Source:** The content to lint, its file path or the name given for STDIN, the file extension, and the content type. A source from a file also has the bytes of the file during the lint, and rules can read them.
- **Result:** The file path, the content type, and the messages. The result does not have the content.

### Relationships

A source produces one result.

### Personal information

None is collected by Secretlint. A linted file can have any data, including secrets and personal information, and Secretlint keeps it only in memory during the lint.

## External service dependencies

None. The lint runs in the process of Secretlint, and rules do not connect to services.

## Security considerations

The content of a source can have secrets. Secretlint reads it only in memory, and does not write it anywhere except the output that the user chooses, such as the `mask-result` formatter.

## Open questions

None.
