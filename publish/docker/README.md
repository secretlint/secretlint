# Docker Container for secretlint

- https://hub.docker.com/r/secretlint/secretlint

## Rules

This Image has built-in rules:

- [@secretlint/secretlint-rule-preset-recommend](https://www.npmjs.com/package/@secretlint/secretlint-rule-preset-recommend) 

## Installation

    docker pull secretlint/secretlint

## Usage

Show help 

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it secretlint/secretlint secretlint  --help

Lint

    $ docker run -v `pwd`:`pwd` -w `pwd` --rm -it secretlint/secretlint secretlint "**/*"
