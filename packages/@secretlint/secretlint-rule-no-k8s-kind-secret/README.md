# @secretlint/secretlint-rule-no-k8s-kind-secret

A secretlint rule that disallow to use [Kind: Secret](https://kubernetes.io/docs/concepts/configuration/secret/) in Kubernetes repository. 

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-no-k8s-kind-secret

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-no-k8s-kind-secret"
        }
    ]
}
```

## MessageIds

### disallowToUseKindSecret
> disallow to use Kind: Secret in manifest: {{FILE_NAME}}

Kubernetes's [`Kind: Secret`]((https://kubernetes.io/docs/concepts/configuration/secret)) includes credentials as plain format.
It just base64 encoded value.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

So, `Kind: Secret` manifest is not committable file into a repository.

- [Secrets - Kubernetes](https://kubernetes.io/docs/concepts/configuration/secret/)

In GitOps context, you can use another solution like [SealedSecret](https://github.com/bitnami-labs/sealed-secrets), [Vault](https://www.vaultproject.io/) etc...

- [GitOps - Frequently Asked Questions](https://www.weave.works/technologies/gitops-frequently-asked-questions/#manage-secrets)
- [Secret Management - Argo CD - Declarative GitOps CD for Kubernetes](https://argoproj.github.io/argo-cd/operator-manual/secret-management/)

## Options

- No Options

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
