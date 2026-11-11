---
name: 'new-rule'
root: '.'
output: '**/*'
ignore: [ ]
questions:
  name: 'Please enter a rule name. (e.g. shopify)'
  owner: 'Please enter a rule owner. (e.g. azu)'
  version: 'Please enter a secretlint version'
---

# `@secretlint/core/src/builtin/rules/{{ inputs.name }}/README.md`

```
{{ read "new-rule/README.md" }}
```

# `@secretlint/core/src/builtin/rules/{{ inputs.name }}/index.ts`

```
{{ read "new-rule/src/index.ts" }}
```

# `@secretlint/core/test/builtin/rules/{{ inputs.name }}/snapshots/ng.secret/input.txt`

```
{{ read "new-rule/test/snapshots/ng.secret/input.txt" }}
```

# `@secretlint/core/test/builtin/rules/{{ inputs.name }}/snapshots/ok.valid/input.txt`

```
{{ read "new-rule/test/snapshots/ok.valid/input.txt" }}
```
