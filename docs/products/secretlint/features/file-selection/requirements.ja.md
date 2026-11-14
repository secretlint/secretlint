# 対象ファイルの選択

[English](requirements.md)

## このドキュメントについて

対象ファイルの選択は、利用者が渡したパスとglobからSecretlintがlintするファイルを選び、利用者やSecretlintが無視ルールで外したファイルを対象から除きます。
親Productは[Secretlint](../../product.ja.md)です。

このドキュメントは、変更に必要な部分だけを書いています。どのファイルを無視するか、無視ルールが何を意味するかを扱います。

無視ルールの振る舞いは、Productの開発の指針のうち「誤検知を減らす」と「無視ルールの意味はGitと同じにする」の二つに従います。このドキュメントに書いていないケースも、この二つから決めます。いま二つが食い違うのは、大文字と小文字の扱いの一点です。

### スコープ

- 無視ルールの出どころ: 組み込みのルール、`.secretlintignore`、`--secretlintignore`で渡した無視ファイル、`.gitignore`
- 無視ルールの意味
- 無視ルールでの大文字と小文字の扱い

### スコープ外

- lintするファイルとして利用者が渡すglobの書き方。まだ書いていません。
- シンボリックリンク。まだ書いていません。
- 選んだファイルのコンテンツの種類と、そのlint。[秘密情報の検査](../secret-scanning/requirements.ja.md)で扱います。
- lintするファイルの中の報告を抑えること。機能「コメントによる無視」と[設定の読み込み](../config-loading/requirements.ja.md)で扱います。

## ユーザーストーリー

### Gitが無視するファイルを外す

開発者として、Gitが無視するファイルをSecretlintでも対象から外したい。それによって、Secretlint用にルールを書き直さなくても、ビルドの出力やローカルのファイルが報告されなくなる。

**受け入れ条件:**

Scenario: `.gitignore`のルールがファイルを無視する場合、そのファイルはlintされない

- Given: リポジトリの`.gitignore`にルール`dist/`があり、`dist/app.js`に秘密情報がある。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: `dist/app.js`はlintされず、結果にそのファイルのメッセージはない。

Scenario: サブディレクトリの`.gitignore`にルールがある場合、そのディレクトリに適用される

- Given: `packages/a/.gitignore`にルール`*.log`があり、`packages/a/debug.log`と`packages/b/debug.log`がある。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: `packages/a/debug.log`はlintされず、`packages/b/debug.log`はlintされる。

Scenario: GitとSecretlintが同じ`.gitignore`を読む場合、同じファイルを無視する

- Given: リポジトリにGitが受け付ける任意のルールを書いた`.gitignore`があり、ファイル名とルールの違いが大文字と小文字だけというものはない。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: lintされるファイルは、Gitが無視しないファイルから、組み込みのルールと`.secretlintignore`が無視するファイルを除いたものになる。

Scenario: 開発者が`.gitignore`を無効にした場合、無視されていたファイルもlintされる

- Given: リポジトリの`.gitignore`にルール`dist/`があり、`dist/app.js`に秘密情報がある。
- When: 開発者が`secretlint --no-gitignore "dist/**/*"`を実行する。
- Then: `dist/app.js`はlintされる。

### Secretlintだけでファイルを外す

開発者として、`.secretlintignore`にファイルを書きたい。それによって、テスト用のフィクスチャのようにコミットするファイルが報告されなくなる。

**受け入れ条件:**

Scenario: `.secretlintignore`のルールがファイルを無視する場合、そのファイルはlintされない

- Given: `.secretlintignore`にルール`test/fixtures/`があり、そのディレクトリのファイルに秘密情報がある。
- When: 開発者が`secretlint "**/*"`を実行する。
- Then: そのファイルはlintされない。

Scenario: ルールとファイル名の違いが大文字と小文字だけの場合、どのOSでもそのファイルは無視される

- Given: `.secretlintignore`にルール`Fixtures/`があり、ディスク上のディレクトリは`fixtures/`である。
- When: 開発者がLinux、macOS、Windowsのいずれかで`secretlint "**/*"`を実行する。
- Then: どのOSでも`fixtures/`の中のファイルはlintされない。

### 開発者が渡した一つの無視ファイルを使う

開発者として、`--secretlintignore`で一つの無視ファイルを渡したい。それによって、プロジェクトの外にある共有の無視ファイルや、プロジェクトの別のディレクトリにある無視ファイルで、外すファイルを決められる。

**受け入れ条件:**

Scenario: 絶対パスを渡した場合、そのファイルのルールを作業ディレクトリから使う

- Given: `/shared/ignore`にルール`test/fixtures/`があり、作業ディレクトリの`test/fixtures/key.pem`に秘密情報がある。
- When: 開発者が`secretlint "**/*" --secretlintignore=/shared/ignore`を実行する。
- Then: `test/fixtures/key.pem`はlintされない。

Scenario: ディレクトリを含む相対パスを渡した場合、作業ディレクトリから探す

- Given: `config/ignore`にルール`dist/`があり、`dist/app.js`に秘密情報がある。
- When: 開発者が`secretlint "**/*" --secretlintignore=config/ignore`を実行する。
- Then: `dist/app.js`はlintされない。

Scenario: ファイルを渡した場合、プロジェクトの`.secretlintignore`は読まない

