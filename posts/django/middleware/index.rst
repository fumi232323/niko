.. title: Django: Middleware
.. tags: django
.. date: 2019-10-14
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


書籍/リファレンス
=================
- https://docs.djangoproject.com/ja/2.2/topics/http/middleware/
- `現場で使える Django の教科書 <https://booth.pm/ja/items/1059917>`_


概要
=====
* Django の主要な機能 (モデル・テンプレート・ビュー) と Web サーバー/アプリケーションの中間に位置
* ビューを出入りするすべてのリクエストとレスポンスをフックできる
* さまざまなミドルウェアが組み込みで用意されている
* 自作して追加することも可能
* 必要なものを settings に加えると利用できる
* サイト全体にリクエストやレスポンスを使用して一律に何らかの機能を加えたい場合などに利用する
* settings の ``MIDDLEWARE`` にリスト形式で列挙
* 書いた順番に実行される。順番大事。
* 書いたミドルウェアはリクエストの度に全部実行されるので、あまり重い処理は書かないようにすること。

  * できるかぎりデータベースアクセスしない
  * 必要なら ``django.utils.functional.SimpleLazyObject`` を使うようにする


主なミドルウェア
=================

* 以下は、 Django プロジェクト作成時にデフォルトで設定される
* デフォルトで設定されるミドルウェアはとりあえずそのまま使うのが吉とのこと

SecurityMiddleware
-------------------

* リクエスト/レスポンスのセキュリティ強化
* HTTP => HTTPS リダイレクト (デフォルトはOFF)

  .. code-block:: Python

    SECURE_SSL_REDIRECT = True

* 入れておいて損はないので何も考えずに入れておくとよい

SessionMiddleware
-------------------

* セッションを有効にする
* 有効にする場合は、 ``INSTALLED_APPS`` に ``django.contrib.sessions`` を入れるのを忘れずに
* 使い方はここを見よ: https://docs.djangoproject.com/ja/2.2/topics/http/sessions/
* 迷ったら有効化しておく

CommonMiddleware
-----------------

* ユーザーエージェントによるアクセス制限
* URL リライティング
* 公式でも使用を強くお勧め
* 必須では
* ``APPEND_SLASH``
* ``PREPEND_WWW``

CsrfViewMiddleware
-------------------

* CSRF トークン検証

AuthenticationMiddleware
-------------------------

* リクエストの度に、リクエストオブジェクトの ``user`` 属性にユーザー情報をセットしてくれる
* ログイン済みの場合: セッション.Userインスタンス
* 未ログインの場合: AnonymousUser (匿名ユーザー)
* セッションが必要なので、 SessionMiddleware より後ろに書く

MessageMiddleware
------------------

* フラッシュメッセージ
* メッセージフレームワーク
* `現場で使える Django の教科書 <https://booth.pm/ja/items/1059917>`_ P.103

XFrameOptionsMiddleware
------------------------

* クリックジャッキング対策
* ``X-Frame-Options`` ヘッダーを全てのレスポンスに設定


ミドルウェアの書き方
======================
ここを見よ

* https://docs.djangoproject.com/ja/2.2/topics/http/middleware/#writing-your-own-middleware
* `現場で使える Django の教科書 <https://booth.pm/ja/items/1059917>`_ P.101
