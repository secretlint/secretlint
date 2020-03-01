---
"@secretlint/quick-start": patch
---

# Quick Start

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
