# @secretlint/secretlint-rule-{{ inputs.name }}

An example rule for secretlint.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-{{ inputs.name }}"
        }
    ]
}
```

## MessageIDs

### EXAMPLE_MESSAGE

An example error message.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
