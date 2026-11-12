# ルールとルールプリセットの設計

[English](design.md)

## このドキュメントについて

このドキュメントでは、[ルールとルールプリセット](requirements.ja.md)の組み込みルールとプリセットを、どのように実装し、テストし、配布しているかを説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### 対象読者

組み込みルールや組み込みのプリセットを追加・変更する人とエージェント。

### 前提知識

`@secretlint/types`のルールのインターフェース（`SecretLintRuleCreator`と`SecretLintRulePresetCreator`）と、このリポジトリのpnpm workspace。

### このドキュメントで扱わないこと

- 設定の読み込みがルールIDからルールを見つける方法: [設定の読み込み](../config-loading/requirements.ja.md)
- カスタムルールの作成方法とテスト方法: [カスタムルール](../custom-rules/requirements.ja.md)
- `@secretlint/core`がルールを実行する仕組み（lint planとキーワードによる走査）

## 実装方針

組み込みルールとプリセットは、それを実行するエンジンやテストと一緒に`@secretlint/core`に含まれています。
`@secretlint/core`はルールIDとルールの対応表を持ち、設定の読み込みはパッケージを探す前にこの表を参照します。
同じ名前のパッケージは、`@secretlint/core`のルールをre-exportするだけの薄いパッケージとして残します。

新しいnpmパッケージをtrusted publishingで公開するには、まず空のパッケージを公開し、npmでtrusted publisherを設定してから、ルールをリリースするという手作業が必要です。ルールのコードを書くだけでは公開できないため、この方法ではルールを増やしにくくなっていました。
組み込みルールは`@secretlint/core`の中のディレクトリなので、追加するときに新しいパッケージは必要ありません。

### ルールのディレクトリ

組み込みルールは`packages/@secretlint/core/src/builtin/rules/<name>/`にあり、メインモジュールは`creator`と`messages`をexportします。
`creator.meta`には、ルールID`@secretlint/secretlint-rule-<name>`、種類（`scanner`または`filter`）、`recommended`、`supportedContentTypes`、リポジトリ内のルールのREADMEを指す`docs.url`があります。
`@secretlint/core`は`docs.url`にメッセージIDを付け足して、各メッセージのリンクを作ります。

正規表現で秘密情報を探すルールは`patterns`を宣言し、`@secretlint/core`がそのパターンを実行します。
patternルールやGCPルールなど、それ以外のルールは`create()`を実装し、`context.report()`で報告します。

`@secretlint/core`をブラウザでも読み込めるように、組み込みルールはNode.jsのモジュールをトップレベルでimportしません。
`node:path`の代わりに、小さな`basename`関数を使います。
GCPルールは、`.p12`ファイルを確認するときだけ`node:fs`と`node:crypto`をimportし、`node:crypto`が使えない環境ではWeb Cryptoを使います。
patternルールは、`micromatch`と同じ方法で`picomatch`を使ってファイルパスを照合します。そのため、`micromatch`には依存しなくなりました。

### 組み込みの対応表とプリセット

`@secretlint/core/builtin`は、ルールの一覧`builtinRules`、`recommendedRules`、`canaryRules`、プリセット`presetRecommend`と`presetCanary`、そして`getBuiltinRule(id)`をexportします。`getBuiltinRule(id)`は、完全なルールIDに対応するルールかプリセットを返し、見つからなければ`undefined`を返します。

2つのプリセットは、どちらも同じ`createPreset(id, rules)`で作ります。プリセットは、`meta.type: "preset"`、ルールの一覧`rules`、各ルールについて順に`context.registerRule()`を呼ぶ`create()`を持ちます。
`@secretlint/core`は、登録された各ルールをプリセットの項目の`rules`とルールIDで対応づけ、その`options`、`severity`、`allowMessageIds`を適用します。
`disabled: true`を指定したルールは、最上位の項目で`disabled: true`を指定した場合と同じく、登録されません。

ルールの一覧の元になるのは`canaryRules`です。新しいルールはまず`canaryRules`に追加し、メジャーリリースで`recommendedRules`に追加します。
現在の`canaryRules`は`recommendedRules`のコピーです。

### 同じ名前のパッケージ

組み込みルールの各パッケージ`@secretlint/secretlint-rule-<name>`は、`@secretlint/core/builtin/rules/<name>`をre-exportします。
プリセットのパッケージは、`@secretlint/core/builtin`の`creator`と`rules`をexportします。
これらのパッケージは同じバージョンの`@secretlint/core`に依存し、パッケージ自体のテストは持ちません。

