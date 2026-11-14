# Secret scanning design

[日本語](design.ja.md)

## About this document

This document describes how [Secret scanning](requirements.md) of [Secretlint](../../product.md) creates a source, decides its content type, and gives it to the rules.

### Audience

People and agents who change what a rule receives, how files are read for the lint, or which rules run for a content type.

### Prerequisites

The key concepts of the Product, and the Requirements of this feature.

### Outside this document

How files are chosen, how the configuration is loaded, how declarative patterns are checked after the keywords are found, how messages are masked, and how results are shown.

## Implementation approach

A lint has two sides: the caller creates a source, and the core (`@secretlint/core`) lints it.
The caller knows where the content comes from, such as a file, STDIN, or the memory of a tool, and the core does not read anything by itself.
This split is what lets the core run in browsers, as the Product requires.

### Creating a source

A source (`SecretLintRawSource`) has the content as a string, the file path, the file extension, and the content type.
It can also have `contentBytes`, the bytes of the content.
When the bytes are given, the core scans them for the keywords of the rules first, and reads the string only when a rule needs it, because most files have no keyword and decoding them costs more than the scan.

For files, the engine (`@secretlint/node`) uses `@secretlint/source-creator`.
It reads each file into one buffer that is shared by all files, decides the content type, and returns a source whose `content` decodes the buffer as UTF-8 when it is read first.
The buffer has a file only until the next file is read, so the engine lints one file at a time and waits for the result before it reads the next file.
`lintSource()` waits for the rules that return a promise before it returns, so the bytes stay valid for the whole lint of the file.

The content type of a file comes from `istextorbinary`, which checks the file extension and then the bytes.
A file that it calls binary is `binary`, a file that it calls text is `text`, and other files are `unknown`.

The `mask-result` formatter needs the content of every file, so for it the engine reads each file into its own buffer with `createRawSource()` and passes that source to the core, with its bytes.
For STDIN, the engine passes the string with the content type `text`.
A program that calls `lintSource()` directly, such as a tool in a browser, creates the source itself.

### Choosing the rules

The core builds a plan from the configuration once, and keeps a view of the plan for each content type.
A view has the rules whose `meta.supportedContentTypes` include the content type or `all`. For `unknown`, it has all rules.
`meta.keywords` are used only for text. A rule that runs for binary content always runs, because it checks the structure of the content or the file name, not keywords.

### Looking for keywords

The lint of a source has two steps: the keyword scan finds the keywords of the rules in the content, and then the rules and patterns that the keywords select run.
Most sources have no keyword, so most sources end after the first step.

The core collects the keywords of the rules and patterns in the view for text, and builds one keyword matcher for them. The matcher is cached by its keywords.
The matcher is an Aho-Corasick automaton: it reads the content once from the start to the end, and finds all keywords in that one pass.
Keywords are ASCII. They match without the case of ASCII letters by default, and a case-sensitive keyword is compared with the content again after it is found.
Because keywords are ASCII, scanning the UTF-8 bytes finds the same keywords as scanning the decoded string.

When the source has bytes, the core scans the bytes, from after the byte order mark.
If no keyword is found and no rule or pattern runs without keywords, the result has no messages, and the content is never decoded.
If a keyword is found, the core checks the lines that have a keyword on the bytes, and decodes the content only when a pattern or a rule runs.
When patterns run, the core scans the decoded string again, because the patterns need indexes in the string and these differ from indexes in the bytes.

The automaton does one table lookup for each byte, whatever the keywords are.
So its time depends on the size of the content and barely on the number of keywords.
It also has no knowledge about the content. This is why it meets "Any content" and "The number of keywords" of the Requirements.

### Keywords with a guard

A guarded keyword is a keyword and a guard. The guard is a set of ASCII characters and a least count `n`, and it is met at a place if the `n` characters after the keyword are all in the set.
The Design of [Rules and rule presets](../rules-and-presets/requirements.md) describes how a pattern declares a guarded keyword and how the core reads it. This section describes the scan.

#### An entry of the matcher

The matcher is built from entries. An entry is a keyword, whether it is case-sensitive, and a guard or no guard.
Two patterns that declare the same keyword with different guards are two entries that end at the same state of the automaton, and a pattern that declares the keyword without a guard is a third one.
`found` of the hits has one flag for each entry, so a pattern is selected only by its own entry.
The automaton itself does not change: it is built from the keywords, and a guard adds no state.

