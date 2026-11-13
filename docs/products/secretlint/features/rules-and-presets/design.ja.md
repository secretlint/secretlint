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
GCPルールは、ファイルを読み込まずに、ソースの`contentBytes`から`.p12`ファイルを確認します。ファイルのMACの計算では、`node:crypto`が使える環境でだけそれをimportし、使えない環境ではWeb Cryptoを使います。
patternルールは、`micromatch`と同じ方法で`picomatch`を使ってファイルパスを照合します。そのため、`micromatch`には依存しなくなりました。

### オプションで有効・無効が切り替わるパターン

パターンは、任意のプロパティ`when`を持てます。パターンをlintに含める条件です。
`when: "name"`は、ルールのオプション`name`が`true`のときに成り立ちます。`when: "!name"`は、そのオプションが`true`でなければ成り立ちます。
たとえばAWSルールは、アクセスキーIDとアカウントIDのパターンに`when: "enableIDScanRule"`を書いています。アカウントIDのキーワードは`account`のようなよくある単語です。そのため、パターンを実行してから`report()`で一致をすべて捨てる方法では、その単語を含むファイルが多いリポジトリで、lintの時間の大きな部分をこのパターンが占めていました。

`@secretlint/core`は、設定からlint planを作るときに各ルールのオプションを読み、`when`が成り立たないパターンをplanから外します。

- `when`がないパターンは、planに入ります。
- `when`は、省略できる`!`と、それに続く名前でなければなりません。名前に使えるのは英字、数字、`_`、`$`で、数字では始められません。それ以外の値のときは、planを作る処理がルールIDとその値を含むエラーを投げます。そのため、`a && b`のように新しいcoreがサポートする演算子を含む文字列を、オプションの名前として読むことはありません。
- オプションの値は、オプションのオブジェクトがその名前で自分自身に持つプロパティから読みます。`constructor`のように、オブジェクトが継承しているプロパティはオプションではありません。指定されていないオプションは`false`です。
- 値が指定されていて、booleanではないときは、planを作る処理がルールIDとオプションの名前を含むエラーを投げます。coreは値をbooleanに変換しません。

planは1つの設定に対して1回だけ作るので、オプションを読むのも1回で、ファイルごとには読みません。
planにないパターンは、キーワードを探す処理に登録されません。そのため、そのキーワードがきっかけでcoreがファイルを文字列として読むことはなく、正規表現も実行されません。
パターンの`report()`は、オプションをもう一度確認しません。

このプロパティの型は、`@secretlint/types`の`SecretLintRulePatternWhen<Options>`です。`Options`のプロパティのうち値がbooleanであるものの名前（`SecretLintRulePatternBooleanOptionName<Options>`）と、その名前の前に`!`を付けたものを、テンプレートリテラル型で表します。ほかのオプションの名前や、オプションではない名前は型エラーになります。既定の`{}`や`unknown`のように`Options`にプロパティが1つもない場合、型は`string`になります。
この文字列の型は、`SecretLintRulePattern`、`SecretLintRulePatternCreator`、`SecretLintRuleCreator`の2つ目の型引数です。既定値は`Options`から計算されるので、ルールが渡す必要はありません。プロパティの型で`Options`を直接使うと、独自の`Options`を持つルールのcreatorを`SecretLintRuleCreator<unknown>`に代入できなくなります。TypeScriptは、`Options`のプロパティ名を使う型を、`unknown`のそれの代わりとしては受け付けないからです。独立した型引数にしておくと、ルールが持つ文字列は、`SecretLintRuleCreator<unknown>`が持つ`string`に代入できます。そのため、プリセットのcreatorの`rules`や`builtinRules`のように、オプションが異なるルールを並べる一覧の型は、`SecretLintRuleCreator<unknown>[]`のままです。

`when`は、coreが知っているパターンのプロパティの1つです。coreは知らないプロパティがあるとエラーを投げます。テストを実行する`@secretlint/core/testing`は、比較のためにキーワードとスコープを取り除くときも、`when`は残します。このプロパティはルールが何を報告するかを決めるもので、最適化ではないからです。

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

スナップショットのテストケースは、`packages/@secretlint/core/test/builtin/rules/<name>/snapshots/`にあります。
テストは、`@secretlint/tester`と同じ方法で各ケースを確認するテストランナー`@secretlint/core/testing`で実行します。バイト列のソース、文字列のソース、キーワードによる最適化をしないルールの3つで、結果が一致しなければなりません。
`@secretlint/tester`は`@secretlint/core`に依存しているため、`@secretlint/core`のテストで`@secretlint/tester`を使うとworkspaceに循環依存ができます。そのため、テストランナーは`@secretlint/core`に置いています。
`@secretlint/tester`はこのテストランナーをラップし、設定の読み込みを使った設定ファイルの読み込みを追加しています。

