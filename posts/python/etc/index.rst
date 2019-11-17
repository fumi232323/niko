.. title: Python いろいろメモ
.. tags: python
.. date: 2018-10-29
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


エキスパートPythonプログラミング改訂２版
=========================================
* 辞書型に明示的な名前をつける: P.162

  .. code-block:: python

    # 例えば dict が名前をキーにしてその人の住所を保持する場合には ``person_address``
    # これずっと悩んでた!!
    person_address = {
        'Bill': '6565 Monty Road',
        'Pamela': '45 Python street',
    }

* 汎用性の高い名前を避ける: P.163

  * 関数名やクラス名では避けたほうが良いでしょう

    * Manager
    * Object
    * Do, handle または perform

* クラス名: P.169

  * 名前からクラスが何をするのかが十分に理解できるように簡潔で的確な名前にする
  * その型やその特性について伝える接尾辞を使用する

    * SQLEngine
    * MineTypes
    * StringWidget
    * TestCase

  * 基底クラスのクラス名には ``Base`` や ``Abstract``

    * BaseCookie
    * AbstractFormatter

  * クラスの属性と一貫性を保つ

    .. code-block:: python

      SMTP.smtp_send()  # 主語が重複していて冗長!! ですよね!!
      SMTP.send()  # Good

* モジュール名とパッケージ名: P.170

  * モジュールやパッケージの名前は、中に含まれる関数やクラスが持っている目的が伝わるような名前にする
  * underscores のない lowercase 形式の短い名前にしましょう

    * sqlite
    * postgres
    * sha1


rundeckrun
==========
Python コードから Rundeck を操作できる: https://rundeckrun.readthedocs.io/en/latest/index.html

autopep8
========
`autopep8 automatically formats Python code to conform to the PEP 8 style guide.` : https://pypi.python.org/pypi/autopep8
