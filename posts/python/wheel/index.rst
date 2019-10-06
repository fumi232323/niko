.. title: wheel
.. tags: python
.. date: 2019-10-06
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


wheel
=====
- wheel: ビルド済みの C 拡張や Python パッケージのみを含み、ファイルを展開するだけでインストールが完了する

  - Python の公式バイナリパッケージは wheel 形式 (PEP491)
  - pip コマンドは、 wheel 形式を優先して利用する
  - pip は、 PyPI にアップロードされている wheel 形式のパッケージを直接インストールできる

    .. code-block:: console

      $ pip install django==1.11.15

  - https://pythonwheels.com/ : 定番パッケージの wheel 配布状況を確認できる

- sdist : パッケージのソース、メタデータ、ビルド方法などをアーカイブしたソース配布形式

  - インストールのたびに各環境でアーカイブに同梱される setup スクリプトを読み込み、 C 拡張があればビルドし、必要があれば
    Python パッケージを確認して、 site-packages へコピーする


インストール
--------------

.. code-block:: bash

  $ pip install wheel


wheel の作り方
--------------
* PyPI で sdist で配布されているパッケージを wheel 形式のパッケージに変換してローカルに保存する。

  .. code-block:: bash

    # wheelhouse ディレクトリに wheel 形式パッケージを作成する
    $ pip wheel markupsafe -w wheelhouse

  - ``wheelhouse`` ディレクトリがなくても、 ``-w wheelhouse`` を指定すると勝手に作ってくれる
  - wheel 形式のパッケージの保存ディレクトリ名は何でもよいが、慣習的に ``wheelhouse`` という名前を使う


* ``setuptools`` ベースのプロジェクトから wheel を作成する

  .. code-block:: bash

    $ python setup.py bdist_wheel

  * Python のパッケージングには setup スクリプトが必要 (PyPro3 P.66)

    * setup.py というファイル名で用意する (Python の仕様で決められている)
    * setup.py には Python パッケージ情報 (メタデータ: パッケージ名やバージョン, 依存パッケージなど) を書く

  * setuptools は pip が使える環境には必ずインストールされているライブラリ

    * 一般的には setuptools が提供する機能拡張された setup 関数を使う

    .. code-block:: python

      # 詳しくは PyPro P.70 を見よ
      from setuptools import find_packages, setup


      setup(
          name="hey",
          version='1.2.3',
          packages=find_packages(),
          include_package_data=True,
          install_requires=['Django>=2.1'],
      )


ガイド/リファレンス
--------------------
* Python プロフェッショナルプログラミング 第3版 P.66, P.70
* Python プロフェッショナルプログラミング 第3版 P.256 - P.259
* https://wheel.readthedocs.io/en/latest/user_guide.html
* https://setuptools.readthedocs.io/en/latest/
