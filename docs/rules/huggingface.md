# @secretlint/secretlint-rule-huggingface

A rule for detecting [Hugging Face](https://huggingface.co/) User Access Tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-huggingface"
        }
    ]
}
```

## MessageIDs

### HUGGINGFACE_USER_ACCESS_TOKEN

Hugging Face User Access Token is detected.

A Hugging Face User Access Token starts with the `hf_` prefix followed by exactly 34 alphabetic characters
(see [User Access Tokens](https://huggingface.co/docs/hub/security-tokens)).

**NG** examples:

```
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
