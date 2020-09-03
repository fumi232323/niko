.. title: JavaScript: ECMAScript2015 とは TypeScript とは, 用語note
.. tags: javascript
.. date: 2020-05-06
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス, 書籍
==================
* React、Angular、Vue.js、React Nativeを使って学ぶ はじめてのフロントエンド開発: https://gihyo.jp/book/2018/978-4-7741-9706-7
* https://developer.mozilla.org/ja/docs/Web/JavaScript
* https://www.typescriptlang.org/docs/home.html
* https://docs.npmjs.com/
* https://reactjs.org/docs/getting-started.html

note
====
* TypeScript は言語 (JavaScript のスーパーセット)
* Vue, React, Angular はフレームワーク
* Next.js は React を使ったフレームワーク。 Nuxt.js は Vue を使ったフレームワーク。 Next のほうが先輩。
* Node.js はサーバーサイドで動く JavaScript 環境
* npm (Node Package Manager): Node.js で作られたパッケージを管理するためのツール

  * npm を使うとパッケージの共有やインストール、アップデートを簡単にできる

* package.json: ローカル開発環境にインストールする npm パッケージを管理するのに利用する

  * package.json を利用すると npm パッケージの依存関係やバージョン管理、開発環境のセットアップが簡単にできる
  * package.json から npm i できる、package.json を更新したら npm up でパッケージ更新もできる

* package-lock.json: npm インストールしたパッケージ名や明確なバージョン情報が記載される
* webpack: フロントエンドビルドツール, モジュールバンドラ

  * 複数の JavaScript ファイルや CSS などあらゆる static ファイルの依存関係を解決し１つのファイルにまとめてくれる
  * リクエスト数を減らせるなどのメリットがある
  * Entry: webpack がモジュールの依存関係を解析するためのエントリポイント、複数指定することもできる
  * Output: バンドルされたファイルの出力先、絶対パスを指定する
  * Loader: JavaScript 以外の static ファイルも同時にバンドルできる、トランスパイルできる
  * Plugins: いろいろ

* Babel: トランスコンパイラー (ECMAScript2015 以降のコードを ECMAScript5 に変換する)
* トランスパイル: あるプログラミング言語で書かれたコードをほかのプログラミング言語のコードに変換すること
* extract-text-webpack-plugin: スタイルシートを CSS ファイルに出力する Plugin
* ESLint: Linter
* ``require``: CommonJS の仕様、Node.js 環境で動作する
* ``import``:  ES2015 (ES6) の仕様、古いブラウザでは動かない

ECMAScript2015
--------------
* JavaScript は ECMA International という標準化団体が仕様を策定している
* ECMAScript2015 == ECMAScript6

  * 2015年に策定された6番目の仕様

* 変数宣言: ``let`` と ``const``
* ブロックスコープ, テンプレートリテラル, デフォルト引数
* アロー関数: アロー関数の場合は定義した場所の ``this`` が参照される

  .. code-block:: javascript

    // アロー関数その１
    const add = (a, b) => {
      returna+b;
    }

  .. code-block:: javascript

    // アロー関数その２
    const add = (a, b) => a + b;

* class 定義, class の継承
* Promise: 非同期処理
* モジュール: モジュールとしてファイル分割できる。 ``export`` 文。


TypeScript
----------
* TypeScript: JavaScript のスーパーセット, 上位互換

  * Microsoft によって開発された OSS の JavaScript ベースのプログラミング言語
  * 静的型付け, クラスベースのオブジェクト指向

* tsc: TypeScript 付属のコンパイラツール, ECMAScript5 へ変換できるよ
* TypeScript の拡張子は ``.ts``
* 型注釈（type annotation）

  * 型推論できるところは型推論に任せる
  * ``?``: オプショナル
  * コールバック関数の型注釈と、アロー関数の定義が紛らわしい

* 型変換

  * JSX を使用することが確定している場合には、「変数 as 変換後の型」を使う

* interface
* アクセス修飾子 (``public``、``private``、``protected``)

  * デフォルトは ``public``

* ジェネリクス

  .. code-block:: typescript

    function identity<T>(arg: T): T {
      return arg;
    }

    // こうとか
    let output = identity<string>("taro");
    // こうとか
    let output = identity<number>(1);

* 型定義ファイル: 型の定義を別ファイルにまとめておける

  * 拡張子は ``.d.ts``

* デコレータ

  * クラス、メソッド、アクセサ、プロパティやパラメータに付与できる

  .. code-block:: typescript

    // 使う時
    @sealed
    class Greeter {
      greeting: string;
      constructor(message: string) {
        this.greeting = message;
      }
      greet() {
        return "Hello, " + this.greeting;
      }
    }

    // デコレーターの実体
    function sealed(constructor: Function) {
      Object.seal(constructor);
      Object.seal(constructor.prototype);
    }

* JSX: JavaScript 中に埋め込み可能な XML ライクな文法

  .. code-block:: typescript

    function render(nickname: string) {
      // React.createElement() は DOM を作成する関数
      return React.createElement("div", {"class": "nickname"}, nickname)
    }

    // JSXではこのように書けるとのこと
    function render(nickname: string) {
      return <div className="nickname">{nickname}</div>
    }


コマンド memo
=============

.. code-block:: zsh

  # package.json ファイルが生成される
  $ npm init -y

  # パッケージをインストール
  # node_modules ディレクトリに指定したパッケージがインストールされる
  # package.json > dependencies/devDependencies にインストールしたパッケージとバージョンが追記される
  $ npm i react react-dom
  # -g : グローバルインストール (すべてのプロジェクトで利用できる)
  $ npm i -g react react-dom
  # ビルドなど開発時だけに必要なパッケージは -D を利用してインストール
  npm i -D webpack webpack-cli
  # アンインストール
  $ npm un react react-dom
  # -D の省略しない形は --save-dev
  $ npm uninstall babel-preset-env --save-dev

  # webpack をインストール, CLI もインストール
  $ npm i -D webpack webpack-cli
  # webpack でバンドラする
  # npx: ローカルにインストールした npm パッケージをパッケージ名を指定して実行できる
  # --mode development: 開発モード. ビルドが速く watch がサポートされている
  $ npx webpack --mode development

  # npm scripts コマンドのエイリアスが作れる
  # package.json の "scripts" フィールドにスクリプトを書いておく
  $ npm run build:dev

  # 今はこの書き方
  $ npm i -D babel-loader style-loader css-loader @babel/core @babel/preset-env @babel/preset-react

  # スタイルシートを CSS ファイルに出力する Plugin をインストール
  $ npm i -D extract-text-webpack-plugin@4.0.0beta.0

  # 開発用サーバーを立てる
  $ npm i -D webpack-dev-server@3.1.1
  # 開発用サーバーを起動
  $ npx webpack-dev-server --mode development --hot --inline --open
  # npm scripts 作っておくと、こう
  # Ctrl + C で停止
  $ npm start

  # ESLint をインストール
  $ npm i -D eslint@4.19.1

  # TypeScript をインストール
  $ sudo npm i -g typescript

  # tsc コマンドで ECMAScript5 に変換
  # -t: 変換する対象バージョン
  $ tsc -t ES5 hello.ts


VSCode memo
===========
* ``F12``: 定義へ移動
* ``option`` + ``F12``: Peek ウィンドウ
* Debugger for Chrome: VSCode の Chrome 拡張機能

  * VSCode上でブレークポイントを使ってデバッグできる

* React Developer Tools: Chrome 拡張機能
