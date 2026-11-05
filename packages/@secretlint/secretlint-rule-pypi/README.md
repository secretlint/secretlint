# @secretlint/secretlint-rule-pypi

Detect [PyPI API tokens](https://pypi.org/help/#apitoken) in text files.

## Install

```sh
npm install @secretlint/secretlint-rule-pypi
```

## Usage

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [{ "id": "@secretlint/secretlint-rule-pypi" }]
}
```

The rule is also included in `@secretlint/secretlint-rule-preset-canary`.

## MessageIDs

### PYPI_API_TOKEN

A PyPI API token was detected. PyPI uses serialized V2 macaroons with the
`pypi-AgEIcHlwaS5vcmc` prefix identifying the `pypi.org` location. This rule
matches that prefix followed by 50–1000 URL-safe Base64 characters
(`A–Z`, `a–z`, `0–9`, `_`, `-`). It does not match a token inside a word or a
prefix of a longer token. This is format detection; it does not authenticate
with PyPI or check whether a token is active. TestPyPI tokens are not covered.

References: [PyPI API token help](https://pypi.org/help/#apitoken),
[Warehouse macaroon implementation](https://github.com/pypi/warehouse/blob/main/warehouse/macaroons/services.py).

## Options

- `allows: string[]`: ignore matching values using
  [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

## Running tests

```sh
pnpm test
```

All token samples in the tests are synthetic and were never issued by PyPI.

## License

MIT © azu
