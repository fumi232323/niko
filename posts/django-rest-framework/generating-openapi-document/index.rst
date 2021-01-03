.. title: OpenAPI Document の自動生成
.. tags: django-rest-framework
.. date: 2021-01-02
.. slug: index
.. status: published


.. note::

  以前案件で Django REST framework のアプリケーションコードから OpenAPI document を自動生成する調査をしたので、自分用にここにもメモ。

  2020年9月時点の情報。


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


調査対象とした自動生成ライブラリ
================================

以下のふたつ。

* API schemas (DRF 標準): https://www.django-rest-framework.org/coreapi/schemas/
* drf-yasg (Third party package): https://github.com/axnsan12/drf-yasg

  * https://github.com/marcgibbons/django-rest-swagger の後継
  * 現在は、 https://github.com/tfranzel/drf-spectacular で OpenAPI 3.0 ベースの OpenAPI document が生成できるもよう

[理由]

* DRF の公式リファレンス `Documenting your API <https://www.django-rest-framework.org/topics/documenting-your-api/#documenting-your-api>`_ でオススメされているのはこの2つ
* web で検索してみると (現在有効なものだと) このふたつの情報がほとんど



挙動まとめ
==========

自分たちのアプリケーションコードに自動生成用のコードを追加する (※1) ことで生成結果をカスタマイズできる (より事実に近い状態の OpenAPI document を自動生成できる) もようだが、
以下はコード追加せずデフォルト状態で生成した (※2)

.. list-table::
  :widths: 20 40 40
  :header-rows: 1
  :stub-columns: 1

  * - 項目
    - API schemas (DRF 標準)
    - drf-yasg
  * - OpenAPI version
    - openapi: 3.0.2
    - swagger: 2.0
  * - output format
    - yaml, json
    - yaml, json
  * - UI
    - Swagger UI, ReDoc
    - Swagger UI, ReDoc
  * - path
    - コード通り生成される

      - urls.py から生成しているもよう
    - 同左
  * - method
    - コード通り生成される

      - urls.py => viewクラス/関数を見て生成しているもよう
    - 同左
  * - operationId
    - 実際のコードと相違がある

      - path + method に応じて機械的につけているもよう
    - 同左 (命名法則には違いがある)
  * - description
    - コード通り生成される

      - viewクラス/view関数のDocString が転記される
    - 同左
  * - ステータスコード
    - 実際のコードと相違がある

      - method に応じて機械的につけているもよう

        - GET: 200
        - PUT: 200
        - PATCH: 200
        - POST: 200
        - DELETE: 204

    - 実際のコードと相違がある

      - method に応じて機械的につけているもよう

        - GET: 200
        - PUT: 200
        - PATCH: 200
        - POST: 201
        - DELETE: 204

  * - parameters (path)
    - コード通り生成される

      - ただし、ID などDRF としては int 型で受け取るものも一律 ``type: string`` として出力される

    - 同左
  * - requestBody
    - 一部コード通り?生成される

      - Generic views を継承している view の場合は serializer_class に指定されたserializer から生成されるもよう
      - APIView を継承した view は生成されない
    - 同左
  * - responses
    - 同上

      - ただし、ClassView の場合は、すべての method に同じ response がついてしまう (例えば実際は何も返さない post にも出力されてしまう)
    - 同左
  * - tags
    - つかない
    - つく

      - 起点 (ROOT_CONF or app/urls) で付き方は変わる


※1 drf-yasg の場合。(試してないけど) View にデコレータをつけて、シリアライザやレスポンスコードなどを指定するようなイメージ。DRF 標準のほうでもできるのかは未確認。

※2 drf-yasg のほうがチェックが甘く、多少ヘンテコなコードでも出力してくれた


生成方法
========

API schemas (DRF 標準)
-----------------------

