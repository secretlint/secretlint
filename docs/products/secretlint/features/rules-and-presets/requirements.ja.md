# ルールとルールプリセット

[English](requirements.md)

## この文書について

Secretlintは秘密情報の種類ごとにルールで検出し、ルールをrecommendプリセットとcanaryプリセットにまとめています。
Secretlint自身がこれらのルールを組み込みルールとして持つので、リポジトリはパッケージをインストールせずに、設定ファイルにルールIDを書いてルールやプリセットを有効にします。
この文書は、組み込みルールとプリセット、その識別のしかた、プリセットがルールにオプションを渡すしかた、組み込みルールの加え方を説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### スコープ

- 組み込みルールと、そのルールID
- パッケージをインストールせずに組み込みルールを使うことと、同じ名前のパッケージ
- recommendプリセットとcanaryプリセット: どのルールを含み、どう登録するか
- プリセット内のルールのオプション、重大度、許可するメッセージ、無効化
- 各ルールのドキュメント
- Secretlintのリポジトリに組み込みルールを加えることと、組み込みルールのテスト

### スコープ外

- 各ルールが何を検出するか。各ルールのドキュメントが説明します。
- 設定ファイルのルールIDをルールに解決するしかた: [設定の読み込み](../config-loading/requirements.ja.md)
- ルールをnpmパッケージとして作り、テストし、使うこと: [カスタムルール](../custom-rules/requirements.ja.md)
- コメントで報告を抑える機能（`@secretlint/secretlint-rule-filter-comments`の動作）。これは「コメントによる無視」の機能に属し、まだ書かれていません。

## ユーザーストーリー

### 1つのIDで推奨ルールを有効にする

開発者として、設定ファイルの1つの項目で推奨ルールを有効にしたい。そうすれば、ルールを1つずつ並べなくて済む。

**受け入れ条件:**

Scenario: 設定ファイルにrecommendプリセットを書くと、プリセットの全ルールが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-preset-recommend" }`がある。
- When: 開発者が、AWSのアクセスキーとGitHubのトークンを含むファイルをlintする。
- Then: 結果に`@secretlint/secretlint-rule-aws`のメッセージと`@secretlint/secretlint-rule-github`のメッセージがある。

Scenario: 設定ファイルに1つのルールだけを書くと、そのルールだけが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルには`{ "id": "@secretlint/secretlint-rule-aws" }`だけがある。
- When: 開発者が、AWSのアクセスキーとGitHubのトークンを含むファイルをlintする。
- Then: 結果に`@secretlint/secretlint-rule-aws`のメッセージがあり、`@secretlint/secretlint-rule-github`のメッセージはない。

### ルールのパッケージを入れる設定を保つ

ドキュメントのとおりにプリセットのパッケージを入れた開発者として、設定と`package.json`をそのまま動かしたい。そうすれば、Secretlintを更新しても何も変えなくて済む。

**受け入れ条件:**

Scenario: 古いプリセットのパッケージが入っていると、Secretlintの組み込みのプリセットが動く

- Given: `package.json`に`secretlint`と古いバージョンの`@secretlint/secretlint-rule-preset-recommend`があり、設定ファイルにrecommendプリセットがある。
- When: 開発者が、新しいSecretlintで加わったルールが検出する秘密情報を含むファイルをlintする。
- Then: インストールしたパッケージではなく、インストールしたSecretlintのプリセットが動くので、結果にそのルールのメッセージがある。

Scenario: コードがルールをパッケージからimportすると、組み込みルールが得られる

- Given: プログラムが、`@secretlint/core`と同じバージョンの`@secretlint/secretlint-rule-aws`から`creator`をimportする。
- When: プログラムがそのcreatorを`@secretlint/core`に渡し、AWSのアクセスキーを含むファイルをlintする。
- Then: 結果は組み込みルール`@secretlint/secretlint-rule-aws`の結果と同じである。

### プリセット内のルールを設定する

開発者として、プリセット内のルールのオプションや重大度を設定したり、ルールを無効にしたりしたい。そうすれば、プリセットを使ったままリポジトリの誤検知を減らせる。

**受け入れ条件:**

Scenario: プリセットの項目にルールのオプションがあると、そのルールはそれを使う

- Given: 設定ファイルのrecommendプリセットに`"rules": [{ "id": "@secretlint/secretlint-rule-aws", "options": { "allows": ["<そのキー>"] } }]`がある。
- When: 開発者が、そのAWSアクセスキーを含むファイルをlintする。
- Then: 結果に、そのキーについての`@secretlint/secretlint-rule-aws`のメッセージはない。

Scenario: プリセットの項目がルールの重大度を設定すると、そのルールのメッセージはその重大度になる

