.. title: Django なんでもメモ
.. tags: django
.. date: 2019-06-18
.. updated: 2019-10-06
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


Djangoで静的ファイルとうまくやる
=================================
tell-k さんの Django Con での発表

すごく良かった

https://tell-k.github.io/djangocongressjp2019/#1

Time zones
==========

リファレンス
--------------
* https://docs.djangoproject.com/ja/2.2/topics/i18n/timezones/
* https://docs.djangoproject.com/ja/2.2/ref/utils/#module-django.utils.timezone


タイムゾーンサポート
--------------------
* ``settings.py`` で設定する

  * ``USE_TZ = True``: タイムゾーンサポートが有効
  * ``USE_TZ = False``: タイムゾーンサポートが無効 (default)

* ``django-admin startproject`` によって生成されるデフォルトの ``settings.py`` ファイル は、 ``USE_TZ = True``
* タイムゾーンのサポートは ``pytz`` を使用する。Django をインストールしたときに一緒にインストールされている。


naive と aware
--------------
* aware: タイムゾーンあり

  * Python の ``datetime.datetime`` のオブジェクトには、タイムゾーン情報を保持するために使える tzinfo 属性があり、これは ``datetime.tzinfo`` のサブクラスのインスタンスで表されます。
  * この属性がセットされオフセットを示すとき、datetime オブジェクトは aware となります。それ以外の場合は naive となります。

* naive: タイムゾーンなし


タイムゾーンサポートが有効なときの Django の日時の取り扱い方
--------------------------------------------------------------
:データベース: 内部的に aware なタイムゾーンオブジェクトを使用して、 UTC で保持
:フォーム: 入力された日時をカレントタイムゾーンで変換し、 cleaned_data 内で aware な datetime オブジェクトを返す
:テンプレート: レンダリングする際に aware な datetime オブジェクトをカレントタイムゾーンに変換する


現在日時の取得
--------------

* タイムゾーンサポートが有効

  .. code-block:: python

    # USE_TZ = True
    # TIME_ZONE = 'Asia/Tokyo'

    >>> from django.utils import timezone
    >>> import datetime
    >>> import pytz

    >>> timezone.now()
    datetime.datetime(2019, 10, 6, 9, 23, 19, 903697, tzinfo=<UTC>)

    >>> datetime.datetime.now()
    datetime.datetime(2019, 10, 6, 18, 23, 41, 152275)

    >>> timezone.make_aware(datetime.datetime.now())
    datetime.datetime(2019, 10, 6, 18, 23, 56, 39144, tzinfo=<DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>)

    >>> timezone.localtime(timezone.now())
    datetime.datetime(2019, 10, 6, 18, 24, 13, 36991, tzinfo=<DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>)

    >>> datetime.datetime.now(tz=pytz.timezone('Asia/Tokyo'))
    datetime.datetime(2019, 10, 6, 18, 24, 16, 258210, tzinfo=<DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>)


* タイムゾーンサポートが無効

  .. code-block:: python

    # USE_TZ = False

    >>> from django.utils import timezone
    >>> import datetime
    >>> import

    >>> timezone.now()
    datetime.datetime(2019, 10, 6, 18, 28, 34, 147660)

    >>> datetime.datetime.now()
    datetime.datetime(2019, 10, 6, 18, 28, 41, 569008)

    >>> timezone.make_aware(datetime.datetime.now())
    datetime.datetime(2019, 10, 6, 18, 28, 54, 973598, tzinfo=<DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>)

    >>> timezone.localtime(timezone.now())
    Traceback (most recent call last):
      File "<console>", line 1, in <module>
      File "/var/www/usonar/.tox/py37/lib/python3.7/site-packages/django/utils/timezone.py", line 207, in localtime
        raise ValueError("localtime() cannot be applied to a naive datetime")
    ValueError: localtime() cannot be applied to a naive datetime

    >>> datetime.datetime.now(tz=pytz.timezone('Asia/Tokyo'))
    datetime.datetime(2019, 10, 6, 18, 29, 5, 566142, tzinfo=<DstTzInfo 'Asia/Tokyo' JST+9:00:00 STD>)


