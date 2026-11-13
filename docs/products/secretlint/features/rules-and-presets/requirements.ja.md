# ルールとルールプリセット

[English](requirements.md)

## このドキュメントについて

Secretlintは、秘密情報の種類ごとにルールを用意して検出します。ルールはrecommendプリセットとcanaryプリセットにまとめられています。
これらのルールはSecretlint自身に組み込まれているため、パッケージをインストールしなくても、設定ファイルにルールIDを書くだけでルールやプリセットを有効にできます。
このドキュメントでは、組み込みルールとプリセット、ルールの識別方法、プリセットからルールにオプションを渡す方法、組み込みルールの追加方法を説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### スコープ

- 組み込みルールとそのルールID
- パッケージをインストールせずに組み込みルールを使うこと、および同じ名前のパッケージの扱い
- recommendプリセットとcanaryプリセットに含まれるルールと、その登録方法
- プリセット内のルールのオプション、重大度、許可するメッセージ、無効化
- 各ルールのドキュメント
- Secretlintのリポジトリへの組み込みルールの追加と、組み込みルールのテスト

### スコープ外

- 各ルールが何を検出するか。これは各ルールのドキュメントで説明します。
- 設定ファイルのルールIDからルールを解決する方法: [設定の読み込み](../config-loading/requirements.ja.md)
- ルールをnpmパッケージとして作成、テストして使うこと: [カスタムルール](../custom-rules/requirements.ja.md)
- コメントで報告を抑制する機能（`@secretlint/secretlint-rule-filter-comments`の動作）。これは「コメントによる無視」の機能に含まれ、まだ書かれていません。

## ユーザーストーリー

### 1つのIDで推奨ルールを有効にする

開発者として、設定ファイルに1つ書くだけで推奨ルールを有効にしたい。ルールを1つずつ列挙しなくて済むからだ。

**受け入れ条件:**

Scenario: 設定ファイルにrecommendプリセットを書くと、プリセットのすべてのルールが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-preset-recommend" }`がある。
- When: 開発者が、AWSのアクセスキーとGitHubのトークンを含むファイルをlintする。
- Then: 結果に`@secretlint/secretlint-rule-aws`と`@secretlint/secretlint-rule-github`のメッセージがある。

Scenario: 設定ファイルにルールを1つだけ書くと、そのルールだけが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルには`{ "id": "@secretlint/secretlint-rule-aws" }`だけがある。
- When: 開発者が、AWSのアクセスキーとGitHubのトークンを含むファイルをlintする。
- Then: 結果に`@secretlint/secretlint-rule-aws`のメッセージがあり、`@secretlint/secretlint-rule-github`のメッセージはない。

### ルールのパッケージを入れた設定をそのまま使い続ける

ドキュメントに従ってプリセットのパッケージをインストールした開発者として、設定と`package.json`をそのまま使い続けたい。Secretlintを更新するときに何も変えなくて済むからだ。

**受け入れ条件:**

Scenario: 古いプリセットのパッケージが入っていても、Secretlintに組み込まれたプリセットが動く

- Given: `package.json`に`secretlint`と古いバージョンの`@secretlint/secretlint-rule-preset-recommend`があり、設定ファイルにrecommendプリセットがある。
- When: 開発者が、新しいSecretlintで追加されたルールが検出する秘密情報を含むファイルをlintする。
- Then: インストールしたパッケージではなく、インストールしたSecretlintのプリセットが動くため、結果にそのルールのメッセージがある。

Scenario: コードがパッケージからルールをimportすると、組み込みルールと同じものが得られる

- Given: プログラムが、`@secretlint/core`と同じバージョンの`@secretlint/secretlint-rule-aws`から`creator`をimportしている。
- When: プログラムがそのcreatorを`@secretlint/core`に渡して、AWSのアクセスキーを含むファイルをlintする。
- Then: 結果は組み込みルール`@secretlint/secretlint-rule-aws`の結果と同じになる。

### プリセット内のルールを設定する

開発者として、プリセット内のルールのオプションや重大度を設定したり、ルールを無効にしたりしたい。プリセットを使ったまま、リポジトリでの誤検知を減らせるからだ。

**受け入れ条件:**

Scenario: プリセットの項目でルールのオプションを指定すると、そのルールはそのオプションを使う

- Given: 設定ファイルのrecommendプリセットに`"rules": [{ "id": "@secretlint/secretlint-rule-aws", "options": { "allows": ["<そのキー>"] } }]`がある。
- When: 開発者が、そのAWSアクセスキーを含むファイルをlintする。
- Then: 結果に、そのキーについての`@secretlint/secretlint-rule-aws`のメッセージはない。

Scenario: プリセットの項目でルールの重大度を指定すると、そのルールのメッセージはその重大度になる

- Given: 設定ファイルのrecommendプリセットに`"rules": [{ "id": "@secretlint/secretlint-rule-github", "severity": "warning" }]`がある。
- When: 開発者が、GitHubのトークンを含むファイルをlintする。
- Then: `@secretlint/secretlint-rule-github`のメッセージの重大度は`warning`になり、このメッセージが原因でコマンドが失敗することはない。

