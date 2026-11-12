# 単一実行ファイル

[English](requirements.md)

## この文書について

単一実行ファイルは、Node.jsもパッケージのインストールもなしにSecretlintを動かします。
いくつかのルールとフォーマッターを組み込んでいるので、リポジトリは1つのファイルをダウンロードするだけで推奨ルールでlintできます。
親のProductは[Secretlint](../../product.ja.md)です。

### 範囲

- 実行ファイルの対応プラットフォームと公開場所
- 実行ファイルに組み込んだルールとフォーマッター
- 実行ファイルの`--init`と`--version`

### 範囲外

コマンドのそのほかのオプション。これは`secretlint`のnpmパッケージと同じで、まだ書かれていません。
設定ファイルのルールIDを解決するしかた: [設定の読み込み](../config-loading/requirements.ja.md)。

## ユーザーストーリー

### Node.jsなしでlintする

CIとリポジトリの管理者として、1つのファイルをダウンロードして推奨ルールでリポジトリをlintしたい。そうすれば、Node.jsやnpmパッケージをインストールしなくて済む。

**受け入れ条件:**

Scenario: 実行ファイルが設定を作ると、組み込みルールが書かれる

- Given: 設定ファイルのないディレクトリと、そのプラットフォームの実行ファイル。
- When: 管理者が`secretlint --init`を実行する。
- Then: `@secretlint/secretlint-rule-preset-recommend`と`@secretlint/secretlint-rule-pattern`を持つ`.secretlintrc.json`が作られ、コマンドはそのファイルのパスを表示する。

Scenario: 設定ファイルがすでにあると、`--init`はそれを上書きしない

- Given: ディレクトリに、名前が`.secretlintrc`で始まるファイルがある。
- When: 管理者が`secretlint --init`を実行する。
- Then: コマンドは設定ファイルがすでにあると表示し、ステータス1で終わり、ファイルは変わらない。

Scenario: 設定が組み込みルールを使うと、実行ファイルはそれでlintする

- Given: `.secretlintrc.json`に`@secretlint/secretlint-rule-preset-recommend`があり、`node_modules`ディレクトリはない。
- When: 管理者が、秘密情報を含むファイルに`secretlint "**/*"`を実行する。
- Then: 実行ファイルは秘密情報を報告し、ステータス1で終わる。

Scenario: 設定が組み込みでないルールを使うと、読み込みが失敗する

- Given: `.secretlintrc.json`に`@secretlint/secretlint-rule-no-dotenv`があり、それはインストールされていない。
- When: 管理者が実行ファイルを実行する。
- Then: 実行ファイルは、ルールのモジュールが見つからないというエラーで止まる。

### SARIFを出力する

CIとリポジトリの管理者として、実行ファイルからSARIFを出力したい。そうすれば、code scanningのツールが結果を読める。

**受け入れ条件:**

Scenario: SARIFのフォーマッターを選ぶと、実行ファイルはSARIFを出力する

- Given: 組み込みルールを使う設定。
- When: 管理者が実行ファイルを`--format @secretlint/secretlint-formatter-sarif`で実行する。
- Then: 出力はSARIFの文書である。

## KPI

なし。実行ファイルについて指標は決まっていません。

## 機能要件

### 組み込みのルールとフォーマッター

**概要:** 実行ファイルはいくつかのパッケージを含み、設定やオプションがそれを指すときに使います。

**入力:** 設定ファイルのルールIDと、`--format`オプション。

**出力:** 同じパッケージをインストールしたnpmパッケージと同じ結果。

#### 適用条件

##### 組み込みのパッケージ

実行ファイルは`@secretlint/secretlint-rule-preset-recommend`、`@secretlint/secretlint-rule-pattern`、`@secretlint/secretlint-formatter-sarif`を、実行ファイルと同じバージョンで含みます。
`@secretlint/preset-recommend`のような、これらのIDの短い形もそれを使います。

##### ほかのパッケージ

canaryプリセット、recommendプリセットのルールを単独のIDで書いたもの、サードパーティのルールなど、ほかのルールは組み込まれていません。

##### プラットフォーム

実行ファイルは、Linux x64とarm64、Windows x64、macOS x64とarm64向けに、SHA-256のチェックサムファイルとともにGitHub Releasesのページで公開されます。

##### バージョン

`secretlint --version`は、実行ファイルのビルド元のSecretlintのバージョンを表示します。

## データ要件

### 必要なデータ

設定ファイルとlintするファイルのほかに、なし。

### 関係

なし。

### 個人情報

なし。

## 外部サービスへの依存

- **GitHub Releases**
  - **関係するユーザーストーリー:** Node.jsなしでlintする
  - **依存する理由:** 実行ファイルはリポジトリのリリースのページからダウンロードします。
  - **契約と利用の判断:** オープンソースのリポジトリの公開リリースで、無料です。

## セキュリティの考慮

実行ファイルはコード署名されていません。利用者はダウンロードしたものをチェックサムファイルで確かめます。

## 未解決事項

なし。
