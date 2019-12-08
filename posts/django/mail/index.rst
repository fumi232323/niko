.. title: mail
.. tags: django
.. date: 2019-12-03
.. slug: index
.. status: draft


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


メール
=======

* リファレンス

  * https://docs.djangoproject.com/ja/2.2/topics/email/


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
----------------------------------

* Amazon SES (Amazon Simple Email Service)

  * https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/Welcome.html
  * Amazon SES は、ユーザー自身の E メールアドレスとドメインを使用して E メールを送受信するための、簡単で費用効率の高い方法を提供する E メールプラットフォームです。


* https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/quick-start.html
Amazon SES クイック スタート

* https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html
E メールアドレスの検証 する


* https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-domains.html
ドメインごと検証もできる

* これをインストール

https://pypi.org/project/django-ses/

.. code-block:: bash

  $ pip install django-ses


* settings に追記

* 本当にやるときはこれもやるんだと思う
Amazon SES における DKIM を使った E メールの認証
https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/dkim.html
Amazon SES の Easy DKIM
https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/easy-dkim.html