.. title: Django REST framework のメモ
.. tags: django-rest-framework
.. date: 2019-07-16
.. updated: 2021-02-06
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ガイド/リファレンスなど
========================
* `Django REST framework <https://www.django-rest-framework.org/>`_
* `くろのて > [Django REST Framework] View の使い方をまとめてみた <http://note.crohaco.net/2018/django-rest-framework-view/>`_
* `くろのて > [Django REST Framework] Serializer の 使い方 をまとめてみた <http://note.crohaco.net/2018/django-rest-framework-serializer/>`_
* `Django REST Frameworkを使って爆速でAPIを実装する <https://qiita.com/kimihiro_n/items/86e0a9e619720e57ecd8>`_


Serializers
===========

シリアライズとデシリアライズ
-----------------------------

* デシリアライズ deserialize (入って来るほう)

  .. code-block:: python

    serializer.is_valid()
    serializer.validated_data

* シリアライズ serialize (出て行くほう)

  .. code-block:: python

    serializer = CommentSerializer(comment)
    serializer.data


Serializer fields の required 挙動まとめ
----------------------------------------

https://www.django-rest-framework.org/api-guide/fields/#required

.. code-block:: python

  from rest_framework import serializers

  class BookSerializer(serializers.Serializer):
      """こういう Serializer があるとすると"""
      id = serializers.IntegerField()  # default は required=True
      name = serializers.CharField(required=False, max_length=255)
      author = serializers.CharField(required=False, allow_blank=True, max_length=255)
      description = serializers.CharField(required=False, allow_null=True, max_length=255)
      price = serializers.IntegerField(required=False)
      total_pages = serializers.IntegerField(required=False, default=0)


deserialize 時
^^^^^^^^^^^^^^

``required=True`` (default):

* キーなしは当然エラー

  .. code-block:: python

    >>> data = {}
    >>> serializer = BookSerializer(data=data)
    >>> serializer.is_valid()
    False


``required=False``:

* キーなしは OK、 ``serializer.validated_data`` にキーは現れない

  .. code-block:: python

    >>> data = {'id': 123}
    >>> serializer = BookSerializer(data=data)
    >>> serializer.is_valid()
    True
    >>> serializer.validated_data
    OrderedDict([('id', 123)])

* キーありは ``None`` はエラー、値が検証される

  .. code-block:: python

    # name は、 None を許容しないよ
    >>> data = {'id': 123, 'name': None}
    >>> serializer = BookSerializer(data=data)
    >>> serializer.is_valid()
    False
    >>> serializer.errors
    {'name': [ErrorDetail(string='この項目はnullにできません。', code='null')]}

    # name は、 blank を許容しないよ
    >>> data = {'id': 123, 'name': ''}
    >>> serializer = BookSerializer(data=data)
    >>> serializer.is_valid()
    False
    >>> serializer.errors
    {'name': [ErrorDetail(string='この項目は空にできません。', code='blank')]}

    # price は、 整数フィールド
    >>> data = {'id': 123, 'price': ''}
    >>> serializer = BookSerializer(data=data)
    >>> serializer.is_valid()
    False
    >>> serializer.errors
    {'price': [ErrorDetail(string='有効な整数を入力してください。', code='invalid')]}


  * ``allow_null=True`` であれば None は OK、 ``serializer.validated_data`` にキーは現れる

    .. code-block:: python

      >>> data = {'id': 123, 'description': None}
      >>> serializer = BookSerializer(data=data)
      >>> serializer.is_valid()
      True
      >>> serializer.validated_data
      OrderedDict([('id', 123), ('description', None)])

  * ``allow_blank=True`` であれば ``''`` (空文字) は OK、 ``serializer.validated_data`` にキーは現れる

    .. code-block:: python

      >>> data = {'id': 123, 'author': ''}
      >>> serializer = BookSerializer(data=data)
      >>> serializer.is_valid()
      True
      >>> serializer.validated_data
      OrderedDict([('id', 123), ('author', '')])


serialize 時
^^^^^^^^^^^^^^

``required=True`` (default):

* キーなしは当然エラー

  .. code-block:: python

    >>> data = {}
    >>> serializer = BookSerializer(data)
    >>> serializer.data
    Traceback (most recent call last):
      File "/usr/local/lib/python3.7/site-packages/rest_framework/fields.py", line 454, in get_attribute
        return get_attribute(instance, self.source_attrs)
      File "/usr/local/lib/python3.7/site-packages/rest_framework/fields.py", line 92, in get_attribute
        instance = instance[attr]
    KeyError: 'id'


``required=False``:

* シリアライザに項目ごと渡さない場合 => キーは現れない

  .. code-block:: python

    >>> data = {'id': 123}
    >>> serializer = BookSerializer(data)
    >>> serializer.data
    # description は allow_null なので、キー + None が現れる
    # total_pages は default 値が設定されているので、 キー + default 値が現れる
    {'id': 123, 'description': None, 'total_pages': 0}


* シリアライザに項目は渡すが中身が ``None`` や空 (``''``) の場合 => キーは現れる + 中身は ``None`` や 空 (``''``)

  .. code-block:: python

    # name は、項目としては required=False なので中身が None もまあいいかということなんだろう
    >>> data = {'id': 123, 'name': None}
    >>> serializer = BookSerializer(data)
    >>> serializer.data
    {'id': 123, 'name': None, 'description': None, 'total_pages': 0}

    # name は、項目としては required=False なので中身が空もまあいいかということなんだろう
    >>> data = {'id': 123, 'name': ''}
    >>> serializer = BookSerializer(data)
    >>> serializer.data
    {'id': 123, 'name': '', 'description': None, 'total_pages': 0}


