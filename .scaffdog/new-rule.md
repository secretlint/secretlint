---
name: 'new-rule'
root: '.'
output: '**/*'
ignore: [ ]
questions:
  name: 'Please enter a rule name. (e.g. shopify)'
  owner: 'Please enter a rule owner. (e.g. azu)'
---

# `@secretlint/secretlint-rule-{{ inputs.name }}/README.md`

```
{{ read "new-rule/README.md" }}
```

# `@secretlint/secretlint-rule-{{ inputs.name }}/LICENSE`

```
{{ read "new-rule/LICENSE" }}
```

# `@secretlint/secretlint-rule-{{ inputs.name }}/package.json`

```
{{ read "new-rule/package.json" }}
```

# `@secretlint/secretlint-rule-{{ inputs.name }}/src/index.ts`

```
{{ read "new-rule/src/index.ts" }}
```

# `@secretlint/secretlint-rule-{{ inputs.name }}/test/index.test.ts`

```
{{ read "new-rule/test/index.test.ts" }}
```

# `@secretlint/secretlint-rule-{{ inputs.name }}/test/snapshots/ng.secret/input.txt`

```
{{ read "new-rule/test/snapshots/ng.secret/input.txt" }}
```

# `@secretlint/secretlint-rule-{{ inputs.name }}/test/snapshots/ok.valid/input.txt`

```
{{ read "new-rule/test/snapshots/ok.valid/input.txt" }}
```