#### The check is in the scan loop

When the automaton reaches a state that completes a keyword, and an entry of that state has a guard or is case-sensitive, the matcher checks these entries at once, before it records the place.

- If no entry of the state is left, nothing is recorded, and the loop goes on with the next character. This is the case that the guard is for: a keyword such as `00` has millions of places in a large repository, and each of them costs one check and no memory.
- If some entries are left, the place is recorded with an id for the entries that are left. The matcher already creates such ids for the case-sensitive keywords, and the guard uses the same ids.
- A state that has an entry without a guard is always recorded, as before.

The comparison of a case-sensitive keyword moves into this check. Before, it ran after the scan, over the recorded places.

The check of a guard reads the next `n` characters of the input and looks each one up in a table of 128 flags. It fails at the first character that is not in the set, at a character that is not ASCII, and at the end of the input.
It does not change the state of the automaton, and the scan goes on from the same place, so keywords that overlap are all found.
The check never goes back, and `n` is at most 255, so the scan reads each character a limited number of times, whatever the content is. This is how it meets "A cost with a limit" and "Any content" of the Requirements.

#### Bytes and strings

The set of a guard has only ASCII characters. A character of the set is one byte in UTF-8 and one code unit in a string, and a character that is not ASCII never meets a guard.
So the scan of the bytes and the scan of the decoded string meet a guard at the same places, as they find the same keywords.

#### After the scan

A place whose guard is not met is not in the hits, so the steps after the scan need no change.
A line is checked with the regular expression of a pattern only if it has a recorded place of that pattern, and `found`, `lineMatched`, and `runsRules` mean the same as before.
`lintSource()`, the check of the lines, and the engine do not know about guards.

#### On worker threads

`KeywordScanPlan` gets `guards`: for each keyword of the plan, `undefined` or the set as a string of its characters and the least count. It is plain data, and the id of the plan has it.
A worker builds the same matcher from the plan, so it checks the guards in its own scan loop and loads no rule.

#### Why the check is in the loop

The scan of a large repository was measured with ten short keywords of real services added to the keywords of the recommended preset.
Without guards, the scan took about 4 times longer than with the keywords of the preset alone, because the scan recorded tens of millions of places and the lines of these places were checked.
With the guards checked after the scan, over the recorded places, it took about half of that. With the guards checked in the loop, it took about a third of that, close to the time without the ten keywords.
The files that the rules ran for were the same in all three.
With the keywords of the recommended preset alone, a guard changed nothing that could be measured, because these keywords are long and rare. The guard is for the keywords that are added later.

#### A keyword that is shared without a guard

If one entry of a state has no guard, every place of the keyword is recorded. This is the case when another pattern declares the same keyword without a guard, or declares a keyword without a guard that is the end of the guarded keyword.
The results are right, and the pattern with the guard still does not run where its guard is not met, but the scan pays for the places.
The profile shows the count of each guarded keyword, so a rule author sees it.

#### The profile

A matcher that is created for the profile counts, for each entry with a guard, the places where the keyword was found and the places where the guard was met.
Without the profile it does not count, so the loop has no cost for it.

### Looking for keywords on several threads

Node.js runs JavaScript on one thread, so the engine lints files one after another.
A profile of a large repository shows where that one thread spends its time: most of it in the keyword scan, and then in reading files. The rules take little, because they run only for the sources that the keywords select.
So the step to run on several threads is the one that narrows down the sources: read a file and scan it for keywords.

The scan can be made parallel in several ways, and the choice follows from two costs: distribution and start-up.

- A native program or a native add-on needs a build for each platform and a way to ship it. WebAssembly has no platform builds, but it has its own ways to load in Node.js, browsers, and the single-executable binary, and its threads are still started by the host. Per thread, a native scan was also about as fast as the JavaScript scan in the measurements, so only the threads gave a gain.
- Worker threads of Node.js need nothing to ship. Their cost is the start-up: a worker loads its code before it works.

