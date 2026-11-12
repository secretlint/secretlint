# 設定の読み込みの設計

[English](design.md)

## このドキュメントについて

このドキュメントでは、`@secretlint/config-loader`が[設定の読み込み](requirements.ja.md)のルールIDをルールに解決する方法を説明します。
親のProductは[Secretlint](../../product.ja.md)です。
Requirementsと同じく、ルールIDの解決だけを扱います。

### 対象読者

ルールを探して読み込む処理を変更する人とエージェント。

### 前提知識

Node.jsのモジュール解決と、[ルールとルールプリセット](../rules-and-presets/requirements.ja.md)で説明しているルールのパッケージのexport。

### このドキュメントで扱わないこと

設定ファイルの探索と検証、および読み込んだルールを`@secretlint/core`で実行すること。

## 実装方針

`loadConfig()`は設定ファイルを読んで設定の記述（descriptor）にし、`loadPackagesFromConfigDescriptor()`は記述の各ルールの項目を、ルールのcreatorを持つ項目に変換します。
変換結果は`@secretlint/core`の設定になります。`@secretlint/core`は、creatorがどこから来たかを知らずに実行します。

読み込みは、各ルールの項目について、次のうち最初に当てはまるものからcreatorを取得します。

1. `testReplaceDefinitions`: 呼び出し側が渡す`{ id, rule }`の一覧で、ルールIDをcreatorに置き換えます。`@secretlint/tester`は、インストール済みのパッケージではなく開発中のルールをテストで動かすためにこれを使います。
2. `@secretlint/core`の組み込みの対応表。`resolveBuiltinRule()`が`@secretlint/core/builtin`を`await import()`で読み込み、まずIDのまま、次に`createFullPackageName("secretlint-rule-", id)`で作ったIDで`getBuiltinRule()`を呼びます。
3. ルールIDに対応するnpmパッケージ。`SecretLintModuleResolver.resolveRulePackageName()`が`createFullPackageName("secretlint-rule-", id)`で完全なパッケージ名を作り、そのパッケージ名とID自体を順に`@secretlint/resolver`の`tryResolve()`で試します。見つかったモジュールを`@secretlint/resolver`の`dynamicImport()`でimportし、`creator`のexportを取得します。

`meta.type: "preset"`のcreatorは、記述の項目の`rules`を持つプリセットの項目になります。それ以外のcreatorは、`options`、`severity`、`disabled`、`allowMessageIds`を持つルールの項目になります。
記述の項目の`id`を結果にそのままコピーするため、メッセージには設定ファイルに書いたIDが残ります。

### resolverのフック

`@secretlint/resolver`は、`require.resolve()`や`import()`を使う前に、プログラムが登録したresolveフックとimportフックを実行します。
resolveフックはパッケージ名に対して決まったURLを返すことができ、importフックは読み込み済みのモジュールのexportを返すことができます。
これにより、単一実行ファイルのようにバンドルされたプログラムでも、`node_modules`にないパッケージを提供できます。組み込みルールはresolverを使う前に見つかるため、フックは必要ありません。

### 失敗

1つの項目でエラーが起きても、そのエラーを記録してほかの項目の読み込みを続けます。すべての項目を処理したあと、各エラーの先頭に`Failed to load rule module: <id>`を付けた`AggregationError`を投げます。
`allowMessageIds`の検証にはルールのメッセージが必要なため、設定の検証は読み込みのあとにcreatorと合わせて行います。

## アーキテクチャ・シーケンス図

```mermaid
sequenceDiagram
    participant CLI as secretlint (CLI)
    participant Loader as config-loader
    participant Resolver as @secretlint/resolver
    participant Core as @secretlint/core
    CLI->>Loader: loadConfig()
    loop each rule entry
        Loader->>Loader: testReplaceDefinitions?
        Loader->>Core: getBuiltinRule(id, then full id)
        Loader->>Resolver: tryResolve(full package name, then id)
        Resolver-->>Loader: path or URL (hooks first)
        Loader->>Resolver: dynamicImport()
        Resolver-->>Loader: exports.creator
    end
    Loader-->>CLI: configuration with creators
    CLI->>Core: lintSource(config)
```

## データモデル・ER 図

- **設定の記述:** 読み込んだ設定ファイルの内容。ルールの項目は`id`、`options`、`severity`、`disabled`、`allowMessageIds`を持ち、プリセットの場合は`rules`も持ちます。
- **`@secretlint/core`の設定:** 設定の記述の各項目に、creatorである`rule`を加えたもの。

## API・インターフェース

- `loadConfig({ cwd, configFilePath, node_moduleDir, testReplaceDefinitions })`は`{ ok, config, configDescriptor, configFilePath, messages }`を返します。
- `loadPackagesFromConfigDescriptor({ configDescriptor, node_moduleDir, testReplaceDefinitions })`は、読み込み済みの設定の記述から同じ処理をします。
- `node_moduleDir`は、`SecretLintModuleResolver`がパッケージ名と結合する基準のディレクトリです。

## 外部サービスとの連携方式

なし。

## データの取り扱い設計

設定ファイルとパッケージのモジュールを読み込むだけで、ファイルには書き込みません。

## 認証認可に関する特記事項

なし。パッケージは、実行しているプロセスの権限でimportされます。

## セキュリティ上の留意事項

パッケージをimportするとそのコードが実行されるため、設定ファイルに書かれたパッケージ名だけをimportします。

## デプロイに関する特記事項

なし。

## 検討した代替手段

- **resolverのフックで組み込みルールを解決する:** 以前の単一実行ファイルがパッケージに対して使っていた方法です。すべてのプログラムがフックを登録する必要があり、npmパッケージでは結局ルールのパッケージのインストールが必要になるため、採用しませんでした。
- **インストールしたパッケージを組み込みルールより優先する:** ルールのバージョンを常にインストールしたSecretlintと一致させ、古いプリセットのパッケージで新しいルールが隠れないようにするため、採用しませんでした。

## 未決事項

なし。