デフォルトタイムゾーンとカレントタイムゾーン
---------------------------------------------
* デフォルトタイムゾーン: ``settings.TIME_ZONE`` に定義されたタイムゾーン
* カレントタイムゾーン: レンダリングに使われるタイムゾーン


naive な日時をデータベースに保存しようとすると、Django は警告を出す
-------------------------------------------------------------------

.. code-block:: python

  RuntimeWarning: DateTimeField ModelName.field_name received a naive
  datetime (2012-01-01 00:00:00) while time zone support is active.


S3 アップロード
================

体感だけど、パターン1 のほうが速いような感じがした

.. code-block:: python

  # settings.py
  DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

.. code-block:: python

  # upload.py
  from django.core.files.base import ContentFile
  from django.core.files.storage import default_storage

  # パターン1
  file_path = default_storage.save(file_path, ContentFile(file_data))

  # パターン2
  with default_storage.open(file_path, 'w') as f:
      file_size = f.write(file_data)

* https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html
* https://docs.djangoproject.com/en/2.2/ref/files/storage/#the-storage-class
* https://docs.djangoproject.com/en/2.2/topics/files/#storage-objects


マイグレーションを間違えたときのリカバリ方法
=============================================
1. DjangoのDBシェルでローカルDBにつなぐ

    .. code-block:: console

      $ python manage.py dbshell --settings=settings.local


2. django_migrations テーブルから該当アプリのレコードを削除する

    .. code-block:: sql

      SELECT * FROM django_migrations WHERE app like '%{application_name}%';
      DELETE FROM django_migrations WHERE id={該当のID};

3. 該当テーブルやカラムも DROP する

    .. code-block:: sql

      DROP TABLE {table_name};
      ALTER TABLE {table_name} DROP COLUMN {column_name};

4. 該当のマイグレーションファイルも削除しておく

5. もう一回最初からマイグレーションする

    .. code-block:: console

      $ python manage.py makemigrations {application_name} --settings=settings.local
      $ python manage.py migrate {application_name} --settings=settings.local


こんなのある
============

MultiValueDict
--------------
なにがうれしいのかさっぱりわからない => `MultiValueDict を継承してる QueryDict とか見るとユースケースはなんとなく想像つくと思います` と教えて頂いた。

- https://docs.djangoproject.com/ja/2.1/_modules/django/utils/datastructures/

  ::

    A subclass of dictionary customized to handle multiple values for the same key.


- よく見たら、こういうところが便利だと思った ↓

  .. code-block:: python

    >>> from django.utils.datastructures import MultiValueDict
    >>> d = MultiValueDict({'name': ['Adrian', 'Simon'], 'position': ['Developer']})
    >>> d.update({'name': 'Momo'})
    >>> d
    <MultiValueDict: {'position': ['Developer'], 'name': ['Adrian', 'Simon', 'Momo']}>
    >>> dd = {'name': ['Adrian', 'Simon'], 'position': ['Developer']}
    >>> dd.update({'name': 'Momo'})
    >>> dd
    {'position': ['Developer'], 'name': 'Momo'}


QueryDict オブジェクト
----------------------
`In an HttpRequest object, the GET and POST attributes are instances of django.http.QueryDict` だそうです。

  - `QueryDict オブジェクト <https://docs.djangoproject.com/ja/2.1/ref/request-response/#querydict-objects>`_

    ::

      In an HttpRequest object, the GET and POST attributes are instances of django.http.QueryDict, a dictionary-like class customized to deal with multiple values for the same key. This is necessary because some HTML form elements, notably <select multiple>, pass multiple values for the same key.


便利さん
========

* django に便利コマンド追加してくれるさん `django-extensions <https://django-extensions.readthedocs.io/en/latest/>`_

* https://djangopackages.org/
* https://django.awesome-programming.com/

* django-allauth: 認証系機能の拡充

  * メールアドレスベースのログイン
  * ログインまわり
  * Google, Twitter, GitHub などのソーシャルアカウントを利用したサードパーティ認証機能

* django-tables2: テーブル表示とページネーション
* django-environ
* django-debug-toolbar: GUI によるデバッグ
