# Docker Container for secretlint

- https://hub.docker.com/r/secretlint/secretlint

## Built-in

This image has the built-in rules of secretlint, such as [@secretlint/secretlint-rule-preset-recommend](https://www.npmjs.com/package/@secretlint/secretlint-rule-preset-recommend) and [@secretlint/secretlint-rule-pattern](https://www.npmjs.com/package/@secretlint/secretlint-rule-pattern), and this package:

- [@secretlint/secretlint-formatter-sarif](https://www.npmjs.com/package/@secretlint/secretlint-formatter-sarif)

Other rules, such as `@secretlint/secretlint-rule-no-dotenv`, are not included.

## Installation

    docker pull secretlint/secretlint

## Usage

Show help 

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it secretlint/secretlint secretlint  --help

Lint

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it secretlint/secretlint secretlint "**/*"