- Given: `.secretlintignore`にルール`a.txt`、`sub/.secretlintignore`にルール`c.txt`、`config/ignore`にルール`b.txt`がある。
- When: 開発者が`secretlint "**/*" --secretlintignore=config/ignore`を実行する。
- Then: `b.txt`はlintされず、`a.txt`と`sub/c.txt`はlintされる。

Scenario: 渡したファイルが存在しない場合、警告を出し、そのファイルでは何も無視しない

- Given: 作業ディレクトリに`missing-ignore`が存在しない。
- When: 開発者が`secretlint "**/*" --secretlintignore=missing-ignore`を実行する。
- Then: ファイル名を含む警告が標準エラーに出て、オプションも`.secretlintignore`もないものとしてファイルがlintされる。

## KPI

この部分についてはなし。

## 機能要件

### ルールでファイルを無視する

**概要:** 無視ルールに一致したファイルはlintしません。

**入力:** 利用者のパスとglobから見つかったファイルと、無視ルール。

**出力:** lintするファイル。

#### 適用する条件

##### 無視ルールの出どころ

- **組み込みのルール:** `.git`と`node_modules`のディレクトリ、Secretlintの設定ファイル（`.secretlintrc`と、その`.json`、`.yaml`、`.yml`、`.js`の形）、名前が`.secretlintignore`で始まるファイル。これらは常に無視します。
- **`.secretlintignore`:** `--secretlintignore`を渡さないとき、`.gitignore`と同じように各ディレクトリで読みます。
- **`--secretlintignore`で渡したファイル:** この一つのファイルだけを読み、`.secretlintignore`は読みません。相対パスは作業ディレクトリから解決し、ルールはGitの`core.excludesFile`のファイルと同じように作業ディレクトリから照合します。API（`ignoreFilePath`を渡した`runSecretLint()`と`searchFiles()`）も同じです。
- **`.gitignore`:** 既定で使います。`--no-gitignore`で無効にできます。

`.secretlintignore`と`.gitignore`はどのディレクトリにも置けます。そのルールは、置いたディレクトリとその下のディレクトリに適用されます。

##### ルールの意味

ルールは、Gitの`.gitignore`に同じルールを書いたときと同じ意味になります（指針「無視ルールの意味はGitと同じにする」）。たとえば次の点です。

- パスに一致した最後のルールが結果を決めます。`!`で始まるルールは、そのパスを対象に戻します。
- 深いディレクトリのルールは、上のディレクトリのルールより強くなります。
- 無視されたディレクトリの中のファイルは無視され、ルールで対象に戻すことはできません。
- 閉じていない`[`のようにGitが受け付けないルールは、何にも一致しません。

組み込みのルールは、作業ディレクトリの無視ファイルに書かれたものとして、ほかのルールより先に評価します。

##### 大文字と小文字

ルールは、どのOSでも、AからZの大文字と小文字を区別せずに名前と一致します。

Gitはリポジトリのファイルシステムによってこれを決めます。macOSとWindowsではふつう区別せず、Linuxでは区別します。
そのため、ファイル名と大文字小文字が違うルールは、ある開発者のマシンではファイルを無視し、CIでは無視しないことになります。
区別しない照合は、区別する照合が無視するファイルをすべて無視します（指針「誤検知を減らす」）。また、どのOSでも同じファイルが選ばれます。
無視した名前と大文字小文字だけが違うファイルをlintしたい利用者は、無視ルールではそれを実現できません。これは受け入れます。

#### 例外ケースでの振る舞い

##### 無視ファイルが読めない

`.secretlintignore`や`.gitignore`が存在しない場合や、権限がなくて読めない場合は、空のファイルとして扱い、コマンドは続行します。

`--secretlintignore`で渡したファイルが存在しない場合は、ファイル名を含む警告を標準エラーに出し、空のファイルとして扱い、コマンドは続行します。開発者が名前を指定したファイルなので、黙って読み飛ばしません。存在するが読めない場合は、コマンドは失敗します。開発者が渡したルールなしでlintすると、開発者が外したつもりのファイルを報告してしまうためです。

##### すべてのファイルが無視された

パスとglobに一致するファイルはあるが、そのすべてが無視された場合、コマンドは「ファイルが見つからない」という理由では失敗しません。

## データ要件

### 必要なデータ

- **無視ルール:** 無視ファイルの1行、または組み込みのルールと、それが適用されるディレクトリ。

### データ間の関係

ディレクトリは、自分の無視ファイルのルールと、上のディレクトリのルールを持ちます。

### 個人情報

扱いません。

## 依存する外部サービス

なし。Gitは実行しません。Secretlintが無視ファイルを自分で読むので、Gitが入っていない環境や、Gitリポジトリではないディレクトリでも動きます。

## セキュリティ上の留意事項

無視ファイルは、プルリクエストのように、利用者が信頼していない人が書いたものであることがあります。その中のルールはファイルを対象から外せますが、コマンドを止めてしまってはいけません。

無視されたファイルはlintされないので、その中の秘密情報は報告されません。広すぎる無視ルールは秘密情報を隠します。Gitが無視するファイルはコミットされないので、その中の秘密情報がコミットによってリポジトリに入ることはありません。

## 未決事項

- **Gitのほかの無視ファイル:** Gitは`.git/info/exclude`と`core.excludesFile`のファイルも読みます。Secretlintはこれらを読みません。読むべきかどうかは決まっていません。決まるまでは読みません。メンテナーが判断します。