Scenario: プリセットの項目でルールを無効にしても、ほかのルールは動く

- Given: 設定ファイルのrecommendプリセットに`"rules": [{ "id": "@secretlint/secretlint-rule-github", "disabled": true }]`がある。
- When: 開発者が、AWSのアクセスキーとGitHubのトークンを含むファイルをlintする。
- Then: 結果に`@secretlint/secretlint-rule-aws`のメッセージがあり、`@secretlint/secretlint-rule-github`のメッセージはない。

Scenario: 同じルールをプリセットと単独の両方に書くと、読み込みに失敗する

- Given: 設定ファイルにrecommendプリセットと`{ "id": "@secretlint/secretlint-rule-aws" }`がある。
- When: 開発者がSecretlintを実行する。
- Then: Secretlintは`@secretlint/secretlint-rule-aws`がすでに登録されているというエラーで停止し、どのファイルもlintされない。

### 新しいルールを早めに試す

開発者として、次のメジャーリリースでrecommendプリセットに入る可能性があるルールを使いたい。推奨になる前に、自分のリポジトリで確認できるからだ。

**受け入れ条件:**

Scenario: 設定ファイルにcanaryプリセットを書くと、canaryプリセットのルールが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-preset-canary" }`がある。
- When: 開発者が、canaryプリセットのルールが検出する秘密情報を含むファイルをlintする。
- Then: 結果にそのルールのメッセージがある。

### 値が報告された理由を読む

開発者として、ルールがその値を報告した理由を読みたい。それが秘密情報なのか誤検知なのかを判断できるからだ。

**受け入れ条件:**

Scenario: ルールが報告したメッセージには、ルールのドキュメントへのリンクがある

- Given: ドキュメントのあるルールがメッセージを報告する。
- When: 開発者が結果を読む。
- Then: メッセージに、ルールのドキュメントとメッセージIDを指すURLがある。

### Secretlintのリポジトリに組み込みルールを追加する

ルールの作者として、npmパッケージを作らずに、新しい種類の秘密情報のルールをSecretlintに追加したい。npmで新しいパッケージを設定しなくても、ルールをリリースできるからだ。

**受け入れ条件:**

Scenario: ルールを生成すると、組み込みルールのファイルが作られる

- Given: ルールの作者がSecretlintのリポジトリで作業している。
- When: ルールの作者が`pnpm run gen:rule`を実行し、名前に`example`を入力する。
- Then: ルールのコード、README、テストケース`ng.secret`と`ok.valid`が`@secretlint/core`の中に作られ、新しいパッケージのディレクトリは作られない。

Scenario: 組み込みルールとして登録すると、ルールIDで使える

- Given: ルール`example`が組み込みルールとして登録され、canaryプリセットに追加されている。
- When: 開発者が、パッケージをインストールせずに`{ "id": "@secretlint/secretlint-rule-example" }`またはcanaryプリセットを使ってlintする。
- Then: ルール`@secretlint/secretlint-rule-example`が動く。

Scenario: Secretlintのテストを実行すると、すべての組み込みルールのスナップショットテストが動く

- Given: 各組み込みルールのスナップショットのテストケースのディレクトリが`@secretlint/core`の中にある。
- When: ルールの作者が`@secretlint/core`のテストを実行する。
- Then: 各テストケースは、キーワードとスコープの確認も含めて、`@secretlint/tester`がカスタムルールを確認するのと同じ方法で確認される。スナップショットのディレクトリがない組み込みルールがあると、テストは失敗する。

## KPI

### recommendプリセットの誤検知

- **現状値:** 未計測。
- **目標値:** [Product](../../product.ja.md)のSLO。
- **計測方法:** 未決定。Productの未解決事項を参照。
- **計測期間:** 未決定。

## 機能要件

### ルール

**概要:** 各ルールは、1つの種類の秘密情報を検出するか、ほかのルールの報告を絞り込みます。

**入力:** ファイルの内容と、ルールのオプション。

**出力:** ルールID、メッセージID、範囲、重大度、ドキュメントへのリンクを持つメッセージ。

#### 適用する条件

##### ルールID

各組み込みルールのルールIDは`@secretlint/secretlint-rule-<name>`で、これは同じ名前のnpmパッケージの名前でもあります。
ルールIDは、設定ファイルとメッセージの`ruleId`で使われます。
`@secretlint/aws`のような短い形でも、組み込みルールを指定できます。

##### 提供するルール

組み込みルールは、recommendプリセットのルール、`@secretlint/secretlint-rule-pattern`（ユーザー定義のパターン）、`@secretlint/secretlint-rule-azure`です。
組み込みのプリセットは、recommendプリセットとcanaryプリセットです。
プリセットに入っていないルールは、そのルールIDを書いて使います。

