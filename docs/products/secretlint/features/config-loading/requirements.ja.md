# 設定の読み込み

[English](requirements.md)

## このドキュメントについて

Secretlintはリポジトリの設定ファイルを読み、どのルールをどのオプションで動かすかを決めます。
このドキュメントでは、Secretlintが設定ファイルを探す方法、設定がないときに動くルール、設定に書いたルールIDから実行するルールが決まるまでの流れを説明します。
親のProductは[Secretlint](../../product.ja.md)です。

### スコープ

- 設定ファイルの探索と、`--secretlintrc`オプション、`--secretlintrcJSON`オプション
- 設定が見つからないときに使う既定の設定
- 設定ファイルの各ルールIDを、組み込みルール、またはインストールしたパッケージのルールやプリセットに解決すること
- ルールIDの短い形
- ルールIDを解決できないときの動作

### スコープ外

このドキュメントでは、設定の読み込みのうち次の部分はまだ説明していません。

- 設定ファイルの検証と、非推奨の設定についてのメッセージ
- `sharedOptions`

ルールとプリセットそのものは[ルールとルールプリセット](../rules-and-presets/requirements.ja.md)で説明します。

## ユーザーストーリー

### リポジトリの設定を使う

開発者として、オプションを付けなくても、Secretlintにリポジトリの設定ファイルを見つけてほしい。リポジトリのどのディレクトリでも、同じコマンドで同じルールを使えるからだ。

**受け入れ条件:**

Scenario: カレントディレクトリに設定ファイルがあると、それを使う

- Given: カレントディレクトリに`.secretlintrc.json`がある。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: `.secretlintrc.json`のルールが動く。

Scenario: 親ディレクトリに設定ファイルがあると、それを使う

- Given: リポジトリのルートディレクトリにだけ`.secretlintrc.json`があり、開発者はサブディレクトリにいる。
- When: 開発者がサブディレクトリで`secretlint "**/*"`を実行する。
- Then: ルートディレクトリの`.secretlintrc.json`のルールが動く。

Scenario: `package.json`に`secretlint`フィールドがあると、それを設定として使う

- Given: カレントディレクトリに`.secretlintrc*`ファイルがなく、`package.json`に`secretlint`フィールドがある。
- When: 開発者がSecretlintを実行する。
- Then: `secretlint`フィールドのルールが動く。

Scenario: 設定にルールがなくても、既定の設定は足さない

- Given: `.secretlintrc.json`が`{ "rules": [] }`である。
- When: 開発者がSecretlintを実行する。
- Then: 秘密情報は報告されず、結果には`.secretlintrc.json`に対する`EMPTY_RULES`の警告がある。recommendプリセットは動かない。

### 設定ファイルなしでSecretlintを実行する

開発者、CIの管理者、またはAIエージェントとして、設定がないときはrecommendのルールで秘密情報を確認してほしい。先に設定ファイルを作らなくても、どのディレクトリでも一度実行できるからだ。

**受け入れ条件:**

Scenario: 設定が見つからないと、recommendプリセットが動く

- Given: カレントディレクトリにも親ディレクトリにも、`.secretlintrc*`ファイルと`package.json`の`secretlint`フィールドがなく、オプションでも設定を渡しておらず、`token.txt`にGitHubのトークンがある。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: 結果に`@secretlint/secretlint-rule-preset-recommend`のGitHubルールのメッセージがあり、終了ステータスは1になる。stderrには何も出ない。

Scenario: 既定の設定で秘密情報が見つからなければ、Secretlintは成功する

- Given: 設定が見つからず、どのファイルにも秘密情報がない。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: メッセージは報告されず、終了ステータスは0になる。

Scenario: recommendプリセットにないルールは、既定では動かない

- Given: 設定が見つからず、ディレクトリに`.env`ファイルがある。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: `@secretlint/secretlint-rule-no-dotenv`のメッセージは報告されない。このルールはrecommendプリセットに含まれないからだ。

### コマンドで設定を選ぶ

