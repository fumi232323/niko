.. title: Django REST framework のメモ
.. tags: django-rest-framework
.. date: 2019-07-16
.. updated: 2019-10-13
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

* デシリアライズ (入って来るほう)

  .. code-block:: python

    serializer.is_valid()
    serializer.validated_data

* シリアライズ (出て行くほう)

  .. code-block:: python

    serializer = CommentSerializer(comment)
    serializer.data


Serializer fields の required 挙動まとめ
----------------------------------------
https://www.django-rest-framework.org/api-guide/fields/#required

* デフォルトは ``required=True``

deserialize 時
^^^^^^^^^^^^^^

``required=True``:

* キーなしは当然エラー
* キーがないとだめ

``required=False``:

* キーなしは OK
* キーあると、 ``None`` はエラー (必須エラー)
* キーある、かつ、 Datetime フィールドとか int フィールドだと ``''`` はエラー (たぶん型違いエラー)


serialize 時
^^^^^^^^^^^^^^

``required=False``:

* シリアライザに項目は渡すが中身が ``None`` (or ``''`` とか) の場合 => キーはあるが中身は ``None``

  .. code-block:: python

    {'updatedAt': None, 'entries': []}  # updatedAt = None で渡した

* シリアライザに項目ごと渡さない場合 => キーが消える

  .. code-block:: python

    {'entries': []}  # updatedAt を渡さなかったので、キーがない


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


Requests/Responses
===================

DRF の Request
----------------

:request.POST: Only handles form data. Only works for 'POST' method.
:request.data: Handles arbitrary data. Works for 'POST', 'PUT' and 'PATCH' methods.

  * json request をはじめとして他の形式も処理できる


DRF の Response
----------------
.. list-table::
  :widths: auto
  :stub-columns: 1

  * - return Response(data)
    - Renders to content type as requested by the client.

      * RESTフレームワークがレスポンスを正しいコンテンツタイプに変換してくれる
      * レスポンスが単一のコンテンツタイプに固定されていない


Routers
=======

Router
------
* Router で登録できるのは ViewSet だけ
* DefaultRouter: Router のルート画面にアクセスしたときに API のリンク一覧を見せてくれる


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
