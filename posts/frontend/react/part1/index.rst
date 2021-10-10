.. title: React: [読書メモ] React、Angular、Vue.js、React Nativeを使って学ぶ はじめてのフロントエンド開発 (props, state, Component)
.. tags: frontend
.. date: 2020-05-24
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
* React、Angular、Vue.js、React Nativeを使って学ぶ はじめてのフロントエンド開発: https://gihyo.jp/book/2018/978-4-7741-9706-7
* https://reactjs.org/
* https://ja.reactjs.org/


これが大事
==========

* props と state の役割と利用方法
* Component ライフサイクルの管理

Component の構成要素
---------------------

  * ``constructor()``: ECMAScript 2015 から利用できるようになったクラスのコンストラクタ

    * React の Component としては主に state の初期状態をセットするのに利用する

      * state: Component のレンダリングに結びつく値を管理する状態

  * ``handleInputChange()`` ※名前は任意: ユーザの操作を Component の state に反映させる役割
  * ``componentDidMount()``: Component ライフサイクルに関するメソッド
  * ``render()``: VirtualDOM（VDOM）のレンダリングに関する処理を行うメソッド。

    * Reactは、標準では HTML のレンダリングのために JSX を使用する

  * Preview も Component のひとつ
  * Class Component: React.Component を継承して定義する Component
  * Functional Component: 関数として定義される Component
  * React は Component を入れ子にしてアプリケーションを組み立てます

props と state
--------------

* props:

  * Component に対する入力、親 Component から子 Component に渡される(降ろされる) もの
  * props は読み込み専用、変更してはいけない

* state:

  * Component 自体が持つ「状態」

    * ユーザが入力中のテキストや、チェックボックスがチェックされているかどうかの判定、データの読み込みが完了したかどうかの情報などが「状態」に該当する。

  * props とは異なり、 state は変更可能。
  * React では state を変更することで、外部データやユーザの入力内容を Component に反映して行く
  * state を変更する場合は、必ず ``this.setState()`` を利用する
  * React では、classのプロパティを自由に追加できることになっている。
  * プロパティとして管理するか state にするかは、 ``render()`` の中で利用するかどうかで判断する

    * ``render()`` の中で利用する場合: state  <= fumi23: 外に出ていくやつ?
    * そうでない場合: はプロパティとして管理する <= fumi23: 中だけで使うやつ?


Component ライフサイクル
-------------------------

ライフサイクル: 「 Component がマウントされたとき」や「 Component が props (読み取り専用のやつ) を受け取るとき」といった Component の状態の推移のこと

* ライフサイクルのわかりやすい図: https://reactjs.org/docs/react-component.html#the-component-lifecycle
* ``componentDidMount()``: Component がマウントされたときに一度だけ実行される

  * DOM が存在していることを前提とする処理を記述する
  * Bootstrap のような CSSフレームワークを利用する場合にしばしば必要となるHTML要素に対する初期化処理はここでやると良い
  * イベントリスナーの定義
  * 外部から HTTP リクエストでデータを取得する処理の呼び出し

* ``componentWillUnmount()``: Component がアンマウントされるときに実行される

  * アンマウントはたとえば SPA においてページ遷移が発生した際に、レンダリング中の Component がレンダリング対象から外れた場合に発生する
  * タイマーの解除
  * 非同期通信のキャンセル処理
  * イベントリスナーの解除

* ``componentWillReceiveProps()``: Component が props を受け取るとき

  * マウントされた Component が新しい props を受け取るときに実行される
  * 「新しく受け取る」 props を引数に取る
  * 現在の props の内容と、新しく受け取る props の内容を比較して処理を分岐できる

    .. code-block:: javascript

      // 例
      public componentWillReceiveProps(nextProps) {
        if(this.props.hoge !== nextProps.hoge) {
          //props.hogeが変更された場合の処理
        }
      }

* ``componentDidUpdate()``: Component がアップデートされたとき (props や state が変化した場合) に実行される

  * 変更前の props と state を引数に取る
  * ``componentWillReceiveProps()`` と同様、変更前と変更後の値を比較して処理を分岐できる
  * 初回マウント時には実行されない (初回は ``componentDidMount()``)

* ``shouldComponentUpdate()``: Component のパフォーマンス改善に

  * 更新後の props と 更新後の state を引数に取る
  * React の Component では、 props や state が変更された場合、再レンダリング = ``render()`` の再実行が発生する
  * ``shouldComponentUpdate()`` を利用すると、再レンダリングの有無を制御できます。
  * ``shouldComponentUpdate()`` が true を戻した場合は再レンダリングが行われ、 false を戻した場合は再レンダリングが行われない。
  * 不必要な再レンダリングを抑制できる

* ``componentDidCatch()``: 子（あるいは子以下の） Component で発生した例外を catch した場合に実行される

  * Componentのいずれかの場所で例外が発生した場合にログを送信したり、エラーメッセージをレンダリングするといった共通処理を行うのに適したメソッド。
  * 公式例: https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html

その他
======
* スターターキット (ボイラテンプレートツール)

  * create-react-app
  * react-starter-kit
  * react-firebase-starter

* フルスタックフレームワークではないので、本格的なアプリケーションを実装する際はサードパーティパッケージと組み合わせて利用する

  * https://github.com/enaqx/awesome-react
  * https://github.com/brillout/awesome-react-components