So the scan runs on worker threads, and the design keeps the start-up of a worker small and constant.
A worker that runs `lintSource()` has to load the configuration and every rule, and custom rules can be of any size. Its start-up grows with the rules and it is not constant.
The keyword scan needs no rule: it needs only the keywords, which are strings. The check of the lines that have a keyword needs only the regular expressions of the patterns, which a worker can create from their source and flags. So a worker loads only the keyword matcher and the line check of the core, and it gets the keywords and the regular expressions as data. This code does not grow when rules are added.
The rules stay on the main thread, are loaded once, and run for one file at a time as before.

#### The scan as a step of its own

The core has an entry `@secretlint/core/keyword-scan` for the first step of the lint alone.
It imports only the keyword matcher: no rule, no configuration, and no Node.js module.
`getKeywordScanPlan({ config })` of the core returns what to scan for as plain data: the keywords, which of them are case-sensitive, `requiresKeyword`, `ruleCheck`, and an id of all of these.
`requiresKeyword` is true when no rule or pattern runs without keywords. Then a source without a keyword has no messages.
`ruleCheck` is what tells if a rule runs for a source that has a keyword. It has the "line" scope patterns as the source and the flags of their regular expressions with the indexes of their keywords, and the indexes of the keywords that select a rule for the whole content: the keywords of a rule without patterns and of a "file" scope pattern.
`createKeywordScanner(plan).scan(bytes)` returns the id of the plan, which keywords are in the bytes, `lineMatched`, and `runsRules`.
The scanner decodes each line that has a keyword of a pattern and tests it with the regular expression of the pattern, and `lineMatched` is true if one matches. It is the same check as the one in `lintSource()`: both call one function of the core.
`runsRules` is true if `lineMatched` is true or a keyword for the whole content is found.
`lintSource()` accepts this result as `keywordScanResult`, and uses it in place of its own scan of the bytes and its own check of the lines if the id is the id of its own plan for the content type of the source.
The result does not have the positions of the keywords. A position has a state of the matcher, and a matcher numbers its states as it meets them, so the numbers differ between the matchers of two threads. So the scanner always checks the lines by itself, with the matcher that found the positions, and the result has only what means the same on every thread.

The core does not start workers by itself. A worker needs the URL of a script file, and sharing memory between threads in a browser needs cross-origin isolation, so only the caller knows how to start one. The Node.js engine does it for files, and a tool in a browser can do the same with Web Workers.

#### Reading and scanning the files

The engine (`@secretlint/node`) lints files in one pass. The main thread and the workers share the list of files and a `SharedArrayBuffer` that has the index of the next file and one byte of state for each file.
A thread claims the next 32 files with `Atomics.add`. Because the threads claim from one list, a thread that starts late or fails only handles fewer files, and no file is given to a thread ahead of time.

The main thread does what it did before for the files that it claims: it reads a file and calls `lintSource()`.

A worker does the part that narrows down. It reads a file into a buffer that it reuses, detects the content type from the name and the bytes as the source creator does, and scans the file if it is text. Then it does one of two things.

- If no rule runs for the file, it only writes the state "no messages". This is the case when the file is text, the scan returns `runsRules: false`, and the plan has `requiresKeyword`. The file gets a result without messages, and nobody reads it again.
- Otherwise it hands the file to the main thread: it copies the bytes into the memory of a batch, and when the 32 files are done it moves the batch to the main thread with the content type and the result of the scan. The memory is moved, not copied, and the main thread lints the file from these bytes with `lintSource({ source, keywordScanResult })`. It does not detect the content type or check the lines again.

The check of the lines is in the worker because a keyword selects many more files than a pattern matches, and a line can be very long. If the main thread checked the lines, it would get every file that has a keyword, and it would be the limit.
The content type is detected in the worker for the same reason: a file whose name does not tell the type would otherwise be scanned by the main thread.

So a file is read once, by the thread that claimed it, and the main thread never reads a file that a worker read.
This matters where reading is the main cost: on some machines, reading the files takes more than half of the time of the lint.

A rule without keywords, such as a rule of patterns that a user writes, runs for every file. Then `requiresKeyword` is false, and the workers hand every file. The reads, the scans, and the checks of the lines are still done by the workers, and the main thread runs the rules. In this case the main thread is the limit, because the rules run only there.

Between its own claims, the main thread lets the messages of the workers arrive and lints the handed files first, because they hold memory.
A worker waits before it claims files while the main thread has more than 256MB of handed bytes to lint. So the memory has a limit when the main thread is slower than the workers. Both threads count the size of the memory that is moved, not the size of the files in it, so the count returns to zero.