開発者またはCIの管理者として、設定をコマンドで渡したい。リポジトリにない設定を使えるからだ。

**受け入れ条件:**

Scenario: `--secretlintrc`でファイルを指定すると、そのファイルを使う

- Given: `config/secretlint.json`に設定がある。
- When: 開発者が`secretlint "**/*" --secretlintrc config/secretlint.json`を実行する。
- Then: `config/secretlint.json`のルールが動き、各ディレクトリの`.secretlintrc*`ファイルは読まれない。

Scenario: `--secretlintrcJSON`でJSON文字列を渡すと、それを使う

- When: 開発者が`secretlint "**/*" --secretlintrcJSON '{"rules":[{"id":"@secretlint/secretlint-rule-preset-recommend"}]}'`を実行する。
- Then: recommendプリセットが動き、設定ファイルは読まれない。

Scenario: `--secretlintrc`が親ディレクトリのファイルを指しても、見つからない

- Given: 親ディレクトリに`rc.json`があり、カレントディレクトリにはない。
- When: 開発者が`secretlint "**/*" --secretlintrc rc.json`を実行する。
- Then: Secretlintは`rc.json`を示すエラーで止まり、終了ステータスは2になる。親ディレクトリの`rc.json`は使わない。

Scenario: `--secretlintrc`のファイルが見つからないと、Secretlintは止まる

- Given: カレントディレクトリに`missing.json`がない。
- When: 開発者が`secretlint "**/*" --secretlintrc missing.json`を実行する。
- Then: Secretlintは`missing.json`を示すエラーで止まり、ファイルはlintされず、終了ステータスは2になる。既定の設定は使わない。

Scenario: 見つかった設定ファイルが壊れていると、Secretlintは止まる

- Given: `.secretlintrc.json`に構文エラーがある。
- When: 開発者がSecretlintを実行する。
- Then: Secretlintは`.secretlintrc.json`を示すエラーで止まり、終了ステータスは2になる。既定の設定は使わない。

### ルールをIDで指定する

開発者として、組み込みルールはルールIDで、カスタムルールはnpmパッケージの名前で指定したい。意図したルールをSecretlintに実行させられるからだ。

**受け入れ条件:**

Scenario: 組み込みルールのIDを書くと、組み込みルールが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-aws" }`がある。
- When: 開発者が、AWSのアクセスキーを含むファイルをlintする。
- Then: 結果に、`ruleId`が`@secretlint/secretlint-rule-aws`のメッセージがある。

Scenario: 短い形のルールIDを書くと、完全なIDのルールが動く

- Given: `secretlint`だけがインストールされていて、設定ファイルに`{ "id": "@secretlint/aws" }`がある。
- When: 開発者が、AWSのアクセスキーを含むファイルをlintする。
- Then: 結果にAWSのルールのメッセージがあり、その`ruleId`は設定ファイルに書いた`@secretlint/aws`になる。

Scenario: 組み込みルールと同じ名前のパッケージがインストールされていても、組み込みルールが動く

- Given: 古いバージョンの`@secretlint/secretlint-rule-preset-recommend`がインストールされていて、設定ファイルに`{ "id": "@secretlint/secretlint-rule-preset-recommend" }`がある。
- When: 開発者がSecretlintを実行する。
- Then: インストールしたSecretlintのプリセットが動き、インストールしたパッケージはimportされない。

Scenario: サードパーティのルールは、インストールすればパッケージ名で使える

- Given: ルールのパッケージ`secretlint-rule-example`がインストールされていて、設定ファイルに`{ "id": "secretlint-rule-example" }`または`{ "id": "example" }`がある。
- When: 開発者がファイルをlintする。
- Then: `secretlint-rule-example`のルールが動く。

### 足りないルールを知る

開発者として、どのルールIDを読み込めなかったのかを知りたい。足りないパッケージをインストールできるからだ。

**受け入れ条件:**

Scenario: ルールのパッケージがインストールされていないと、SecretlintはそのIDを示して停止する

