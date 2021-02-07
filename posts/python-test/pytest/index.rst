.. title: pytest
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


pytest
======

リファレンス
------------
https://docs.pytest.org/en/latest/

例外のテストはこれ
------------------
https://docs.pytest.org/en/latest/reference.html#pytest-raises

- ``with pytest.raises(RuntimeError) as excinfo:`` の ``excinfo`` には、 `ExceptionInfo <https://docs.pytest.org/en/latest/reference.html#exceptioninfo>`_ が入ってくる
- 例外のインスタンスは、 ``value`` フィールドに入っている

  .. code-block:: python

      with pytest.raises(ListFileError) as e:
          target(list_file).read('201803')

      # assert
      assert e.value.line == 2


parametrize
-----------
``unittest.TestCase`` を継承したテストクラス内では、 ``@pytest.mark.parametrize`` を使えない。


pytest.fixture
--------------
https://docs.pytest.org/en/latest/fixture.html

::

  Test functions can receive fixture objects by naming them as an input argument. For each argument name, a fixture function with that name provides the fixture object. Fixture functions are registered by marking them with @pytest.fixture.

fixture のスコープと実行順序
----------------------------

https://docs.pytest.org/en/latest/fixture.html#order-higher-scoped-fixtures-are-instantiated-first

* デフォルトは function
* ``autouse=True`` すると、引数に与えなくても自動で実行される

  * スコープは function
  * 同じスコープのほかの fixture の前にインスタンス化される

Temporary directories and files
--------------------------------
http://doc.pytest.org/en/latest/tmpdir.html#the-tmpdir-fixture

* 一時ディレクトリやファイルの fixture がある
* こんな感じで使う、便利

.. code-block:: python

  # settings fixture 経由で storage の path を pytest の tempdir fixture の path に置き換える
  def test_csv(self, target, settings, tmpdir):  # <- settings fixture と tmpdir fixture を受け取る
      settings.MEDIA_ROOT = tmpdir               # ダウンロードファイル出力先を置換

      # ...
      # これで、ファイルのパスがとれる
      p = tmpdir.join(output_file_path)          # <- output_file_path はファイル名とか


pytest-django
===============
https://pytest-django.readthedocs.io/en/latest/index.html

* pytest-django is a plugin for pytest that provides a set of useful tools for testing Django applications and projects.
* Django アプリとプロジェクトのテストに便利な pytest のプラグイン

settings の fixture がある
---------------------------
https://pytest-django.readthedocs.io/en/latest/helpers.html#settings


テストデータベースのオプション
------------------------------
https://pytest-django.readthedocs.io/en/latest/database.html

:``--reuse-db``: テストデータベースを再利用する

  * テストDB が存在しない場合は migration ファイルから新規作成する
  * テスト完了後にテストDB を削除しない
  * テストDB がすでに存在する場合はそのテストDB を使ってテストする
  * migration file を追加した場合は勝手に適用されたりはしないので、テストDB 作り直してね

:``--create-db``: テストデータベースを強制的に新規作成する

  * migration ファイルからテストDB を新規作成する

:``--nomigrations``: Disable Django migrations

  * 最新のモデル定義からテストDB を作成するよ
  * 場合によっては、テストDB の準備がものすごく速くなる (今の案件では 10 分くらい速くなった)
  * テストDB作成に migration ファイルが使われないので、migration ファイルの正当性は検証できないので注意


pytest-freezegun
================
https://pypi.org/project/pytest-freezegun/

pytest で freezegun が便利に使える