ModelSerializer メモ
--------------------

.. code-block:: python

  class EntrySerializer(serializers.ModelSerializer):
      """エントリー"""
      class Meta:
          model = Entry
          # 除外したいフィールド
          exclude = ['author']
          # 読み取り専用指定 https://www.django-rest-framework.org/api-guide/serializers/#specifying-read-only-fields
          # AutoField はデフォルトで読み取り専用
          read_only_fields = [
              'created_at',
              'created_by',
              'created_by_id',
              'updated_at',
              'updated_by',
              'updated_by_id',
          ]
          extra_kwargs = {
              # モデル上は必須フィールドだけれど、シリアライザでは Not必須にしたい場合は、required を上書きする
              'display_order': {'required': False}
          }


Serializer の分け方の考え方
---------------------------

* Serializer も Form も使いまわそう (違う API 間で同じ Serializer や Form を共用する) とするとつらくなりがち
* 同じ API でも取得系と更新系で分けるほうが、 read_only とかで頑張ってぐちゃぐちゃになるよりマシな場合もある。
* 同じような項目を受け取るのでも、目的の数だけあって良い。
* 共通化できるように考えるより、目的ごとに切り出したほうが、結果バグ入れ込む隙は減る。
* 同じ Validator を複数 Serializer でコピペするようになりそうなら、親Serializer を作れば良い。

(ae35 さんありがとうございました)


Requests/Responses
===================

DRF の Request
----------------

:request.data: Handles arbitrary data. Works for 'POST', 'PUT' and 'PATCH' methods.

  * json request をはじめとして他の形式も処理できる

:request.query_params: request.GET と同じ。こっちを使うほうがおすすめ (by DRF) 。

  *  GET じゃなくてもクエリストリングはつけられるので

:request.POST: Only handles form data. Only works for 'POST' method.
:request.GET: request.query_params と同じ


DRF の Response
----------------
.. list-table::
  :widths: auto
  :stub-columns: 1

  * - return Response(data)
    - Renders to content type as requested by the client.

      * RESTフレームワークがレスポンスを正しいコンテンツタイプに変換してくれる
      * レスポンスが単一のコンテンツタイプに固定されていない

Response
---------

https://twitter.com/kazuho/status/1356204483412258816

https://httpwg.org/http-extensions/draft-ietf-httpbis-bcp56bis.html#section-4.6

(shimizukawa さんありがとうございました)


**TODO: 整理する**


Views
=======

API ビュー
------------

RESTフレームワークには、APIビューを書くために使用できる2つのラッパーがあります。

* ``@api_view``: 関数ベースのビューを扱うためのデコレータ。
* ``APIView``: クラスベースのビューを操作するためのクラス。


クラスベース (APIView) で記述するのがおすすめ
----------------------------------------------
* 特定のモデルに紐付かないような処理は クラスベースで記述するのがおすすめと言えるでしょう。 (くろのて)

  * クエリが複雑すぎて queryset じゃ処理しきれないとかで SQLAlchemy で処理した結果を返したい という場合などに APIView を使っています。 (くろのて)


ちょっと動かしたい
==================

コマンドでアクセスする場合
----------------------------

.. code-block:: bash

  # curl の場合
  $ curl -H 'Accept: application/json; indent=4' -u <username>:<password> http://127.0.0.1:xxxx/users/

  # HTTPie の場合
  # https://httpie.org/doc
  $ http -a <username>:<password> http://127.0.0.1:8989/users/


Browsable API
---------------
* rest_framework.response.Response を返すと Browsable API で見られるようだ!


Browsable API で HTML form タブが出せる
----------------------------------------

.. list-table::
  :widths: auto
  :stub-columns: 1

  * - viewsets.ModelViewSet
    - 継承するだけで出る
  * - APIView
    - ``serializer_class = SnippetSerializer`` を指定すると出る
  * - Generic view
    - ``serializer_class = SnippetSerializer`` を指定すると出る

      - というか、指定しないとどの serializer と対応してるかわからないからどのみち指定することになる

* see: https://stackoverflow.com/questions/14616489/django-rest-framework-autogenerate-form-in-browsable-api


便利なライブラリ
================

Django REST Framework JSON CamelCase
-------------------------------------
https://pypi.org/project/djangorestframework-camel-case/

* Camel case JSON support for Django REST framework.
* render と parser があって、キャメルケース <=> スネークケース 変換してくれる


django-cors-headers
--------------------
https://pypi.org/project/django-cors-headers/

`django-cors-headers <https://github.com/ottoyiu/django-cors-headers>`_

* A Django App that adds Cross-Origin Resource Sharing (CORS) headers to responses. This allows in-browser requests to your Django application from other origins.
* レスポンスヘッダーに CORS に必要なヘッダーを足してくれる

  * allow の origin からのアクセスだったら、 ``Access-Control-Allow-Origin``  ヘッダーには origin が設定されて返る
  * allow じゃない origin からのアクセスだったら ``Access-Control-Allow-Origin`` ヘッダー自体が返らない
  * そういう実装になっている
  * 理由は、「これは OK だよ」と教えちゃうと、悪いひとが偽装したりするから (きっと)

CORS
^^^^^

オリジン間リソース共有 (Cross-Origin Resource Sharing)

* くわしくはここを見よ

  * https://github.com/adamchainz/django-cors-headers#about-cors
  * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
  * `くろのて > CORS とか Preflight とかよくわかんないよな <http://note.crohaco.net/2019/http-cors-preflight/>`_


Routers
=======

Router
------
* Router で登録できるのは ViewSet だけ
* DefaultRouter: Router のルート画面にアクセスしたときに API のリンク一覧を見せてくれる
