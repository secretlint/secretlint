# secretlint

Secretlint CLI that scan secret/credential data.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install secretlint

## Usage

    Usage
      $ secretlint [file|glob*]
 
    Note
      supported glob syntax is based on picomatch (the engine used by micromatch)
      https://github.com/micromatch/picomatch#globbing-features
      https://github.com/micromatch/micromatch#matching-features
 
    Options
      --init             setup config file. Create .secretlintrc.json file from your package.json
      --format           [String] formatter name. Default: "stylish". Available Formatter: ${getFormatterList()
          .map((item) => item.name)
          .join(", ")}
      --output           [path:String] output file path that is written of reported result.
      --secretlintrc     [path:String] path to .secretlintrc config file. Default: .secretlintrc.*
      --secretlintignore [path:String] path to .secretlintignore file. Default: .secretlintignore
      --stdinFileName    [String] filename to process STDIN content. Some rules depend on filename to check content.
      --no-color         disable ANSI-color of output.
      --no-terminalLink  disable terminalLink of output.
      --no-maskSecrets   disable masking of secret values; secrets are masked by default.
      --no-glob          disable glob pattern interpretation; treat all inputs as literal file paths.
      --no-gitignore     disable .gitignore cascade respect; .gitignore files are
                         respected by default (since v13).

    Options for Developer
      --profile          Enable performance profile. 
      --secretlintrcJSON [String] a JSON string of .secretlintrc. use JSON string instead of rc file.

    Experimental Options
      --locale            [String] locale tag for translating message. Default: en
 
    Examples
      # Scan a single file
      $ secretlint ./README.md

      # Scan all files (wrap glob in double quotes to avoid shell expansion)
      $ secretlint "**/*"
      $ secretlint "source/**/*.ini"

      # Treat inputs as literal paths (for SvelteKit (group) / Next.js [param] etc.)
      $ secretlint --no-glob "src/(auth)/login.ts"

      # Lint STDIN content (filename hint affects which rules apply)
      $ echo "SECRET" | secretlint --stdinFileName=secret.txt

      # Use a custom config file
      $ secretlint "**/*" --secretlintrc=.secretlintrc.custom.json

      # Scan files ignored by .gitignore (e.g. to verify build artifacts)
      $ secretlint --no-gitignore "dist/**/*"

      # Mask secrets in a file in-place
      $ secretlint .zsh_history --format=mask-result --output=.zsh_history

      # Output JSON for programmatic parsing
      $ secretlint "**/*" --format=json --output=secretlint-report.json

      # Output GitHub Actions annotations in CI
      $ secretlint "**/*" --format=github

    Exit Status
      Secretlint exits with the following values:
    
      - 0: 
        - Linting succeeded, no errors found. 
        - Found lint error but --output is specified.
      - 1: 
        - Linting failed, errors found.
      - 2: 
        - Unexpected error occurred, fatal error.


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