- Given: 設定ファイルのrecommendプリセットに`"rules": [{ "id": "@secretlint/secretlint-rule-github", "severity": "warning" }]`がある。
- When: 開発者が、GitHubのトークンを含むファイルをlintする。
- Then: `@secretlint/secretlint-rule-github`のメッセージの重大度は`warning`で、それが原因でコマンドは失敗しない。

Scenario: プリセットの項目がルールを無効にすると、ほかのルールは動き続ける

- Given: 設定ファイルのrecommendプリセットに`"rules": [{ "id": "@secretlint/secretlint-rule-github", "disabled": true }]`がある。
- When: 開発者が、AWSのアクセスキーとGitHubのトークンを含むファイルをlintする。
- Then: 結果に`@secretlint/secretlint-rule-aws`のメッセージがあり、`@secretlint/secretlint-rule-github`のメッセージはない。

Scenario: 同じルールをプリセットと単独の両方に書くと、読み込みが失敗する

- Given: 設定ファイルにrecommendプリセットと`{ "id": "@secretlint/secretlint-rule-aws" }`がある。
- When: 開発者がSecretlintを実行する。
- Then: Secretlintは`@secretlint/secretlint-rule-aws`がすでに登録されているというエラーで止まり、どのファイルもlintされない。

### 新しいルールを早めに試す

開発者として、次のメジャーリリースでrecommendプリセットに入るかもしれないルールを使いたい。そうすれば、推奨になる前に自分のリポジトリで確かめられる。

**受け入れ条件:**

Scenario: 設定ファイルにcanaryプリセットを書くと、canaryプリセットのルールが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-preset-canary" }`がある。
- When: 開発者が、canaryプリセットのルールが検出する秘密情報を含むファイルをlintする。
- Then: 結果にそのルールのメッセージがある。

### 値が報告された理由を読む

開発者として、ルールがその値を報告した理由を読みたい。そうすれば、それが秘密情報か誤検知かを判断できる。

**受け入れ条件:**

Scenario: ルールがメッセージを報告すると、メッセージはルールのドキュメントへリンクする

- Given: ドキュメントを持つルールがメッセージを報告する。
- When: 開発者が結果を読む。
- Then: メッセージに、ルールのドキュメントとメッセージIDを指すURLがある。

### Secretlintのリポジトリに組み込みルールを加える

ルールの作者として、npmパッケージを作らずに、新しい種類の秘密情報のルールをSecretlintに加えたい。そうすれば、npmで新しいパッケージを設定せずにルールをリリースできる。

**受け入れ条件:**

Scenario: ルールの作者がルールを生成すると、組み込みルールのファイルが作られる

- Given: ルールの作者がSecretlintのリポジトリにいる。
- When: ルールの作者が`pnpm run gen:rule`を実行し、名前`example`を入力する。
- Then: ルールのコードとREADME、テストケース`ng.secret`と`ok.valid`が`@secretlint/core`の中に作られ、新しいパッケージのディレクトリは作られない。

Scenario: 組み込みルールとして登録すると、ルールIDで使える

- Given: ルール`example`が組み込みルールとして登録され、canaryプリセットに加えられている。
- When: 開発者がパッケージをインストールせずに、`{ "id": "@secretlint/secretlint-rule-example" }`かcanaryプリセットでlintする。
- Then: ルール`@secretlint/secretlint-rule-example`が動く。

Scenario: Secretlintのテストを実行すると、すべての組み込みルールのスナップショットテストが動く

- Given: 各組み込みルールが、`@secretlint/core`の中にスナップショットのテストケースのディレクトリを持つ。
- When: ルールの作者が`@secretlint/core`のテストを実行する。
- Then: 各テストケースは、キーワードと範囲の確認も含めて`@secretlint/tester`がカスタムルールを確かめるのと同じように確かめられ、スナップショットのディレクトリのない組み込みルールがあるとテストが失敗する。

## KPI

### recommendプリセットの誤検知

- **現在値:** 未計測。
- **目標値:** [Product](../../product.ja.md)のSLO。
- **計測方法:** 未決定。Productの未解決事項を参照。
- **計測期間:** 未決定。

## 機能要件

### ルール

**概要:** 各ルールは1つの種類の秘密情報を検出するか、他のルールの報告をフィルタします。

**入力:** ファイルの内容と、ルールのオプション。

**出力:** ルールID、メッセージID、範囲、重大度、ドキュメントへのリンクを持つメッセージ。

#### 適用条件

##### ルールID

各組み込みルールのルールIDは`@secretlint/secretlint-rule-<name>`で、これはそのnpmパッケージの名前でもあります。
ルールIDは、設定ファイルとメッセージの`ruleId`に使われます。
`@secretlint/aws`のような短い形も、組み込みルールを指します。

##### 提供するルール

組み込みルールは、recommendプリセットのルール、`@secretlint/secretlint-rule-pattern`（ユーザー定義のパターン）、`@secretlint/secretlint-rule-azure`です。
組み込みのプリセットは、recommendプリセットとcanaryプリセットです。
プリセットに入っていないルールは、そのルールIDを書いて使います。

