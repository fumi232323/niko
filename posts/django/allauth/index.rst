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


リファレンスなど
=================
* https://django-allauth.readthedocs.io/en/latest/
* `現場で使える Django の教科書《実践編》 <https://booth.pm/ja/items/1030026>`_ 2章

概要
=====
Integrated set of Django applications addressing authentication, registration, account management as well as 3rd party (social) account authentication.

主な機能
========
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
===================================

ガイド
------
https://django-allauth.readthedocs.io/en/latest/providers.html#github

手順
----
1. GitHub に OAuth アプリケーションを登録する

   * https://github.com/settings/developers > ``OAuth Apps``  > ``Register a new OAuth application``

      {{% figure 00_register-oauth-application.png %}}

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

      {{% figure 01_login.png %}}
      {{% figure 02_sign-in-to-github.png %}}
      {{% figure 03_authorize-fuminote.png %}}

      * 今いま callback URL がエラーになる => メールを設定していないからかもしれない => あとでやってみる

        {{% figure 06_social-login-error.png %}}

   * ログインできた!

      {{% figure 04_home.png %}}

4. ソーシャル連携解除

   * http://localhost:8181/accounts/social/connections/ でソーシャル連携解除できる

     {{% figure 05_social-connections.png %}}

できあがるレコード
------------------

:auth_user: Django サイトのユーザー
:account_emailaddress: Django サイトのユーザーと Email
:socialaccount_socialtoken: サービスプロバイダから払いだされたトークン
:socialaccount_socialaccount: Django サイトのユーザーとサービスプロバイダから払いだされたトークンとを関連付けるソーシャルアカウント

  * サービスプロバイダから連携されたユーザー情報を保持

:socialaccount_socialapp: http://localhost:8181/admin/socialaccount/socialapp/ で登録したサービスプロパイダ

  * 今回の場合だと GitHub に登録した OAuth アプリケーションの ``Client ID`` と ``Client Secret`` を保持

:socialaccount_socialapp_sites: サービスプロパイダとサイトの紐付け

settings
---------

{{% codeblock fufu/fufu/settings.py label="settings.py" lexer="python" %}}


メールを設定した
================

* callback URL はエラーにならず、 ``Confirm E-mail Address`` メール が送られてくるようになった。

  * Confirm E-mail Address メールが送られてくるのは、 settings に ``ユーザー登録時にメールアドレス確認を行う`` と設定しているためです
  * メールの設定は `Django: メールを送信する </django/email/>`_ を参照のこと

* 流れ

  1. ログイン画面で ``GitHub`` リンク押下する

      {{% figure 11_sign_in.png %}}

  2. GitHub 側のサインイン画面へ遷移する

      {{% figure 12_continue_to_fuminote.png %}}

  3. GitHub でサインインすると、自分のアプリのホーム画面へ遷移する。

  4. 同時に、 GitHub に登録してある Email address に ``Confirm E-mail Address`` メールが届く。

      {{% figure 13_confirm_email.png %}}

  5. ``Confirm E-mail Address`` メールに記載のリンクを押下すると、 E-mail Address 確認画面へ遷移する。

      {{% figure 14_confirm_email_screen.png %}}

  6. Confirm ボタンを押下するとホーム画面が表示される。

      {{% figure 15_home.png %}}

  7. おまけ: `Amazon SES をセットアップした </aws/ses-sending-email/>`_ の図 (ちゃんと送られてきたー)

      {{% figure 16_mail-detail-aws-ses.png %}}
