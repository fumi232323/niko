.. title: React * Next.js * TypeScript で何か作ろう
.. tags: javascript
.. date: 2020-08-23
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


つくったもの
============

https://fuminote-tools.vercel.app/


アプリの種をつくる
==================

.. code-block:: zsh

  # 新しいNext.jsアプリを作成
  npx create-next-app

  # Starts the development server.
  cd path/to/app
  npm run dev

  # Builds the app for production.
  npm run build

  # Runs the built app in production mode.
  npm start

  # TypeScript の導入
  npm install --save-dev typescript @types/react @types/node
  touch tsconfig.json
  # dev サーバーの再起動が必要
  npm run dev

  # React Bootstrap の導入
  # https://react-bootstrap.github.io/getting-started/introduction
  # _app.tsx に `import 'bootstrap/dist/css/bootstrap.min.css';`
  npm install react-bootstrap bootstrap

  # styled components の導入
  # https://styled-components.com/
  npm install --save styled-components
  npm install @types/styled-components

  # styled components: Babel Plugin
  # https://styled-components.com/docs/tooling#babel-plugin
  # .babelrc も書く
  npm install --save-dev babel-plugin-styled-components

  # yarn をインストール (こっから yarn でやってみる)
  # package.json をそのまま使える
  sudo npm install -g yarn

  # Material-UI をインストール
  # https://material-ui.com/
  # React Bootstrap よりも使い方がややこしいが、 Component の種類が豊富
  yarn add @material-ui/core @material-ui/icons

  # react-copy-to-clipboard をインストール
  # https://www.npmjs.com/package/react-copy-to-clipboard
  # Clip board にコピーしてくれるさん
  yarn add react-copy-to-clipboard
  yarn add --dev @types/react-copy-to-clipboard

  # Axios をインストール
  # https://github.com/axios/axios
  yarn add axios



Vercel へ deploy
==================

0. Vercel アカウントを作成し、GitHub 連携する (すでに持っている場合はスキップ)

   * https://vercel.com/signup
   * やってみればわかる

1. GitHub に deploy したいアプリの repository を作成して push する
2. GitHub の自分のアカウントに https://vercel.com/github (Vercel for GitHub) をインストールする
3. Repository access を設定する

   * ここ https://github.com/settings/installations でインストール済みの GitHub Apps が見られる
   * 「すべての repositories にアクセスを許可する」 or 「選択した repositories のみにアクセスを許可する」が選べる

4. Vercel から ``Import Project`` (dashboard 画面右上の黒いボタン) する

   * 「Import Git Repository」を選択 > Continue > import したい Git repository の URL を入力

     * 手順3 で、 import したい repository にアクセスを許可をしていないと、ここで import したいプロジェクトが「ない」、と言われる

   * Continue する

5. 勝手に deploy が始まって、終わったら ドメインが 3つ払い出される

   * deploy 時にエラーが発生すると、 production にはデプロイしないでおいてくれる
