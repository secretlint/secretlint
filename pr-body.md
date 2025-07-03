feat: add @secretlint/secretlint-rule-anthropic for detecting Anthropic Claude API keys

## Description

This PR adds a new secretlint rule for detecting Anthropic Claude API keys.

## Changes

- **New Rule**: `@secretlint/secretlint-rule-anthropic`
- **Pattern Detection**: Detects API keys with format `sk-ant-api0X-...AA`
- **Comprehensive Testing**: Includes test cases for both positive and negative scenarios
- **Documentation**: Complete README with usage examples

## Features

### Supported API Key Formats
- `sk-ant-api03-...` (original format)
- `sk-ant-api04-...` (newer format)

### Detection Pattern
- Uses regex: `/sk-ant-api0\d-[A-Za-z0-9_-]{90,128}AA/g`
- Matches keys that start with `sk-ant-api0` followed by a digit
- Validates proper length (90-128 characters in the middle section)
- Ensures keys end with `AA`

### Avoids False Positives
- ❌ Does not detect `ssk-ant-api04-` (typos with double 's')
- ❌ Does not detect `sk-ant-api02-` or `sk-ant-api05-` (unsupported versions)
- ❌ Does not detect `sk-openai-` (different service)

## Testing

- ✅ All existing tests pass
- ✅ New rule has comprehensive test coverage
- ✅ Snapshot tests ensure consistent behavior
- ✅ Tests both valid and invalid API key formats

## Usage

Add to `.secretlintrc.json`:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-anthropic"
    }
  ]
}
```

## Related

Based on GitGuardian's detection specifications for Anthropic Claude API keys.

Fixes potential security issues by preventing Anthropic API keys from being committed to repositories.
