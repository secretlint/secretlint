## .secretlintignore

The logic of `.secretlintignore` should be put in @secretilnt/core or @secretlint/node.
But, We put it to `secretlint`(cli), because for optimizing performance.

- Slow: `secretlint` search -> @secretilnt/core filter ignored -> @secretilnt/core lint
- Fast: `secretlint` search + ignore -> @secretilnt/core lint

It is trade off about performance.
