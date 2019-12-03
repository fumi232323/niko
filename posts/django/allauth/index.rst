.. title: django-allauth
.. tags: django
.. date: 2019-12-03
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


django-allauth
==============

リファレンスなど
------------------
* https://django-allauth.readthedocs.io/en/latest/
* `現場で使える Django の教科書《実践編》 <https://booth.pm/ja/items/1030026>`_ 2章

概要
-----
Integrated set of Django applications addressing authentication, registration, account management as well as 3rd party (social) account authentication.

主な機能
---------
* ログイン
* ログアウト
* パスワード変更
* パスワード再設定
* ユーザー登録
* ユーザー登録時にメールを送信して登録確認
* メールアドレスとパスワードでログイン
* ログイン失敗回数制限
* ソーシャル連携認証

  * https://python-social-auth-docs.readthedocs.io/en/latest/ こういうのもある

* テンプレートも用意してくれている

GitHub とソーシャル連携認証してみる
-----------------------------------

ガイド
^^^^^^^
https://django-allauth.readthedocs.io/en/latest/providers.html#github

手順
^^^^^
1. GitHub に OAuth アプリケーションを登録する

   * https://github.com/settings/developers > ``OAuth Apps``  > ``Register a new OAuth application``

      {{% figure register-OAuth-application.png %}}

      * ``Authorization callback URL``: サービスプロバイダが認可コードを返した後に Web アプリ側にリダイレクトするための URL

        * django-allauth を使う場合はサービスプロバイダによって異なる
        * サービスプロバイダごとに異なるビュー関数が用意されているため

   * 設定値は後から Update できるよ

2. Admin サイトで GitHub とソーシャル連携するために初期データを登録する

    .. code-block:: bash

      # django-allauth をインストールする
      $ pip3 install django-allauth

      # マイグレーション
      $ python3 manage.py migrate
      # スーパーユーザー作成
      $ python3 manage.py createsuperuser
      # Django アプリを起動
      $ python3 manage.py runserver 0.0.0.0:8181

   * http://localhost:8181/admin/ へログインする
   * http://localhost:8181/admin/sites/site/ にレコードが1件あることを確認する
   * http://localhost:8181/admin/socialaccount/socialapp/ に GitHub に登録した OAuth アプリケーションの ``Client ID`` と ``Client Secret`` を登録する

3. 動作確認する

   * admin サイトからログアウト
   * GitHub からもログアウト
   * http://localhost:8181/accounts/login/ へアクセス
   * GitHub リンク押下

      {{% figure login.png %}}
      {{% figure sign-in-to-github.png %}}
      {{% figure authorize-fuminote.png %}}

      * 今いま callback URL がエラーになる => メールを設定していないからかもしれない => あとでやってみる

   * ログインできた!

      {{% figure home.png %}}

4. ソーシャル連携解除

   * http://localhost:8181/accounts/social/connections/ でソーシャル連携解除できる

     {{% figure social-connections.png %}}

できあがるレコード
^^^^^^^^^^^^^^^^^^^

:auth_user: Django サイトのユーザー
:account_emailaddress: Django サイトのユーザーと Email
:socialaccount_socialtoken: サービスプロバイダから払いだされたトークン
:socialaccount_socialaccount: Django サイトのユーザーとサービスプロバイダから払いだされたトークンとを関連付けるソーシャルアカウント

  * サービスプロバイダから連携されたユーザー情報を保持

:socialaccount_socialapp: http://localhost:8181/admin/socialaccount/socialapp/ で登録したサービスプロパイダ

  * 今回の場合だと GitHub に登録した OAuth アプリケーションの ``Client ID`` と ``Client Secret`` を保持

:socialaccount_socialapp_sites: サービスプロパイダとサイトの紐付け

settings
^^^^^^^^^

{{% codeblock fufu/fufu/settings.py label="settings.py" lexer="python" %}}
