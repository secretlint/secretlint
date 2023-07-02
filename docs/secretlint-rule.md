# Secretlint Rule

Secretlint Rule is a npm package.

## Requirements

- `export default ruleCreatorFunction`
    - `ruleCreatorFunction` should have `meta`, `messages`, and `create` function
- Package name should start with `secretlint-rule-*` or `@scope/secretlint-rule-*`

## Example: `@secretlint/secretlint-rule-example`

[@secretlint/secretlint-rule-example](../packages/@secretlint/secretlint-rule-example) is an example package. 

This secretllint rule just do following:

- Found `"secret"` word and report it

Implementation:

- A rule should export `creator` object
  - `messages`: MessageIds
  - `meta`: meta information for the rule
    - `id`: `id` should be equal to `package.json`'s `name`
    - `recommended`(optional): recommended to use 
    - `type`: `"scanner"`
    - `supportedContentTypes`: "text" or "binary" or "all"
      - If specified `["text"]`, secretlint pass the content of text to the rule. 
      - In other words, secretlint does not pass binary content
    - `docs`
      - `url`: document base url. secretlint show `{docs.url}#{MessageId}` in results.
  - `create`: main logic of the rule

`@secretlint/types` package includes type definition for secretlint rule.

```ts
import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

// MessageIds
export const messages = {
    EXAMPLE_MESSAGE: {
        en: (props: { ID: string }) => `found secret: ${props.ID}`,
        ja: (props: { ID: string }) => `secret: ${props.ID} がみつかりました`
    }
};

// export named `creator`
export const creator: SecretLintRuleCreator = {
    // required `messages` property
    messages,
    // meta object for rule
    meta: {
        // rule.meta.id should be same with package.json name
        id: "@secretlint/secretlint-rule-example",
        recommended: false,
        // type
        type: "scanner",
        // support content types: "text" or "binary" or "all"
        supportedContentTypes: ["text"],
        // Documentation Base URL for the package
        docs: {
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-example/README.md"
        }
    },
    // Rule Logic
    create(context) {
        // Create Traslate instance
        const t = context.createTranslator(messages);
        return {
            // source has `content`, `filePath` etc...
            file(source: SecretLintSourceCode) {
                const pattern = /secret/gi;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length];
                    // Report found "secret"
                    context.report({
                        // Replace "found secret: {{ID}}" with `ID` data
                        message: t("EXAMPLE_MESSAGE", {
                            ID: matchString
                        }),
                        range
                    });
                }
            }
        };
    }
};
```

### Test: `@secretlint/secretlint-rule-example`

