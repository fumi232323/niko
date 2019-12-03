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


