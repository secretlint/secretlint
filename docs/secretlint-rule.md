# Secretlint Rule

## Tips

### Add Word boundary

For example, Use RegExp for finding token-like string:

```js
/(?:ACCESS|access|Access)_?(?:KEY|key|Key)[:=]([A-Za-z0-9/\+=]{12})/
```

It will work, but it has some false-positive.

Because, It will match a token string that longer than 40 characters like follows.

```js
ACCESS_KEY=ENCTRYPEDENCTRYPEDENCTRYPEDTOKEN
```

Litte patch is adding Word boundary `\b` pattern.

```js
/(?:ACCESS|access|Access)_?(?:KEY|key|Key)[:=]([A-Za-z0-9/\+=]{12})\b/
```
