.. title: Git の設定まとめ
.. tags: git
.. date: 2018-09-20
.. slug: index
.. status: published


いろいろ
========

- git の config ファイル

  * ~/.gitconfig

- コミットメッセージのテンプレートを設定できるファイル

  * ~/.stCommitMsg

- グローバル (たぶん Mac のユーザー単位) に gitignore したいものを書けるファイル

  * ~/.gitignore_global
  * ~/.gitconfig に以下を記述

    .. code-block:: ini

      [core]
        excludesfile = /path/to/userhome/.gitignore_global


- エディタに Vim に設定する

  .. code-block:: console

    $ git config --global core.editor 'vim -c "set fenc=utf-8"'

- git status で日本語のファイル名をちゃんと出す

  .. code-block:: console

    $ git config --global core.quotepath off

- 現在の設定を確認する

  .. code-block:: console

    $ git config --list