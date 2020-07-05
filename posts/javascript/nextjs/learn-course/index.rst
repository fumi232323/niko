.. title: Next.js: Tutorial 前半
.. tags: javascript
.. date: 2020-07-05
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

* https://nextjs.org/learn/basics/create-nextjs-app
* https://nextjs.org/learn/basics/navigate-between-pages
* https://nextjs.org/learn/basics/assets-metadata-css


Create a Next.js App
====================

.. code-block:: bash

  # Node.js がインストールされていること
  $ node -v

  # アプリを作成するディレクトリを作成
  $ mkdir learn-course
  $ cd learn-course

  # Next.jsアプリを作成する
  # 内部では `create-next-app` というツールを使っている
  $ npm init next-app nextjs-blog --example "https://github.com/vercel/next-learn-starter/tree/master/learn-starter"

  # 開発サーバーの起動
  $ cd nextjs-blog
  # port 3000 で起動する (http://localhost:3000/)
  $ npm run dev

Navigate Between Pages
=======================

Pages in Next.js
----------------
* Next.js では、ページは ``pages`` ディレクトリ配下のファイルから export された React Component です。
* ファイル名とパスが関連付いている。

  * ``pages/index.js`` => ``/``
  * ``pages/posts/first-post.js`` => ``/posts/first-post``

Link Component
--------------
ページ間のリンクは ``<Link>`` React Component を使う

  .. code-block:: javascript

    import Link from 'next/link'

    // 中に a tag が入る
    Read <Link href="/posts/first-post"><a>this page!</a></Link>


Client-Side Navigation
----------------------

* ``Link`` Component は ``client-side navigation`` なるものを可能にする

  * ページ遷移が JavaScript を使用して行われる
  * ブラウザによって行われるデフォルトのナビゲーションより速い

* Next.js は、自動的に code splitting するので、それぞれのページはそのページに必要な部分だけロードする。
* さらに production ビルドでは、 ``Link`` Component がブラウザの viewport に現れるたびに、
  Next.js があらかじめ自動的にバックグラウンドでリンク先ページのコードを読み込むので、
  いざユーザーがリンクをクリックした暁には、ささっとページ遷移できちゃう


Assets, Metadata, and CSS
=========================

Next.js は CSS 及び Sass を built-in サポートしている

Assets
------

* Next.js は画像のような静的ファイルを serve できる
* 静的ファイルは、アプリケーションのトップレベルの ``public`` ディレクトリに配置する
* ``public`` ディレクトリ配下の静的ファイルは、 ``pages`` と同様に、アプリケーションルートから参照できる

  .. code-block:: javascript

    // app_root/public/vercel.svg を参照する場合
    <img src="/vercel.svg" alt="Vercel Logo" className="logo" />

* ``public`` ディレクトリには、そのほかにも ``robots.txt`` など静的な aseets を置くとよい


Metadata
--------

``<title>`` など、ページのメタデータを変更したい場合は ``<Head>`` React Component を使う

.. code-block:: javascript

  import Head from 'next/head'

  // Head の H は大文字
  <Head>
    <title>First Post</title>
  </Head>


CSS Styling
-----------

* CSS-in-JS ライブラリ:

  * React Component 内で CSS を記述できる
  * CSS スタイルがスコープされる（他の Component は影響を受けない）

  .. code-block:: javascript

    // e.g. styled-jsx を使ってページ内で有効な CSS をあてる
    <style jsx>{`
      …
    `}</style>

* Next.js は ``styled-jsx`` ライブラリを built-in support しているが、
* ``styled-components`` や ``emotion`` など他のポピュラーな CSS-in-JS ライブラリを使うこともできる

  * 使っているひとのはなしだと「``antdesign`` と ``styled-components`` は使わないと損なレベルで完成度高い。」
  * 使おう


Writing and Importing CSS
-------------------------

* Next.js は CSS 及び Sass を built-in サポートしているので、 ``.css`` や ``.scss`` ファイルを import できる
* popular CSS ライブラリーの ``Tailwind CSS`` もサポートしているよ


Layout Component
-----------------

* すべてのページに共通の ``Layout`` Component を、 ``components`` top-level ディレクトリに作る

  .. code-block:: javascript

    // components/layout.js
    function Layout({ children }) {
      return <div>{children}</div>
    }

    export default Layout

* それを、各 page から import して利用できる

  .. code-block:: javascript

    // pages/posts/first-post.js
    import Layout from "../../components/layout"

    export default function FirstPost() {
      return (
        <Layout>
          <Head>
            <title>First Post</title>
          </Head>
          <h1>First Post</h1>
          <h2>
            <Link href="/">
              <a>Back to home</a>
            </Link>
          </h2>
        </Layout>
      )
    }


Adding CSS
----------

CSS Modules を使うと、 React Component に CSSファイルをインポートできる

  .. code-block:: css

    /* components/layout.module.css */
    .container {
      max-width: 36rem;
      padding: 0 1rem;
      margin: 3rem auto 6rem;
    }

  .. code-block:: javascript

    // components/layout.js
    import styles from "./layout.module.css"

    export default function Layout({ children }) {
      return <div className={styles.container}>{children}</div>
    }


* CSS Modules のファイル名は ``.module.css`` で終わる名前にすること!!
* CSS Modules により、一意の CSSクラス名が自動的に生成されるので、クラス名の衝突を心配する必要がない

  * ``layout_container__2t4v2`` こんなクラス名が自動生成される

* Next.js の code splittin 機能が CSSモジュールでも機能するので、各ページに読み込まれる CSS量は最小限になる
* CSS Modules は、ビルド時に JavaScriptバンドルから抽出され、
  Next.js によって自動的にロードされる ``.css`` ファイルを生成する


Global Styles
-------------

* すべてのページにスタイルを適用したいときは ``App`` Compnent を使う
* ``pages`` ディレクトリに ``_app.js`` を作成し、↓のような感じで書く

  .. code-block:: javascript

    // pages/_app.js
    export default function App({ Component, pageProps }) {
      return <Component {...pageProps} />
    }

* ``App`` Compnent はすべてのページに共通する top-level Component です
* この Compnent を使用して、ページ間を移動するときに状態を維持できます
* ``_app.js`` を追加した際は、 dev server の再起動が必要


Adding Global CSS
-----------------

* Next.js では、 global CSS files を追加できる。
* global CSS files は、 ``_app.js`` からのみ import できる。ほかのところからは import できない (page 上のすべてのエレメントに影響するため) 。
* global CSS files は、配置先と名前はなんでもよい
* 例)

  {{% codeblock nextjs-blog/styles/global.css label="styles/global.css" lexer="css" %}}
  {{% codeblock nextjs-blog/pages/_app.js label="pages/_app.js" lexer="css" %}}

まとめ
------

* To use CSS Modules, import a CSS file named ``*.module.css`` from any component.
* To use global CSS, import a CSS file in ``pages/_app.js``.
