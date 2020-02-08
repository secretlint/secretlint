# Secretlint

Secretlint is pluggable linting tool to prevent commit secret/credential file.

## Purpose

- Scan files and if the file has secret and report it
- Prevent to commit secret/credential files
- Fix invalid  file?

## Motivation

- [git-secrets](https://github.com/awslabs/git-secrets) is useful, but it is hard to setup per project.
	- It main use-case is globally installation
	- gitlint want to install for a project and customize setting per project.
- [repo-security-scanner](https://github.com/UKHomeOffice/repo-security-scanner), [Gitleaks](https://github.com/zricethezav/gitleaks) and [truffleHog](https://github.com/dxa4481/truffleHog) is good scan tools
	- We need to flexible customize that include ignore by comment, ignore like gitinore
- [detect-secrets](https://github.com/Yelp/detect-secrets) is similar tools, but it apply opt-out approach
	- If you want to disable plugin, use `--no-<plugin>`
	    - Secretlint apply opt-in approach  
    - We need to custom plugin by user
		- See [Bring-your own-plugins (BYOP), via --custom-plugins option by KevinHock · Pull Request #255 · Yelp/detect-secrets](https://github.com/Yelp/detect-secrets/pull/255)

## Usage

We need to your contribution!

- <https://github.com/secretlint/secretlint/issues>

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
