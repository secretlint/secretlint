# Change Log

## 0.7.4

### Patch Changes

-   Updated dependencies [4d0413a]
    -   secretlint@0.8.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.7.3](https://github.com/secretlint/secretlint/compare/v0.7.2...v0.7.3) (2020-03-01)

**Note:** Version bump only for package @secretlint/quick-start

## [0.7.2](https://github.com/secretlint/secretlint/compare/v0.7.1...v0.7.2) (2020-03-01)

**Note:** Version bump only for package @secretlint/quick-start

## [0.7.1](https://github.com/secretlint/secretlint/compare/v0.7.0...v0.7.1) (2020-03-01)

### Bug Fixes

-   **quick-start:** add config/ as files ([15488ec](https://github.com/secretlint/secretlint/commit/15488ecedd6ce72f8593cb3b4c5186201e7926cb))

# [0.7.0](https://github.com/secretlint/secretlint/compare/v0.6.0...v0.7.0) (2020-03-01)

### Bug Fixes

-   **quick-start:** fix bin script name ([#70](https://github.com/secretlint/secretlint/issues/70)) ([8887af1](https://github.com/secretlint/secretlint/commit/8887af1adb411ba8dacce0e3e5a497f0bb822c85))
-   **quick-start:** fix env type ([9a797ac](https://github.com/secretlint/secretlint/commit/9a797ace78bf17141a89c11dbae740fdb9b233e7))

### Features

-   **quick-start:** add @secretlint/quick-start module ([8c7c298](https://github.com/secretlint/secretlint/commit/8c7c298a0aa2cff6c03278006aacbf2468e232b1))

# @secretlint/quick-start

## 0.6.2

### Patch Changes

-   8887af1: Fix to work `secretlint/quick-start`:

    ```
    npx @secretlint/quick-start "**/*"
    ```

    Refer to `@secretlint/quick-start`'s `quick-start` script by default.

## 0.6.1

### Patch Changes

-   c679a7d: # Quick Start

    We have introduce `@secretlint/quick-start` package.

    It will be used in "Quick Start" section on README.

    ```markdown
    ## Quick Start

    You can try to use Secretlint on your project at one command.

    If you already have installed Docker:

        docker run -v `pwd`:`pwd` -w `pwd` -it secretlint/secretlint secretlint "**/*"

    If you already have installed Node.js:

        npx @secretlint/quick-start "**/*"

    After running,
    If you got empty result and exit status is `0`, your project is secure.
    Otherwise you got some error report, your project includes credential as plain format.

    You want to get continuous security, Please see following installation guide and setup pre-commit hook and CI.
    ```