- Given: 設定ファイルにカスタムルール`{ "id": "@secretlint/secretlint-rule-no-dotenv" }`があり、そのパッケージはインストールされていない。
- When: 開発者がSecretlintを実行する。
- Then: Secretlintは、`@secretlint/secretlint-rule-no-dotenv`が見つからないため読み込めないというエラーで停止し、どのファイルもlintされない。

## KPI

なし。この機能はすべてのlintで行われる処理の一部で、指標は決まっていません。

## 機能要件

### 設定ファイルの探索

**概要:** Secretlintは、コマンドのオプションから設定を決めるか、カレントディレクトリから設定ファイルを探します。

**入力:** カレントディレクトリと、`--secretlintrc`オプションまたは`--secretlintrcJSON`オプション。

**出力:** 設定と、それを読んだファイルのパス。または、パスを持たない既定の設定。

#### 適用する条件

##### オプションがないとき

Secretlintはカレントディレクトリで次のものをこの順に探し、最初に読めたものを使います。

1. `.secretlintrc.cjs`、`.secretlintrc.js`、`.secretlintrc.json`、`.secretlintrc.yaml`、`.secretlintrc.yml`
2. `.secretlintrc`（JSON、YAML、JavaScriptとして読む）
3. `package.json`の`secretlint`フィールド

どれも見つからなければ、親ディレクトリで同じように探し、ファイルシステムのルートまで続けます。
別々のディレクトリの設定はマージしません。

##### `--secretlintrc`

このオプションは、ちょうど1つのファイルを指します。相対パスはカレントディレクトリから解決し、指定した名前のファイルをそのまま読みます。
親ディレクトリは探さず、拡張子も付けず、`package.json`の`secretlint`フィールドも探しません。
この変更の前は、このオプションが上の探索のファイル名`.secretlintrc`を置き換えていたため、相対パスは親ディレクトリでも探され、拡張子を付けたものも試されていました。探索に頼っていたコマンドは失敗するようになるので、新しい動作はメジャーバージョンでリリースします。

##### `--secretlintrcJSON`

このオプションは、設定をJSON文字列で渡します。ファイルは探しません。報告先のファイルがないので、設定についてのメッセージは報告しません。

##### 既定の設定

オプションで設定を渡しておらず、ルートまで探しても何も見つからないとき、Secretlintは既定の設定を使います。既定の設定は、recommendプリセット`@secretlint/secretlint-rule-preset-recommend`を既定のオプションで使うものです。
これは`secretlint --init`が書き出す設定と同じなので、`--init`で設定ファイルを作っても結果は変わりません。
既定のルールで動くほかのlintツールと同じく、Secretlintは既定の設定についての通知を出しません。出力は`--init`が書き出すファイルを使ったときと同じです。`--debug`のログには、既定の設定を使ったことが出ます。
Node.jsのエンジンを使うすべての配布形態、つまりnpmパッケージ、Dockerイメージ、単一実行ファイルで同じ動作になります。

既定にする理由は、recommendプリセットが別にインストールするパッケージではなくSecretlint自体の一部であり、一般的な秘密情報のスキャナーよりも誤検知がはるかに少なくなるように設計されているからです。
最初の実行の前に設定ファイルを必須にすると、recommendのルールが使いにくくなります。既定でrecommendが動くことを欠点と感じる利用者は少ないと考えます。
recommendプリセットにないルール、ルールのオプション、許可するメッセージを使うには、引き続き設定ファイルが必要です。

#### 例外ケースでの振る舞い

##### `--secretlintrc`のファイルが見つからない

Secretlintは指定されたパスを示すエラーで止まり、ファイルはlintされません。終了ステータスは2です。開発者が特定のファイルを指定しているので、既定の設定は使いません。

##### 設定ファイルを読めない

見つかったファイルに構文エラーがあると、Secretlintはそのファイルを示すエラーで止まり、ファイルはlintされません。終了ステータスは2です。

### ルールIDの解決

**概要:** 設定ファイルの各ルールIDを、組み込みのルールやプリセット、またはnpmパッケージがexportするルールやプリセットに解決します。

