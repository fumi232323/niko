.. title: article の置きかた
.. tags: miyadaiku
.. date: 2018-07-01
.. slug: index
.. status: published


article の置きかた
==================
- 最初に決めた方がよい。
- 分けないと後々何が何だかわからなくなるらしい。
- 年ごと > カテゴリごとにディレクトリを作る。
- article には、 ``index.rst`` というファイル名をつける。
- article ごとに、 ``canonical_url`` プロパティを設定する。

  e.g. ``contents/2018/sample-article1/index.rst``

  .. code-block:: python

 .. slug: index

- article 本体とそこから参照する画像は同じディレクトリに配置する。
