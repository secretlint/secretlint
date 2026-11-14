# @secretlint/secretlint-rule-anthropic

A rule for detecting Anthropic Claude API keys in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-anthropic"
        }
    ]
}
```

## MessageIDs

### ANTHROPIC_API_KEY

Anthropic Claude API key is detected.

**NG** examples:

```
sk-ant-api03-R2D2C3P0BEEP_BOOP_BUZZ_WHIRR_CLICK_SPIN_TURN_JUMP_SKIP_HOP_DANCE_SING_PLAY_WORK_LEARN_GROW_LOVE_LIVEigAA
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
