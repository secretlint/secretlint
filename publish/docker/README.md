# Docker Container for secretlint

- https://hub.docker.com/r/secretlint/secretlint

## Built-in

This Image has built-in packages:

- [@secretlint/secretlint-rule-preset-recommend](https://www.npmjs.com/package/@secretlint/secretlint-rule-preset-recommend) 
- [@secretlint/secretlint-rule-pattern](https://www.npmjs.com/package/@secretlint/secretlint-rule-pattern)
- [@secretlint/secretlint-formatter-sarif](https://www.npmjs.com/package/@secretlint/secretlint-formatter-sarif)

## Installation

    docker pull secretlint/secretlint

## Usage

Show help 

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it secretlint/secretlint secretlint  --help

Lint

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it secretlint/secretlint secretlint "**/*"
