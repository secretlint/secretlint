# 単一実行ファイル

[English](requirements.md)

## このドキュメントについて

単一実行ファイルを使うと、Node.jsもパッケージのインストールも必要とせずにSecretlintを実行できます。
Secretlintの組み込みルールとSARIFのフォーマッターが含まれているため、ファイルを1つダウンロードするだけで、推奨ルールを使ってリポジトリをlintできます。
親のProductは[Secretlint](../../product.ja.md)です。

### スコープ

- 実行ファイルの対応プラットフォームと公開場所
- 実行ファイルに含まれるルールとフォーマッター
- 実行ファイルの`--init`と`--version`

### スコープ外

コマンドのそのほかのオプション。これらは`secretlint`のnpmパッケージと同じで、まだ書かれていません。
設定ファイルのルールIDを解決する方法: [設定の読み込み](../config-loading/requirements.ja.md)。

## ユーザーストーリー

### Node.jsなしでlintする

CIやリポジトリの管理者として、ファイルを1つダウンロードするだけで、推奨ルールを使ってリポジトリをlintしたい。Node.jsやnpmパッケージをインストールしなくて済むからだ。

**受け入れ条件:**

Scenario: 実行ファイルで設定ファイルを作ると、組み込みルールが書き込まれる

- Given: 設定ファイルのないディレクトリと、そのプラットフォーム向けの実行ファイルがある。
- When: 管理者が`secretlint --init`を実行する。
- Then: `@secretlint/secretlint-rule-preset-recommend`と`@secretlint/secretlint-rule-pattern`を含む`.secretlintrc.json`が作られ、コマンドはそのファイルのパスを表示する。

Scenario: 設定ファイルがすでにあると、`--init`は上書きしない

- Given: ディレクトリに、名前が`.secretlintrc`で始まるファイルがある。
- When: 管理者が`secretlint --init`を実行する。
- Then: コマンドは設定ファイルがすでにあることを表示してステータス1で終了し、ファイルは変更されない。

Scenario: 設定で組み込みルールを使うと、実行ファイルはそのルールでlintする

- Given: `.secretlintrc.json`に`@secretlint/secretlint-rule-preset-recommend`があり、`node_modules`ディレクトリはない。
- When: 管理者が、秘密情報を含むファイルに対して`secretlint "**/*"`を実行する。
- Then: 実行ファイルは秘密情報を報告し、ステータス1で終了する。

Scenario: 設定で組み込みルールを個別のIDで指定しても、実行ファイルはそのルールを使う

- Given: `.secretlintrc.json`に`@secretlint/secretlint-rule-preset-canary`または`@secretlint/secretlint-rule-aws`があり、`node_modules`ディレクトリはない。
- When: 管理者が、AWSのアクセスキーを含むファイルに対して`secretlint "**/*"`を実行する。
- Then: 実行ファイルは`@secretlint/secretlint-rule-aws`でそのキーを報告する。

Scenario: 設定でカスタムルールを使うと、読み込みに失敗する

- Given: `.secretlintrc.json`にカスタムルール`@secretlint/secretlint-rule-no-dotenv`があり、そのパッケージはインストールされていない。
- When: 管理者が実行ファイルを実行する。
- Then: 実行ファイルは、ルールのモジュールが見つからないというエラーで停止する。

### SARIFを出力する

CIやリポジトリの管理者として、実行ファイルからSARIFを出力したい。code scanningのツールで結果を読めるからだ。

**受け入れ条件:**

Scenario: SARIFのフォーマッターを指定すると、実行ファイルはSARIFを出力する

- Given: 組み込みルールを使う設定がある。
- When: 管理者が`--format @secretlint/secretlint-formatter-sarif`を付けて実行ファイルを実行する。
- Then: SARIF形式の文書が出力される。

## KPI

なし。実行ファイルについて、指標は決まっていません。

## 機能要件

### 組み込みのルールとフォーマッター

**概要:** 実行ファイルには、すべての組み込みのルールとプリセット、およびSARIFのフォーマッターが含まれ、設定やオプションで指定されたときに使われます。

**入力:** 設定ファイルのルールIDと、`--format`オプション。

**出力:** 同じバージョンのnpmパッケージと同じ結果。

#### 適用する条件

##### 組み込みルール

実行ファイルには、ビルド元のバージョンのSecretlintにあるすべての組み込みのルールとプリセットが含まれます。具体的には、recommendプリセット、canaryプリセット、これらのプリセットのルールを個別のIDで指定したもの、`@secretlint/secretlint-rule-pattern`、`@secretlint/secretlint-rule-azure`です。
`@secretlint/preset-recommend`のような短い形のIDでも、これらを指定できます。

##### 組み込みのフォーマッター

実行ファイルには、実行ファイルと同じバージョンの`@secretlint/secretlint-formatter-sarif`が含まれます。

##### ほかのパッケージ

`@secretlint/secretlint-rule-no-dotenv`やサードパーティのルールなどのカスタムルールは、実行ファイルに含まれません。

##### プラットフォーム

実行ファイルは、Linux（x64、arm64）、Windows（x64）、macOS（x64、arm64）向けに、SHA-256のチェックサムファイルと一緒にGitHub Releasesのページで公開されます。

##### バージョン

`secretlint --version`は、実行ファイルのビルド元になったSecretlintのバージョンを表示します。

## データ要件

### 必要なデータ

設定ファイルとlintするファイル以外には、なし。

### データ間の関係

なし。

### 個人情報

なし。

## 依存する外部サービス

- **GitHub Releases**
  - **関連するユーザーストーリー:** Node.jsなしでlintする
  - **依存する理由:** 実行ファイルは、リポジトリのリリースページからダウンロードします。
  - **契約・利用上の判断:** オープンソースのリポジトリの公開リリースで、無料です。

## セキュリティ上の留意事項

実行ファイルはコード署名されていません。利用者は、ダウンロードしたファイルをチェックサムファイルで確認します。

## 未決事項

なし。
