.. title: docker-compose で動かしている Django アプリケーションを PyCharm で Dubug する
.. tags: pycharm
.. date: 2020-04-16
.. updated: 2020-10-04
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ガイド/参考書籍
===============
- `実行/デバッグ構成: Django サーバー <https://pleiades.io/help/pycharm/run-debug-configuration-django-server.html>`_


実行/デバッグ構成を作成する
===========================

1. Run -> Edit Configurations...

    {{% figure RunEditCofigurations.png %}}

2. Run/Debug Configurations -> ``+`` ボタン -> ``Django server``


    {{% figure ChooseDjangoServer.png %}}

    * ずっと ``Docker`` のほうを選ぶんだろうと思っていたけど、違ってた


3. 設定値を書く

    {{% figure RunDebugConfigurations.png %}}

    .. list-table::
      :widths: auto
      :header-rows: 1
      :stub-columns: 1

      * - 項目
        - 設定値
        - 説明
      * - Name
        - 任意の名前
        -
      * - Host
        - ``0.0.0.0``
        - - ここが PyCharm が実行する runserver の IP 部分に渡される

          - コンテナ外 (ホストマシンのブラウザなど) からもアクセスしたいので、 ``0.0.0.0`` を指定する

            - ``127.0.0.1`` or ``localhost`` で runserver すると、Django app が動いているコンテナ内からしか接続できない
            - [参考] `自走プログラマー <https://gihyo.jp/book/2020/978-4-297-11197-7>`_ 105: 127.0.0.1 と 0.0.0.0 の違い
      * - Port
        - ``8000``
        - ここが PyCharm が実行する runserver の ポート部分に渡される
      * - Project
        - デバッグ対象のプロジェクトを選択する
        -
      * - Environment variables
        - デフォルトに加えて ``;DJANGO_SETTINGS_MODULE=fufufu.settings`` (settings の場所) を追記
        - - Django の settings.DEBUG を環境変数で指定している場合は、 ``DEBUG=True`` もここで渡せる
          - settings の場所は、 Dockerfile or docker-compose.yml 内で指定した  working_dir からの相対位置を指定する
      * - Python interpreter
        - デバッグ対象のプロジェクトの Remote Python Interpreter を選択する
        -
      * - Path mappings
        - ホスト側のアプリのプロジェクトのパス:コンテナ内のアプリのパス
        - なくても動くかも

4. Apply -> OK


デバッグする
============

1. 左上のほうにあるプルダウンで↑で作った「実行/デバッグ構成」選択する

    {{% figure Pulldown.png %}}

2. 虫みたいなマークを押下するとデバッグモードでアプリが起動する

    {{% figure Debug.png %}}

3. あとは、コード上のブレイクしたいポイントに印をつけて、アプリを呼び出す


PyCharm の docker-compose デバッグの仕組み
============================================

* PyCharm はデバッグ実行時に docker-compose.override.yaml ファイルを自動生成する
* 自動生成した docker-compose.override.yaml で、
  デバッグ対象アプリの Dockerfile/docker-compose ファイルの CMD/command を上書きしてデバッガーを注入している
* Debug 実行時のコンソールをじっと見ていると以下のようなコマンドが実行されていて、

  .. code-block:: console

    /usr/local/bin/docker-compose -f /Users/fumi23/projects/fufufu/docker-compose.yml -f /Users/fumi23/projects/fufufu/docker-compose.override.yml -f /Users/fumi23/Library/Caches/JetBrains/PyCharm2020.2/tmp/docker-compose.override.397.yml up --exit-code-from web --abort-on-container-exit web

* ``/Users/fumi23/Library/Caches/JetBrains/PyCharm2020.2/tmp/docker-compose.override.397.yml`` が
  PyCharm が自動生成した docker-compose.override ファイル
* 中を見てみると、こんな感じになっている↓

  .. code-block:: yaml

    version: "3"
    services:
      app:
        command:
        - "python"
        - "-u"
        - "/opt/.pycharm_helpers/pydev/pydevd.py"
        - "--multiprocess"
        - "--qt-support=auto"
        - "--port"
        - "50596"
        - "--file"
        - "/var/www/fufufu/fufufu/manage.py"
        - "runserver"
        - "0.0.0.0:8000"
        (後略)

* Dockerfile で ENTRYPOINT を定義していて、かつ、その ENTRYPOINT の定義内容がコマンドラインオプションを無視するものになっていると、
  PyCharm が CMD を上書きしてデバッガーを注入できず、デバッグできない状態になってしまうので、注意

  * [参考]

    * PyCharm remote debug times out: https://intellij-support.jetbrains.com/hc/en-us/community/posts/360003328800-PyCharm-remote-debug-times-out
    * Best practices for writing Dockerfiles > ENTRYPOINT: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#entrypoint
