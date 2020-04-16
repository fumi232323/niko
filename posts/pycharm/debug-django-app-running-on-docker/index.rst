.. title: docker-compose で動かしている Django アプリケーションを PyCharm で Dubug する
.. tags: pycharm
.. date: 2020-04-16
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ガイド
======
- `実行/デバッグ構成: Django サーバー <https://pleiades.io/help/pycharm/run-debug-configuration-django-server.html>`_


実行/デバッグ構成を作成する
===========================

1. Run -> Edit Configurations...

    {{% figure RunEditCofigurations.png %}}

2. Run/Debug Configurations -> ``+`` ボタン -> Django server


    {{% figure ChooseDjangoServer.png %}}

    * ずっと ``Docker`` のほうを選ぶんだろうと思っていたけど、違ってた


3. 設定値を書く

    {{% figure RunDebugConfigurations.png %}}

    * Name: 任意の名前
    * Host: ``0.0.0.0``

      * ``127.0.0.1`` とか ``localhost`` だと動かなかった
      * docker-compose.yml 内でこうしているからかもしれない

        .. code-block:: yaml

          command:
            - "python"
            - "fufufu/manage.py"
            - "runserver"
            - "0.0.0.0:8000"

    * Port: ``8000``

      * たぶん docker-compose.yml 内でこうしているからだろう

        .. code-block:: yaml

          ports:
            - "8000:8000"

    * Project: デバッグ対象のプロジェクトを選択する
    * Environment variables: デフォルトに加えて ``;DJANGO_SETTINGS_MODULE=fufufu.settings`` を追記

      * わたしの場合は docker-compose.yml 内でこうしているので、そこからの相対位置を指定する必要があったのだろう (このプロジェクトの settings はコンテナ内だと ``/var/www/fufufu/fufufu`` 配下にある)

        .. code-block:: yaml

          working_dir: "/var/www/fufufu"


    * Python interpreter: デバッグ対象のプロジェクトの interpreter を選択する
    * Path mappings: ローカルのアプリのプロジェクトのパス:コンテナ内のアプリのパス (なくても動くかも)

4. Apply -> OK


デバッグする
============

1. 左上のほうにあるプルダウンで↑で作った「実行/デバッグ構成」選択する

    {{% figure Pulldown.png %}}

2. 虫みたいなマークを押下するとデバッグモードでアプリが起動する

    {{% figure Debug.png %}}

3. あとは、コード上のブレイクしたいポイントに印をつけて、アプリを呼び出す
