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
