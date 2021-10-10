.. title: Firebase
.. tags: frontend
.. date: 2020-05-13
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
* https://firebase.google.com/docs

note
====
* Firebase: Google社が提供するモバイルプラットフォーム。iOS、Android、Webなどでアプリケーションを構築し、モバイルサービスを提供する際に必要な機能を備えている。
* Firebase Cloud Functions: Firebase の機能のイベントや HTTPSリクエストによるトリガに応じて関数を実行する

  * Node.js 環境

* Firebase Realtime Database: NoSQL データベース。 JSON データを保存・同期する。
* Firebase Hosting: SPAを簡単に公開できる。 CDN や HTTPS にも対応している。
* Firebase Authentication: ユーザ認証システムを簡単に構築できる。ログインプロバイダとして、メールアドレス、電話認証、Google、Twitter、Facebook、GitHubおよび匿名がある。
* https://console.firebase.google.com
* Express: Express パッケージのルーティングを使ってAPIのエンドポイントを実装する
* cors: cors パッケージを使ってクロスドメイン通信の許可をする
* サーバーに Firebase Admin SDK を追加する: https://firebase.google.com/docs/admin/setup


コマンド memo
=============

.. code-block:: bash

  # Firebase CLI のインストール
  $ sudo npm i -g firebase-tools
  # Firebase Admin SDK のインストール
  $ npm install firebase-admin --save
  # Express, cors のインストール
  $ npm i express cors

  # Firebase へログイン
  $ firebase login
  # Firebase からログアウト
  $ firebase logout

  # Firebase Hosting の設定
  $ firebase init hosting
  # Firebase Functions の設定
  $ firebase init functions

  # 作成したAPIのテスト
  # 事前に環境変数 GOOGLE_APPLICATION_CREDENTIALS に、サービス アカウント キーが含まれる JSON ファイルのファイルパスを設定する。
  # Path は絶対パスでないといけない模様
  $ export GOOGLE_APPLICATION_CREDENTIALS="/path/to/fumi23-chat-app-firebase-adminsdk-e09li-560aa95e27.json"

  # テスト用サーバーの起動
  $ cd {firebase.json のあるディレクトリ}
  $ firebase serve --only functions
  # チャンネル作成
  # http://localhost:5000/fumi23-chat-app/us-central1/v1
  $ curl -H 'Content-Type:application/json' -d '{"cname": "general"}' http://localhost:5000/fumi23-chat-app/us-central1/v1/channels
  # チャンネル一覧
  $ curl http://localhost:5000/fumi23-chat-app/uscentral1/v1/channels

  # 作成した Functions を公開する
  $ firebase deploy --only functions
  # 初期状態に戻す
  $ curl -H 'ContentType:application/json' -d '{}' https://us-central1-fumi23-chat-app.cloudfunctions.net/v1/reset