1. pyyaml, uritemplate を install
2. ``settings.DEFAULT_SCHEMA_CLASS`` が指定されていたら、 default の ``rest_framework.schemas.openapi.AutoSchema`` に戻しておく
3. 以下のコマンドを実行する

    .. code-block:: console

      $ python manage.py generateschema --title="fumi23API" --description="[DFR標準] OpenAPI document 自動生成をテスト" --urlconf='fumi23.urls' > openapi-schema.yaml

4. もしくは URLconf に以下を追記して、 runserver =>  http://localhost:8000/openapi-schema/ にアクセス

    .. code-block:: python

      # urls.py (今回は ROOT_CONF に記載)
      from rest_framework.schemas import get_schema_view
      from rest_framework import permissions
      from rest_framework.renderers import OpenAPIRenderer
      from django.views.generic.base import TemplateView

      urlpatterns += [
          # yaml file download
          path('openapi-schema/', get_schema_view(
              title="fumi23 API",
              description="[DFR標準] OpenAPI document 自動生成をテスト",
              version="1.0.0",
              public=True,
              urlconf='fumi23.urls',
              renderer_classes=[OpenAPIRenderer],
              permission_classes=(permissions.AllowAny,),
          ), name='openapi-schema'),
          # Swagger UI view
          # ここ https://www.django-rest-framework.org/topics/documenting-your-api/#a-minimal-example-with-swagger-ui に記載の template も用意する
          path('docs/', TemplateView.as_view(
              template_name='swagger-ui.html',
              extra_context={'schema_url': 'openapi-schema'}
          ), name='swagger-ui'),
      ]

参考にしたページ
^^^^^^^^^^^^^^^^^

* https://www.django-rest-framework.org/coreapi/schemas/
* https://www.django-rest-framework.org/community/3.10-announcement/
* https://dev.to/errietta/documenting-a-django-api-with-openapi-and-dataclasses-1p6h


drf-yasg (Third party package)
-------------------------------

1. drf-yasg を install
2. settings.INSTALLED_APPS に ``drf_yasg`` を追記
3. URLconf に以下を追記して runserver => http://localhost:8000/swagger/ にアクセス

    .. code-block:: python

      from django.urls import re_path
      from rest_framework import permissions
      from drf_yasg.views import get_schema_view
      from drf_yasg import openapi

      schema_view = get_schema_view(
          openapi.Info(
              title="fumi23 API",
              default_version='v3',
              description="[drf-yasg] OpenAPI document 自動生成をテスト",
          ),
          url='http://localhost:8000',
          urlconf='fumi23.urls',
          public=True,
          permission_classes=(permissions.AllowAny,),
      )

          urlpatterns += [
              # yaml or json file download
              re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
              # Swagger UI view
              path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
              # ReDoc view
              path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
          ]

参考にしたページ
^^^^^^^^^^^^^^^^^

* https://github.com/axnsan12/drf-yasg
* https://qiita.com/jnuank/items/be163ffb2a0c41a130be
* https://qiita.com/T0000N/items/c982fd9586763747fb11


OpenAPI document があるとうれしいこと
======================================

* コードを読んだり実際にアプリケーションを動かしてみなくても、API の I/F が一目瞭然

  * 運用・保守していく立場からするととても助かる

* フロントエンド の TypeScript の型ファイル? を自動生成できるもよう

  * 人間が手でやると、書き間違えたり、誤認・誤解したりする
  * ちなみに、 Go など型がある言語だとどこも自動生成するものらしい

* バックエンドの モックサーバーをたてられるもよう

  * https://github.com/zalando/connexion
  * https://github.com/encode/apistar
  * 同じ起点 (OpenAPI Document) から実装 => テストしていけば、例えばバックエンドとフロントエンドの担当者が違っても、認識齟齬によるバグと悲しい気持ちを生まない


OpenAPI document を自動生成できるとうれしいこと
===============================================

* OAS に準拠した書き方を習得するのにちょっとだけ学習コストがかかるのと、
* 書くのおっくうになっても、コード書けば勝手に yaml にしてくれたらうれしいかも
