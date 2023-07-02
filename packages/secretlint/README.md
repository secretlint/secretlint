# secretlint

Secretlint CLI that scan secret/credential data.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install secretlint

## Usage

    Usage
      $ secretlint [file|glob*]
 
    Note
      supported glob syntax is based on microglob
      https://github.com/micromatch/micromatch#matching-features
 
    Options
      --init             setup config file. Create .secretlintrc.json file from your package.json
      --format           [String] formatter name. Default: "stylish". Available Formatter: ${getFormatterList()
          .map((item) => item.name)
          .join(", ")}
      --output           [path:String] output file path that is written of reported result.
      --no-color         disable ANSI-color of output.
      --no-terminalLink  disable terminalLink of output.
      --maskSecrets      enable masking of secret values. replace actual secrets with "***".
      --secretlintrc     [path:String] path to .secretlintrc config file. Default: .secretlintrc.*
      --secretlintignore [path:String] path to .secretlintignore file. Default: .secretlintignore

    Options for Developer
      --profile          Enable performance profile. 
      --secretlintrcJSON [String] a JSON string of .secretlintrc. use JSON string instead of rc file.

    Experimental Options
      --locale            [String] locale tag for translating message. Default: en
 
    Examples
      $ secretlint ./README.md
      # glob pattern should be wrapped with double quote
      $ secretlint "**/*"
      $ secretlint "source/**/*.ini"
      # found secrets and mask the secrets
      $ secretlint .zsh_history --format=mask-result --output=.zsh_history

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
