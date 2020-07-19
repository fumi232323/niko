.. title: Next.js: Tutorial 下
.. tags: javascript
.. date: 2020-07-19
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス, 書籍
==================

* https://nextjs.org/learn/basics/dynamic-routes
* https://nextjs.org/learn/basics/api-routes

Dynamic Routes
==============

* Next.js は、外部データに依存するパスを持つページを静的に生成できる。
* これは、 Next.js において ``dynamic URLs`` を可能にする。

How to Statically Generate Pages with Dynamic Routes
----------------------------------------------------

1. ``page`` ディレクトリ配下に、 ``[`` で始まり ``]`` で終わるファイルを作る

   * ファイル名: ``pages/posts/[id].js``  => パス: ``/posts/{id}``
   * ``[`` で始まり ``]`` で終わるのが動的 page

2. ``pages/posts/[id].js`` の中に、 ``getStaticPaths`` という非同期関数を export する。

{{% codeblock ../nextjs-blog/pages/posts/[id].js label="pages/posts/[id].js" lexer="javascript" %}}

実行の順番
----------

1. ``getStaticPaths()``
2. ``getStaticProps()``
3. ``Post()``

他のページからリンクするとき
----------------------------

.. code-block:: javascript

  // href に `[]` を使い、 `as` prop に実際のパス (id) を入れてあげる
  <Link href="/posts/[id]" as="/posts/ssg-ssr">
    <a>...</a>
  </Link>

getStaticPaths が実行されるタイミング
--------------------------------------

* 開発時: リクエスト毎
* 本番時: ビルド時

Fallback
--------

* ``fallback: false``: ``getStaticPaths`` から返されるどのページにも合致しないパスがリクエストされた場合、404 page を返す
* ``fallback: true``: 404 page を返さない

  * のはわかったけれどあとは良くわからないので、ここを読んでください: https://nextjs.org/docs/basic-features/data-fetching#fallback-pageshttps://nextjs.org/docs/basic-features/data-fetching#fallback-pages

Catch-all Routes
-----------------

``[]`` の中に ``...`` (three dots) を入れるとすべてのパスをキャッチできるようになる

* ``pages/posts/[...id].js`` => ``/posts/a`` も ``/posts/a/b`` も ``/posts/a/b/c`` もマッチする。

.. note::

  詳しくは: https://nextjs.org/docs/routing/dynamic-routes

Router
-------

Next.js router にアクセスしたい場合は、 ``next/router`` から ``useRouter`` hook を import する

.. note::

  詳しくは: https://nextjs.org/docs/routing/dynamic-routes

404 Pages
----------

カスタム 404 Page を作成できる

* ``pages/404.js`` というファイルを作れば良い
* ビルド時に静的生成される

.. note::

  詳しくは: https://nextjs.org/docs/advanced-features/custom-error-page#404-page

Dynamic Routes Details
----------------------
* Data Fetching: https://nextjs.org/docs/basic-features/data-fetching
* Dynamic Routes: https://nextjs.org/docs/routing/dynamic-routes

ライブラリ
----------
* ``remark``: Markdown コンテンツのレンダリング
* ``date-fns``: 日付フォーマット


API Routes
==========

* Next.js は API Routes をサポートしている
* Node.js 関数として APIエンドポイントを簡単に作成できる

Creating API Routes
-------------------

``pages/api`` 配下にこんな関数を作る

{{% codeblock ../nextjs-blog/pages/api/hello.js label="pages/api/hello.js" lexer="javascript" %}}

* Serverless Functions (also known as Lambdas) としてデプロイできる
* Do Not Fetch an API Route from ``getStaticProps`` or ``getStaticPaths``
* 良い Use Case は、入力フォームのハンドリングです

  * page にフォームを作る
  * => API Route に POSTリクエストする
  * => API Route で直接 DBに保存する

* API Route のコードはクライアントバンドルされないので、安全にサーバーサイドコードが記述できる

Dynamic API Routes
------------------

API Routes は、通常の page と同様に動的にできる

.. note::

  詳しくは: https://nextjs.org/docs/api-routes/dynamic-api-routes