Secretlintは、`@secretlint/secretlint-rule-no-dotenv`、`@secretlint/secretlint-rule-no-homedir`、`@secretlint/secretlint-rule-no-k8s-kind-secret`、`@secretlint/secretlint-rule-secp256k1-privatekey`もカスタムルールとして公開しています。これらは[カスタムルール](../custom-rules/requirements.ja.md)と同じく、パッケージをインストールして使います。

##### インストール

組み込みのルールやプリセットは、npm、Dockerイメージ、単一実行ファイル、quick startのどの方法で実行しても、パッケージをインストールせずに使えます。
同じ名前のパッケージがインストールされていても組み込みルールが使われ、そのパッケージは読み込まれません。そのため、ルールのバージョンは常にインストールしたSecretlintのバージョンと一致します。

##### 同じ名前のパッケージ

組み込みルールのパッケージ`@secretlint/secretlint-rule-<name>`と2つのプリセットのパッケージは、引き続き公開されます。どのパッケージも同じバージョンの組み込みルールと同じものをexportするため、これらから`creator`をimportしているコードはそのまま動きます。
これらのパッケージの非推奨化は、別の変更で扱います。

##### ブラウザ

組み込みルールは、Node.jsのモジュールなしにブラウザでも読み込んで実行できます。`.p12`ファイルを扱うGCPルールのように、バイナリの内容を確認するルールは、呼び出し側がソースと一緒に渡すバイト列を使い、ファイルは読み込みません。

##### ドキュメント

各ルールには、値を報告する理由、メッセージ、オプションを説明するREADMEがあります。

### ルールプリセット

**概要:** プリセットは、決められたルールの一覧を登録するルールです。

**入力:** 設定ファイルのプリセットの項目と、その中に書くルールごとの設定の一覧`rules`。

**出力:** プリセットの各ルールが、個別に書いた場合と同じように、プリセットの項目で指定したオプションで動きます。

#### 適用する条件

##### recommendプリセット

`@secretlint/secretlint-rule-preset-recommend`には、`@secretlint/secretlint-rule-filter-comments`を含む28個のルールが入っています。
recommendプリセットにルールを追加すると、Secretlintが初期設定で報告するエラーが増えるため、追加はメジャーリリースで行います。

##### canaryプリセット

`@secretlint/secretlint-rule-preset-canary`には、recommendプリセットに入る予定のルールが入っています。
Semantic Versioningには従わず、マイナーリリースでもルールが追加されます。
現在は、recommendプリセットと同じルールが入っています。

##### プリセット内のルール

プリセットの項目の`rules`にある各項目は、ルールIDでルールと対応づけられます。
プリセットに入っていないルールの項目と同じように、そのルールの`options`、`severity`、`allowMessageIds`、`disabled`を設定できます。
`disabled: true`を指定したルールは動きません。
項目のないルールは、既定のオプションで動きます。

#### 例外ケースでの振る舞い

##### 同じルールIDが2回登録される

プリセットと単独の項目の両方に書くなどして同じルールIDが2回登録されると、SecretlintはそのルールIDを含むエラーで停止します。

### 組み込みルールの追加

**概要:** 組み込みルールは、新しいnpmパッケージとしてではなく、Secretlintのファイルとして追加します。

**入力:** ルールの名前、コード、README、スナップショットのテストケース。

**出力:** パッケージをインストールせずに`@secretlint/secretlint-rule-<name>`で使えるルール。

#### 適用する条件

##### 登録

新しいルールは組み込みルールとして登録し、canaryプリセットに追加します。recommendプリセットへの追加はメジャーリリースで行います。

##### テスト

組み込みルールのスナップショットのテストケースは`@secretlint/core`にあり、`@secretlint/core`のテストで実行します。プリセットのテストでは、プリセットに含まれるルールのテストケースをプリセットとして実行し、`ok.*`のケースはプリセットのどのルールにも報告されてはいけません。
テストケースの構成は`@secretlint/tester`と同じで、テストケースの設定ファイルに書くルールIDは組み込みルールを指します。

## データ要件

### 必要なデータ

- **ルールID:** 設定ファイルとメッセージで、ルールやプリセットを識別する名前。
- **プリセットのルール一覧:** プリセットが登録するルールを、決まった順に並べたもの。

### データ間の関係

プリセットはルールを含みます。メッセージは、それを報告したルールをルールIDで示します。

### 個人情報

なし。ルールはファイルの内容を読み、報告する値が秘密情報であることもあります。その値を隠すことは「結果の秘密情報のマスク」機能で扱います。

## 依存する外部サービス

- **npm registry**
  - **関連するユーザーストーリー:** 1つのIDで推奨ルールを有効にする、ルールのパッケージを入れた設定をそのまま使い続ける、新しいルールを早めに試す
  - **依存する理由:** 組み込みルールを含むSecretlintと、同じ名前のパッケージは、npmパッケージとして配布されます。
  - **契約・利用上の判断:** npm registryの公開パッケージで、無料です。

## セキュリティ上の留意事項

組み込みルールは、Secretlintから渡された内容だけを読み、ネットワークは使いません。

## 未決事項

なし。
