# File selection

[日本語](requirements.ja.md)

## About this document

File selection chooses the files that Secretlint lints from the paths and globs that the user gives, and leaves out the files that the user or Secretlint excludes with ignore rules.
The parent Product is [Secretlint](../../product.md).

This document is written for the part of the feature that a change needs: which files are ignored, and what an ignore rule means.

The behavior of ignore rules follows two development principles of the Product: "Reduce false positives" and "Ignore rules mean the same as in Git". A case that is not written in this document is decided from them too. Today the two differ in one point, the case of letters.

### Scope

- The sources of ignore rules: the built-in rules, `.secretlintignore`, the ignore file given by `--secretlintignore`, and `.gitignore` files
- The meaning of an ignore rule
- The case of letters in ignore rules

### Out of scope

- The syntax of the globs that the user gives as the files to lint. It is not written yet.
- Symbolic links. They are not written yet.
- The content type of a chosen file, and the lint of it. They belong to [Secret scanning](../secret-scanning/requirements.md).
- Suppressing a report inside a file that is linted. It belongs to the features "Ignoring by comment" and [Configuration loading](../config-loading/requirements.md).

## User stories

### Leave out the files that Git ignores

As a developer, I want Secretlint to leave out the files that Git ignores so that build output and local files are not reported, without writing the rules again for Secretlint.

**Acceptance criteria:**

Scenario: When a `.gitignore` rule ignores a file, the file is not linted

- Given: A repository has a `.gitignore` with the rule `dist/`, and `dist/app.js` has a secret.
- When: The developer runs `secretlint "**/*"`.
- Then: `dist/app.js` is not linted, and the result has no message for it.

Scenario: When a `.gitignore` in a subdirectory has a rule, it applies to that directory

- Given: `packages/a/.gitignore` has the rule `*.log`, and both `packages/a/debug.log` and `packages/b/debug.log` exist.
- When: The developer runs `secretlint "**/*"`.
- Then: `packages/a/debug.log` is not linted, and `packages/b/debug.log` is linted.

Scenario: When Git and Secretlint read the same `.gitignore`, they ignore the same files

- Given: A repository has `.gitignore` files with any rules that Git accepts, and the names of the files do not differ from the rules only in the case of letters.
- When: The developer runs `secretlint "**/*"`.
- Then: The linted files are the files that Git does not ignore, except the files that the built-in rules and `.secretlintignore` ignore.

Scenario: When the developer turns off `.gitignore`, the ignored files are linted

- Given: A repository has a `.gitignore` with the rule `dist/`, and `dist/app.js` has a secret.
- When: The developer runs `secretlint --no-gitignore "dist/**/*"`.
- Then: `dist/app.js` is linted.

### Leave out files only for Secretlint

As a developer, I want to list files in `.secretlintignore` so that files that are committed, such as test fixtures, are not reported.

**Acceptance criteria:**

Scenario: When a `.secretlintignore` rule ignores a file, the file is not linted

- Given: `.secretlintignore` has the rule `test/fixtures/`, and a file in the directory has a secret.
- When: The developer runs `secretlint "**/*"`.
- Then: The file is not linted.

Scenario: When a rule differs from the name of a file only in the case of letters, the file is ignored on every OS

- Given: `.secretlintignore` has the rule `Fixtures/`, and the directory on the disk is `fixtures/`.
- When: The developer runs `secretlint "**/*"` on Linux, macOS, or Windows.
- Then: The files in `fixtures/` are not linted on any of them.

### Use one ignore file that the developer gives

As a developer, I want to give one ignore file with `--secretlintignore` so that a shared ignore file outside the project, or one in another directory of the project, decides the files to leave out.

**Acceptance criteria:**

Scenario: When the developer gives an absolute path, the rules of that file are used from the working directory

- Given: `/shared/ignore` has the rule `test/fixtures/`, and `test/fixtures/key.pem` in the working directory has a secret.
- When: The developer runs `secretlint "**/*" --secretlintignore=/shared/ignore`.
- Then: `test/fixtures/key.pem` is not linted.

Scenario: When the developer gives a relative path with a directory, it is found from the working directory

- Given: `config/ignore` has the rule `dist/`, and `dist/app.js` has a secret.
- When: The developer runs `secretlint "**/*" --secretlintignore=config/ignore`.
- Then: `dist/app.js` is not linted.

Scenario: When the developer gives a file, the `.secretlintignore` files of the project are not read

