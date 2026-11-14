# @secretlint/secretlint-rule-openai

A secretlint rule for OpenAI.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## MessageIDs

### OPENAI_TOKEN

> found OpenAI API Token: {{KEY}}

OpenAI API tokens should be private.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## Examples

```json5

{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-openai",
            // Ignore error related to IDs
            "allowMessageIds": ["OPENAI_TOKEN"],
            "options": {
                // allow list
                "allows": ["/IT_IS_PUBLIC/"]
            }
        }
    ]
}
```
