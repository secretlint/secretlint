# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.2](https://github.com/secretlint/secretlint/compare/v0.1.1...v0.1.2) (2020-02-16)


### Bug Fixes

* **npm:** add dependencies ([1dd1ca3](https://github.com/secretlint/secretlint/commit/1dd1ca373f29fc6c0cddfef03b9527150cf2036d))





## [0.1.1](https://github.com/secretlint/secretlint/compare/v0.1.0...v0.1.1) (2020-02-16)

**Note:** Version bump only for package root





# 0.1.0 (2020-02-16)


### Bug Fixes

* **@secretlint/secretlint-rule-privatekey:** fix ([3f7513e](https://github.com/secretlint/secretlint/commit/3f7513e506cae2deb873c260bf4efa37082609b9))
* **cli:** fix exit status ([04d9b41](https://github.com/secretlint/secretlint/commit/04d9b412fe60eb638d0cb131d95ed4dcfcc4c11a))
* **cli:** fix exitStatus of linting result ([c94ec15](https://github.com/secretlint/secretlint/commit/c94ec15f950821edf18298910a68c11662ff63d2)), closes [#11](https://github.com/secretlint/secretlint/issues/11)
* **cli:** fix ignore error ([329f689](https://github.com/secretlint/secretlint/commit/329f6892f92c3840830bbf7c9feea5d698781074))
* **cli:** support root / in .secretlintignore ([abb94e3](https://github.com/secretlint/secretlint/commit/abb94e3b43509bc694f47a462720f6a0bf392982))
* **config-loader:** rule will be undefined ([9a109a6](https://github.com/secretlint/secretlint/commit/9a109a630c2062890a553c7b4d672b00b4db0724))
* **config-loader:** rule will be undefined ([c0c2bcd](https://github.com/secretlint/secretlint/commit/c0c2bcdbb93536af219ce54bfa8019aff2f748c6))
* **core:** separate options to rules in preset ([1b16638](https://github.com/secretlint/secretlint/commit/1b166380b8174b1e474aab05a9c1e4b4f6bb0d1a))
* **types:** fix type ([08b113c](https://github.com/secretlint/secretlint/commit/08b113cba971f37a1cfb3b0f10bc96f0614c6bcf))
* fix type name ([08d39e8](https://github.com/secretlint/secretlint/commit/08d39e8fb8ce8c4eb7a8ac8087e7da969e3afa8b))
* optional docs ([3d27587](https://github.com/secretlint/secretlint/commit/3d2758776f1bf638086a9bdfc1103c21fcc309a0))


### Features

* **cli:** add `.git` ignore by default ([e6bfe7a](https://github.com/secretlint/secretlint/commit/e6bfe7a7cc5c22b4fdf650054a42e228f289c3ca))
* **cli:** add secretlint --init ([c83751a](https://github.com/secretlint/secretlint/commit/c83751a4362e9d4b44b46b0caa793536f85b2b21))
* **cli:** implement --output-file ([0a33866](https://github.com/secretlint/secretlint/commit/0a33866037774bee6b437401c8c93d2ccea892df))
* **config-loader:** add config-loader ([c56e8a3](https://github.com/secretlint/secretlint/commit/c56e8a3b8f2b1dc5fc6b3306dbd3ef496b31feb5))
* **config-loader:** add validation on loading ([686b879](https://github.com/secretlint/secretlint/commit/686b879928e60e3f886f0af50f3d51d495c364b0))
* **config-validator:** support rule preset validation ([4784e16](https://github.com/secretlint/secretlint/commit/4784e169c1d9504446366dc12edfa53e25bfed32))
* **core:** add basic core ([248e312](https://github.com/secretlint/secretlint/commit/248e3128d09fc73a3d0b247f56ee0c71ee01dae2))
* **core:** check duplicated rule registration ([22db54e](https://github.com/secretlint/secretlint/commit/22db54eea6410f2a64b66c45697d9acdd869698c))
* **core:** support `ruleId` implicitly ([1aa6d5c](https://github.com/secretlint/secretlint/commit/1aa6d5c90c9b62714e45e0b997be6a20c56a208b))
* **core:** support Localization ([845f24a](https://github.com/secretlint/secretlint/commit/845f24a2a5ba1af39a3da8c2b5d487f3f4e6c313))
* **core:** support severity options ([876e936](https://github.com/secretlint/secretlint/commit/876e9360c324232aeade50fd7767fe8bd08907a5))
* **formatter:** add @secretlint/formatter ([2b2d9ab](https://github.com/secretlint/secretlint/commit/2b2d9abe693848c3271abbdb9845feefed582a1e))
* **messages-to-markdown:** add messages-to-markdown ([69580e5](https://github.com/secretlint/secretlint/commit/69580e5fe169ced05e795389e2e3f89bcd85dc6b))
* **node:** implement @secretlint/node ([acd3dd2](https://github.com/secretlint/secretlint/commit/acd3dd2dcbda473677348ea8350c2481fe920c95))
* **node:** support configFilePath ([682bb60](https://github.com/secretlint/secretlint/commit/682bb6021473e3a08a1e73704fd68bcff256c74d))
* **npm:** add @secretlint/secretlint-rule-npm ([b0c891f](https://github.com/secretlint/secretlint/commit/b0c891fc42f3799452eb2b50d842811718a42078))
* **secretlint:** implement `secretlint` package as CLI ([6765e2d](https://github.com/secretlint/secretlint/commit/6765e2d6a182e5e876f4c4ba5348101bf8f36806))
* **secretlint:** node_modules is ignored by default ([2844962](https://github.com/secretlint/secretlint/commit/28449626da6b5821826a2150f039d9e3228556e9)), closes [#22](https://github.com/secretlint/secretlint/issues/22)
* **secretlint-rule-preset-recommend:** implement secretlint-rule-preset-recommend ([2728140](https://github.com/secretlint/secretlint/commit/27281404717565a6bcea4749bb047cf0d6b777ed))
* **tester:** support .secretlintrc options via file ([c137c00](https://github.com/secretlint/secretlint/commit/c137c00829d6ee903d0e81894e0d343fff94f089))
* add test case ([747bb57](https://github.com/secretlint/secretlint/commit/747bb57f7ccffd220e3118a4fa45bfd2c277e21a))
* preset ([868ac0f](https://github.com/secretlint/secretlint/commit/868ac0f2526217e04a774a48c26d90a89937cee2))
* **secretlint-rule-privatekey:** implement @secretlint/secretlint-rule-privatekey ([f2038a5](https://github.com/secretlint/secretlint/commit/f2038a59a60fd861faf128e84555ccfb860e21f6))