- Given: `.secretlintignore` has the rule `a.txt`, `sub/.secretlintignore` has the rule `c.txt`, and `config/ignore` has the rule `b.txt`.
- When: The developer runs `secretlint "**/*" --secretlintignore=config/ignore`.
- Then: `b.txt` is not linted, and `a.txt` and `sub/c.txt` are linted.

Scenario: When the given file does not exist, a warning is shown and no file is ignored by it

- Given: `missing-ignore` does not exist in the working directory.
- When: The developer runs `secretlint "**/*" --secretlintignore=missing-ignore`.
- Then: A warning that names the file is written to the standard error, and the files are linted as if the option and the `.secretlintignore` files were not there.

## KPIs

None for this part of the feature.

## Functional requirements

### Ignore files by rules

**Overview:** A file that an ignore rule matches is not linted.

**Input:** The files found from the paths and globs of the user, and the ignore rules.

**Output:** The files to lint.

#### Applicable conditions

##### The sources of ignore rules

- **Built-in rules:** `.git` and `node_modules` directories, the configuration files of Secretlint (`.secretlintrc` and its `.json`, `.yaml`, `.yml`, and `.js` forms), and files whose names start with `.secretlintignore`. They are always ignored.
- **`.secretlintignore`:** Read in every directory, like `.gitignore`, when `--secretlintignore` is not given.
- **The file given by `--secretlintignore`:** Only this one file is read, and the `.secretlintignore` files are not. A relative path is resolved from the working directory, and the rules are matched from the working directory, like the file of `core.excludesFile` in Git. The API (`runSecretLint()` and `searchFiles()` with `ignoreFilePath`) works the same.
- **`.gitignore`:** Used by default. `--no-gitignore` turns it off.

`.secretlintignore` and `.gitignore` can be in any directory. Their rules apply to that directory and the directories below it.

##### The meaning of a rule

A rule means what the same rule means in a `.gitignore` of Git (the principle "Ignore rules mean the same as in Git"). This includes:

- The last rule that matches a path decides, and a rule that starts with `!` includes the path again.
- A rule in a deeper directory is stronger than a rule in a directory above it.
- A file in an ignored directory is ignored, and a rule can not include it again.
- A rule that Git does not accept, such as an unclosed `[`, matches nothing.

The built-in rules are evaluated as if they were written in an ignore file at the working directory, before the other rules.

##### The case of letters

A rule matches a name without regard to the case of the letters A to Z, on every OS.

Git decides it by the file system of the repository: on macOS and Windows a rule usually matches without regard to case, and on Linux it does not.
So a rule whose case differs from the name of a file ignores the file on the machine of one developer and not in CI.
Matching without regard to case ignores every file that the other way ignores (the principle "Reduce false positives"), and it gives the same files on every OS.
A user who wants to lint a file whose name differs from an ignored name only in case can not do it with ignore rules. This is accepted.

#### Exceptional behavior

##### An ignore file can not be read

When a `.secretlintignore` or `.gitignore` does not exist or can not be read because of its permission, it is treated as an empty file, and the command continues.

When the file given by `--secretlintignore` does not exist, a warning that names the file is written to the standard error, the file is treated as an empty file, and the command continues. The developer named the file, so it is not skipped silently. When it exists but can not be read, the command fails, because linting without the rules that the developer gave would report the files that the developer meant to leave out.

##### All files are ignored

When the paths and globs match files but all of them are ignored, the command does not fail because no file was found.

## Data requirements

### Required data

- **Ignore rule:** A line of an ignore file, or a built-in rule, and the directory it applies to.

### Relationships

A directory has the rules of its own ignore files and of the directories above it.

### Personal information

None.

## External service dependencies

None. Git is not run: Secretlint reads the ignore files itself, so it works where Git is not installed and in a directory that is not a Git repository.

## Security considerations

An ignore file can be written by someone whom the user does not trust, for example in a pull request. A rule in it can exclude files, but it must not make the command hang.

A file that is ignored is not linted, so a secret in it is not reported. An ignore rule that is too wide hides secrets. Files that Git ignores are not committed, so a secret in them does not reach the repository by a commit.

## Open questions

- **Other ignore files of Git:** Git also reads `.git/info/exclude` and the file of `core.excludesFile`. Secretlint does not read them. Whether it should is not decided. Until then they are not read. Decided by the maintainer.
