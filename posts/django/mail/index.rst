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
https://docs.djangoproject.com/ja/2.2/topics/email/

.. code-block:: python

  from django.core.mail import send_mail

  send_mail(
      'Subject here',           # 件名
      'Here is the message.',   # 本文
      'from@example.com',       # From アドレス
      ['to@example.com'],       # To アドレス
  )


https://docs.djangoproject.com/ja/2.2/topics/email/#email-backends
* いろんなバックエンドがある

  * コンソールに出すとか
  * メール送らないダミーとか

https://docs.djangoproject.com/ja/2.2/topics/email/#configuring-email-for-development
* 開発用にメールを設定する

  * これ使いそう
