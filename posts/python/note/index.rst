.. title: Python のメモ
.. tags: python
.. date: 2019-04-20
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス
=============
- `頭文字別索引: <https://docs.python.org/ja/3/genindex.html>`_
- `Pythonモジュール索引 <https://docs.python.org/ja/3/py-modindex.html>`_
- `組み込み関数 <https://docs.python.org/ja/3/library/functions.html#built-in-functions>`_
- `Python 標準ライブラリ <https://docs.python.org/ja/3/library/index.html>`_


いろいろ
========

ローカルに HTTP サーバーを立てる
--------------------------------

`http.server --- HTTP サーバ <https://docs.python.org/ja/3/library/http.server.html>`_

.. code-block:: python

  # ポートを指定 (現在のディレクトリのファイルを提供)
  $ python -m http.server 8000
  # バインドするアドレスを指定 (現在のディレクトリのファイルを提供)
  $ python -m http.server 8000 --bind 127.0.0.1
  # ファイルを提供するディレクトリを指定
  $ python -m http.server --directory /tmp/


ユーザー定義例外
----------------

`8.5. ユーザー定義例外 <https://docs.python.org/ja/3.7/tutorial/errors.html#user-defined-exceptions>`_

- Exception クラスを、直接または間接的に継承する

  - `BaseException <https://docs.python.org/ja/3/library/exceptions.html#BaseException>`_ : 全ての組み込み例外の基底クラスです。ユーザ定義の例外に直接継承されることは意図されていません (継承には Exception を使ってください)。

- 大抵は、いくつかの属性だけを提供し、例外が発生したときにハンドラがエラーに関する情報を取り出せるようにする程度にとどめる
- だいたいは、標準の例外の名前付けと同様に、 "Error" で終わる名前で定義する
- 複数の別個の例外を送出するようなモジュールを作成する際には、そのモジュールで定義されている例外の基底クラスを作成するのが一般的なプラクティス


interface 使いたい
------------------

抽象基底クラス
^^^^^^^^^^^^^^^

* 抽象基底クラス: https://docs.python.org/ja/3/library/abc.html
* collections.abc: https://docs.python.org/ja/3/library/collections.abc.html#module-collections.abc

  * ``Container`` とか ``Iterable`` とか ``Hashable`` とか...

* abstract base class: https://docs.python.org/ja/3/glossary.html#term-abstract-base-class
* エキスパートPythonプログラミング改訂2版:

  * P.478: インターフェース
  * P.483: 関数アノテーションや抽象基底クラスを使用する
  * P.490: collections.abc を使用する


.. code-block:: python

  from abc import ABCMeta, abstractmethod


  class Pushable(metaclass=ABCMeta):
      @abstractmethod
      def push(self, x):
          """何でも push"""

      @classmethod
      def __subclasshook__(cls, subclass):
          # これを実装しておくと、暗黙的にインターフェイスを実装しているインスタンスも
          # インターフェイスのインスタンスだと確認できる
          if cls is Pushable:
              if any('push' in B.__dict__ for B in subclass.__mro__):
                  return True
          return NotImplemented


  class HeyPushable(Pushable):
      def push(self, x):
          print(f'Hey {x} push.')


  class HoyPushable(Pushable):
      def pull(self, x):
          print(f'Hoy {x} pull.')


  class PoyPushable:
      def push(self, x):
          print(f'Poy {x} push.')


  class NyaPushable:
      def pull(self, x):
          print(f'Nya {x} pull.')


  class HeyHeyPushable(Pushable):
      def push(self, x, y):
          # 引数違いも互換性ありとみなされる
          # (PyCharm では警告出る)
          print(f'Hey hey {x}, {y} push.')


.. code-block:: python

  >>> hey = HeyPushable()
  >>> isinstance(hey, Pushable)
  True
  >>> hey.push('husky')
  Hey husky push.

  >>> hoy = HoyPushable()
  Traceback (most recent call last):
    File "<console>", line 1, in <module>
  TypeError: Can't instantiate abstract class HoyPushable with abstract methods push

  >>> poy = PoyPushable()
  >>> isinstance(poy, Pushable)
  True

  >>> nya = NyaPushable()
  >>> isinstance(nya, Pushable)
  False

  >>> heyhey = HeyHeyPushable()
  >>> heyhey.push('husky', 'shiba')
  Hey hey husky, shiba push.


Protocol
^^^^^^^^

* Simple user-defined protocols: https://mypy.readthedocs.io/en/latest/protocols.html#simple-user-defined-protocols
* class typing.Protocol: https://docs.python.org/ja/3/library/typing.html#typing.Protocol


defaultdict
-----------
リストの初期化が不要になる！

- `defaultdict オブジェクト <https://docs.python.org/ja/3/library/collections.html#defaultdict-objects>`_
- `defaultdict の使用例 <https://docs.python.org/ja/3/library/collections.html#defaultdict-examples>`_


どんどん足してくやつ
--------------------
`functools.reduce <https://docs.python.org/ja/3/library/functools.html#functools.reduce>`_


StringIO().seek(0)
------------------
https://docs.python.org/ja/3/library/io.html#io.IOBase.seek

- 先頭にもどす、 (カーソルを先頭に戻すみたいなイメージ)


yield dict(zip(columns, data))
------------------------------

