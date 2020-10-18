.. title: Mac のメモ
.. tags: mac
.. date: 2018-11-19
.. updated: 2020-04-28
.. slug: index
.. status: published


font
====

``.ttf`` という拡張子のファイルが取得できた場合は、以下へ移動するだけ

.. code-block:: console

  $ mv xxx*.ttf ~/Library/Fonts/.

※もしかしたらもう1ステップ何かやるのかもしれない.. (VSCode に他所から持ってきた font を追加するのは↑だけでできた)


ファイル操作
============

文字コードを変換
----------------

.. code-block:: console

  $ iconv -f Shift-JIS -t UTF-8 <変換前のファイル名> <変換後のファイル名>


.gz に圧縮
----------

.. code-block:: console

  $ gzip <ファイル名>


環境変数
========

一覧表示する
--------------

.. code-block:: console

  $ printenv


追加する
--------

.. code-block:: console

  $ export AWS_ACCESS_KEY_ID=XXXXXXXXX
  $ export AWS_SECRET_ACCESS_KEY=XXXXXXXXX
  $ export AWS_SESSION_TOKEN=XXXXXXXXX

削除する
--------

.. code-block:: console

  $ unset AWS_ACCESS_KEY_ID
  $ unset AWS_SECRET_ACCESS_KEY
  $ unset AWS_SESSION_TOKEN


本体がどこに行ったかわからなくなったとき
========================================

.. code-block:: console

  $ which python