#### The number of threads

The Requirements only say that a worker is not started when it gives no gain. How the work is divided is decided here from experiments, and the numbers below are the result of the measurements so far. They can change when the measurements change.

The main thread starts the lint alone, so a short lint never pays for a worker, and it runs in the same way as without workers.
After a warm-up of 20ms, it measures how many files it lints in the next 20ms, and estimates the time for the rest of the files.
It starts `floor(rest time / 100ms)` workers, at most `os.availableParallelism() - 1`. 100ms is about the start-up of a worker, so each worker has work for longer than its start-up.
The warm-up is not used for the estimate, because the lint is several times slower until the runtime has optimized it.
The decision uses time, not the number of files, so it follows the size of the files and the speed of the disk.

#### Keeping the results the same

- Messages are created only by the rules on the main thread. When patterns run, the core scans the decoded string as before.
- The bytes that the rules see are the bytes that were scanned: the worker hands the same bytes that it scanned, so a file that changes during the lint can not make the result of the scan and the content differ.
- The result of the scan is used only for a text file, because the plan is for the text content type. A file that is not text is always handed, without a result. The worker detects the content type with the same function and the same bytes as the source creator.
- The check of the lines is one function of the core for the worker and for `lintSource()`. The worker creates the regular expressions from the source and the flags of the ones that the main thread uses, so both test a line in the same way.
- `lintSource()` ignores a result with the id of another plan. The id has the keywords and the patterns, so a result for other patterns of the same keywords is not used.
- A file that a worker could not read, or that a failed worker claimed and did not hand, stays without a result. The main thread lints these files by itself at the end, so the error is the same.
- The results are stored by the index of the file, so the order of the results is the order of the files.
- The order in which the rules see the files is not the order of the files: the main thread lints a handed file when it arrives. A rule gets one source at a time and the core gives it nothing of another source, so a result does not depend on this order. A rule that keeps its own state between files is not supported.
- The engine stops all workers and waits for them when the lint ends, also when it fails. A worker that waits for the main thread would keep the process alive.
- Workers are not used with the `mask-result` formatter, which reads every file as a string.
- The profiler does not change the path: with `--profile` the files are linted in the same way, so the profile shows the run that a user gets. Each worker measures its own time and files, and the engine adds them to the profiler as `@node>keyword-scan-thread`. With `--profile` a worker also measures its tests of lines for each pattern, and the engine adds them to `@core>pattern-line-test`.

#### The single-executable binary

The engine starts a worker from the file `keyword-scan-worker.js` next to its own file.
The single-executable binary is one bundle built with Bun, so it has no such file by default. The build gives the worker as a second entry with the same name, and Bun puts it next to the main entry inside the binary.
The test of the binary checks that a worker starts in it.
A bundle of another tool that does not have the file still works: the worker fails to start, and the files are linted without it.

The measurements of each version are in the pull request of the change, not here, because they depend on the machine and get old.

### What a rule receives

A rule receives a source code object (`SecretLintSourceCode`).
It has `content`, `hasBOM`, `filePath`, `physicalFilePath`, `ext`, `contentType`, and the conversions between locations and indexes.
`content` is the decoded string without the byte order mark, and it is decoded only when a rule reads it.
`physicalFilePath` is `undefined` when the caller sets `noPhysicFilePath`.
`contentBytes` is the bytes that the caller gave as `source.contentBytes`, or `undefined` when the caller gave none.

The bytes are given to rules because a rule that checks binary content needs the original bytes, and `content` of a binary file has lost them in the decoding.
Before this, such a rule had to read the file again with `node:fs`, which does not work in browsers and makes the same rule give different results by environment.
With the bytes on the source code object, a rule depends only on what the caller gives, which is how the core already treats the content.

The core reads `source.contentBytes` once at the start of `lintSource()`, and the same value is used for the keyword scan and for the source code object.
The bytes of the shared buffer of source-creator stay valid until `lintSource()` returns, because the engine waits for the result before it reads the next file and `lintSource()` waits for the rules that return a promise.
So a rule can read `contentBytes` at any time during its handler, including after an `await`.
A rule that keeps the bytes after the lint copies them, because the buffer is reused for the next file. The rules that Secretlint provides do not keep them.

