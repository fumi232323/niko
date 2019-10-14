.. title: Pycharm の Tox support を使う
.. tags: pycharm
.. date: 2019-10-14
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ガイド/リファレンスなど
========================
* https://pleiades.io/help/pycharm/tox-support.html
* https://stackoverflow.com/questions/19236745/pycharm-pytestrunner-pluginmanager-unexpected-keyword-argument


設定
====

1. Run/Debug Configurations
2. ``+`` ボタン
3. Templates から ``tox`` を選ぶ
4. 必要事項を記入して ``Apply`` => ``OK``

    * Name: 好きな名前
    * Argument: tox に渡す引数

      * 例) ``-- --reuse-db tests/test_views/test_entries.py::TestEntries::test_it -x -vv``

    * Run only environment: 実行したい環境

      * 例) py37, flake8

    * Python interpreter: Project Innterpreter を選択

      * 例) ``Remote Python 3.7.3 Docker Compose (app at [/Users/fumi23/docker-work/fufufu/docker-compose.yml])``

    * Workinng directory: なしでもローカルpathでもリモートpathでも動いた
    * Path mapping: 設定してもしなくても動いた

{{% figure RunDebugConfigTox.png %}}


良いところ
----------
* 各テストケースのログにパッとアクセスできる

  * テストメソッド名を押すと、横にそのテストケースだけのログが出る
  * たくさんスクロールしなくて良い

* 失敗したテストケースだけサクッと実行できる

  * 左側の▶︎丸びっくりボタンを押すだけ

{{% figure Run.png %}}


イマイチなところ
----------------
* BreakPoint で止まらない (いろいろ試したけれど解消できなかった)
* ほかにもできないひとがいるみたい? https://intellij-support.jetbrains.com/hc/en-us/community/posts/360000140764-Pycharm-debugger-doesn-t-stop-at-any-breakpoint
* たぶん、本来はできるんだと思う


注意: pytest のバージョンは以下なら動く
----------------------------------------

* pytest 5.0.1 (2019-07-04)

  * これより新しいバージョンは動かなかった

* PyCharm 2019.2.3 (Professional Edition)
  Build #PY-192.6817.19, built on September 25, 2019