### テスト

スナップショットのテストケースは、`packages/@secretlint/core/test/builtin/rules/<name>/snapshots/`と`packages/@secretlint/core/test/builtin/presets/{recommend,canary}/snapshots/`にあります。
テストは、`@secretlint/tester`と同じ方法で各ケースを確認するテストランナー`@secretlint/core/testing`で実行します。バイト列のソース、文字列のソース、キーワードによる最適化をしないルールの3つで、結果が一致しなければなりません。
`@secretlint/tester`は`@secretlint/core`に依存しているため、`@secretlint/core`のテストで`@secretlint/tester`を使うとworkspaceに循環依存ができます。そのため、テストランナーは`@secretlint/core`に置いています。
`@secretlint/tester`はこのテストランナーをラップし、設定の読み込みを使った設定ファイルの読み込みを追加しています。

`@secretlint/core`のテストでは、テストケースの設定ファイルにルールIDを書き、テストランナーが`getBuiltinRule`でルールを取得します。
スナップショットのディレクトリがないルールのディレクトリがあると、テストは失敗します。
`sync-preset-snapshots`スクリプトは、各ルールのテストケースをプリセットのスナップショットにコピーします。

`pnpm run gen:rule`は、ルールのディレクトリ、README、テストケース`ng.secret`と`ok.valid`を`@secretlint/core`の中に作ります。

## アーキテクチャ・シーケンス図

図は不要です。プリセットはルールの一覧であり、ほかとのやり取りはlintの準備中に呼ぶ`registerRule()`だけです。

## データモデル・ER 図

- **ルールのcreator:** `meta`（id、type、recommended、supportedContentTypes、docs.url、任意のkeywords）、`messages`、そして`patterns`か`create()`のどちらか。
- **プリセットのcreator:** `meta`（id、type `preset`）、`rules`（ルールのcreator）、`create(context, options)`。
- **設定ファイルのプリセットの項目:** `id`、`options`、`rules`。`rules`は、`id`、`options`、`severity`、`allowMessageIds`、`disabled`を持つ項目の一覧です。

## API・インターフェース

- `@secretlint/core/builtin`: `builtinRules`、`recommendedRules`、`canaryRules`、`presetRecommend`、`presetCanary`、`getBuiltinRule(id)`、`builtinRuleIds`。
- `@secretlint/core/builtin/rules/<name>`: 1つのルールの`creator`と`messages`。
- `@secretlint/core/testing`: スナップショットのディレクトリからテストケースを作る`createSnapshotTestCases(options)`。
- 同じ名前のパッケージは、ルールなら同じ`creator`と`messages`を、プリセットなら`creator`と`rules`をexportします。

## 外部サービスとの連携方式

`@secretlint/core`と同じ名前のパッケージは、リポジトリのリリースワークフローからnpm registryに公開されます。

## データの取り扱い設計

ルールは`@secretlint/core`から1つのファイルの内容を受け取り、メッセージを返します。内容を保存したり外部に送ったりはしません。

## 認証認可に関する特記事項

なし。ルールは、Secretlintを実行するプロセスの権限で動きます。

## セキュリティ上の留意事項

ルールの正規表現は繰り返し回数に上限を設けて、細工されたファイルで走査に時間がかかりすぎないようにしています。

## デプロイに関する特記事項

同じ名前のパッケージは引き続き公開されるため、それらを書いた設定や`package.json`はそのまま動きます。これらのパッケージの非推奨化は別の変更で扱います。
npmパッケージの`--init`は、`package.json`にあるルールを設定に書き込みます。ルールのパッケージがなくてもrecommendプリセットを書き込むようになるまでは、ドキュメントではプリセットのパッケージのインストールを案内したままにします。

## 検討した代替手段

- **ルールごとに1つのパッケージを作り、プリセットにルールを同梱する:** 変更前の設計です。ルールを追加するたびに新しいnpmパッケージを作り、上で説明したtrusted publishingの手作業をする必要がありました。
- **組み込みルール専用のパッケージを1つ作る:** Biomeがルールをエンジンとは別のcrateに置いているように、ルールとテストを`@secretlint/core`とは別のパッケージに置く案です。これは採用しませんでした。oxlintやESLintと同じく、ルール、エンジン、テストを1つのパッケージに置きます。

## 未決事項

なし。
