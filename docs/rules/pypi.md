# @secretlint/secretlint-rule-pypi

A rule for detecting [PyPI](https://pypi.org/) API tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-pypi"
        }
    ]
}
```

## MessageIDs

### PYPI_API_TOKEN

PyPI API token is detected. The token is `pypi-AgEIcHlwaS5vcmc` (`pypi-` and the encoded header for `pypi.org`) followed by 50 to 22,000 URL-safe Base64 characters (a token scoped to many projects is long).

**NG** examples:

```
pypi-AgEIcHlwaS5vcmcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [PyPI: API tokens](https://pypi.org/help/#apitoken)
- [Warehouse: macaroon service](https://github.com/pypi/warehouse/blob/main/warehouse/macaroons/services.py)
