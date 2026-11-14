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
GCPルールなど、それ以外のルールは`create()`を実装し、`context.report()`で報告します。patternルールのパターンはオプションから来ます。[ユーザー定義のパターン](#ユーザー定義のパターン)を参照してください。

`@secretlint/core`をブラウザでも読み込めるように、組み込みルールはNode.jsのモジュールをトップレベルでimportしません。
`node:path`の代わりに、小さな`basename`関数を使います。
GCPルールは、ファイルを読み込まずに、ソースの`contentBytes`から`.p12`ファイルを確認します。ファイルのMACの計算では、`node:crypto`が使える環境でだけそれをimportし、使えない環境ではWeb Cryptoを使います。
patternルールは、`micromatch`と同じ方法で`picomatch`を使ってファイルパスを照合します。そのため、`micromatch`には依存しなくなりました。

### オプションで有効・無効が切り替わるパターン

パターンは、任意のプロパティ`when`を持てます。パターンをlintに含める条件です。
`when: "options.name"`は、ルールのオプション`name`が`true`のときに成り立ちます。`when: "!options.name"`は、そのオプションが`true`でなければ成り立ちます。
接頭辞の`options.`は、その値がルールのオプションであることを表します。ルールが`context.options`を読むのと同じ名前です。共有オプションのような別の値に対する条件は、あとから別の接頭辞で追加できます。
たとえばAWSルールは、アクセスキーIDとアカウントIDのパターンに`when: "options.enableIDScanRule"`を書いています。アカウントIDのキーワードは`account`のようなよくある単語です。そのため、パターンを実行してから`report()`で一致をすべて捨てる方法では、その単語を含むファイルが多いリポジトリで、lintの時間の大きな部分をこのパターンが占めていました。

`@secretlint/core`は、設定からlint planを作るときに各ルールのオプションを読み、`when`が成り立たないパターンをplanから外します。

- `when`がないパターンは、planに入ります。
- `when`は、省略できる`!`、`options.`、それに続く名前でなければなりません。名前に使えるのは英字、数字、`_`、`$`で、数字では始められません。それ以外の値のときは、planを作る処理がルールIDとその値を含むエラーを投げます。そのため、`options.a && options.b`や別の接頭辞を持つ参照のように、新しいcoreがサポートする文字列を別の意味に読むことはありません。
- オプションの値は、オプションのオブジェクトがその名前で自分自身に持つプロパティから読みます。`constructor`のように、オブジェクトが継承しているプロパティはオプションではありません。指定されていないオプションは`false`です。
- 値が指定されていて、booleanではないときは、planを作る処理がルールIDとオプションの名前を含むエラーを投げます。coreは値をbooleanに変換しません。

planは1つの設定に対して1回だけ作るので、オプションを読むのも1回で、ファイルごとには読みません。
planにないパターンは、キーワードを探す処理に登録されません。そのため、そのキーワードがきっかけでcoreがファイルを文字列として読むことはなく、正規表現も実行されません。
パターンの`report()`は、オプションをもう一度確認しません。

このプロパティの型は、`@secretlint/types`の`SecretLintRulePatternWhen<Options>`です。`Options`のプロパティのうち値がbooleanであるものの名前（`SecretLintRulePatternBooleanOptionName<Options>`）を`options.`のあとに書いたものと、その前に`!`を付けたものを、テンプレートリテラル型で表します（`` `options.${Name}` | `!options.${Name}` ``）。ほかのオプションの名前や、オプションではない名前は型エラーになります。既定の`{}`や`unknown`のように`Options`にプロパティが1つもない場合は、`options.`のあとにどんな名前でも書けます。
この文字列の型は、`SecretLintRulePattern`、`SecretLintRulePatternCreator`、`SecretLintRuleCreator`の2つ目の型引数です。既定値は`Options`から計算されるので、ルールが渡す必要はありません。プロパティの型で`Options`を直接使うと、独自の`Options`を持つルールのcreatorを`SecretLintRuleCreator<unknown>`に代入できなくなります。TypeScriptは、`Options`のプロパティ名を使う型を、`unknown`のそれの代わりとしては受け付けないからです。独立した型引数にしておくと、ルールが持つ文字列は、どんな名前でも受け付ける`SecretLintRuleCreator<unknown>`の文字列に代入できます。そのため、プリセットのcreatorの`rules`や`builtinRules`のように、オプションが異なるルールを並べる一覧の型は、`SecretLintRuleCreator<unknown>[]`のままです。

`when`は、coreが知っているパターンのプロパティの1つです。coreは知らないプロパティがあるとエラーを投げます。テストを実行する`@secretlint/core/testing`は、比較のためにキーワードとスコープを取り除くときも、`when`は残します。このプロパティはルールが何を報告するかを決めるもので、最適化ではないからです。

### ユーザー定義のパターン

`@secretlint/core`は、`@secretlint/secretlint-rule-pattern`のオプションを、他の組み込みルールの`patterns`と同じように、lint計画のパターンとして読みます。
このルールのcreatorは`patterns: []`を持ち、`create()`を持ちません。coreは計画を作るときに、idではなくcreatorのオブジェクトでこのルールを見分け、`options.patterns`の各エントリを`src/builtin/rules/pattern/user-patterns.ts`の`compileUserPatterns()`で変換します。

- `patterns`(または`pattern`)の各RegExp風の文字列は、スコープ`file`の計画のパターンになります。文字列は、これまで`matchPatterns()`が使っていた`@textlint/regexp-string-matcher`の`createRegExp()`でRegExpにするので、同じテキストに一致します。`/source/flags`は`new RegExp(source, flags + "ug")`になり、それ以外の文字列はエスケープします。
- 計画のパターンのキーワードは、エントリに`keywords`があればそれです。なければ`src/helper/extract-keywords.ts`の`extractKeywords(regex)`の結果で、見つからなければキーワードなしです。`keywords: []`はキーワードなしを意味し、パターンはすべてのファイルで実行します。見つけたキーワードが誤っているときの逃げ道になります。
- 計画のパターンの`report()`は、全体の`allows`とエントリの`allows`を確認し、これまでのルールと同じく、エントリの名前を入れたメッセージ`PATTERN`を報告します。
- `filePathGlobs`は、計画のパターンのファイルパスの条件になります。coreはパターンを実行する前にこれを確認し、globが一致しないパターンは、キーワードが見つかっても実行しません。パスはこれまでと同じく`picomatch`で照合します。
- `filePathGlobs`だけのエントリはパスのパターンになります。パスが一致すると、内容全体を範囲にしてファイル名を報告します。パスのパターンはキーワードを必要とせず、計画はパスのパターンを別に持ちます。そのため、どのキーワードにもどのパスのパターンにも一致しないファイルでは、どのルールも実行しません。ワーカースレッドのキーワード走査はパスを確認しないので、パスのパターンが有効な間は、キーワード走査の計画の`requiresKeyword`をfalseにし、ワーカーはすべてのファイルをメインスレッドに渡します。
- `options.patterns`がないか空のとき、計画にこのルールのパターンはありません。そのため、オプションなしでこのルールを書く`secretlint --init`は、lintに何も加えません。
- オプションの確認(`patterns`と`pattern`の両方がある、`patterns`、`pattern`、`filePathGlobs`のどれもないエントリがある、`keywords`が正しくない)は、計画を作るときにエラーにし、どのファイルもlintしません。

計画は設定ごとに1回作るので、文字列の解釈とキーワードの抽出も、ファイルごとではなく1回です。
計画のパターンのプロファイルIDは`@secretlint/secretlint-rule-pattern#<番号> <名前>`で、すべてのファイルで実行するパターンには名前の後に` (no keywords)`が付きます。
`@secretlint/core/testing`のスナップショットの実行は、結果をキーワードなしの結果と比べます。coreはcreatorのオブジェクトでこのルールを見分けるので、このルールには同じcreatorを渡し、各エントリに`keywords: []`を付けます。
`@secretlint/core`のメインモジュールは、このルールのcreator、`picomatch`、`@textlint/regexp-string-matcher`を読み込むようになります。どれもパッケージの依存には既にあります。coreと推奨プリセットのブラウザ向けバンドルは、209.75 kBから218.21 kB(gzipで45.16 kBから46.77 kB)に増えます。

#### パターンからキーワードを見つける

`extractKeywords(regex)`は、`regex`のすべての一致が必ず含む文字列か、`undefined`を返します。`regex.source`を先頭から読み、すべての一致が続けて消費するASCII文字の並びを集めます。

- リテラルの文字や、エスケープした記号(`\.`や`\/`など)は、今の並びに加えます。キーワードの照合はASCIIの大文字と小文字を区別しないので、フラグ`i`のときは小文字にします。
- 文字クラス、`.`、`^`、`$`、`\d`、`\w`、`\s`、`\b`、`\x41`や`\u0041`のようなエスケープ、後方参照、ASCII以外の文字は、今の並びを終えます。
- `?`、`*`、`{0,...}`の付いた文字は省略されうるので、除いて並びを終えます。`+`や`{n,...}`(`n`は1以上)の付いた文字は残して並びを終えます。
- すべての一致が通るグループ(量指定子がないか、最小が1以上)は、すべての選択肢に並びがあるとき、各選択肢の最もよい並びの和集合になります。肯定の先読みと後読みは、その文字列が内容にあるはずなので、グループとして扱います。否定の先読みと後読みは、並びを終えます。
- トップレベルの`|`は、各選択肢の最もよい並びの和集合になり、並びのない選択肢があれば`undefined`になります。
- フラグ`v`や修飾子付きのグループなど、知らない構文は`undefined`になります。

3文字より短い並びは使いません。短いキーワードはほとんどのファイルで見つかり、走査が多くの位置を報告するためです。
並びのうち、最も短いキーワードが最も長いものを使います。

試作を組み込みルールの38個のパターンで確かめました。38個すべてでキーワードが見つかり、24個はルールが宣言するキーワードと同じで、残りはそれより短いものでした(`http://`に対して`http`など)。スナップショットテストの142個の入力では、見つけたキーワードのどれも含まないファイルでの一致はありませんでした。ランダムなパターン12,852個とランダムなテキストでも、そうした一致はありませんでした。これらは証明ではないので、抽出は保守的にし、組み込みルールでテストします。

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
- **`options.`を付けずにオプションの名前だけを書く:** `when: "enableIDScanRule"`の方が短く書けます。採用しませんでした。名前だけでは、ルールのオプションしか表せないからです。接頭辞があれば、別の値に対する条件をあとから別の接頭辞で追加でき、すでにある条件の意味も変わりません。
- **CELのような式言語を使う:** オプションを使う任意の式を条件にする案です。採用しませんでした。式を評価する処理を入れると、ブラウザでも動く`@secretlint/core`の依存とサイズが増えます。自由な式は、オプションの型で確認できません。そして、現在の用途はbooleanのオプション1つだけです。`when`は、そのような言語の部分集合として読める書き方にしてあり、coreはサポートしていない書き方を拒否します。そのため、演算子はあとから追加できます。
- **真とみなせる値をtrueとして読む:** AWSルールがオプションを`report()`の中で確認していたときは、文字列の`"true"`でもパターンが有効になっていました。この動きは残しませんでした。`when`は新しいプロパティで、保つべき動きがありません。また、booleanに対する条件が、値ごとの変換のしかたに左右されるべきではありません。そのような値を持つ設定は、結果が黙って変わるのではなく、エラーで停止します。
- **オプションが指定されていないときに`report()`の最初で処理をやめる:** 変更前の設計です。結果は同じですが、パターンのキーワードを探し、ファイルを文字列として読み、パターンを実行したうえで、一致をすべて捨てていました。
- **idでパターンルールを見分ける:** coreが、パターンのない`@secretlint/secretlint-rule-pattern`をidで外します。試しましたが(#1825)採用しませんでした。1つのルールのための例外を計画と計画のキャッシュに足すことになり、同じidを持つ別のパッケージのルールも外してしまい、パターンがあるときはキーワードのないルールとして、やはりすべてのファイルで動くためです。
- **ルールの関数からパターンを返す:** ルールが、オプションからパターンを返す関数を持ちます。ルールは見つけるものをデータとして示し、coreがそれを実行するので、採用しませんでした。パターンが設定から来るルールはパターンルールだけなので、この1つの変換はcoreが持ちます。
- **ユーザー定義のパターンのための設定ファイルの新しいプロパティ:** ルールのオプションではなく、設定ファイルの最上位にパターンを書きます。既存の設定はルールの名前を書いており、メッセージもそのルールIDを持つので、今は採用しませんでした。同じ変換の上に後から追加できます。
- **ユーザーが書いたキーワードだけを使う:** coreはパターンからキーワードを見つけません。既存の設定には`keywords`がなく、それらがすべてのファイルで動いたままになるので、採用しませんでした。
- **ASCII文字に畳み込まれるASCII以外の文字のキーワード:** フラグ`i`のとき、`k`や`s`を含むキーワードに、ケルビン記号や長いsを加えます。キーワードの照合はASCIIだけで、`k`や`s`ごとにキーワードの数が増え、Secretlintは検出漏れをなくすことより誤検知をなくすことを優先するので、採用しませんでした。

## 未決事項

なし。