`@secretlint/core`のテストでは、テストケースの設定ファイルにルールIDを書き、テストランナーが`getBuiltinRule`でルールを取得します。
スナップショットのディレクトリがないルールのディレクトリがあると、テストは失敗します。
プリセットは自分のテストケースを持ちません。プリセットのテストでは、プリセットに含まれる各ルールのテストケースを、そのルールのオプションをプリセットの項目に入れた設定でプリセットとして実行し、次の2つを確認します。1つは、そのルールのメッセージがルールの`output.json`と一致すること（`ruleParentId`はプリセットのIDになる）です。もう1つは、`ok.*`のケースでプリセットのどのルールも報告しないことです。2つ目の確認で、あるルールが有効とする値をプリセットのほかのルールが報告していないかが分かります。
以前は、スクリプトでルールのテストケースをプリセットごとのスナップショットのディレクトリにコピーしていました。コピーは`ruleParentId`以外はルールのものと同じ内容で、ルールを変えるたびにコピーし直す必要があったため、ルールのテストケースを直接読むようにしました。

`pnpm run gen:rule`は、ルールのディレクトリ、README、テストケース`ng.secret`と`ok.valid`を`@secretlint/core`の中に作ります。

## アーキテクチャ・シーケンス図

図は不要です。プリセットはルールの一覧であり、ほかとのやり取りはlintの準備中に呼ぶ`registerRule()`だけです。

## データモデル・ER 図

- **ルールのcreator:** `meta`（id、type、recommended、supportedContentTypes、docs.url、任意のkeywords）、`messages`、そして`patterns`か`create()`のどちらか。
- **パターン:** `pattern`、任意の`keywords`、`caseSensitiveKeywords`、`scope`、`when`、そして`report()`。
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
- **組み込みルール専用のパッケージを1つ作る:** Biomeがルールをエンジンとは別のcrateに置いているように、ルールとテストを`@secretlint/core`とは別のパッケージに置く案です。これは、ルールとエンジンのバージョンが一致している必要があるため採用しませんでした。ルールが宣言した`patterns`は`@secretlint/core`が実行し、古いエンジンで新しいルールを動かすことはサポートしません。別のパッケージにすると、`@secretlint/core`と異なるバージョンのルールがインストールされる可能性があります。1つのパッケージにすれば、ルールは常にそれを実行するエンジンと一緒に配布され、公開してインストールするパッケージも1つで済みます。oxlintやESLintと同じく、ルール、エンジン、テストを1つのパッケージに置きます。
- **パターンに関数`enabled(options)`を持たせる:** パターンが、有効かどうかを返す関数を持つ案です。どんな条件でも書けますが、採用しませんでした。ルールは探すものをデータとして書き、`@secretlint/core`がそれを実行します。関数にすると、どのオプションを読んでいるのかがcoreから見えません。また、条件をルールごとに書くことになるので、文字列の`"true"`のような同じ値でも、あるルールでは有効になり、別のルールでは有効にならないということが起こります。`when`なら、条件はcoreの1か所にまとまり、名前は型で確認でき、データなので一覧にしたり別のスレッドに渡したりできます。
- **`enabledByOption`と`disabledByOption`の2つのプロパティを持たせる:** それぞれにオプションの名前を書く案です。採用しませんでした。1つの条件のために対のプロパティを持つと、条件の種類が増えるたびにプロパティも増え、1つのパターンに両方を書くこともできてしまいます。VS Codeの`when`句やCELと同じように、`!`を使えば1つの条件で両方を書けます。
- **CELのような式言語を使う:** オプションを使う任意の式を条件にする案です。採用しませんでした。式を評価する処理を入れると、ブラウザでも動く`@secretlint/core`の依存とサイズが増えます。自由な式は、オプションの型で確認できません。そして、現在の用途はbooleanのオプション1つだけです。`when`は、そのような言語の部分集合として読める書き方にしてあり、coreはサポートしていない書き方を拒否します。そのため、演算子はあとから追加できます。
- **真とみなせる値をtrueとして読む:** AWSルールがオプションを`report()`の中で確認していたときは、文字列の`"true"`でもパターンが有効になっていました。この動きは残しませんでした。`when`は新しいプロパティで、保つべき動きがありません。また、booleanに対する条件が、値ごとの変換のしかたに左右されるべきではありません。そのような値を持つ設定は、結果が黙って変わるのではなく、エラーで停止します。
- **オプションが指定されていないときに`report()`の最初で処理をやめる:** 変更前の設計です。結果は同じですが、パターンのキーワードを探し、ファイルを文字列として読み、パターンを実行したうえで、一致をすべて捨てていました。

## 未決事項

なし。