`source.contentBytes` keeps its meaning for text: the UTF-8 encoding of `content`, with an optional byte order mark at the start.
For binary, it is the bytes of the file, and `content` is those bytes decoded as UTF-8. source-creator already does this, so the documentation of the type is changed to say it.

### Rules that check binary content

A rule that checks binary content lists `binary` in `meta.supportedContentTypes`, and also `text` when it checks text files too. Listing the types, instead of `all`, states in the declaration which content the rule checks.
Keywords are not used for binary content, so the rule runs for every binary file. It decides from `filePath` or `ext` whether the file is one it checks, and returns quickly for other files.

The rule reads the bytes from `contentBytes` of the source code object, not from `content` and not from a file.
When `contentBytes` is `undefined`, the rule skips only the checks that need the bytes and reports nothing for them. Checks of text that use `content`, such as a JSON key file, run as before. It does not fall back to reading the file, because the command always gives the bytes, and reading the file would ignore `noPhysicFilePath` and make the result depend on the environment.

The rule does not import a Node.js module statically, because a preset imports its rules statically and one such import stops the preset from loading in a browser. A file name for a message is taken from `filePath` with a small helper instead of `node:path`.
An API that is faster in Node.js but has a standard alternative, such as `node:crypto` for Web Crypto, is imported dynamically and falls back to the standard API when the import fails.
With these conditions, the rule gives the same result in Node.js, in browsers, and in the single-executable binary.

A message for binary content points to the whole file, because positions in the decoded string have no meaning for the bytes.

Among the rules that Secretlint provides, the gcp rule is the one that checks binary content: it verifies the MAC of a `.p12` file with the password that GCP uses for service account keys, and it follows the conditions above.

### Rule tests

`@secretlint/tester` lints each test file twice: once with the bytes, and once with the string only. It checks that both results are the same, because the bytes are only for speed for text.
For binary content the bytes are needed, so the tester compares the two results only for text. For binary, the snapshot is the result with the bytes.

## Architecture and sequence diagrams

```mermaid
sequenceDiagram
    participant Engine as @secretlint/node
    participant Reader as source-creator
    participant Core as @secretlint/core
    participant Rule as rule for binary
    Engine->>Reader: read file
    Reader-->>Engine: source (content getter, contentBytes = shared buffer, contentType)
    Engine->>Core: lintSource(source)
    Core->>Core: choose the view for the content type
    Core->>Rule: file(sourceCode) with contentBytes
    Rule->>Rule: check contentBytes
    Rule-->>Core: report
    Core-->>Engine: result
    Engine->>Reader: read next file (buffer is reused)
```

The lint with worker threads:

```mermaid
sequenceDiagram
    participant Main as main thread (@secretlint/node)
    participant Worker as worker threads (no rules)
    participant Core as @secretlint/core and rules
    Main->>Core: getKeywordScanPlan(config)
    Core-->>Main: plan (keywords and regular expressions as data)
    Main->>Main: lint alone, measure the speed
    opt the rest takes longer than the start-up of a worker
        Main->>Worker: plan, file list, SharedArrayBuffer
    end
    par threads claim 32 files at a time
        loop files of a worker
            Worker->>Worker: read file, detect the content type, scan keywords, check lines
            alt no rule runs for the file
                Worker->>Worker: write the state "no messages"
            else
                Worker-->>Main: bytes, content type, and result of the scan (memory is moved)
                Main->>Core: lintSource({ source from the bytes, keywordScanResult })
                Core-->>Main: result
            end
        end
        loop files of the main thread
            Main->>Main: read file
            Main->>Core: lintSource({ source })
            Core-->>Main: result
        end
    end
```

## Data model and ER diagrams

| Type | Properties | Note |
| --- | --- | --- |
| `SecretLintRawSource` | `content`, `contentBytes?`, `filePath`, `ext?`, `contentType` | Created by the caller. For text, `contentBytes` is the UTF-8 encoding of `content`. For binary, `contentBytes` is the bytes of the file and `content` is those bytes decoded as UTF-8. |
| `SecretLintSourceCode` | `content`, `contentBytes`, `hasBOM`, `filePath`, `physicalFilePath`, `ext`, `contentType`, location methods | Created by the core for the rules. `contentBytes` is new: `Uint8Array \| undefined`, read-only, valid until the lint of the source ends. |

