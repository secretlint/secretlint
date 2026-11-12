# ルールとルールプリセットの設計

[English](design.md)

## この文書について

この文書は、[ルールとルールプリセット](requirements.ja.md)の組み込みルールとプリセットを、どう作り、テストし、配布しているかを説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### 読者

組み込みルールや組み込みのプリセットを追加・変更する人とエージェント。

### 前提

`@secretlint/types`のルールのインターフェース（`SecretLintRuleCreator`と`SecretLintRulePresetCreator`）と、このリポジトリのpnpm workspace。

### この文書の外

- 設定の読み込みがルールIDからルールを見つけるしかた: [設定の読み込み](../config-loading/requirements.ja.md)
- カスタムルールの作り方とテストのしかた: [カスタムルール](../custom-rules/requirements.ja.md)
- `@secretlint/core`がルールを実行するしかた（lint planとキーワードの走査）

## 実装方針

組み込みルールとプリセットは、それを実行するエンジンとそのテストとともに`@secretlint/core`の一部です。
`@secretlint/core`はルールIDからルールへの表を持ち、設定の読み込みはパッケージを探す前にこの表を引きます。
同じ名前のパッケージは、`@secretlint/core`のルールをre-exportする薄いパッケージとして残ります。

ルールを新しいnpmパッケージとして加えるには、最初のリリースの前に、trusted publisherなどnpmでのパッケージの設定を手作業でする必要があります。
組み込みルールは`@secretlint/core`の中のディレクトリなので、加えるのに新しいパッケージはいりません。

### ルールのディレクトリ

組み込みルールは`packages/@secretlint/core/src/builtin/rules/<name>/`にあり、メインモジュールは`creator`と`messages`をexportします。
`creator.meta`は、ルールID`@secretlint/secretlint-rule-<name>`、種類（`scanner`か`filter`）、`recommended`、`supportedContentTypes`、リポジトリのルールのREADMEを指す`docs.url`を持ちます。
`@secretlint/core`は`docs.url`にメッセージIDを付けて、各メッセージのリンクを作ります。

正規表現で秘密情報を探すルールは`patterns`を宣言し、`@secretlint/core`がそれを実行します。
patternルールやGCPルールなど、それ以外のルールは`create()`を実装し、`context.report()`で報告します。

`@secretlint/core`がブラウザで読み込めるように、組み込みルールはNode.jsのモジュールをトップレベルでimportしません。
`node:path`の代わりに小さな`basename`の関数を使います。
GCPルールは`.p12`ファイルを確かめるときだけ`node:fs`と`node:crypto`をimportし、`node:crypto`がなければWeb Cryptoを使います。
patternルールは`micromatch`と同じやり方で`picomatch`でファイルのパスを照合するので、`micromatch`はもう依存ではありません。

### 組み込みの表とプリセット

`@secretlint/core/builtin`は、一覧`builtinRules`、`recommendedRules`、`canaryRules`、プリセット`presetRecommend`と`presetCanary`、完全なルールIDに対するルールかプリセットを返し、なければ`undefined`を返す`getBuiltinRule(id)`をexportします。

2つのプリセットは1つの`createPreset(id, rules)`で作ります。プリセットは、`meta.type: "preset"`、ルールの一覧`rules`、各ルールについて順に`context.registerRule()`を呼ぶ`create()`を持ちます。
`@secretlint/core`は、登録された各ルールをプリセットの項目の`rules`とルールIDで照合し、その`options`、`severity`、`allowMessageIds`を適用します。
項目が`disabled: true`のルールは、最上位の項目の`disabled: true`と同じように登録されません。

`canaryRules`がルールの一覧の元です。新しいルールはまず`canaryRules`に加え、メジャーリリースで`recommendedRules`に加えます。
今は`canaryRules`は`recommendedRules`のコピーです。

### 同じ名前のパッケージ

組み込みルールの各パッケージ`@secretlint/secretlint-rule-<name>`は、`@secretlint/core/builtin/rules/<name>`をre-exportします。
プリセットのパッケージは、`@secretlint/core/builtin`から`creator`と`rules`をexportします。
これらのパッケージは同じバージョンの`@secretlint/core`に依存し、自分のテストは持ちません。

