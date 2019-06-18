.. title: Django なんでもメモ
.. tags: django
.. date: 2019-06-18
.. updated: 2019-06-18
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


Time zones
==========

リファレンス
--------------
* https://docs.djangoproject.com/ja/2.2/topics/i18n/timezones/


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


現在日時の取得方法
-------------------

  .. code-block:: python

    # タイムゾーンサポートが有効
    from django.utils import timezone
    now = timezone.now()

    # タイムゾーンサポートが無効
    import datetime
    now = datetime.datetime.now()


デフォルトタイムゾーンとカレントタイムゾーン
---------------------------------------------
* デフォルトタイムゾーン: ``settings.TIME_ZONE`` に定義されたタイムゾーン
* カレントタイムゾーン: レンダリングに使われるタイムゾーン


naive な日時をデータベースに保存しようとすると、Django は警告を出す
-------------------------------------------------------------------

.. code-block:: python

  RuntimeWarning: DateTimeField ModelName.field_name received a naive
  datetime (2012-01-01 00:00:00) while time zone support is active.


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

django に便利コマンド追加してくれるさん
----------------------------------------
- `django-extensions <https://django-extensions.readthedocs.io/en/latest/>`_
