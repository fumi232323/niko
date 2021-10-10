.. title: Next.js: TypeScript
.. tags: frontend
.. date: 2020-07-25
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

* https://nextjs.org/learn/excel/typescript

TypeScript
===========

How to set up Next.js with TypeScript
--------------------------------------

1. プロジェクトルートディレクトリ直下に ``tsconfig.json`` を作る

2. TypeScript をインストールする

    .. code-block:: bash

      $ npm install --save-dev typescript @types/react @types/node

3. 開発サーバーを再起動する

    .. code-block:: bash

      $ npm run dev

4. サーバー再起動後、 Next.js は次のことをしてくれるでしょう。

   * ``tsconfig.json`` ファイルの中身を入れてくれる。このファイルは、自分でカスタマイズしても良し。
   * ``next-env.d.ts`` ファイルを作ってくれる。このファイルは、触ってはいけません。

     * このファイルは、Next.js types が確実に TypeScript compiler にピックアップされるようにします。

これで、 Next.js アプリで TypeScript が使えるようになります!


Next.js Specific Types
----------------------

Next.js 固有のタイプが使えるよ。

Static Generation and Server-side Rendering
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* TypeScript

  .. code-block:: typescript

    import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

    export const getStaticProps: GetStaticProps = async context => {
      // ...
    }

    export const getStaticPaths: GetStaticPaths = async () => {
      // ...
    }

    export const getServerSideProps: GetServerSideProps = async context => {
      // ...
    }

* JavaScript

  .. code-block:: javascript

    export async function getStaticProps(context) {
      // ...
    }

    export async function getStaticPaths() {
      // ...
    }

    export async function getServerSideProps(context) {
      // ...
    }

API Routes
^^^^^^^^^^

.. code-block:: typescript

  /* TypeScript */
  import { NextApiRequest, NextApiResponse } from 'next'

  export default (req: NextApiRequest, res: NextApiResponse) => {
    // ...
  }

  /* JavaScript */
  export default (req, res) => {
    // ...
  }


Custom App
^^^^^^^^^^^

* TypeScript

  .. code-block:: typescript

    // built-in type
    import { AppProps } from 'next/app'

    function App({ Component, pageProps }: AppProps) {
      return <Component {...pageProps} />
    }

    export default App

* JavaScript

  .. code-block:: javascript

    export default function App({ Component, pageProps }) {
      return <Component {...pageProps} />
    }
