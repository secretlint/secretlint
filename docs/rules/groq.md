# @secretlint/secretlint-rule-groq

A rule for detecting [Groq](https://groq.com/) API keys in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-groq"
        }
    ]
}
```

## MessageIDs

### GROQ_API_KEY

Groq API key is detected.

Groq API keys use the `gsk_` prefix followed by exactly 52 alphanumeric characters.

**NG** examples:

```
gsk_aBcDeFgHiJkLmNoPqRsT1234567890abcdefghijklmnopqrstuv
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