A diagram is not needed, because a source creates one source code object for one lint.

## APIs and interfaces

### `lintSource({ source, options })`

The entry point of the core. It receives a source and the configuration, and returns a result without the content.
It reads `source.contentBytes` once at the start of the call, and `source.content` only when a rule or the result needs it.

### Rule `create(context, options)`

A rule returns handlers, and the `file(source)` handler receives the source code object. The handler can return a promise, and the core waits for it.
`source.contentBytes` is the new property. A rule must not change the bytes, because the core and other rules read the same bytes.
`meta.supportedContentTypes` lists `text` and `binary`. `all` is removed from the type `SecretLintRuleContentType`, and the core still treats `all` as both at runtime, so a JavaScript rule or a published rule that declares `all` keeps working.

### `@secretlint/source-creator`

`createRawSource(filePath)` reads a file into its own buffer. `createFileSourceReader()` returns a reader that reads files into one shared buffer; `contentBytes` of a source is `undefined` after the reader reads the next file, and reading `content` for the first time after that throws.

### `@secretlint/core/keyword-scan`

`createKeywordScanner(plan)` returns a scanner, and `scanner.scan(bytes)` returns a `KeywordScanResult`: the id of the plan, the keywords that were found, `hasKeyword`, `lineMatched`, and `runsRules`.
`createKeywordScanner(plan, { profile: true })` also counts the tests of lines for each pattern, and `scanner.lineTests()` returns them.
`getKeywordScanPlan({ config, locale?, contentType? })` of `@secretlint/core` returns the `KeywordScanPlan` for a configuration, or `undefined` when no rule has keywords.
The plan and the result are plain data and typed arrays, so they can be sent to another thread.
`lintSource({ source, options, keywordScanResult })` uses the result as written in "The scan as a step of its own".

`KeywordScanPlan` has `guards` next to `keywords` and `caseSensitive`: `guards[i]` is `undefined`, or `{ chars, min }` for a keyword with a guard.

## External service integration

None.

## Data handling

The bytes of a file are in the shared buffer until the next file is read. The decoded string is kept by the source while the caller keeps the source.
Rules read the same bytes as the core and do not copy them. No file is read a second time.

## Authentication and authorization notes

None. The lint reads the files that the user of the command can read.

## Security considerations

The bytes and the content can have secrets. They stay in memory and are not written by the core.

## Deployment notes

Removing `all` from the type makes a TypeScript rule that declares `all` fail to compile until it lists `text` and `binary`. Its behavior does not change, because the core still accepts `all`.
Removing a value from a public type is an incompatible change of the public API, so this part is released in a major version, following the versioning rules of the contributing guide.

Adding `contentBytes` to the source code object does not change existing rules.
A program that calls `lintSource()` for a binary file with only the string gets no report from a rule that checks binary content after this change, while such a rule (the gcp rule for `.p12`) read the file before. The release notes tell such a caller to pass `contentBytes`. It is not a breaking change: by the versioning principle of the Product, a major release is for a change that reports more by default, and this change only reports less for such a caller.
This change is made after the built-in rules move into `@secretlint/core`. Then the built-in rules are files of the core, and their packages only re-export them and depend on the core of the same release.
So the configuration resolves a built-in rule from the core that also runs `lintSource()`, and the rule and `contentBytes` always come from the same core.
A program that imports a rule object from a newer package and passes it to `lintSource()` of an older core is not supported, as the rules ship with the core. In that case a rule that checks binary content sees no bytes and reports nothing, without reading the file.

## Alternatives considered

### Disable rules that depend on Node.js in a preset for browsers

A preset for browsers would turn off the rules that need Node.js, and the bundle would be built from it.
It was not chosen because a rule that checks binary content needs only the bytes, so giving the bytes removes the dependency instead of hiding it.
A disabled rule also stays in the bundle, because a preset imports all its rules statically, and its secrets would still not be reported in browsers.

### Give the bytes only for binary content

`contentBytes` would be `undefined` for text.
It was not chosen because the rule would then need to know when the bytes exist, and a later rule that checks text bytes, for example for speed, would need another change. The bytes cost nothing to give, because the core already has them.

