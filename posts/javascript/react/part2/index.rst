.. title: React: [読書メモ] React、Angular、Vue.js、React Nativeを使って学ぶ はじめてのフロントエンド開発 (その他)
.. tags: javascript
.. date: 2020-06-16
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
* https://reactjs.org/
* https://ja.reactjs.org/


ほむほむ
==========

* react-router: Routing 機能を提供するサードパーティパッケージ
* semantic-ui-react: UIツールキット Semantic UI に実装された UI に関する機能を React Component として利用できるようにしたもの
* axios: Promise をベースとした HTTP クライアント。サーバーサイドアプリケーションにリクエストを送信する。

  * RESTful API のクライアントとしてよく利用する機能や設定があらかじめ用意されている

* ``.tsx``: TypeScriptで記述し、かつJSXを利用するもの
* ``.ts``: TypeScriptでJSXを利用しないもの
* 小さい中身も Component だし、まわりの外側も Component
* props として渡せるのは値だけではない。オブジェクトや関数などあらゆるものを受け渡せる。
* React では、データは親Component から子Component へ流れるというデータフローの原則がある。親子関係にない Component間で情報を直接やりとりすることはできない。

  * そういうときは、 親Component を経由して props で受け渡す

* スピナー: ``import {Dimmer, Loader} from 'semantic-ui-react'`` とか
* Component のアンマウントと HTTPリクエストのキャンセル: Axios の場合、 CancelToken のしくみを利用して処理の中断を実現できる


コマンド memo
=============

.. code-block:: bash

  # プロジェクト作成
  $ mkdir react-sample-app
  $ cd react-sample-app
  $ npm init -y

  # 依存パッケージのインストール
  $ npm i react@ react-dom@
  $ npm i react-router@ react-router-dom@
  $ npm i semantic-ui-react@
  $ npm i axios@

  # 依存パッケージのインストール (開発環境用)
  $ npm i -D @types/react@ @types/react-dom@
  $ npm i -D @types/react-router@ @types/react-router-dom@
  $ npm i -D typescript@ ts-loader@
  $ npm i -D webpack webpack-cli webpack-dev-server

  # tslint (2019年から非推奨) のインストール
  $ npm i -D tslint
  $ npm i tslint-config-typings
  # eslint のインストール
  $ npm i -D eslint

  # しばしアプリを実装...

  # アプリケーションの起動
  $ cd react-sample-app
  $ npm run start
