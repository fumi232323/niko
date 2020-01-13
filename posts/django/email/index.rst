.. title: Django: メールを送信する
.. tags: django
.. date: 2019-12-08
.. updated: 2020-01-13
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス/参考書籍など
=========================

* https://docs.djangoproject.com/ja/2.2/topics/email/
* `現場で使える Django の教科書《実践編》 <https://booth.pm/ja/items/1030026>`_ A: メール送信の設定


説明
====
* メールを送信する

  .. code-block:: python

    from django.core.mail import send_mail

    send_mail(
        'Subject here',           # 件名
        'Here is the message.',   # 本文
        'from@example.com',       # From アドレス
        ['to@example.com'],       # To アドレス
    )

* いろんなバックエンドがある

  * https://docs.djangoproject.com/ja/2.2/topics/email/#email-backends

    * コンソールに出すとか
    * メール送らないダミーとか

* 開発用にメールを設定する

  * https://docs.djangoproject.com/ja/2.2/topics/email/#configuring-email-for-development
  * これ使いそう

    .. code-block:: bash

      $ python -m smtpd -n -c DebuggingServer localhost:1025


Amazon SES を使ってメール送信する
=================================

1. https://pypi.org/project/django-ses/ をインストール

    .. code-block:: bash

      $ pip install django-ses

2. settings に設定を追加する

    .. code-block:: python

      EMAIL_BACKEND = 'django_ses.SESBackend'

      # 本当は settings には書かない
      AWS_ACCESS_KEY_ID = 'MY-ACCESS-KEY-ID'
      AWS_SECRET_ACCESS_KEY = 'MY-SECRET-ACCESS-KEY'
      # us-east-1 以外のAWSリージョンを使用する場合はこれも必要↓
      # AWS_SES_REGION_NAME = 'us-west-2'
      # AWS_SES_REGION_ENDPOINT = 'email.us-west-2.amazonaws.com'

      # DEFAULT_FROM_EMAIL: サイト管理者からの自動送信メールに使用するデフォルトの Email アドレス
      # SERVER_EMAIL: ADMINS や MANAGERS に送信されるエラーメッセージの送信元 Email アドレス
      DEFAULT_FROM_EMAIL = SERVER_EMAIL = 'no-reply <XXXXX@example.com>'


3. Amazon SES を設定する

    `Amazon SES でメールを送信する </aws/ses-sending-email/>`_ を参照のこと
