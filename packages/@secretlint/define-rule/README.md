# @secretlint/define-rule

Define a [secretlint](https://github.com/secretlint/secretlint) rule with declarative patterns.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/define-rule

## Usage

A pattern is a regular expression, its keywords, and a `report()` function.

```ts
import { defineRule } from "@secretlint/define-rule";

export const messages = {
    EXAMPLE_TOKEN: {
        en: (props: { TOKEN: string }) => `found example token: ${props.TOKEN}`,
    },
};
export type Options = {
    allows?: string[];
};
export const creator = defineRule<Options>({
    messages,
    meta: {
        id: "secretlint-rule-example",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    patterns: [
        {
            pattern: /example_[A-Za-z0-9]{32}/g,
            keywords: ["example_"],
            scope: "line",
            report(match, context) {
                if (context.options.allows?.includes(match.text)) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("EXAMPLE_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
});
```

Secretlint scans the content once for the keywords of all rules.
It runs the regular expression of a pattern only where its keywords are found, and calls `report()` for each match.
So a rule does not cost for the files that do not have its keywords.

- `pattern`: the regular expression that finds the secret. Secretlint finds all matches, regardless of the "g" flag.
- `keywords`: every match of the pattern must contain one of the keywords. Keywords are matched ASCII case-insensitively.
  If `keywords` is not defined, the pattern runs for all content.
- `scope`:
    - `"file"` (default): the pattern runs on the whole content.
    - `"line"`: the pattern runs on each line that contains a keyword. A line includes its line break.
      Use `"line"` if a match never includes a line break and the result does not depend on other lines.
      It is faster, because secretlint does not need to read the other lines.
- `report(match, context)`: called for each match.
    - `match.text` is the matched text, and `match.range` is its range in the content.
    - `match.captures` and `match.groups` are the capture groups.
    - `context` is the rule context with `options` (the rule options) and `source` (the source code).

`defineRule()` returns a rule that also works on secretlint that does not support `patterns`:
it creates `create()` that runs the patterns on the whole content, and `meta.keywords` from the keywords of the patterns.

`@secretlint/tester` checks keywords and scopes.
It compares the result with the result of running the patterns on the whole content for each snapshot.

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
