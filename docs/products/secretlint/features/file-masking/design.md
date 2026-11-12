# File masking design

[日本語](design.ja.md)

## About this document

This document describes how [File masking](requirements.md) of [Secretlint](../../product.md) is realized by the `mask-result` formatter.

### Audience

People and agents who change the `mask-result` formatter or the data that formatters receive.

### Prerequisites

The Requirements of this feature, and the Requirements of [Result output](../result-output/requirements.md), which describe how a formatter is chosen and how its text is output.

### Outside this document

How a formatter is loaded and how the output is written. How rules decide the range of a message.

## Implementation approach

`mask-result` is a formatter of Secretlint itself in `@secretlint/formatter`.
It receives the lint results of all files, like every formatter, and returns the masked contents as one text.

For each lint result, the formatter takes the content of the file from `sourceContent` of the result.
It then replaces the range of each message with `*` of the same length. The length of the content does not change, so the ranges of the other messages stay correct.
The masked contents are joined in the order of the results, without a separator.

The formatter throws an error when the content type of a result is binary, and when `sourceContent` is empty or missing.
The check does not distinguish an empty string from a missing content, so an empty file is an error.
The reason of this behavior for an empty file is unknown.

### Where the content comes from

The engine (`@secretlint/node`) reads files into one shared buffer, and the lint result decodes the content only when `sourceContent` is read.
`mask-result` reads `sourceContent` of every result after all files are linted, so the buffer no longer has the files, and each file is read again from the disk.
When the size or the time stamps of a file differ from the time of the lint, reading throws an error. This keeps the output to the content that the rules checked.

For the STDIN content, the lint result has the given string, and nothing is read from the disk.

### Configuration messages

The engine can add a result for the configuration file to the lint results, to show problems of the configuration.
That result has no content, so the engine does not add it when the formatter is `mask-result`.

## Architecture and sequence diagrams

A diagram is not needed. The formatter is one function that maps the lint results to a text, and the flow around it is the flow of Result output.

## Data model and ER diagrams

The formatter uses `sourceContent`, `sourceContentType`, and the `range` of each message of a lint result. It adds no data.

## APIs and interfaces

The formatter has the same interface as other formatters: it receives the list of lint results and the formatter options, and returns the output text.
Users choose it with `--format=mask-result`.

## External service integration

None.

## Data handling

The contents of all linted files are decoded and joined in memory to create the output.
The output is written by the command to the standard output or to the file of `--output`. With the same path as the linted file, the file is replaced by the masked content.

## Authentication and authorization notes

None. The feature reads and writes the files that the user of the command can read and write.

## Security considerations

The check of the size and the time stamps described in [Where the content comes from](#where-the-content-comes-from) prevents the output of content that no rule has checked.
The formatter throws before returning any text when one file can not be masked, so a part of the files is never output.

## Deployment notes

None.

## Alternatives considered

There is no record of alternatives.

## Open questions

None.
