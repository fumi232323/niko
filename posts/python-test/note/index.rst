.. title: Python テストのメモ
.. tags: python-test
.. date: 2018-11-08
.. updated: 2021-02-07
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


testfixtures
============

リファレンス
------------
https://testfixtures.readthedocs.io/en/latest/index.html


date と datetime を mock できる
--------------------------------

- https://testfixtures.readthedocs.io/en/latest/datetime.html
- https://testfixtures.readthedocs.io/en/latest/api.html#testfixtures.test_date
- https://testfixtures.readthedocs.io/en/latest/api.html#testfixtures.test_datetime

  - ``test_datetime`` は、 ``datetime.datetime.now()`` にしか効果を及ぼさないので注意!!
  - ``datetime.datetime.today()`` には何の効果もない


※近頃は、freezegun を使うほうが便利でしょう


flake8 3.6 対応がわかりやすい
=============================

https://scrapbox.io/shimizukawa/flake8-3.6.0_に更新したら警告たくさん出てきた


あれこれ
========

3a スタイル
-----------

.. code-block:: python

  # arrange
  # act
  # assert


http://wiki.c2.com/?arrangeactassert (つながらない)


TestPyramid
--------------
UI 寄りのテストは、コストと実行時間が長くなってしまうので、いきなり書かない方がいい

- https://martinfowler.com/bliki/TestPyramid.html


テストターゲットの取得方法
----------------------------
http://pelican.aodag.jp/xiao-guo-de-naunittest-mataha-callfutnomi-mi.html
