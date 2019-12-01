.. title: Django: とりあえず note
.. tags: django
.. date: 2019-11-25
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
https://django-allauth.readthedocs.io/en/latest/

* ログイン
* ログアウト
* パスワード変更
* パスワード再設定
* ユーザー登録
* ユーザー登録時にメールを送信して登録確認
* メールアドレスとパスワードでログイン
* ログイン失敗回数制限
* ソーシャル連携認証を簡単に組み込むための仕組み