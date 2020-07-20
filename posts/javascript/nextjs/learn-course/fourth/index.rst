.. title: Next.js: Tutorial deploying
.. tags: javascript
.. date: 2020-07-20
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

* https://nextjs.org/learn/basics/deploying-nextjs-app

Deploying Your Next.js App
==========================

Deploy to Vercel
----------------

* Next.js を本番環境にデプロイする一番簡単な方法は、
  Next.jsの作成者が開発した Vercel プラットフォームを使用することです。
* Vercel は all-in-one プラットフォーム

  * with Global CDN supporting static & JAMstack deployment and Serverless Functions.

* 無料で使い始められる

やりかた
^^^^^^^^^

* Vercel アカウントを作る: https://vercel.com/signup
* GitHub と連携する
* Vercel for GitHub をインストールする
* デプロイしたい Next.js アプリをインポートする
* しばらく待つと、ビルド & デプロイされて deployment URLs が払い出される
* これだけ!

Next.js and Vercel
------------------

* Vercel に Next.js app をデプロイすると、デフォルトで以下がサポートされる

  * Static Generation を使っている page と assets  (JS, CSS, images, fonts, etc) は、
    自動的に、めちゃくちゃ速い Vercel Edge Network から serve される
  * Server-Side Rendering と API routes を使っている page は、
    自動的に、分離された Serverless Functions になる

* Vercel には以下ようなたくさんの特徴がある

  * Custom Domains: Next.js アプリにカスタムドメインを割り当ててくれる
  * Environment Variables: 環境変数を設定することもできる
  * Automatic HTTPS: HTTPS がデフォルトで有効、SSL証明書は自動更新してくれる

Preview Deployment for Every Push
---------------------------------

* アプリを変更して GitHub で PR すると、 push の度ごとに、
  自動的に preview deployment を作成してくれる。

  * GitHub の PR に vercel bot が preview URL を表示してくれるので、
  * その URL へアクセスすると、最新の preview deployment を見られる。しゅごい。

* master へ merge すると、自動的に production deplyment してくれる

Develop, Preview, Ship
------------------------

Next.js アプリを開発するときは ``DPS`` workflow を使いましょう

Other Hosting Options
---------------------

Next.js は、 Node.js をサポートするどのホスティングプロバイダーにもデプロイできる。

``package.json`` がこうなっているとするでしょ。

.. code-block:: json

  {
    "scripts": {
      "dev": "next",
      "build": "next build",
      "start": "next start"
    }
  }

するとこう。

.. code-block:: bash

  # 自分のホスティングプロバイダー上で ``build`` スクリプトを1回実行すると、
  # ``.next`` フォルダーに本番アプリケーションがビルドされる。
  $ npm run build

  # ビルドしたらに ``start`` スクリプトでハイブリッドページをサポートする Node.js server を起動し、
  # 静的生成されたページとサーバーサイドレンダリングされたページの両方を提供する
  # API Routes もまたサポートしているよ
  $ npm run start