Secretlint testing is based on Snapshot testing like [Jest](https://jestjs.io/docs/ja/snapshot-testing).

Secretlint provide `@secretlint/tester` for testing.
It will help you to write snapshot testing for your rule.

`@secretlint/tester` supports Node.js's [Test runner](https://nodejs.org/dist/latest-v18.x/docs/api/test.html#test-reporters) for testing as test runner.

- Requires Node.js 18+

There are a template for testing.

`test/index.test.ts`

```ts
import test from "node:test";
import { snapshot } from "@secretlint/tester";
import { creator as rule } from "../src/index.js";

test("@secretlint/secretlint-rule-basicauth", async (t) => {
    await snapshot({
        // Base Config
        // You can override by each snapshot
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-basicauth",
                    rule,
                    options: {}
                }
            ]
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("./snapshots", import.meta.url),
    }).forEach((name, test) => {
        return it(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();  // skip test when update snapshot
            }
        });
    });
});
```

<details>
<summary>CommonJS version</summary>

Basically, recommended to write ESM.
If you have written a rule in CommonJS, you can use dynamic import for loading `@secretlint/tester`.

```js
const test = require("node:test");
const { creator: rule } = require("../src/index.js");
test("@secretlint/secretlint-rule-example", async (t) => {
  const snapshot = (await import("@secretlint/tester")).snapshot;
  return snapshot({
    defaultConfig: {
      rules: [
        {
          id: "@secretlint/secretlint-rule-example",
          rule,
          options: {},
        },
      ],
    },
    updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
    snapshotDirectory: new URL("snapshots", import.meta.url),
  }).forEach((name, test) => {
    return t.test(name, async (context) => {
      const status = await test();
      if (status === "skip") {
        context.skip();
      }
    });
  });
});
```

</details>

Creating test case

- `<snapshots_dir>/<test_case_name>/`
    - `input.*` is input file (any extension)
    - `output.json` is output file that is created by `@secretlint/tester`

```
test/
├── index.test.ts
├── mocha.opts
├── snapshots
│   ├── ng.secret
│   │   ├── input.txt
│   │   └── output.json
│   └── ok.valid
│       ├── input.txt
│       └── output.json
└── tsconfig.json
```


Run Test

```sh
# for .js file
$ node --test test/index.test.js
# for .ts file
$ node --loader ts-node/esm --test test/index.test.ts
```

Update snapshots

```sh
# for .js file
$ UPDATE_SNAPSHOT=1 node --test test/index.test.js
# for .ts file
$ UPDATE_SNAPSHOT=1 node --loader ts-node/esm --test test/index.test.ts
```


For example, `test/snapshots/ng.secret/input.txt` has the following content

```
THIS IS SECRET.
```

The `output.json` for `ng.secret/input.txt` is following json.

```json
{
    "filePath": "[SNAPSHOT]/ng.secret/input.txt",
    "sourceContent": "THIS IS SECRET.",
    "sourceContentType": "text",
    "messages": [
        {
            "message": "found secret: SECRET",
            "range": [
                8,
                14
            ],
            "ruleId": "@secretlint/secretlint-rule-example",
            "loc": {
                "start": {
                    "line": 1,
                    "column": 8
                },
                "end": {
                    "line": 1,
                    "column": 14
                }
            },
            "severity": "error",
            "messageId": "EXAMPLE_MESSAGE",
            "docsUrl": "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-example/README.md#EXAMPLE_MESSAGE",
            "data": {
                "ID": "SECRET"
            }
        }
    ]
}
```

If you ok with the output, please commit it.
If you not ok with the output, fix rule and update snapshots again.

## Publishing

If you want to publish your secretlint rule, see following documents.

### Package Naming Conventions

Secretlint rule package naming should have `secretlint-rule-` prefix.
 
- `secretlint-rule-<name>`
- `@scope/textlint-rule-<name>`
    - secretlint supports [Scoped packages](https://docs.npmjs.com/misc/scope "Scoped packages")

Example: `secretlint-rule-example`

Secretlint user use it following:

```json
{
    "rules": [
      { 
        "id": "secretlint-rule-example"
      }
    ]
}
```

Example: `@scope/secretlint-rule-example`

Secretlint user use it following:

```json
{
    "rules": [
      {
        "id": "@scope/secretlint-rule-example"
      }
    ]
}
```

### Rule Naming Conventions

The rule naming conventions for secretlint are simple:

- If your rule is disallowing something, prefix it with `no-`.
    - For example, `no-todo` disallowing `TODO:` and `no-exclamation-question-mark` for disallowing `!` and `?`.
- If your rule is enforcing the inclusion of something, use a short name without a special prefix.
    - If the rule for english, please uf `secretlint-rule-en-` prefix.
- Keep your rule names as short as possible, use abbreviations where appropriate.
- Use dashes(`-`) between words.

For more details, please see following:

- [package.json | npm Documentation](https://docs.npmjs.com/files/package.json "package.json | npm Documentation")

## Performance

Use `--profile` option for checking performance of your rule .

```
$ secretlint --profile "**/*"
```


## Tips

### Add Word boundary

For example, Use RegExp for finding token-like string:

```js
/(?:ACCESS|access|Access)_?(?:KEY|key|Key)[:=]([A-Za-z0-9/\+=]{12})/
```

It will work, but it has some false-positive.

Because, It will match a token string that longer than 40 characters like follows.

```js
ACCESS_KEY=ENCTRYPEDENCTRYPEDENCTRYPEDTOKEN
```

Litte patch is adding Word boundary `\b` pattern.

```js
/(?:ACCESS|access|Access)_?(?:KEY|key|Key)[:=]([A-Za-z0-9/\+=]{12})\b/
```
