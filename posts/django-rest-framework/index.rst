.. title: Django REST framework のメモ
.. tags: django-rest-framework
.. date: 2019-07-16
.. slug: index
.. status: draft


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ガイド/リファレンス
===================
* `Django REST framework <https://www.django-rest-framework.org/>`_
* `くろのて > [Django REST Framework] View の使い方をまとめてみた <http://note.crohaco.net/2018/django-rest-framework-view/>`_
* `くろのて > [Django REST Framework] Serializer の 使い方 をまとめてみた <http://note.crohaco.net/2018/django-rest-framework-serializer/>`_
* `くろのて > CORS とか Preflight とかよくわかんないよな <http://note.crohaco.net/2019/http-cors-preflight/>`_
* `Django REST Frameworkを使って爆速でAPIを実装する <https://qiita.com/kimihiro_n/items/86e0a9e619720e57ecd8>`_
* `django-cors-headers <https://github.com/ottoyiu/django-cors-headers>`_


メモ
=====

コマンドでアクセスする場合
----------------------------

.. code-block:: bash

  # curl の場合
  $ curl -H 'Accept: application/json; indent=4' -u <username>:<password> http://127.0.0.1:8989/users/

  # HTTPie の場合
  # https://httpie.org/doc
  $ http -a <username>:<password> http://127.0.0.1:8989/users/


クラスベース (APIView) で記述するのがおすすめ
----------------------------------------------
* 特定のモデルに紐付かないような処理は クラスベースで記述するのがおすすめと言えるでしょう。 (くろのて)

  * クエリが複雑すぎて queryset じゃ処理しきれないとかで SQLAlchemy で処理した結果を返したい という場合などに APIView を使っています。 (くろのて)


Router
------
* Router で登録できるのは ViewSet だけ
* DefaultRouter: Router のルート画面にアクセスしたときに API のリンク一覧を見せてくれる


Browsable API
---------------
* rest_framework.response.Response を返すと Browsable API で見られるようだ!


Browsable API で HTML form タブが出せる
------------------------------------------

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


django-cors-headers
--------------------

* allow の origin からのアクセスだったら、 ``Access-Control-Allow-Origin``  ヘッダーには origin が設定されて返る
* allow じゃない origin からのアクセスだったら ``Access-Control-Allow-Origin`` ヘッダー自体が返らない
* そういう実装になっている
* 理由は、「これは OK だよ」と教えちゃうと、悪いひとが偽装したりするから (きっと)


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


API ビュー
------------

RESTフレームワークには、APIビューを書くために使用できる2つのラッパーがあります。

1. @api_view 関数ベースのビューを扱うためのデコレータ。
2. APIView クラスベースのビューを操作するためのクラス。