**入力:** 設定ファイルの`rules`と、パッケージを探す基準のディレクトリ。

**出力:** 実行するルールとプリセット。各項目は、ID、オプション、重大度、許可するメッセージ、無効化の設定を持ちます。

#### 適用する条件

##### 組み込みルール

ルールIDは、まず`@secretlint/core`の組み込みルールから探します。最初は書かれたIDのまま探し、次にパッケージ名と同じ規則で接頭辞`secretlint-rule-`を付けたIDで探します。
組み込みのルールやプリセットが見つかればそれを使います。このとき、同じ名前のパッケージがインストールされていても、そのパッケージは解決もimportもされません。

##### パッケージ名

組み込みでないルールIDは、短い形とみなして接頭辞`secretlint-rule-`を付けます。`@scope/name`は`@scope/secretlint-rule-name`に、`name`は`secretlint-rule-name`になります。
すでに接頭辞が付いているIDは、そのまま使います。
その名前のパッケージが見つからなければ、ID自体をパッケージ名として試します。

##### パッケージを探す場所

パッケージは、Secretlintがインストールされている場所から、Node.jsの`require.resolve`と同じ方法で探します。
設定の読み込みを使うプログラムは、別の`node_modules`ディレクトリを指定できます。
また、プログラムはNode.jsより先にパッケージ名を解決・importするフックを登録できます。単一実行ファイルは、組み込みのフォーマッターのためにこのフックを使います。

##### パッケージのexport

パッケージは`creator`をexportしている必要があります。種類が`preset`のcreatorはプリセットとして読み込まれ、設定ファイルの項目にある`rules`の一覧と組み合わされます。

##### 結果のルールID

設定ファイルに書いたIDがそのままルールIDになります。そのため、短い形で指定したルールのメッセージでは、`ruleId`も短い形になります。

#### 例外ケースでの振る舞い

##### パッケージが見つからない

ルールIDを解決できないと、読み込みは失敗します。エラーには、そのID、現在のディレクトリ、基準のディレクトリが含まれます。すべての項目のエラーは1つのエラーにまとめられ、どのファイルもlintされません。

##### パッケージが`creator`をexportしていない

ルールは`creator`をexportする必要があるというエラーで、読み込みは失敗します。

## データ要件

### 必要なデータ

- **設定:** `rules`の一覧とその他の設定。設定ファイル、`package.json`の`secretlint`フィールド、`--secretlintrcJSON`オプションのどれかから読む。
- **ルールの項目:** ルールやプリセットの`id`、`options`、`severity`、`allowMessageIds`、`disabled`。プリセットの場合は`rules`も含みます。

### データ間の関係

1回の実行で使う設定は1つで、設定はルールの項目を持ちます。各ルールの項目は、1つのルールまたは1つのプリセットに解決されます。

### 個人情報

なし。

## 依存する外部サービス

なし。組み込みルールは`@secretlint/core`に含まれています。パッケージはローカルのファイルシステムから読み込み、パッケージのインストールは利用者のパッケージマネージャーが行います。

## セキュリティ上の留意事項

既定の設定は組み込みルールだけを動かすので、設定のないディレクトリでSecretlintを実行しても、パッケージはimportされません。
結果の秘密情報の値は、設定ファイルがあるときと同じく既定でマスクされます。
ルールIDが指すのは、組み込みルールか、importしてSecretlintの権限で実行するパッケージです。そのため、実行されるのは組み込みルールと、利用者がインストールしたパッケージだけです。
同じ名前のパッケージをインストールしても、組み込みルールを置き換えることはできません。

## 未決事項

- **quick startコマンド:** 既定の設定があれば、`@secretlint/quick-start`の役目はなくなります（azu、2026-11-14）。非推奨にするのは、この変更の後続の作業です。

レビューで決まったこと（azu、2026-11-14）: `--secretlintrc`はちょうど1つのファイルを指す。Dockerイメージは引き続き必要。