.. code-block:: python

  # これは、
  for column, value in zip(columns, data):
      row_dict[column] = value
      yield row_dict

  # こう書ける。
  yield dict(zip(columns, data))


- ``zip`` はタプルのイテレータを返す -> タプルから辞書を作れる
- ``dict(iterable, **kwarg)``
- https://docs.python.org/ja/3/library/stdtypes.html#dict

  * それ以外の場合、位置引数は iterable オブジェクトでなければなりません。iterable のそれぞれの要素自身は、ちょうど 2 個のオブジェクトを持つイテラブルでなければなりません。それぞれの要素の最初のオブジェクトは新しい辞書のキーになり、2 番目のオブジェクトはそれに対応する値になります。同一のキーが 2 回以上現れた場合は、そのキーの最後の値が新しい辞書での対応する値になります。


シーケンスのアンパッキング
--------------------------
`タプルとシーケンス <https://docs.python.org/ja/3/tutorial/datastructures.html#tuples-and-sequences>`_


if __name__ == "__main__"
-------------------------
http://blog.pyq.jp/entry/Python_kaiketsu_180207

- Pythonでは、インポートされたファイルの中身は実行される


組み込み型と名前が被った場合
----------------------------
``in`` や ``int`` など、キーワード・組み込み型と同じ名前を変数名にしたい場合は、末尾に ``_`` を付ける。


組み込み関数
============

isinstance(object, classinfo)
------------------------------
https://docs.python.org/ja/3/library/functions.html#isinstance

* 継承を考慮してくれる
* classinfo には複数指定できる (タプルで)

all(iterable)
-------------
`all(iterable) <https://docs.python.org/ja/3/library/functions.html#all>`_

- iterable の全ての要素が真ならば (もしくは iterable が空ならば) True を返す。


``sorted(iterable, *, key=None, reverse=False)``
--------------------------------------------------

`sorted <https://docs.python.org/ja/3/library/functions.html#sorted>`_

- `タプル型 (tuple) <https://docs.python.org/ja/3/library/stdtypes.html#tuples>`_ : ``タプルはイミュータブルなシーケンス`` なので、 ソートできる。

.. code-block:: python

  # これは、
  summary_list = list(summary_dict.values())
  summary_list.sort(key=lambda x: x['sort_key'])

  # ``sorted`` という関数を使って以下のように書ける。
  summary_list = sorted(summary_dict.values(), key=lambda x: x['sort_key'])


  # さらに、for文をこんなふうに書くと ``summary_list`` を作る工程が不要。
  for _, summary in sorted(summary_dict.items()):
      # ....


@property
---------
https://docs.python.org/ja/3/library/functions.html#property

* ``@property`` デコレータ を付けると、プロパティのように呼び出せる。
* 同じ名前のまま 読み出し専用属性の ``getter`` にしてくれる

  .. code-block:: python

    # 付けるとき
    @ property
    def husky(self):
        return self.access_datetime.strftime('%Y/%m/%d %H')


  .. code-block:: python

    # 呼び出すとき
    xxx.husky


正規表現
========

バックスラッシュ感染症
----------------------
`バックスラッシュ感染症 <https://docs.python.org/ja/3.7/howto/regex.html#the-backslash-plague>`_

.. code-block:: python

  # こんなふうに書く
  r"ab*"

- ``r`` を文字列リテラルの先頭に書くことでバックスラッシュは特別扱いされなくなる
- 多くの場合 Python コードの中の正規表現はこの raw string 記法を使って書かれる


正規表現のグループ化機能
------------------------
`取り出さないグループと名前つきグループ <https://docs.python.org/ja/3.7/howto/regex.html#non-capturing-and-named-groups>`_


re.MatchObject.groupdict
------------------------
https://docs.python.org/ja/3/library/re.html#re.Match.groupdictgroupdict

- マッチの、すべての 名前つきの サブグループを含む、サブグループ名でキー付けされた辞書を返す
- リファレンスのサンプルコードを見ると一目瞭然なので、そちらを見てください


長い正規表現を記述する方法
--------------------------
- カンマ区切り無しで文字列リテラルを複数に分ける: http://docs.python-guide.org/en/latest/writing/style/#line-continuations
- re.VERBOSE オプションを使う: https://docs.python.org/ja/3/library/re.html#re.VERBOSE


Python2
========

unicode と str
--------------

`3.1.3. Unicode 文字列 <https://docs.python.org/ja/2.7/tutorial/introduction.html#unicode-strings>`_

.. code-block:: python

  >>> # -*- coding: utf-8 -*-
  >>> 'ふみ' == u'ふみ'
  False
  >>> 'fumi23' == u'fumi23'
  True
  >>>

- python2 の場合、マルチバイトを含むと ``u`` の有無で違うオブジェクトとして判定される。
- python2の文字には ``unicode`` と ``str`` がある。 ascii 文字しか含まない場合は 同じ値と判断されるけど基本的に別物として考えたほうがいい。


coding: utf-8
-------------
ソースコードの文字エンコーディングを指定する

.. code-block:: python

  # -*- coding: utf-8 -*-

- ファイルの先頭に記述する
- 記述しないと、 Python2 環境かつファイルにマルチバイトが含まれていると ``SyntaxError`` が発生する。
- Python3 環境では不要