### テスト

スナップショットのテストケースは`packages/@secretlint/core/test/builtin/rules/<name>/snapshots/`と`packages/@secretlint/core/test/builtin/presets/{recommend,canary}/snapshots/`にあります。
これらは、`@secretlint/tester`と同じように各ケースを確かめるランナー`@secretlint/core/testing`で動きます。バイト列のソース、文字列のソース、キーワードの最適化をしないルールの結果が同じでなければなりません。
`@secretlint/tester`は`@secretlint/core`に依存するので、`@secretlint/core`のテストが`@secretlint/tester`を使うとworkspaceに循環ができます。そのためランナーは`@secretlint/core`にあります。
`@secretlint/tester`はランナーを包み、設定の読み込みを通した設定ファイルの読み込みを加えます。

`@secretlint/core`のテストでは、テストケースの設定ファイルはルールIDを書き、ランナーはそれを`getBuiltinRule`で引きます。
ルールのディレクトリにスナップショットのディレクトリがないと、テストが失敗します。
`sync-preset-snapshots`スクリプトは、各ルールのテストケースをプリセットのスナップショットにコピーします。

`pnpm run gen:rule`は、ルールのディレクトリ、そのREADME、テストケース`ng.secret`と`ok.valid`を`@secretlint/core`に作ります。

## 構成図とシーケンス図

図は不要です。プリセットはルールの一覧で、やり取りはlintの準備中の`registerRule()`だけです。

## データモデルとER図

- **ルールのcreator:** `meta`（id、type、recommended、supportedContentTypes、docs.url、任意のkeywords）、`messages`、そして`patterns`か`create()`。
- **プリセットのcreator:** `meta`（id、type `preset`）、`rules`（ルールのcreator）、`create(context, options)`。
- **設定のプリセットの項目:** `id`、`options`、`rules`。`rules`は`id`、`options`、`severity`、`allowMessageIds`、`disabled`を持つ項目の一覧。

## APIとインターフェース

- `@secretlint/core/builtin`: `builtinRules`、`recommendedRules`、`canaryRules`、`presetRecommend`、`presetCanary`、`getBuiltinRule(id)`、`builtinRuleIds`。
- `@secretlint/core/builtin/rules/<name>`: 1つのルールの`creator`と`messages`。
- `@secretlint/core/testing`: スナップショットのディレクトリのテストケースを返す`createSnapshotTestCases(options)`。
- 同じ名前のパッケージは、同じ`creator`と`messages`を、プリセットなら`creator`と`rules`をexportします。

## 外部サービスとの連携

`@secretlint/core`と同じ名前のパッケージは、リポジトリのリリースのワークフローからnpm registryに公開されます。

## データの扱い

ルールは`@secretlint/core`から1つのファイルの内容を受け取り、メッセージを返します。内容を保存したり送ったりしません。

## 認証と認可

なし。ルールはSecretlintを動かすプロセスの権限で動きます。

## セキュリティの考慮

ルールの正規表現は繰り返しの回数を制限し、細工したファイルで走査が長くかからないようにします。

## デプロイの注意

同じ名前のパッケージは引き続き公開されるので、それを書いた設定や`package.json`は動き続けます。その非推奨化は別の変更です。
npmパッケージの`--init`は、`package.json`にあるルールを書きます。それがなくてもrecommendプリセットを書くようになるまでは、ドキュメントはプリセットのパッケージのインストールを案内したままにします。

## 検討した代替案

- **ルールごとに1つのパッケージにし、プリセットにルールを同梱する:** 変更前の設計です。新しいルールごとに新しいnpmパッケージと、npmでの手作業の設定が必要でした。
- **組み込みルールのための別の1つのパッケージ:** Biomeがルールをエンジンとは別のcrateに置くように、ルールとテストを`@secretlint/core`の隣のパッケージに置く案です。これは選びませんでした。oxlintやESLintのように、ルール、エンジン、テストを1つのパッケージに置きます。

## 未解決事項

なし。
