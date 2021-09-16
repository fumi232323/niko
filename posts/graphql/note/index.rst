.. title: GraphQL メモ
.. tags: graphql
.. date: 2021-09-16
.. updated: 2021-09-16
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


GraphQL
==========

リファレンス・ガイド
--------------------

* GraphQL: https://graphql.org/
* GitHub の GraphQLガイド: https://docs.github.com/ja/graphql/guides/introduction-to-graphql

概要
----

* GraphQL だと、自分のほしいデータのみをクライアント側で絞り込んで取得できる

  * REST API: API のエンドポイントを叩くとデータが取得できる
  * 公開されているAPI だと、自分には不要なデータも大量にとれてきたりする

* エンドポイントはひとつだけ
* JSON と SQL のあいのこみたいなクエリを書く
* Type 定義がサーバー側のテーブル定義のような雰囲気
* 画面に合わせて API を何本も書かないとならない、というようなことが解消できそうな印象を受けた


ライブラリ・tools
------------------

* https://www.apollographql.com/docs/react/get-started/

  * React 向けの GraphQL 呼び出し? ライブラリ
  * Vue には同様に apollo というライブラリがある

* https://github.com/graphql/graphiql

  * オートコンプリートが効く
  * クエリを書くのにDBのテーブル構造を知っている必要があるが、これを使うと IDE でオートコンプリートが効くので、
    いちいちテーブル定義書とか ER図とにらめっこしなくて便利

* GraphQL Code Generator

  * 紹介しているブログ: https://techlife.cookpad.com/entry/2021/03/24/123214
  * GraphQL クエリを書いて、 Generator を叩くと TypeScript の型定義を自動で生成してくれる
  * GraphQL は JSON しか返さないので、型がついていない
  * これを使うと型がついた状態で Response してくれる
  * yaml に hool = true のような設定があって、true にすると、クエリを叩くフックをつけることができて、クエリを叩くコードが自動生成される (べんりそうー: まだ使っていない)
  * apollo の Generator もある

    * React だと、 GraphQL Code Generator のほうが良さそうな雰囲気 (会社の同僚談)

* GitHub の Explorer

  * https://docs.github.com/en/graphql/overview/explorer
  * GraphQL のクエリを書く練習はここでやると良さそう

耳より情報
----------

* https://docs.github.com/en/graphql

  * GitHub が公開している GraphQL API
  * 練習用に良さそう
  * https://github.com/trending (星がたくさんついている repo を探せる) ライクなものを書いてみるとか

* https://newrelic.com/jp

  * ここも GraphQL API があるもよう
  * システム・データ監視分析してくれるやつ