Secretlintは、`@secretlint/secretlint-rule-no-dotenv`、`@secretlint/secretlint-rule-no-homedir`、`@secretlint/secretlint-rule-no-k8s-kind-secret`、`@secretlint/secretlint-rule-secp256k1-privatekey`もカスタムルールとして公開しています。これらは[カスタムルール](../custom-rules/requirements.ja.md)のとおり、パッケージとしてインストールして使います。

##### インストール

組み込みルールやプリセットは、パッケージをインストールせずに、npm、Dockerイメージ、単一実行ファイル、quick startのどの動かし方でも使えます。
同じ名前のパッケージがインストールされていても、組み込みルールが使われ、パッケージは読み込まれないので、ルールは常にインストールしたSecretlintのバージョンになります。

##### 同じ名前のパッケージ

組み込みルールのパッケージ`@secretlint/secretlint-rule-<name>`と、2つのプリセットのパッケージは、引き続き公開されます。それぞれ同じバージョンの組み込みルールと同じルールをexportするので、そこから`creator`をimportするコードは動き続けます。
これらのパッケージの非推奨化は別の変更です。

##### ブラウザ

組み込みルールはブラウザで読み込めます。`.p12`ファイルのためのGCPルールのように、一部の内容でだけNode.jsを必要とするルールは、その内容を確かめるときだけそれを読み込みます。

##### ドキュメント

各ルールには、値を報告する理由、メッセージ、オプションを説明するREADMEがあります。

### ルールプリセット

**概要:** プリセットは、決まった一覧のルールを登録するルールです。

**入力:** 設定ファイルのプリセットの項目と、その中のルール向けのオプションの一覧`rules`。

**出力:** プリセットのルールが、それぞれを書いたときと同じように、プリセットの項目のオプションで動きます。

#### 適用条件

##### recommendプリセット

`@secretlint/secretlint-rule-preset-recommend`は`@secretlint/secretlint-rule-filter-comments`を含む28個のルールを持ちます。
recommendプリセットへのルールの追加は、Secretlintが初期設定で報告するエラーを増やすので、メジャーリリースで行います。

##### canaryプリセット

`@secretlint/secretlint-rule-preset-canary`は、recommendプリセットに入る予定のルールを持ちます。
Semantic Versioningに従わず、マイナーリリースでもルールが追加されます。
現在はrecommendプリセットと同じルールを持ちます。

##### プリセット内のルール

プリセットの項目の`rules`の各項目は、ルールIDで照合されます。
プリセットに入っていないルールの項目と同じように、そのルールの`options`、`severity`、`allowMessageIds`、`disabled`を設定できます。
項目が`disabled: true`のルールは動きません。
項目のないルールは既定のオプションで動きます。

#### 例外的な動作

##### 同じルールIDが2回登録される

プリセットと単独の項目などで同じルールIDが2回登録されると、SecretlintはそのルールIDを示すエラーで止まります。

### 組み込みルールの追加

**概要:** 組み込みルールは、新しいnpmパッケージではなく、Secretlintのファイルとして加えます。

**入力:** ルールの名前、コード、README、スナップショットのテストケース。

**出力:** パッケージをインストールせずに`@secretlint/secretlint-rule-<name>`で使えるルール。

#### 適用条件

##### 登録

新しい組み込みルールは、組み込みルールとして登録し、canaryプリセットに加えます。recommendプリセットへの追加はメジャーリリースで行います。

##### テスト

組み込みルールとプリセットのスナップショットのテストケースは`@secretlint/core`にあり、`@secretlint/core`のテストがそれを実行します。
テストケースは`@secretlint/tester`のテストケースと同じ構成で、その設定ファイルのルールIDは組み込みルールを指します。

## データ要件

### 必要なデータ

- **ルールID:** 設定ファイルとメッセージで、ルールやプリセットを識別する名前。
- **プリセットのルール一覧:** プリセットが登録するルールを、決まった順で並べたもの。

### 関係

プリセットはルールを含みます。メッセージは、それを報告したルールをルールIDで指します。

### 個人情報

なし。ルールはファイルの内容を読み、報告する値は秘密情報のことがあります。それを隠すのは「結果の秘密情報のマスク」機能に属します。

## 外部サービスへの依存

- **npm registry**
  - **関係するユーザーストーリー:** 1つのIDで推奨ルールを有効にする、ルールのパッケージを入れる設定を保つ、新しいルールを早めに試す
  - **依存する理由:** 組み込みルールを持つSecretlintと、同じ名前のパッケージは、npmパッケージとして配布されます。
  - **契約と利用の判断:** npm registryの公開パッケージで、無料です。

## セキュリティの考慮

提供するルールはSecretlintが渡す内容だけを読み、ネットワークを使いません。

## 未解決事項

なし。
