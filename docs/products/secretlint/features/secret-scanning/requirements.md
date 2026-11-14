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
- Scaling to a very large number of files, by using several CPU cores to look for keywords
- Looking for keywords apart from the lint, for a program that calls `@secretlint/core`

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

### Lint a very large number of files

As a developer of a repository with a very large number of files, I want the time of the lint to scale with my machine, not only with one CPU core, so that Secretlint stays usable as the repository grows. The results are the same, and there is nothing to set up.

**Acceptance criteria:**

Scenario: When many files are linted, the results are the same and the lint ends sooner

- Given: A repository has tens of thousands of files, and the machine has several CPU cores.
- When: The developer runs `secretlint "**/*"`.
- Then: The output and the exit status are the same as with one CPU core, with the results in the same order, and the lint takes less time.

Scenario: When few files are linted, no other CPU core is used

- Given: A repository has a few hundred small files.
- When: The developer runs `secretlint "**/*"`.
- Then: Secretlint does not start work on another CPU core, and the results are the same as before.

Scenario: When a rule is a custom rule, it runs as before

- Given: The configuration has a custom rule that keeps state in its module.
- When: The developer lints many files.
- Then: The rule is loaded once and runs for one file at a time, as with one CPU core.

Scenario: When the work on another CPU core fails, the lint still ends with the same results

- Given: Many files are linted, and the work that Secretlint started on another CPU core fails.
- When: The lint goes on.
- Then: The results are the same as with one CPU core, and no error is shown for the failure.

### Look for keywords in the threads of a tool

As a tool integrator, I want to look for keywords apart from running the rules so that my tool can do that work in its own threads, such as Web Workers, while the rules run in one place.

**Acceptance criteria:**

Scenario: When the result of looking for keywords is given, the lint has the same result

- Given: A tool looked for the keywords of the configuration in the bytes of a source.
- When: The tool calls `lintSource()` with the source and that result.
- Then: The result is the same as `lintSource()` without it, and Secretlint does not look for keywords in the bytes again.

Scenario: When the given result is for other keywords, it is not used

- Given: A tool has a result of looking for the keywords of another configuration.
- When: The tool calls `lintSource()` with the source and that result.
- Then: The result is the same as `lintSource()` without it.

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

### Scale to a very large number of files

**Overview:** The time of the lint should not grow only in proportion to the number of files on one CPU core. When the command or the Node.js API lints many files, Secretlint looks for keywords on several CPU cores at the same time. The rules run in one place, one file at a time, as before.

**Input:** The files to lint and the keywords of the enabled rules.

**Output:** The same results as with one CPU core.

#### Applicable conditions

##### Scaling

With one CPU core, the time of the lint grows in proportion to the number and the size of the files, and a very large repository has to wait for that one core.
With several CPU cores, the lint of a very large number of files takes less time than with one core, and the more files there are, the larger the difference is.
The lint of a small number of files does not become slower for this.

##### Why looking for keywords is the part to do at the same time

Secretlint runs on Node.js, and Node.js runs JavaScript on one thread.
So files are linted one after another, and with many files the time of the lint has a limit that one CPU core sets.
Most of that time goes to looking for keywords.
Running the rules costs little, because the rules run only for the few sources that the keywords select.
So what Secretlint does at the same time on several CPU cores is the part that narrows down the sources: reading the files and looking for keywords.

##### Narrowing down to the files that a rule runs for

A keyword alone selects more files than the rules report for. For example, a keyword such as `https://` is in many files, and a pattern matches only a few of them.
So the part that is done on several CPU cores narrows down to the files that a rule runs for: it also tells the content type of a file, and it checks the lines that have a keyword with the regular expression of the pattern of that keyword.
The place where the rules run gets only the files that a rule runs for, so it does not become the limit when many files have a keyword.

##### A file is read once

Reading files can be the largest part of the time, more than looking for keywords, depending on the machine.
So reading is also done on several CPU cores, and no file is read twice.

##### Rules without keywords

A rule without keywords runs for every file, so every file reaches the rules.
Reading the files, looking for keywords, and checking the lines are still done on several CPU cores. The rules run in one place, so in this case the time of the rules sets the limit.

##### The cost of starting

Starting work on another CPU core takes time, and that time is lost when the lint is short.
Secretlint keeps this cost small: no rule is loaded on another CPU core, so the cost does not grow with the code of the rules in the configuration.
What another CPU core gets from the rules is data: the keywords and the regular expressions of the patterns.

##### The same results

The messages, the order of the results, the output, and the exit status are the same as with one CPU core.
A report is created only by a rule, from the content that the rule reads.

##### When other CPU cores are used

Starting work on another CPU core has a cost, so Secretlint does not start it when the lint is too short to gain from it, such as a lint of few files.
How the work is divided between the CPU cores, and how many are used, is decided in the Design from measurements.

##### The number of CPU cores

Secretlint uses at most the number of CPU cores that the operating system gives to the process.

##### Rules

Rules are loaded once and run on one thread.
A rule does not need to be safe for threads, and a custom rule needs no change.

##### Where it applies

It applies to linting files with the command and with `@secretlint/node`, in every way the command is distributed, including the single-executable binary.
It does not apply to the STDIN content, which is one source.

##### The core starts no thread

`@secretlint/core` does not start threads, so it runs in browsers as before.
The caller of the core chooses where to look for keywords. See "Look for keywords apart from the lint".

##### Nothing to set up

A user does not enable it or configure it.

##### Seeing what happened

`--profile` runs the lint in the same way as without it, and shows how many threads looked for keywords, with the time and the number of files of each thread. See [Performance profile](../performance-profile/requirements.md).

#### Exceptional behavior

##### The `mask-result` formatter

Other CPU cores are not used, because the formatter needs the content of every file.

##### A failure on another CPU core

When the work on another CPU core fails, the files of that work are linted as with one CPU core.

##### A file that can not be read

The error is the same as with one CPU core.

##### A file that changes during the lint

Secretlint reads a file once. The keywords and the rules use the same content, so a change of the file during the lint can not make them differ.

### Look for keywords apart from the lint

**Overview:** A program that calls `@secretlint/core` can look for keywords as a separate step, and give the result to `lintSource()`. The step also tells if a rule runs for the source. So the program can do this step in its own threads.

**Input:** A configuration, and the bytes of a source.

**Output:** What to look for, as data that can be sent to another thread. The result of looking for it in the bytes. The result of the lint.

#### Applicable conditions

##### Without rules

Looking for keywords needs only the keywords, and checking the lines that have a keyword needs only the regular expressions of the patterns. Both are data. The step does not load rules or the configuration, and it does not depend on Node.js.

##### The same result

`lintSource()` with the result of this step returns the same result as without it.

##### Sources that no rule runs for

The result tells if a rule that has keywords runs for the source. No such rule runs if the source has no keyword, or if no pattern matches the lines that have its keyword.
The program can tell from the configuration whether a rule runs without keywords. If no rule does, the program does not need to lint a source that no rule runs for.

#### Exceptional behavior

##### A result for other keywords or patterns

`lintSource()` does not use a result that is not for the keywords and the patterns of its configuration and the content type of the source. It looks for keywords by itself.

##### A result for other bytes

The program gives a result only for the same bytes as the source. `lintSource()` can not check it.

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

- Is an option needed to turn off other CPU cores or to limit their number? ESLint has `--concurrency`.
- Should the number of CPU cores have a limit on a machine with many cores? It was measured only on 4 cores. ripgrep limits it to 12.
- With a rule without keywords, the rules on one thread are the limit. Should such a rule be able to declare keywords?
