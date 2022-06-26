# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.2.1](https://github.com/secretlint/secretlint/compare/v5.2.0...v5.2.1) (2022-06-26)

### Bug Fixes

* **config-loader:** use native import() ([#275](https://github.com/secretlint/secretlint/issues/275)) ([7699777](https://github.com/secretlint/secretlint/commit/769977776eaa5bd8b663106195f88d7e3070d1d6))
* **deps:** update minor updates ([0913164](https://github.com/secretlint/secretlint/commit/0913164dbc3178dc7ec8230a2bcae6f2434eacfc))

# [5.2.0](https://github.com/secretlint/secretlint/compare/v5.1.3...v5.2.0) (2022-04-11)

### Bug Fixes

* **monorepo:** use lerna-lite instead of lerna ([#250](https://github.com/secretlint/secretlint/issues/250)) ([35fc82e](https://github.com/secretlint/secretlint/commit/35fc82e55c819b3078051d08dc8d1e4c7813d5ce))

### Features

* **canary:** add shopify ([118c7b3](https://github.com/secretlint/secretlint/commit/118c7b3001a2714591229ff0e8432e8928022b2f))
* implement rule for Shopify API keys ([a897bea](https://github.com/secretlint/secretlint/commit/a897bea6b5ab6665106e1f10646792d5b0f5116c))
* **recommend:** add shopify to recommended preset ([1f166a3](https://github.com/secretlint/secretlint/commit/1f166a3942f71e5681d778e7ecd00cae4c61bb59))

## [5.1.3](https://github.com/secretlint/secretlint/compare/v5.1.1...v5.1.3) (2022-04-04)

### Bug Fixes

* **deps:** update minor updates ([a11c9e0](https://github.com/secretlint/secretlint/commit/a11c9e0e408d4cc2a98673e7206dc285dcc33f67))

### Features

* **docker:** support arm64 for image ([#253](https://github.com/secretlint/secretlint/issues/253)) ([fcdab11](https://github.com/secretlint/secretlint/commit/fcdab11abdd4204c985f02c789459209b428c048))

## [5.1.2](https://github.com/secretlint/secretlint/compare/v5.1.1...v5.1.2) (2022-04-04)

### Bug Fixes

* **deps:** update minor updates ([a11c9e0](https://github.com/secretlint/secretlint/commit/a11c9e0e408d4cc2a98673e7206dc285dcc33f67))

### Features

* **docker:** support arm64 for image ([#253](https://github.com/secretlint/secretlint/issues/253)) ([fcdab11](https://github.com/secretlint/secretlint/commit/fcdab11abdd4204c985f02c789459209b428c048))

## [5.1.1](https://github.com/secretlint/secretlint/compare/v5.1.0...v5.1.1) (2022-03-24)

**Note:** Version bump only for package root

# [5.1.0](https://github.com/secretlint/secretlint/compare/v5.0.1...v5.1.0) (2022-03-08)

### Bug Fixes

* **docker:** update Node.js 16 ([288230a](https://github.com/secretlint/secretlint/commit/288230aa9284520b6b67d7c8853ae98fe151f8cc))
* refactor while loop + RegExp.exec → matchAll ([#238](https://github.com/secretlint/secretlint/issues/238)) ([1276228](https://github.com/secretlint/secretlint/commit/1276228114d667955731a1738d435b02aa975d8f)), closes [#236](https://github.com/secretlint/secretlint/issues/236)

### Features

* **slack:** detect xapp- token ([#239](https://github.com/secretlint/secretlint/issues/239)) ([d603165](https://github.com/secretlint/secretlint/commit/d60316539b315e9d5d99f4a92146b0385333cb50))

## [5.0.1](https://github.com/secretlint/secretlint/compare/v5.0.0...v5.0.1) (2022-03-05)

### Bug Fixes

* **config-loader:** do not apply prettier ([bfdb32d](https://github.com/secretlint/secretlint/commit/bfdb32d42d3d22212e8394df8a9dabc3d5a96aab))
* **secretlint-rule-filter-comments:** remove unnecessary deps ([#234](https://github.com/secretlint/secretlint/issues/234)) ([60bf7f0](https://github.com/secretlint/secretlint/commit/60bf7f09672e44874adc7c0d4e483ba83199e456))

# [5.0.0](https://github.com/secretlint/secretlint/compare/v4.2.1...v5.0.0) (2022-03-05)

### Bug Fixes

* **deps:** update dependencies ([7c665d5](https://github.com/secretlint/secretlint/commit/7c665d59e9e6ac6646f69800c609b1b07be693e4))

### chore

* Drop Node.js 12 support ([#226](https://github.com/secretlint/secretlint/issues/226)) ([d05fbe6](https://github.com/secretlint/secretlint/commit/d05fbe672bc0554a4fac98dd886b080fa6ea4e6d))

### Features

* **config-loader:** improve validation to config ([#224](https://github.com/secretlint/secretlint/issues/224)) ([222555f](https://github.com/secretlint/secretlint/commit/222555f46f230c451917bf87442b9473a67855bb))

### BREAKING CHANGES

* Drop Node.js 12 support
* **config-loader:** this change will throw error some config that is already wrong.

* fix: remove unused type

* chore: update test

* docs: fix

* test: add assertion for rule/preset impl

* test: add assertion for rule/preset impl

* test: fix test snapshot

* fix

* chore:  fix

## [4.2.1](https://github.com/secretlint/secretlint/compare/v4.2.0...v4.2.1) (2022-03-02)

### Bug Fixes

* **sarif:** fix main file path ([cf874e4](https://github.com/secretlint/secretlint/commit/cf874e4a18c598af02b78a439c026a5099750844))

# [4.2.0](https://github.com/secretlint/secretlint/compare/v4.1.4...v4.2.0) (2022-03-02)

### Features

* **sarif:** add @secretlint/secretlint-formatter-sarif ([#217](https://github.com/secretlint/secretlint/issues/217)) ([6cdf303](https://github.com/secretlint/secretlint/commit/6cdf303073d0686a1d5ac0004e1365b1b8a70205))

### Performance Improvements

* introduce turborepo ([#215](https://github.com/secretlint/secretlint/issues/215)) ([7080b05](https://github.com/secretlint/secretlint/commit/7080b052f1e02feb9146bfb054aa17b7e0ed27a1))

## [4.1.4](https://github.com/secretlint/secretlint/compare/v4.1.3...v4.1.4) (2022-01-13)

### Bug Fixes

* **secretlint-rule-gcp:** update node-forge ([#212](https://github.com/secretlint/secretlint/issues/212)) ([10eae64](https://github.com/secretlint/secretlint/commit/10eae64760324ea53394280f3db957cd6439e8d1))

## [4.1.3](https://github.com/secretlint/secretlint/compare/v4.1.1...v4.1.3) (2021-10-13)

**Note:** Version bump only for package root

## [4.1.2](https://github.com/secretlint/secretlint/compare/v4.1.1...v4.1.2) (2021-10-13)

**Note:** Version bump only for package root

## [4.1.1](https://github.com/secretlint/secretlint/compare/v4.1.0...v4.1.1) (2021-10-11)

### Bug Fixes

* **config-loader:** fix to load secretlint rule on Windows ([#206](https://github.com/secretlint/secretlint/issues/206)) ([74526f4](https://github.com/secretlint/secretlint/commit/74526f4a3204a36f9c6ea2fa4bccb546e20cb8e6))

# [4.1.0](https://github.com/secretlint/secretlint/compare/v4.0.0...v4.1.0) (2021-09-25)

### Bug Fixes

* **github:** token length should be 40 ([6b41e01](https://github.com/secretlint/secretlint/commit/6b41e01801d9fe8d5fb25cd15250efddc36f9787))

### Features

* **npm:** support `npm_` prefix access token ([#201](https://github.com/secretlint/secretlint/issues/201)) ([20c4839](https://github.com/secretlint/secretlint/commit/20c483970ab1e7a2c33cedff4ac79df7201bc86f))

# [4.0.0](https://github.com/secretlint/secretlint/compare/v3.3.0...v4.0.0) (2021-09-15)

### Bug Fixes

* **privatekey:** fix report range ([#184](https://github.com/secretlint/secretlint/issues/184)) ([f3226ca](https://github.com/secretlint/secretlint/commit/f3226ca5190faad1b41b8690fc294fc824c20bae))

### Features

* **config-loader:** support a rule written by ESM ([#187](https://github.com/secretlint/secretlint/issues/187)) ([590c333](https://github.com/secretlint/secretlint/commit/590c3339f2f10ffeaf2b6d1084f9a907466d7453))
* **preset:** add @secretlint/secretlint-rule-filter-comments to presets ([#198](https://github.com/secretlint/secretlint/issues/198)) ([7f25af3](https://github.com/secretlint/secretlint/commit/7f25af32977bc4726c8d2e796b08ba046e58f2fc))
* **secretlint-rule-filter-comments:** secretlint-disable/secretlint-enable comment ([#195](https://github.com/secretlint/secretlint/issues/195)) ([607f361](https://github.com/secretlint/secretlint/commit/607f361bebf75f532ac1966c6939ed5955f3c669))

# [3.3.0](https://github.com/secretlint/secretlint/compare/v3.2.0...v3.3.0) (2021-07-05)

### Features

* **core:** add `maskSecrets` option ([#177](https://github.com/secretlint/secretlint/issues/177)) ([658db4b](https://github.com/secretlint/secretlint/commit/658db4b1f0526006bec0448f9cba9a02bc8edd4a))

# [3.2.0](https://github.com/secretlint/secretlint/compare/v3.1.0...v3.2.0) (2021-06-27)

### Features

* **formatter:** add "native" table formatter ([#169](https://github.com/secretlint/secretlint/issues/169)) ([6bd7910](https://github.com/secretlint/secretlint/commit/6bd79101458677a08a69bdfc36c0782e3fb90799))

# [3.1.0](https://github.com/secretlint/secretlint/compare/v3.0.0...v3.1.0) (2021-06-24)

### Bug Fixes

* **gcp:** Fixed typo from CP to GCP ([#170](https://github.com/secretlint/secretlint/issues/170)) ([ceab009](https://github.com/secretlint/secretlint/commit/ceab00980de07c80f2a290b45a70201250fc71d6))

### Features

* **privatekey:** support non cryptosystem name pattern ([#173](https://github.com/secretlint/secretlint/issues/173)) ([c211103](https://github.com/secretlint/secretlint/commit/c211103d9a151e02be53f693997f0d68e6781427))

# [3.0.0](https://github.com/secretlint/secretlint/compare/v2.2.0...v3.0.0) (2021-05-29)

### Features

* **preset-recommend:** add GitHub to preset ([#164](https://github.com/secretlint/secretlint/issues/164)) ([c5fb277](https://github.com/secretlint/secretlint/commit/c5fb2778961b784be255549519a27d920a0278dd))

### BREAKING CHANGES

* **preset-recommend:** secretlint-rule-preset-recommend has been changed

- It includes "@secretlint/secretlint-rule-github" by default

# [2.2.0](https://github.com/secretlint/secretlint/compare/v2.1.1...v2.2.0) (2021-05-27)

### Bug Fixes

* **docker:** fix invalid label key ([#156](https://github.com/secretlint/secretlint/issues/156)) ([c0da8db](https://github.com/secretlint/secretlint/commit/c0da8dbcd16063f08a7b8b319f4a7b62b90ce6de))

### Features

* implement @secretlint/secretlint-rule-github ([#160](https://github.com/secretlint/secretlint/issues/160)) ([e4294f0](https://github.com/secretlint/secretlint/commit/e4294f09d9faf8d598d369837b152694be7ca3a7))

## [2.1.1](https://github.com/secretlint/secretlint/compare/v2.1.0...v2.1.1) (2020-11-04)

**Note:** Version bump only for package root

# [2.1.0](https://github.com/secretlint/secretlint/compare/v2.0.0...v2.1.0) (2020-06-16)

### Bug Fixes

* **secretlint:** fix handling for non-ascii file path ([#137](https://github.com/secretlint/secretlint/issues/137)) ([510decf](https://github.com/secretlint/secretlint/commit/510decf4605b202539c7bedf7a6ea22bdd4cc62f))

### Features

* **rule:** Creating new rule for SecretLint for using regular expressions ([#139](https://github.com/secretlint/secretlint/issues/139)) ([097921f](https://github.com/secretlint/secretlint/commit/097921f9682b619dbeb5e35068b1c57913bf5df9))
* **secretlint-rule-no-homedir:** add new rule ([#136](https://github.com/secretlint/secretlint/issues/136)) ([447e2e0](https://github.com/secretlint/secretlint/commit/447e2e0b473e267934ea42ed8788de15dcea9cd8))

# [2.0.0](https://github.com/secretlint/secretlint/compare/v1.1.0...v2.0.0) (2020-04-27)

### Bug Fixes

* **tester:** sort object be property name ([#133](https://github.com/secretlint/secretlint/issues/133)) ([f684cdf](https://github.com/secretlint/secretlint/commit/f684cdfb76f7701e301ded4771fb3207e43fa7e0))
* add word length limits for clarity ([e5b5867](https://github.com/secretlint/secretlint/commit/e5b5867a98ff7cf2145e253de43b7fd25278d5c7))
* make rule specific to sendgrid ([cda8b6c](https://github.com/secretlint/secretlint/commit/cda8b6c2b76cf5537d4f8e61bb07b348f8f969f1))
* missing escape on regex dot chars ([3e12160](https://github.com/secretlint/secretlint/commit/3e121606291a65dd6a0bfd82d5778cd1b44028bf))
* remove generic api rule ([40ae9b1](https://github.com/secretlint/secretlint/commit/40ae9b1e444636d7ebee35e623db27f31e95a6a7))
* **core:** change SecretLintRuleMessageTranslate to check statically ([03ccff1](https://github.com/secretlint/secretlint/commit/03ccff116390374193ca5975405b0cafeaf63932))

### Features

* **recommended-preset:** add sendgrid rule ([#131](https://github.com/secretlint/secretlint/issues/131)) ([0bcbe2e](https://github.com/secretlint/secretlint/commit/0bcbe2ebbf6b990912bdc0ead369c63f61b2a362))
* add generic key detection ([8dcb023](https://github.com/secretlint/secretlint/commit/8dcb0230b2f8647b3fae4766899c6c9c705e60e1))

### BREAKING CHANGES

* **core:** It changes SecretLintRuleMessageTranslate interface

Rule need to change `messages` object format.

# [1.1.0](https://github.com/secretlint/secretlint/compare/v1.0.5...v1.1.0) (2020-04-04)

### Features

* **secretlint-rule-no-dotenv:** add new rule ([99959b2](https://github.com/secretlint/secretlint/commit/99959b283079ac431e4c9ba2386ca54a3a6864ff))

## [1.0.5](https://github.com/secretlint/secretlint/compare/v1.0.4...v1.0.5) (2020-04-03)

### Bug Fixes

* **secretlint-rule-no-k8s-kind-secret:** fix detect logic ([d0cbab7](https://github.com/secretlint/secretlint/commit/d0cbab72ef1465db54727b7103d2ffde92e952e8))

## [1.0.4](https://github.com/secretlint/secretlint/compare/v1.0.3...v1.0.4) (2020-03-31)

### Bug Fixes

* **core:** fix placeholder assertion for rule ([c48b380](https://github.com/secretlint/secretlint/commit/c48b3809196a88236642a038452e1de13a0f9ddf)), closes [#116](https://github.com/secretlint/secretlint/issues/116)

## [1.0.3](https://github.com/secretlint/secretlint/compare/v1.0.2...v1.0.3) (2020-03-30)

**Note:** Version bump only for package root

## [1.0.2](https://github.com/secretlint/secretlint/compare/v1.0.1...v1.0.2) (2020-03-29)

### Bug Fixes

* **secretlint-rule-secp256k1-privatekey:** handle thrown exception due to invalid key ([#110](https://github.com/secretlint/secretlint/issues/110)) ([320b344](https://github.com/secretlint/secretlint/commit/320b3446d7afd85e342cb9bb15f6e9df7dae8036))

## [1.0.1](https://github.com/secretlint/secretlint/compare/v1.0.0...v1.0.1) (2020-03-29)

### Bug Fixes

* **secretlint-rule-preset-canary:** fix id name ([4c91c60](https://github.com/secretlint/secretlint/commit/4c91c6053194be74ea1d0f080d8a547693c40555))
* japanese message translation ([629125a](https://github.com/secretlint/secretlint/commit/629125ae11fd5ce842bad4f216abd5ac488805c2))
* package author ([dddd0f7](https://github.com/secretlint/secretlint/commit/dddd0f764039952ea215c90218b001b865753032))

### Features

* **secretlint-rule-preset-canary:** add secretlint-rule-secp256k1-privatekey ([d9d93ed](https://github.com/secretlint/secretlint/commit/d9d93ed657b80fd673e3172ba76792261dc022f4))
* check for the presence of secp256k1 curve private keys ([a8f1902](https://github.com/secretlint/secretlint/commit/a8f190266c6f3def98592ba599096ddb5e007dd3))

### Reverts

* remove secretlint-rule-secp256k1-privatekey from canary ([d6b3aea](https://github.com/secretlint/secretlint/commit/d6b3aea646826334d995426e19b1e998fd6caaa6))

# [1.0.0](https://github.com/secretlint/secretlint/compare/v0.10.1...v1.0.0) (2020-03-18)

**Note:** Version bump only for package root

## [0.10.1](https://github.com/secretlint/secretlint/compare/v0.10.0...v0.10.1) (2020-03-18)

### Bug Fixes

* **publish-binary:** fix config ([429fa9f](https://github.com/secretlint/secretlint/commit/429fa9f23055e7e48a89966ef3560c4d247774ef))

# [0.10.0](https://github.com/secretlint/secretlint/compare/v0.9.2...v0.10.0) (2020-03-18)

### Bug Fixes

* **publish:** split publish to binary ([b4a358c](https://github.com/secretlint/secretlint/commit/b4a358cc2a786c4f0ba8c95d4bdee4168f7e37ad))
* **publish-binary:** fix config ([1596c37](https://github.com/secretlint/secretlint/commit/1596c379cbb535b4e43dff617cc34ef66e484490))
* **publish-binary:** fix config ([8d82565](https://github.com/secretlint/secretlint/commit/8d82565ae5cdb5a5a4305888cf58df7def23a1a2))

### Features

* **core:** support locale options ([256a58c](https://github.com/secretlint/secretlint/commit/256a58c6cd03f585f15dd09972212ca6dfb70ac4))
* **preset-canary:** add secretlint-rule-preset-canary ([4100626](https://github.com/secretlint/secretlint/commit/4100626b65d8e4166b1d198a81b5b1d6679c1a46))

## [0.9.2](https://github.com/secretlint/secretlint/compare/v0.9.1...v0.9.2) (2020-03-16)

**Note:** Version bump only for package root

## [0.9.1](https://github.com/secretlint/secretlint/compare/v0.9.0...v0.9.1) (2020-03-16)

**Note:** Version bump only for package root

# [0.9.0](https://github.com/secretlint/secretlint/compare/v0.7.3...v0.9.0) (2020-03-16)

### Bug Fixes

* **binary-compiler:** fix binary compiler workflow ([13a1660](https://github.com/secretlint/secretlint/commit/13a1660d35f533e28efa0a04f9159755c5e388b0))
* **deps:** add @changesets/changelog-github ([4cd589a](https://github.com/secretlint/secretlint/commit/4cd589a9ddc64a04a0b656f4fda287135edcc4a6))
* **deps:** revert @changesets/changelog-github ([f8560bd](https://github.com/secretlint/secretlint/commit/f8560bd59abf40e2eb3aa8aa6daac487cc8d6986))
* **messages-to-markdown:** rename bin script ([c6a620c](https://github.com/secretlint/secretlint/commit/c6a620c9ba774f8373653a31fbb536712da3ae94))

### Features

* **cli:** support --secretlintrcJSON flag ([#78](https://github.com/secretlint/secretlint/issues/78)) ([449b4a1](https://github.com/secretlint/secretlint/commit/449b4a1c78c33722c41d1251d2dde4d8d040cf88))

### Performance Improvements

* **profiler:** add profile mark to config-loader ([d127d23](https://github.com/secretlint/secretlint/commit/d127d237843341d7704fe96852e0d4638da50eaa))
* **secretlint-rule-preset-recommend:** rollup ([#76](https://github.com/secretlint/secretlint/issues/76)) ([71c382a](https://github.com/secretlint/secretlint/commit/71c382abb4c2f8bf60319e2716f3d6600f1de8ba))

## [0.7.3](https://github.com/secretlint/secretlint/compare/v0.7.2...v0.7.3) (2020-03-01)

### Bug Fixes

* **node:** add concurrency limit to lint ([b966a3a](https://github.com/secretlint/secretlint/commit/b966a3ad39fc5188c46c23e625c0c022adcb2f55)), closes [#72](https://github.com/secretlint/secretlint/issues/72)

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
