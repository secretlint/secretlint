# @secretlint/secretlint-rule-nuntiq

A rule for detecting [Nuntiq](https://www.nuntiq.com/) API keys in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-nuntiq"
        }
    ]
}
```

## MessageIDs

### NUNTIQ_CUSTOMER_API_KEY

Nuntiq customer API key (`nuntiq_ck_`) is detected.

The format is `nuntiq_<kind>_<environment>_<8 hex key id>_<43 base64url random><6 base62 checksum>`.
`kind` is `ck`, `pk`, or `rs`, and `environment` is `live`, `test`, or `dev`.
The last 6 characters are a checksum (CRC32 of the 43 random characters in base62). A key with a wrong checksum is not reported.

**NG** examples:

```
nuntiq_ck_live_1787e770_Cx3BT1zw4XhBmOwTNnTzqXVssmZWnD8n-XosQLWqXJI0fil7C
```

### NUNTIQ_PARTNER_API_KEY

Nuntiq partner API key (`nuntiq_pk_`) is detected.

**NG** examples:

```
nuntiq_pk_live_326e932b_pcvLCgsshxMD84d2YyG8mqrkXIcXBG0-YhknB7Q6zDU3ggTr8
```

### NUNTIQ_ROTATION_SECRET

Nuntiq key rotation secret (`nuntiq_rs_`) is detected.

**NG** examples:

```
nuntiq_rs_live_21de8760_SqPffdMtVohhIsr6xV3cb9KQeXZ33W2DY2jtbXBeY0Q2ESzMW
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [secretlint#1772: the format proposed by Nuntiq](https://github.com/secretlint/secretlint/issues/1772)
