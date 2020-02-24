# Secretlint [![Actions Status](https://github.com/secretlint/secretlint/workflows/test/badge.svg)](https://github.com/secretlint/secretlint/actions?query=workflow%3A"test")

Secretlint is pluggable linting tool to prevent commit secret/credential file.

## Purpose

- Scan files and if the file has secret and report it
- Prevent to commit credential files
- Pluggable architecture

## Motivation

- [git-secrets](https://github.com/awslabs/git-secrets) is useful, but it is hard to setup per project.
	- It main use-case is globally installation
	- Secretlint want to install for a project and customize setting per project.
- [repo-security-scanner](https://github.com/UKHomeOffice/repo-security-scanner), [Gitleaks](https://github.com/zricethezav/gitleaks) and [truffleHog](https://github.com/dxa4481/truffleHog) is good scan tools
	- We need to flexible customize that include ignore by comment, ignore like gitignore
- [detect-secrets](https://github.com/Yelp/detect-secrets) is similar tools, but it adopt opt-out approach
    - Secretlint adopt opt-in approach  
    - We also need to custom plugin by user
		- See [Bring-your own-plugins (BYOP), via --custom-plugins option by KevinHock · Pull Request #255 · Yelp/detect-secrets](https://github.com/Yelp/detect-secrets/pull/255)

## Installation and Usage

**Prerequisites:** Secretlint is written by JavaScript. It require [Node.js 10+](https://nodejs.org/).

You can install Secretlint using [npm](https://www.npmjs.com/):

```
npm install secretlint @secretlint/secretlint-rule-preset-recommend --save-dev
```

You should then set up a configuration file:

```
npx secretlint --init
```

After that, you can run Secretlint on any file or directory like this:

```
npx secretlint "**/*"
```

:memo: Secretlint support [glob pattern](https://github.com/mrmlnc/fast-glob#basic-syntax) and glob pattern should be wrapped by double quote.

It is also possible to install Secretlint globally using `npm install --global`. But, We do not recommended it, some rules may be broken in globally.

## Configuration

Secretlint has a configuration file `.secretlintrc.{json,yml,js}`.

After running `secretlint --init`, you'll have a `.secretlintrc.json` file in your directory.

In it, you'll see some rules configured like this:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend"
    }
  ]
}
```

The `id` property is the name of secretlint rule package. 

Secretlint does not have built-in rule.
You want to add some rule and You should **install** the package and **add** the rule to `.secretlintrc` file.


Each rule has same configuration pattern

- `options`: Option definition for the rule. For more details, see each rule documentation
- `disabled`: If `disabled` is `true`, disable the rule

Example, `@secretlint/secretlint-rule-example` has `allows` options, but the rule is disabled.

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-example",
      "options": {
        "allows": [
          "/dummy_secret/i"
        ]
      },
      "disabled": true
    }
  ]
}
```

## Rule Packages

Secretlint rules are implemented as separated modules.

- [@secretlint/secretlint-rule-npm](./packages/@secretlint/secretlint-rule-npm)
- [@secretlint/secretlint-rule-aws](./packages/@secretlint/secretlint-rule-aws)
- [@secretlint/secretlint-rule-privatekey](./packages/@secretlint/secretlint-rule-privatekey)
- [@secretlint/secretlint-rule-basicauth](./packages/@secretlint/secretlint-rule-basicauth)
- [@secretlint/secretlint-rule-slack](./packages/@secretlint/secretlint-rule-slack)

Also, Secretlint provide rule preset that package some rule set.

- [@secretlint/secretlint-rule-preset-recommend](./packages/@secretlint/secretlint-rule-preset-recommend)
    - Recommended rule set

## Integration

### Pre-commit Hook

You can use Secretlint with a pre-commit tool.
This can prevent to commit secret data by linting with Secretlint.

#### [Husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged)

Install [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged):

```
npm install husky lint-staged --save-dev
```

Edit `package.json`:

```json5
{
  // ...
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*": [
      "secretlint"
    ]
  }
}
```

This means that check each staged file by Secretlint before commit. 

## Architecture

### Opt-in instead of Opt-out

Secretlint adopt opt-in approach.

In our experience, linting tools that report various errors by default is difficult to use.
Opt-in approach help to introduce Secretlint increasing.

### A documentation per a Rule

We think a rule as a documentation.

Each rule should have reasonable documentation.

- [ ]  How?

### Why Node.js?

- Package Manager
	- Require pacakge manager to realize flexible pluggable system
	- Node.js has npm and yarn as package manager
	- Package manger help to install custom plugin/rule by user
- Exist Reference Implementation
	- Node.js already has pluggable linting tools like ESLint, textlint, stylelint etc
	- So Node.js user familiar with pluggable linting tools
	- Previously, I created textlint as same approach, so I familiar with Node.js

If you interesting in Docker support, please see [Docker support · Issue #7](https://github.com/secretlint/secretlint/issues/7)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    yarn test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

See also, [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
