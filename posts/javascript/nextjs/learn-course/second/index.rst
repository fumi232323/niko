.. title: Next.js: Pre-rendering, Data Fetching
.. tags: javascript
.. date: 2020-07-12
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

* https://nextjs.org/learn/basics/data-fetching

Pre-rendering and Data Fetching
===============================

Pre-rendering
-------------

* デフォルトでは、Next.js はすべてのページを事前にレンダリングする
* クライアントサイドの JavaScript で HTML を生成しない
* 事前にレンダリングしておくと、パフォーマンスとSEO が向上する
* Next.js によって生成された HTML は、そのページに必要最小限の JavaScript コードと関連づけられている
* ブラウザによってページが読み込まれると、その JavaScript コードが実行されてページが完全に interactive になる
* プレーンな React.jsアプリ（Next.js なし）の場合、事前レンダリングは行われない

Two Forms of Pre-rendering
--------------------------

Next.js の Pre-rendering には、以下の 2つの形式がある。

* Static Generation: build 時に HTML を生成する。各リクエストで再利用される。
* Server-side Rendering: リクエストごとに HTMLを生成する。

.. Note::

  開発モードでは、すべてのページがリクエストごとに事前レンダリングされる

Per-page Basis
--------------

* Next.jsでは、ページごとに使用する Pre-rendering 形式を選択できる
* ひとつのアプリケーション内で、2つの形式を混在させることができる

When to Use Static Generation v.s. Server-side Rendering
----------------------------------------------------------

* 可能な限り ``Static Generation`` を使うのがおすすめ

  * 一度ページを build すれば CDN で提供できる
  * リクエストごとにサーバーでページをレンダリングするよりもずっと高速

* 頻繁にデータが更新されたり、リクエストごとに content が変わるような page には ``Server-side Rendering`` を使う

  * 速度は遅くなるが常に最新の状態

Static Generation with and without Data
----------------------------------------

``Static Generation`` はデータの有無にかかわらずできる

* 外部データを取得する必要のない page: アプリが本番用に build されるときに自動的に  ``Static Generation`` される
* 外部データを取得しないと HTML レンダリングできない page: このケースも Next.js は out of the box で サポートしている

Static Generation with Data using ``getStaticProps``
----------------------------------------------------

外部データを取得して page の props として渡すには、 ``getStaticProps`` を使う

* ``getStaticProps`` は、サーバーサイドのみで実行される

  * クライアント側では実行されない
  * JS のバンドルにも含まれない

* ``getStaticProps`` が実行されるタイミング:

  * 開発時 ( ``npm run dev`` or ``yarn dev``): リクエストの度
  * 本番時: ビルド時

* ビルド時に実行されることを想定しているため、クエリパラメータや HTTPヘッダーなど、リクエスト時にのみ利用可能なデータを使用することはできない
* page ファイルからのみ export できる (非 page ファイルからは export できない)
* 詳しくは => https://nextjs.org/docs/basic-features/data-fetching
* リクエスト時にデータ取得したい場合は Static Generation は良いアイデアではない

  * そういうときは、 ``Server-side Rendering`` するか pre-rendering をスキップしよう

Fetching Data at Request Time
-----------------------------

Using ``getServerSideProps``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

ビルド時ではなく、リクエスト時にデータ取得が必要ならば、 ``Server-side Rendering`` してみよう

* Server-side Rendering するには、 ``getStaticProps`` のかわりに ``getServerSideProps`` を
  page から export する

  .. code-block:: javascript

    export async function getServerSideProps(context) {
      // `getServerSideProps` はリクエスト時に呼び出されるものなので、
      //  context にはリクエストパラメーターが含まれている
      return {
        props: {
          // props for your component
        }
      }
    }

* Time to first byte (TTFB) は ``getStaticProps`` より遅くなる
* 追加設定なしに CDN に 生成結果をキャッシュすることはできない

Client-side Rendering
^^^^^^^^^^^^^^^^^^^^^^

データを事前レンダリングする必要がないならば、 ``Client-side Rendering`` できます

* page のうち、外部データが不要な部分は静的に生成 (事前レンダリング) して、
* page ロード時に、クライアントから JavaScript で外部データを取得して、
  残りの部分を入れ込みます
* user dashboard pages などに使うと良い

SWR
^^^^

* データ取得のための React hook
* クライアントサイドからデータ取得するならとってもおすすめ
* いろいろできるらしい
* 詳細はこちら => https://swr.now.sh/
