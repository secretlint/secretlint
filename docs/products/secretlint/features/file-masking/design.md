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

For each lint result, the formatter gets the content of the file by calling `getSource` of the formatter options with the file path of the result.
It then replaces the range of each message with `*` of the same length. The length of the content does not change, so the ranges of the other messages stay correct.
The masked contents are joined in the order of the results, without a separator.

The formatter throws an error when the content type of a result is binary, and when the content is not available: `getSource` is missing or returns `undefined`.
An empty string is a content, so an empty file is masked to an empty text and is not an error.

### Where the content comes from

`mask-result` outputs every file, so it needs the content of every linted text file, not only of the files with messages.
When the formatter is `mask-result`, the engine (`@secretlint/node`) reads each file as a string, lints the string, and keeps it for `getSource`.
The content that the formatter masks is the same string that the rules checked, so the file is never read a second time.

For the STDIN content, `getSource` returns the given string.

### Configuration messages

The engine can add a result for the configuration file to the lint results, to show problems of the configuration.
That result has no content, so the engine does not add it when the formatter is `mask-result`.

## Architecture and sequence diagrams

A diagram is not needed. The formatter is one function that maps the lint results to a text, and the flow around it is the flow of Result output.

## Data model and ER diagrams

The formatter uses `sourceContentType` and the `range` of each message of a lint result, and the content from `getSource`. It adds no data.

## APIs and interfaces

The formatter has the same interface as other formatters: it receives the list of lint results and the formatter options, and returns the output text.
Users choose it with `--format=mask-result`.
A program that calls the formatter through `loadFormatter` must pass `getSource`. Without it, the formatter throws for the first result.

## External service integration

None.

## Data handling

The contents of all linted files are kept in memory as strings until the formatter returns, and are joined to create the output.
The output is written by the command to the standard output or to the file of `--output`. With the same path as the linted file, the file is replaced by the masked content.

## Authentication and authorization notes

None. The feature reads and writes the files that the user of the command can read and write.

## Security considerations

The formatter masks the string that the rules checked, as described in [Where the content comes from](#where-the-content-comes-from), so a content that no rule has checked is never output.
The formatter throws before returning any text when one file can not be masked, so a part of the files is never output.

## Deployment notes

None.

## Alternatives considered

### Read files into the shared buffer and decode all of them for `mask-result`

The engine would read files as bytes like for other formatters, and decode every file after its lint.
It was not chosen because `mask-result` needs every content as a string anyway. Reading the file as a string from the start is simpler and has one path for the content.

## Open questions

None.
