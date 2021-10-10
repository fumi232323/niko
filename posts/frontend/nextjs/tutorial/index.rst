.. title: Next.js TypeScript チュートリアル
.. tags: frontend
.. date: 2020-06-22
.. updated: 2020-06-29
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

* https://programmagick.com/sections/nextjs_tutorial/sample
* https://nextjs.org/docs/


Next.js の note
===============

* Next.js 公式のサンプル集: https://github.com/vercel/next.js/tree/master/examples
* ``.babelrc`` ファイル: ビルド設定

  * Next.jsでは ``.babelrc`` を作成・編集してビルド設定を変更できる

* ``next.config.js`` ファイル: Next.js 全般の設定

  * TypeScript を使うよ、もここに書く

* Custom App:

  * https://nextjs.org/docs/advanced-features/custom-app
  * https://nextjs.org/docs/basic-features/typescript#custom-app
  * ファイル名と配置先は決まっているもよう => こう ``./pages/_app.tsx``
  * Next.js は App コンポーネントを使用してページを初期化する。そいつをオーバーライドしてページの初期化をコントロールできる。
  * すべてのページで共有するコンポーネント （メニューやツールバーなど） が必要な場合は、App を使う

* Custom Document: https://nextjs.org/docs/advanced-features/custom-document

  * ファイル名と配置先は決まっているもよう => こう ``./pages/_document.tsx``
  * 自分のアプリケーションの ``<html>`` や ``<body>`` タグを拡張するために使う感じ
  * ``<Html>``, ``<Head />``, ``<Main />`` and ``<NextScript />`` は必ず必要のもよう
  * Document はサーバーサイドのみでレンダリングされる。 ``onClick`` とかは働かない。

* ``static`` ディレクトリ: 配下に画像などの静的ファイルを置くと、
  Node.js 経由で静的ファイルを配信できる。

  * 本番では Node.js (Next.js) をアプリケーション処理に特化させ、
    Nginx や各種CDN などに静的ファイル配信を任せる構成が一般的とのこと

* ``getInitialProps``: https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

  * サーバーサイドレンダリングを可能にし、初期データ設定できる (SEO に役立つらしい)
  * 非同期でデータを取得し、 Props に初期値を設定できる
  * static メソッドとして任意の Page にくっつけられる非同期関数
  * 引数に ``context`` オブジェクトを受け取る (いろいろ properties が入っている)
  * Next.js 9.3 以降を使っている場合は ``getInitialProps`` のかわりに ``getStaticProps`` や ``getServerSideProps`` がオススメとのこと。

* # TODO: Next.js の Getting Started もやると良さそう


その他 note
-----------

* ``export`` : export するとほかのモジュールから import できる
* ``...initialProps`` : 可変長引数
* 「antdesign と styled-components は使わないと損なレベルで完成度高い。」との情報を得た。


コマンド書き留め
================

.. code-block:: bash

  $ mkdir curry
  $ npm init -y
  $ npm install next react react-dom styled-components

  # TypeScript で Next.js を動作させるため、 Zeit社が提供する公式プラグインをインストールする
  $ npm install --save-dev @zeit/next-typescript

  # React等の型定義ファイルをインストールする
  $ npm install --save-dev @types/react
  $ npm install --save-dev @types/react-dom
  $ npm install --save-dev @types/next
  $ npm install --save-dev @types/styled-components

  # これもいるっぽい
  $ npm install --save-dev typescript @types/node

  # ビルド & アプリ起動
  # http://localhost:3000 でアクセスできる
  $ npm run dev
