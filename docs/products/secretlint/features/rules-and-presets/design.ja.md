# ルールとルールプリセットの設計

[English](design.md)

## この文書について

この文書は、[ルールとルールプリセット](requirements.ja.md)のルールとプリセットを、どう作って配布しているかを説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### 読者

Secretlintが提供するルールやプリセットを追加・変更する人とエージェント。

### 前提

`@secretlint/types`のルールのインターフェース（`SecretLintRuleCreator`と`SecretLintRulePresetCreator`）と、このリポジトリのpnpm workspace。

### この文書の外

- 設定の読み込みがルールIDからルールを見つけるしかた: [設定の読み込み](../config-loading/requirements.ja.md)
- ルールのテストのしかた: [独自ルール](../custom-rules/requirements.ja.md)
- `@secretlint/core`がルールを実行するしかた（lint planとキーワードの走査）

## 実装方針

Secretlintが提供する各ルールはそれぞれ1つのnpmパッケージで、各プリセットはルールのコードを同梱したnpmパッケージです。
ルールIDはパッケージ名なので、設定の読み込みは同じ名前のパッケージをインストールしてimportすればルールを見つけられます。

### ルールのパッケージ

ルールは`packages/@secretlint/secretlint-rule-<name>/`にあり、`@secretlint/secretlint-rule-<name>`として公開されます。
メインモジュールは`creator`と`messages`をexportします。
`creator.meta`は、ルールID、種類（`scanner`か`filter`）、`recommended`、`supportedContentTypes`、パッケージのREADMEを指す`docs.url`を持ちます。
`@secretlint/core`は`docs.url`にメッセージIDを付けて、各メッセージのリンクを作ります。

正規表現で秘密情報を探すルールは`patterns`を宣言し、`@secretlint/core`がそれを実行します。
patternルールやGCPルールなど、それ以外のルールは`create()`を実装し、`context.report()`で報告します。

### プリセットのパッケージ

プリセットは、`meta.type: "preset"`の`creator`、ルールの一覧`rules`、各ルールについて順に`context.registerRule()`を呼ぶ`create()`をexportします。
`@secretlint/core`は、登録された各ルールをプリセットの項目の`rules`とルールIDで照合し、その`options`、`severity`、`allowMessageIds`を適用します。
その項目の`disabled`はルールを登録するときに読まれないため、ルールは動いたままになります（Requirementsの未解決事項を参照）。

プリセットのパッケージはルールのパッケージにdevDependenciesとしてだけ依存し、Rollupで全ルールのコードを含む1つのモジュールにビルドされます。
そのため、プリセットをインストールしてもルールのパッケージはインストールされず、各ルールのバージョンはプリセットに同梱したものになります。
プリセットのREADMEは、同梱したファイルは読み込みのコストを減らすという理由を挙げています。

canaryプリセットがルールの一覧の元です。
recommendプリセットの`sync-canary`スクリプトは、メジャーリリースでルールを昇格するときに、canaryプリセットのソースとテストをプリセットIDを置き換えてrecommendプリセットにコピーします。

## 構成図とシーケンス図

図は不要です。プリセットはルールの一覧で、やり取りはlintの準備中の`registerRule()`だけです。

## データモデルとER図

- **ルールのcreator:** `meta`（id、type、recommended、supportedContentTypes、docs.url、任意のkeywords）、`messages`、そして`patterns`か`create()`。
- **プリセットのcreator:** `meta`（id、type `preset`）、`rules`（ルールのcreator）、`create(context, options)`。
- **設定のプリセットの項目:** `id`、`options`、`rules`。`rules`は`id`、`options`、`severity`、`allowMessageIds`、`disabled`を持つ項目の一覧。

## APIとインターフェース

ルールのパッケージの公開インターフェースはexportの`creator`と`messages`で、プリセットのパッケージは`creator`と`rules`です。
ルールのパッケージから`creator`をimportしたコードは、それを`@secretlint/core`に直接渡せます。

## 外部サービスとの連携

パッケージは、リポジトリのリリースのワークフローからnpm registryに公開されます。

## データの扱い

ルールは`@secretlint/core`から1つのファイルの内容を受け取り、メッセージを返します。内容を保存したり送ったりしません。

## 認証と認可

なし。ルールはSecretlintを動かすプロセスの権限で動きます。

## セキュリティの考慮

ルールの正規表現は繰り返しの回数を制限し、細工したファイルで走査が長くかからないようにします。

## デプロイの注意

なし。

## 検討した代替案

ルールごとに1つのパッケージにすることや、プリセットにルールを同梱することについて、代替案の記録はありません。

## 未解決事項

Requirementsの未解決事項のほかには、なし。
