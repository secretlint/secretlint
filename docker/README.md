# Docker Container for secretlint

- https://hub.docker.com/r/secretlint/secretlint

## Installation

    docker pull secretlint/secretlint

## Usage

Show help 

    $ docker run -v `pwd`:`pwd` -w `pwd` -i -t secretlint/secretlint secretlint --help

Lint

    $ docker run -v `pwd`:`pwd` -w `pwd` -i -t secretlint/secretlint secretlint "**/*"
