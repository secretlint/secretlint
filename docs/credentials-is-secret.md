# Credentials is secret

In almost case, A raw credentials data is secret.

Raw credentials is a token value, user name and password for any services.
For examples, slacks's Webhook URl includes access token for the channel.

> https://hooks.slack.com/services/T11111AA/BAAAA111A/qKirRWalryBGqKirRWalryBG 

This is a credential and you should not export it in public.

## How to hide a credentials

### Environments variables

If you can use environments variables, you should use environments variables instead of raw credentials data.

`main.js` in Node.js
```js
const CREDENTIAL = process.env.CREDENTIAL;
console.log(CREDENTIAL);
```

Run the script with environments variables.

```
CREDENTIAL=XXXX node main.js
```

Related:

- [The Twelve-Factor App: III. Config](https://12factor.net/config)


If you want to the credential in CI service, use environments variables instead of raw credentials value.
Almost CI service also support environments variables for secret data.

- Travis CI: <https://docs.travis-ci.com/user/environment-variables/>
- Circle CI: <https://circleci.com/docs/2.0/env-vars/>
- GitHub Actions: <https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables>

### Encrypt credentials

You should use encrypted credentials instead of raw credentials data.

You can integrate Key Management Service (KMS) and embed encrypted credentials.

- [bitnami-labs/sealed-secrets: A Kubernetes controller and tool for one-way encrypted Secrets](https://github.com/bitnami-labs/sealed-secrets)
- [godaddy/kubernetes-external-secrets: Integrate external secret management systems with Kubernetes](https://github.com/godaddy/kubernetes-external-secrets)
- [shyiko/kubesec: Secure Secret management for Kubernetes (with gpg, Google Cloud KMS and AWS KMS backends)](https://github.com/shyiko/kubesec)
