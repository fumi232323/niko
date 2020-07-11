.. title: Next.js: Tutorial 後半
.. tags: javascript
.. date: 2020-07-06
.. slug: index
.. status: draft


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

※開発モードでは、すべてのページがリクエストごとに事前レンダリングされる

Per-page Basis
--------------

* Next.jsでは、ページごとに使用する Pre-rendering 形式を選択できる
* ひとつのアプリケーション内で、2つの形式を混在させることができる

When to Use Static Generation v.s. Server-side Rendering
----------------------------------------------------------

どんなときに ``Static Generation`` を使い、どんなときに ``Server-side Rendering`` を使うべきかと言うと、

可能な限り Static Generation を使うのがおすすめです。
なぜなら、一度ページを build すれば CDN で提供できるし、
リクエストごとにサーバーでページをレンダリングするよりもずっと高速だからです。