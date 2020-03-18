# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.10.1](https://github.com/secretlint/secretlint/compare/v0.10.0...v0.10.1) (2020-03-18)

**Note:** Version bump only for package @secretlint/core





# [0.10.0](https://github.com/secretlint/secretlint/compare/v0.9.2...v0.10.0) (2020-03-18)


### Features

* **core:** support locale options ([256a58c](https://github.com/secretlint/secretlint/commit/256a58c6cd03f585f15dd09972212ca6dfb70ac4))





## [0.9.2](https://github.com/secretlint/secretlint/compare/v0.9.1...v0.9.2) (2020-03-16)

**Note:** Version bump only for package @secretlint/core





## [0.9.1](https://github.com/secretlint/secretlint/compare/v0.9.0...v0.9.1) (2020-03-16)

**Note:** Version bump only for package @secretlint/core





# [0.9.0](https://github.com/secretlint/secretlint/compare/v0.7.3...v0.9.0) (2020-03-16)

**Note:** Version bump only for package @secretlint/core





# [0.7.0](https://github.com/secretlint/secretlint/compare/v0.6.0...v0.7.0) (2020-03-01)

**Note:** Version bump only for package @secretlint/core

# [0.6.0](https://github.com/secretlint/secretlint/compare/v0.5.0...v0.6.0) (2020-02-29)

### Features

-   support terminalLink ([#65](https://github.com/secretlint/secretlint/issues/65)) ([a28ef9e](https://github.com/secretlint/secretlint/commit/a28ef9eb9b3803984ec37bbbd9cdf35e7d4b67a6))

# [0.5.0](https://github.com/secretlint/secretlint/compare/v0.4.2...v0.5.0) (2020-02-28)

**Note:** Version bump only for package @secretlint/core

## [0.4.2](https://github.com/secretlint/secretlint/compare/v0.4.1...v0.4.2) (2020-02-28)

### Bug Fixes

-   **core:** fix allowMessageIds of preset's rule options ([7dcb506](https://github.com/secretlint/secretlint/commit/7dcb506315fae72c12253c6dd7119f746f80fddc))

## [0.4.1](https://github.com/secretlint/secretlint/compare/v0.4.0...v0.4.1) (2020-02-28)

**Note:** Version bump only for package @secretlint/core

# [0.4.0](https://github.com/secretlint/secretlint/compare/v0.3.0...v0.4.0) (2020-02-28)

### Features

-   **core:** support "disabled" options ([17c1391](https://github.com/secretlint/secretlint/commit/17c1391cbd19edfe72f894fcf2e3a9d50fc4a7d2))
-   **core:** support "disabledMessages" options ([17de33e](https://github.com/secretlint/secretlint/commit/17de33eaef2408c63cbaeecb4038c8878a292ca0))
-   **core:** support Context#ignore method ([7ca0445](https://github.com/secretlint/secretlint/commit/7ca0445e9a5c494ea52ab0b9efa302ef5c902e2f))
-   **types:** rule require `messages` ([412803e](https://github.com/secretlint/secretlint/commit/412803eeebe7f14ce67f1c33c2ba16eac2acf9a5))

# [0.3.0](https://github.com/secretlint/secretlint/compare/v0.2.0...v0.3.0) (2020-02-27)

### Bug Fixes

-   **slack:** fix id ([761e1d0](https://github.com/secretlint/secretlint/commit/761e1d01374a23b734eecf1af2a9d40564990ded))

### Features

-   **secretlint-rule-slack:** add @secretlint/secretlint-rule-slack ([d3d9f5b](https://github.com/secretlint/secretlint/commit/d3d9f5ba0173cd8dc46b720b13cfd9adf7e35d9d))

# [0.2.0](https://github.com/secretlint/secretlint/compare/v0.1.2...v0.2.0) (2020-02-23)

### Features

-   **profiler:** add --profiler flag ([#40](https://github.com/secretlint/secretlint/issues/40)) ([0f86e54](https://github.com/secretlint/secretlint/commit/0f86e5415f0c249c6f5c2dfbf44465f0c58ce56e))
-   **rule:** add `supportedContentTypes` to rule `meta` ([#39](https://github.com/secretlint/secretlint/issues/39)) ([3883c75](https://github.com/secretlint/secretlint/commit/3883c7578de38854aba2d1d20b8f167c8275f1c9))

### Performance Improvements

-   **core:** skip lint with rule if the rule does not support contentType ([1e2eb3e](https://github.com/secretlint/secretlint/commit/1e2eb3eb61b6198619e0283bb05ede28f4a1d5b0)), closes [#39](https://github.com/secretlint/secretlint/issues/39)

# 0.1.0 (2020-02-16)

### Bug Fixes

-   **cli:** fix exit status ([04d9b41](https://github.com/secretlint/secretlint/commit/04d9b412fe60eb638d0cb131d95ed4dcfcc4c11a))
-   **core:** separate options to rules in preset ([1b16638](https://github.com/secretlint/secretlint/commit/1b166380b8174b1e474aab05a9c1e4b4f6bb0d1a))
-   fix type name ([08d39e8](https://github.com/secretlint/secretlint/commit/08d39e8fb8ce8c4eb7a8ac8087e7da969e3afa8b))

### Features

-   **config-loader:** add config-loader ([c56e8a3](https://github.com/secretlint/secretlint/commit/c56e8a3b8f2b1dc5fc6b3306dbd3ef496b31feb5))
-   **core:** add basic core ([248e312](https://github.com/secretlint/secretlint/commit/248e3128d09fc73a3d0b247f56ee0c71ee01dae2))
-   **core:** check duplicated rule registration ([22db54e](https://github.com/secretlint/secretlint/commit/22db54eea6410f2a64b66c45697d9acdd869698c))
-   **core:** support `ruleId` implicitly ([1aa6d5c](https://github.com/secretlint/secretlint/commit/1aa6d5c90c9b62714e45e0b997be6a20c56a208b))
-   **core:** support Localization ([845f24a](https://github.com/secretlint/secretlint/commit/845f24a2a5ba1af39a3da8c2b5d487f3f4e6c313))
-   **core:** support severity options ([876e936](https://github.com/secretlint/secretlint/commit/876e9360c324232aeade50fd7767fe8bd08907a5))
-   **formatter:** add @secretlint/formatter ([2b2d9ab](https://github.com/secretlint/secretlint/commit/2b2d9abe693848c3271abbdb9845feefed582a1e))
-   **secretlint-rule-preset-recommend:** implement secretlint-rule-preset-recommend ([2728140](https://github.com/secretlint/secretlint/commit/27281404717565a6bcea4749bb047cf0d6b777ed))
-   **tester:** support .secretlintrc options via file ([c137c00](https://github.com/secretlint/secretlint/commit/c137c00829d6ee903d0e81894e0d343fff94f089))
-   add test case ([747bb57](https://github.com/secretlint/secretlint/commit/747bb57f7ccffd220e3118a4fa45bfd2c277e21a))
-   preset ([868ac0f](https://github.com/secretlint/secretlint/commit/868ac0f2526217e04a774a48c26d90a89937cee2))
