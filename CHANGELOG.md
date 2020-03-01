# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.7.2](https://github.com/secretlint/secretlint/compare/v0.7.1...v0.7.2) (2020-03-01)


### Bug Fixes

* **secretlint-rule-gcp:** fix plaice holder of report ([f25cb0b](https://github.com/secretlint/secretlint/commit/f25cb0b1fae45e9420a7de7d291251cb5f4e56b5))





## [0.7.1](https://github.com/secretlint/secretlint/compare/v0.7.0...v0.7.1) (2020-03-01)


### Bug Fixes

* **quick-start:** add config/ as files ([15488ec](https://github.com/secretlint/secretlint/commit/15488ecedd6ce72f8593cb3b4c5186201e7926cb))





# [0.7.0](https://github.com/secretlint/secretlint/compare/v0.6.0...v0.7.0) (2020-03-01)


### Bug Fixes

* **quick-start:** fix bin script name ([#70](https://github.com/secretlint/secretlint/issues/70)) ([8887af1](https://github.com/secretlint/secretlint/commit/8887af1adb411ba8dacce0e3e5a497f0bb822c85))
* **quick-start:** fix env type ([9a797ac](https://github.com/secretlint/secretlint/commit/9a797ace78bf17141a89c11dbae740fdb9b233e7))


### Features

* **quick-start:** add @secretlint/quick-start module ([8c7c298](https://github.com/secretlint/secretlint/commit/8c7c298a0aa2cff6c03278006aacbf2468e232b1))





# [0.6.0](https://github.com/secretlint/secretlint/compare/v0.5.0...v0.6.0) (2020-02-29)


### Bug Fixes

* **secretlint-rule-basicauth:** fix regexp pattern ([5bb36be](https://github.com/secretlint/secretlint/commit/5bb36be5421f347639b9f00c867cb8cb48f81f5f))


### Features

* support terminalLink ([#65](https://github.com/secretlint/secretlint/issues/65)) ([a28ef9e](https://github.com/secretlint/secretlint/commit/a28ef9eb9b3803984ec37bbbd9cdf35e7d4b67a6))
* **slack:** support Incoming Webhook ([a68b875](https://github.com/secretlint/secretlint/commit/a68b875843b9f8f41bb21c3ad229a272bddfdf3e)), closes [#63](https://github.com/secretlint/secretlint/issues/63)





# [0.5.0](https://github.com/secretlint/secretlint/compare/v0.4.2...v0.5.0) (2020-02-28)


### Features

* **cli:** add --debug flag ([d9326d5](https://github.com/secretlint/secretlint/commit/d9326d5606ffb96214a791f1bb0b66bbfe96b2bf))
* **gcp:** add @secretlint/secretlint-rule-gcp ([130973d](https://github.com/secretlint/secretlint/commit/130973d668c24a5adbb86a66c223d06c8f31deec))
* **secretlint-rule-preset-recommend:** add @secretlint/secretlint-rule-gcp ([8ab7b00](https://github.com/secretlint/secretlint/commit/8ab7b00978a7fa03210770db18d717e360ff1b6c))





## [0.4.2](https://github.com/secretlint/secretlint/compare/v0.4.1...v0.4.2) (2020-02-28)


### Bug Fixes

* **core:** fix allowMessageIds of preset's rule options ([7dcb506](https://github.com/secretlint/secretlint/commit/7dcb506315fae72c12253c6dd7119f746f80fddc))
* **lerna:** add --no-push for waiting docker image ([b53471a](https://github.com/secretlint/secretlint/commit/b53471a59d6505d76198aca8b06b8bed469f9ae2))





## [0.4.1](https://github.com/secretlint/secretlint/compare/v0.4.0...v0.4.1) (2020-02-28)


### Bug Fixes

* **aws:** remove console.log ([0bf11ae](https://github.com/secretlint/secretlint/commit/0bf11aedc033bd4217040f2198b3b43cc4197372))





# [0.4.0](https://github.com/secretlint/secretlint/compare/v0.3.0...v0.4.0) (2020-02-28)


### Bug Fixes

* **binary-compiler:** use name includes OS ([a89e599](https://github.com/secretlint/secretlint/commit/a89e59992bbcf042592b8531f753d79cdc734590))


### Features

* **core:** support "disabled" options ([17c1391](https://github.com/secretlint/secretlint/commit/17c1391cbd19edfe72f894fcf2e3a9d50fc4a7d2))
* **core:** support "disabledMessages" options ([17de33e](https://github.com/secretlint/secretlint/commit/17de33eaef2408c63cbaeecb4038c8878a292ca0))
* **core:** support Context#ignore method ([7ca0445](https://github.com/secretlint/secretlint/commit/7ca0445e9a5c494ea52ab0b9efa302ef5c902e2f))
* **types:** rule require `messages` ([412803e](https://github.com/secretlint/secretlint/commit/412803eeebe7f14ce67f1c33c2ba16eac2acf9a5))





# [0.3.0](https://github.com/secretlint/secretlint/compare/v0.2.0...v0.3.0) (2020-02-27)


### Bug Fixes

* **aws:** fix false-positive _KEY=XXX pattern ([1baa241](https://github.com/secretlint/secretlint/commit/1baa24161f9f64fe40f392d3719f5396aa6913b4))
* **basicauth:** fix id ([3190cac](https://github.com/secretlint/secretlint/commit/3190cac6d3e14dd6281083035e841853fd7800e3))
* **basicauth:** fix id ([148c8b2](https://github.com/secretlint/secretlint/commit/148c8b2e39b10c7298335d4a6bdf48c614aa275f))
* **binary:** suppress fs error ([63e4e29](https://github.com/secretlint/secretlint/commit/63e4e292e587501d88e8260a762758e1e7b880dd))
* **slack:** fix id ([761e1d0](https://github.com/secretlint/secretlint/commit/761e1d01374a23b734eecf1af2a9d40564990ded))


### Features

* **basicauth:** add @secretlint/secretlint-rule-basicauth ([464d2cd](https://github.com/secretlint/secretlint/commit/464d2cd0240df2cf6d31ba791af69e713b6a7605))
* **binary:** add `secretlint` binary ([6acdeb7](https://github.com/secretlint/secretlint/commit/6acdeb723efa53f76d41d9e197ca1c2e9e3cdcc6))
* **docker:** add Docker Workflow ([263bad0](https://github.com/secretlint/secretlint/commit/263bad0eec640a2d77b0a5b36ac042c55baf99a9))
* **preset-recommend:** add @secretlint/secretlint-rule-basicauth ([0acf113](https://github.com/secretlint/secretlint/commit/0acf1131b922dced6cafc527d87f95f2af7bd104))
* **preset-recommend:** add @secretlint/secretlint-rule-slack as preset ([1e8c4f4](https://github.com/secretlint/secretlint/commit/1e8c4f4c5a9e946f1d3de0f3a0e468f6735152f7))
* **secretlint-rule-slack:** add @secretlint/secretlint-rule-slack ([d3d9f5b](https://github.com/secretlint/secretlint/commit/d3d9f5ba0173cd8dc46b720b13cfd9adf7e35d9d))
* **secretlint-scripts:** add secretlint-scripts is wrapper of tsc ([3fcb7db](https://github.com/secretlint/secretlint/commit/3fcb7dbbde9b185000abaef411ccc6ebcc253066))





# [0.2.0](https://github.com/secretlint/secretlint/compare/v0.1.2...v0.2.0) (2020-02-23)


### Bug Fixes

* **aws:** report only found Access key ([cfa0d4d](https://github.com/secretlint/secretlint/commit/cfa0d4d694ec6a8dc13bcc729c773b88567eecb5)), closes [#32](https://github.com/secretlint/secretlint/issues/32)
* **cli:** prevent to output profile if no --profile flag ([17b8570](https://github.com/secretlint/secretlint/commit/17b85709be9558a744d2164884a9810a46e53635))
* **example:** fix example ([82a18a5](https://github.com/secretlint/secretlint/commit/82a18a55dfa08486e1ece1be8072c928ab92880a))
* **example:** use preset ([73893d6](https://github.com/secretlint/secretlint/commit/73893d6e385d223e629689f9cd7aa5b35d92cbd8))
* **tester:** Make testDefinitions optional ([04b8dcc](https://github.com/secretlint/secretlint/commit/04b8dcc5dc9c93f0a9c02aa303f61b6bfe751e5d))


### Features

* **benchmark:** add benchmark scripts ([#38](https://github.com/secretlint/secretlint/issues/38)) ([8b48f42](https://github.com/secretlint/secretlint/commit/8b48f4206fe3a3b019b76c4ef0346bc487177fe5))
* **profiler:** add --profiler flag ([#40](https://github.com/secretlint/secretlint/issues/40)) ([0f86e54](https://github.com/secretlint/secretlint/commit/0f86e5415f0c249c6f5c2dfbf44465f0c58ce56e))
* **rule:** add `supportedContentTypes` to rule `meta` ([#39](https://github.com/secretlint/secretlint/issues/39)) ([3883c75](https://github.com/secretlint/secretlint/commit/3883c7578de38854aba2d1d20b8f167c8275f1c9))


### Performance Improvements

* **core:** skip lint with rule if the rule does not support contentType ([1e2eb3e](https://github.com/secretlint/secretlint/commit/1e2eb3eb61b6198619e0283bb05ede28f4a1d5b0)), closes [#39](https://github.com/secretlint/secretlint/issues/39)





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
