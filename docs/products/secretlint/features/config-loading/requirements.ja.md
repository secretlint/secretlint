# 設定の読み込み

[English](requirements.md)

## この文書について

Secretlintはリポジトリの設定ファイルを読み、どのルールをどのオプションで動かすかを決めます。
この文書は、設定ファイルに書いたルールIDが、実行するルールになるまでを説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### 範囲

- 設定ファイルの各ルールIDを、ルールやプリセットに解決すること
- ルールIDの短い形
- ルールIDを解決できないときの動作

### 範囲外

この文書は、設定の読み込みの次の部分をまだ説明していません。

- 設定ファイルを探すことと、`--secretlintrc`オプション
- 設定ファイルの検証と、非推奨の設定についてのメッセージ
- `sharedOptions`

ルールとプリセットそのものは[ルールとルールプリセット](../rules-and-presets/requirements.ja.md)が説明します。

## ユーザーストーリー

### インストールしたルールをIDで使う

開発者として、ルールをnpmパッケージの名前で書きたい。そうすれば、インストールしたルールをSecretlintが動かす。

**受け入れ条件:**

Scenario: ルールIDがインストールしたルールのパッケージ名なら、そのルールが動く

- Given: リポジトリに`@secretlint/secretlint-rule-aws`がインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-aws" }`がある。
- When: 開発者が、AWSのアクセスキーを含むファイルをlintする。
- Then: 結果に、`ruleId`が`@secretlint/secretlint-rule-aws`のメッセージがある。

Scenario: ルールIDが短い形なら、完全なパッケージ名のルールが動く

- Given: `@secretlint/secretlint-rule-aws`がインストールされていて、設定ファイルに`{ "id": "@secretlint/aws" }`がある。
- When: 開発者が、AWSのアクセスキーを含むファイルをlintする。
- Then: 結果にAWSのルールのメッセージがあり、その`ruleId`は設定ファイルに書いたIDの`@secretlint/aws`である。

Scenario: サードパーティのルールをインストールすると、同じように使える

- Given: ルールのパッケージ`secretlint-rule-example`がインストールされていて、設定ファイルに`{ "id": "secretlint-rule-example" }`か`{ "id": "example" }`がある。
- When: 開発者がファイルをlintする。
- Then: `secretlint-rule-example`のルールが動く。

### どのルールが足りないかを知る

開発者として、どのルールIDを読み込めないかを知りたい。そうすれば、足りないパッケージをインストールできる。

**受け入れ条件:**

Scenario: ルールIDがインストールされていないと、SecretlintはそのIDを示して止まる

- Given: 設定ファイルに`{ "id": "@secretlint/secretlint-rule-github" }`があり、そのパッケージはインストールされていない。
- When: 開発者がSecretlintを実行する。
- Then: Secretlintは`@secretlint/secretlint-rule-github`が見つからないため読み込めないというエラーで止まり、どのファイルもlintされない。

## KPI

なし。この機能はすべてのlintの一段階で、指標は決まっていません。

## 機能要件

### ルールIDの解決

**概要:** 設定ファイルの各ルールIDを、npmパッケージがexportするルールやプリセットに解決します。

**入力:** 設定ファイルの`rules`と、パッケージを解決するディレクトリ。

**出力:** 実行するルールとプリセット。各項目のID、オプション、重大度、許可するメッセージ、無効化の設定を持つ。

#### 適用条件

##### パッケージ名

ルールIDはまず短い形として読まれ、接頭辞`secretlint-rule-`が付けられます。`@scope/name`は`@scope/secretlint-rule-name`に、`name`は`secretlint-rule-name`になります。
すでに接頭辞があるIDはそのまま使われます。
その名前のパッケージが見つからなければ、ID自体をパッケージ名として試します。

##### パッケージを探す場所

パッケージは、Secretlintがインストールされた場所から、Node.jsの`require.resolve`と同じように探されます。
設定の読み込みを使うプログラムは、別の`node_modules`ディレクトリを渡せます。
プログラムは、Node.jsより先にパッケージ名を解決・importするフックも登録できます。単一実行ファイルは、組み込みルールのためにこれを使います。

##### パッケージのexport

パッケージは`creator`をexportする必要があります。種類が`preset`のcreatorはプリセットとして読み込まれ、その項目の`rules`の一覧と組み合わされます。

##### 結果のルールID

設定ファイルに書いたIDがルールIDとして保たれるので、短い形で読み込んだルールのメッセージは`ruleId`が短い形になります。

#### 例外的な動作

##### パッケージが見つからない

ルールIDを解決できないと、読み込みはそのID、現在のディレクトリ、基準のディレクトリを示すエラーで失敗します。全項目のエラーが1つのエラーにまとめられ、どのファイルもlintされません。

##### パッケージが`creator`をexportしない

ルールは`creator`をexportする必要があるというエラーで読み込みが失敗します。

## データ要件

### 必要なデータ

- **ルールの項目:** ルールやプリセットの`id`と、その`options`、`severity`、`allowMessageIds`、`disabled`、プリセットなら`rules`。

### 関係

各ルールの項目は、1つのルールか1つのプリセットに解決されます。

### 個人情報

なし。

## 外部サービスへの依存

なし。パッケージはローカルのファイルシステムから読みます。インストールは利用者のパッケージマネージャーが行います。

## セキュリティの考慮

ルールIDはimportしてSecretlintの権限で実行するパッケージを指すので、利用者がインストールしたパッケージだけが実行されます。

## 未解決事項

なし。
