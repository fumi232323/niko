.. title: React Hooks
.. tags: javascript
.. date: 2020-08-02
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

* https://ja.reactjs.org/docs/hooks-intro.html
* https://ja.reactjs.org/docs/hooks-overview.html
* https://ja.reactjs.org/docs/hooks-state.html
* https://ja.reactjs.org/docs/hooks-effect.html
* https://ja.reactjs.org/docs/hooks-rules.html
* https://ja.reactjs.org/docs/hooks-custom.html
* フック API リファレンス: https://ja.reactjs.org/docs/hooks-reference.html


ステートフック
==============

.. code-block:: javascript

  import React, { useState } from 'react';

  function Example() {
    // Declare a new state variable, which we'll call "count"
    // 現在の state の値と、それを更新するための関数とをペアにして返す
    // 引数は state の初期値のみ
    // state はオブジェクトでもそうでなくてもOK
    // 引数として渡された state の初期値は最初のレンダー時にのみ使用される
    const [count, setCount] = useState(0);

    // count が 『state変数』
    // state 変数には好きな名前をつけられる
    // useState は何を返すのか？ => 現在の state と、それを更新するための関数とを、ペアにして返す

    // state が「作成」されるのはコンポーネントの初回レンダー時だけ
    // 通常、関数が終了すると変数は『消えて』しまうけれど、state 変数は React によって保持される

    // 関数内では、`this.state.count` とかせずに、直接 count を使うことができる↓
    // setCount で、 state を更新↓
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }


.. code-block:: javascript

  function ExampleWithManyStates() {
    // Declare multiple state variables!
    // 1つのコンポーネント内で 2 回以上ステートフックを使うことができる
    // React は useState を何度も呼び出す場合は、それらが全てのレンダー間で同じ順番で呼び出されるものと仮定する
    const [age, setAge] = useState(42);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
    // ...
  }


要するにフックとは？
--------------------

* 関数コンポーネントに ``state`` やライフサイクルといった React の機能を ``接続する (hook into)`` ための関数
* フックは React をクラスなしに使うための機能なので、クラス内では機能しない
* React は ``useState`` のような幾つかのビルトインのフックを提供する
* 異なるコンポーネント間でステートフルな振る舞いを共有するために自分自身のフックを作成することもできる


副作用フック
============

副作用のためのフック

* ``副作用 (side-effects)``、あるいは省略して ``作用 (effects)``

  * 外部データの取得や購読 (subscription)、あるいは手動での DOM 更新
  * 他のコンポーネントに影響することがあり、またレンダーの最中に実行することができない

* React が DOM を更新した後で追加のコードを実行したい場合に使う
* クラスコンポーネントにおける ``componentDidMount``, ``componentDidUpdate`` および ``componentWillUnmount`` と同様の目的で使うもの
* React コンポーネントにおける副作用は 2 種類ある

  * クリーンアップコードを必要としない副作用
  * 必要とする副作用


クリーンアップを必要としない副作用
----------------------------------

ネットワークリクエストの送信、手動での DOM 改変、ログの記録、といったものがクリーンアップを必要としない

.. code-block:: javascript

  import React, { useState, useEffect } from 'react';

  function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    // useEffect フックを使うことで、レンダー後に何かの処理をしないといけない、ということを React に伝えられる
    useEffect(() => {
      // Update the document title using the browser API
      // React が DOM を更新した後で、HTML ドキュメントのタイトルを設定する

      // DOM の更新後に呼び出される
      // 非同期的に行われる (useEffect でスケジュールされた副作用はブラウザによる画面更新をブロックしない)
      // 副作用はコンポーネント内で宣言されるので、props や state にアクセスすることが可能
      // デフォルトでは初回のレンダーも含む毎回のレンダー時にこの副作用関数が呼び出される
      document.title = `You clicked ${count} times`;
    });

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }


* 同期的に行う必要がある稀なケース（レイアウトの測定など）のために、``useEffect`` と同一の API を有する ``useLayoutEffect`` という別のフックがある


クリーンアップを有する副作用
----------------------------

例えば何らかの外部のデータソースへの購読をセットアップしたいことがあります。そのような場合、メモリリークが発生しないようにクリーンアップが必要です！

.. code-block:: javascript

  import React, { useState, useEffect } from 'react';

  function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }
      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      // Specify how to clean up after this effect:
      // すべての副作用は、それをクリーンアップするための関数を返すことができる
      // 関数を返した場合、 React はクリーンアップのタイミングが来たらそれを実行してくれる、しゅごい

      // React はコンポーネントがアンマウントされるときにクリーンアップを実行する
      // ひとつ前のレンダーによる副作用を、次回の副作用を実行する前にもクリーンアップする
      return function cleanup() {
        // 名前付き関数でなくともよい、アロー関数でもOK
        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
      };
    });

    if (isOnline === null) {
      return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
  }


副作用のスキップによるパフォーマンス改善
-----------------------------------------

.. code-block:: javascript

  // 再レンダー間で特定の値が変わっていない場合には副作用の適用をスキップするよう、React に伝えることができる
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // Only re-run the effect if count changes

  // useEffect のオプションの第 2 引数として配列を渡す ↑


フックのルール
==============

ルール
--------

1. フックを呼び出すのはトップレベルのみ

   * ループや条件分岐、あるいはネストされた関数内で呼び出してはいけません。
   * これを守ることで、コンポーネントがレンダーされる際に毎回同じ順番で呼び出されるということが保証される

2. フックを呼び出すのは React の関数内のみ

   * フックは React の関数コンポーネントの内部のみで呼び出してください。通常の JavaScript 関数内では呼び出さないでください。

ESLint プラグイン
------------------

↑のルールを強制できる ESLint のプラグイン

* linter plugin : https://www.npmjs.com/package/eslint-plugin-react-hooks
* Create React App ではデフォルトで含まれている

* React はフックが呼ばれる順番に依存している

  * フックへの呼び出しの順番がレンダー間で変わらない限り、React はそれらのフックにローカル ``state`` を割り当てることができる

独自フックの作成
=================

カスタムフックとは、名前が ``use`` で始まり、ほかのフックを呼び出せる JavaScript の関数のことです

* state を用いたロジックをコンポーネント間で再利用できる。
* フックは state を用いたロジックを再利用するものであって、state そのものを再利用するものではない。

  * カスタムフックを使う場所ごとで、内部の state や副作用は完全に分離している

* カスタムフックは、機能というよりはむしろ慣習のようなもの。関数の名前が ``use`` から始まって、その関数が他のフックを呼び出している。
* React のコンポーネントと違い、カスタムフックは特定のシグネチャを持つ必要はありません。
  何を引数として受け取り、そして（必要なら）何を返すのか、といったことは自分で決めることができる。


その他のフック
=================

* ``useContext``
* ``useReducer``
* フック API リファレンス: https://ja.reactjs.org/docs/hooks-reference.html
