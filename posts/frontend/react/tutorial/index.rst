.. title: React: 公式チュートリアルやってみた React のメモ
.. tags: frontend
.. date: 2020-06-21
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
* https://ja.reactjs.org/tutorial/tutorial.html
* https://ja.reactjs.org/docs/hello-world.html


ふむ
====

* インタラクティブな三目並べゲーム (tic-tac-toe) を作る
* ``Create React App``: https://ja.reactjs.org/docs/create-a-new-react-app.html#create-react-app

  * フロントエンドのビルドパイプラインを構築する
  * バックエンドのロジックやデータベース接続は扱わない
  * 内部では Babel と webpack を利用している

* コンポーネントは ``props`` （“``properties``” の略）と呼ばれるパラメータを受け取り、``render`` メソッドを通じて、表示するビューの階層構造を返します。
* ``this.state`` はそれが定義されているコンポーネント内でプライベートと見なすべきものです
* JavaScript のクラスでは、サブクラスのコンストラクタを定義する際は常に ``super`` を呼ぶ必要があります。
* ``constructor`` を持つ React のクラスコンポーネントでは、すべてコンストラクタを ``super(props)`` の呼び出しから始めるべきです。
* ``state`` を親コンポーネントにリフトアップ (lift up) することは React コンポーネントのリファクタリングでよくあることです
* React では、イベントを表す ``props`` には ``on[Event]`` という名前、イベントを処理するメソッドには ``handle[Event]`` という名前を付けるのが慣習となっています。
* React における関数コンポーネントとは、``render`` メソッドだけを有して自分の ``state`` を持たないコンポーネントを、よりシンプルに書くための方法です。React.Component を継承するクラスを定義する代わりに、``props`` を入力として受け取り表示すべき内容を返す関数を定義します。
* リストには ``key`` が必要です
* 「実を言うと class コンポーネントはもうあんまり使わないから state も使わないんだよなぁ。関数コンポーネントで書いて、状態はフックで管理するのが今どきのやり方らしい。」という情報を得た


コマンド memo
=============

.. code-block:: bash

  # https://nodejs.org/en/
  # Node.js のバージョンを確認する
  $ node --version

  # Create React App で新しいプロジェクトを作成する
  # npx: npm 5.2 から利用できるパッケージランナーツール
  $ npx create-react-app tic-tac-toe

  # アプリを起動
  $ cd tic-tac-toe
  $ npm start