### A new property of the raw source for the original bytes

A property such as `originalBytes` would be added for binary, and `contentBytes` would stay only the encoding of `content`.
It was not chosen because source-creator already gives the bytes of the file as `contentBytes` for binary, and the keyword scan already uses them. Writing the existing behavior in the documentation of the type changes nothing for callers, while a second property would make callers pass the same bytes twice.

### Keep reading the file with `node:fs` when the bytes are not given

A rule that checks binary content would read the file when `contentBytes` is `undefined`, as the gcp rule did.
It was not chosen by the maintainer: the command always gives the bytes, the rules are released with the core, and reading the file ignores `noPhysicFilePath` and keeps a Node.js import in the rule.

### Workers that run the rules

Each worker would load the configuration and the rules and run `lintSource()` for a part of the files.
It was not chosen because the start-up of a worker then depends on the rules: it was longer than the start-up of a worker without rules even with only the built-in rules, and custom rules can be of any size, so the cost is not constant.
A rule would also have to load and run in a worker, and results with content would be copied between threads.

### A native program or WebAssembly for the scan

A program in a native language would read the files and scan them on its own threads.
It was not chosen because it needs a build and a way to ship for each platform, and WebAssembly needs a way to load in each environment.
One native thread was about as fast as one JavaScript thread for this work, so the gain was only from threads, which worker threads also give.

### Start workers in the core

`lintSource()` or the core would start workers by itself.
It was not chosen because the core runs in browsers and has no way to start a thread that works everywhere. The caller starts the threads, and the core only splits the scan from the lint.

### Scan all files first, and let the main thread read the files again

The main thread and the workers would scan all files before the lint, and then the main thread would read and lint the files that have a keyword.
This was the first version of this design. It was not chosen because of a configuration with a rule without keywords: then every file has to be linted, so every file was read twice, and the lint became slower than with one thread.

### Check the lines on the main thread

A worker would hand every file that has a keyword, and the main thread would check the lines that have the keyword.
This was the version before the worker got the regular expressions. It was not chosen because a keyword selects many more files than a rule runs for, so the main thread became the limit where many files have a keyword or lines are long.
Sending the regular expressions did not make the start-up of a worker longer in the measurements.

### Workers that only tell which files have a keyword

A worker would send back one flag for each file, and the main thread would scan the files that have a keyword again.
It was not chosen because the files with a keyword are then scanned twice, and it was slower than sending the hits.

### A fixed number of files for each thread

The number of threads would be the number of files divided by a constant, as ESLint does with 50 files for each worker.
It was not chosen because the time of the scan depends on the size of the files, and a constant that fits one repository does not fit another. The threads claim files from one list, so the decision can wait until the speed is measured.

### A sieve before the automaton

A sieve with SIMD instructions in WebAssembly would look at 16 bytes at once and drop the blocks that can not have a keyword, and the automaton would check only the rest.
It was faster with the keywords of today: the sieve kept 5% of the blocks for 65 keywords.
It was not chosen by the maintainer, because the number of keywords grows. With 100 more keywords the sieve kept 66% of the blocks, and with the keywords of another secret scanner (285) it kept 94%, so the sieve only adds work.
A sieve that chooses rare bytes from a table of how common each byte is was also not chosen: Secretlint does not limit the content, so the core does not assume which bytes are common.

### Check the guards after the scan

The scan would record every place of a keyword as today, and a second step would drop the places whose guard is not met.
It needs no change of the scan loop. It was not chosen because the cost of a short keyword is the recording itself: in the measurement above it was about 1.4 times slower than the check in the loop.

### A regular expression as the guard

The guard would be any regular expression that is tested at the place of the keyword.
It was not chosen because a regular expression can go back in the content, so its cost has no limit that the core can state, and the check would depend on how each guard is written. A set of characters and a count is one loop over a table.

### A second automaton for longer keywords

The scan would look for a longer string that has the keyword, in place of a guard.
It was not chosen because what follows a short prefix is random characters of the key. No longer fixed string exists.

## Open questions

- The open questions of the Requirements: an option, and a limit for many cores.
- With a rule without keywords, the main thread is the limit: workers still make a large lint shorter, but less, and a lint that is just long enough to start workers can become a little slower. Whether such a rule can declare keywords is a separate question.
