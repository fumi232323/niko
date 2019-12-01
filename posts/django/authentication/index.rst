.. title: Django: 認証システム
.. tags: django
.. date: 2019-12-01
.. slug: index
.. status: draft


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


django.contrib.auth: 認証システム
==================================

リファレンスなど
------------------
* https://docs.djangoproject.com/ja/2.2/topics/auth/
* `現場で使える Django の教科書《実践編》 <https://booth.pm/ja/items/1030026>`_ 2章

説明
----
Djangoの認証は、認証機能と権限機能の両方を共に提供しています。そして、一般的に、これらの機能を合わせて認証システムと呼びます。

* ユーザー登録/ユーザー情報変更とかはない感じ
* テンプレートは用意されていないので、使用したいビューのテンプレートを自分で作る
* 設定ディレクトリの ``urls.py`` に ``django.contrib.auth.urls`` の include を追加すると、 以下の URL パターンが設定される

  https://docs.djangoproject.com/ja/2.2/topics/auth/default/#module-django.contrib.auth.views

  .. code-block:: python

    # これを追加すると、↓が全部使える!! しゅごい!
    urlpatterns = [
        path('accounts/', include('django.contrib.auth.urls')),
    ]

  .. list-table::
    :widths: auto
    :header-rows: 1

    * - 機能
      - URL パターン
      - ビュー
      - フォーム
    * - ログイン
      - accounts/login/ [name='login']
      - LoginView
      - AuthenticationForm
    * - ログアウト
      - accounts/logout/ [name='logout']
      - LogoutView
      - \-
    * - パスワード変更
      - accounts/password_change/ [name='password_change']
      - PasswordChangeView
      - PasswordChangeForm
    * - パスワード変更完了
      - accounts/password_change/done/ [name='password_change_done']
      - PasswordChangeDoneView
      - \-
    * - パスワード再設定 メール送信
      - accounts/password_reset/ [name='password_reset']
      - PasswordResetView
      - PasswordResetForm
    * - パスワード再設定 メール送信完了
      - accounts/password_reset/done/ [name='password_reset_done']
      - PasswordResetDoneView
      - \-
    * - パスワード再設定
      - accounts/reset/<uidb64>/<token>/ [name='password_reset_confirm']
      - PasswordResetConfirmView
      - SetPasswordForm
    * - パスワード再設定 完了
      - accounts/reset/done/ [name='password_reset_complete']
      - PasswordResetCompleteView
      - \-


django-allauth
==============

リファレンスなど
------------------
* https://django-allauth.readthedocs.io/en/latest/
* `現場で使える Django の教科書《実践編》 <https://booth.pm/ja/items/1030026>`_ 2章

概要
-----
Django 認証システムにもっと便利になるやつを追加できる

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


GitHub とソーシャル連携してみる
--------------------------------

https://django-allauth.readthedocs.io/en/latest/providers.html#github

* https://github.com/settings/developers > ``OAuth Apps``  > ``Register a new OAuth application`` で値を登録

  e.g.
  {{% figure register-OAuth-application.png %}}

  * Authorization callback URL: サービスプロバイダが認可コードを返した後に Web アプリ側にリダイレクトするための URL

    * django-allauth を使う場合はこの値がサービスプロバイダによって異なる
    * サービスプロバイダごとに異なるビュー関数が用意されているため

  * 設定値は後から Update できるよ

* 登録できたら ``Client ID`` と ``Client Secret`` を書き留めておく

  :Client ID: e19df88ba3b567180252
  :Client Secret: e68ba4640f182b7ef5739fe2600bedb03b00c100

* Django アプリを起動

  .. code-block:: bash

    # django-allauth をインストールする
    $ pip3 install django-allauth

    # Django アプリを起動する
    $ python3 manage.py migrate
    $ python3 manage.py createsuperuser
    $ python3 manage.py runserver 0.0.0.0:8181

    * http://localhost:8181/admin/ へログイン
    * http://localhost:8181/admin/sites/site/ にレコードが1件あることを確認
    * http://localhost:8181/admin/socialaccount/socialapp/ に GitHub で登録した ``Client ID`` と ``Client Secret`` を設定

* 動作確認する

  * admin サイトからログアウト
  * GitHub もログアウト
  * http://localhost:8181/accounts/login/ へアクセス
  * GitHub リンク押下

    {{% figure login.png %}}
    {{% figure sign-in-to-github.png %}}
    {{% figure authorize-fuminote.png %}}

  * ログインできた

    * 今今 callback URL がエラーになる => たぶんメールを設定していないせい?っぽい?
    * あとでやってみる

    {{% figure home.png %}}

* http://localhost:8181/accounts/social/connections/ でソーシャル連携解除できる

  {{% figure social-connections.png %}}

* settings

  {{% codeblock fufu/fufu/settings.py label="settings.py" lexer="python" %}}
