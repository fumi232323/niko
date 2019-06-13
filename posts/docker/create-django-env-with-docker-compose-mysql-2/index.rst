.. title: Docker Compose で Django/MySQL 環境をつくる その2
.. tags: docker
.. date: 2019-01-20
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス・ガイド・参考書籍
==============================
- `Docker Compose で Django/MySQL 環境をつくる </docker/create-django-env-with-docker-compose-mysql>`_ と同じ
- 現場で使える Django の教科書《基礎編》


環境構築
========

1. 準備
-------

ディレクトリ構成
^^^^^^^^^^^^^^^^

.. code-block:: shell

  $ tree fufu
  fufu
  ├── Dockerfile-mysql
  ├── Dockerfile-web
  ├── docker-compose.yml
  ├── mysql
  │   └── conf.d
  │       └── mysql.cnf
  └── requirements.txt

設定ファイル
^^^^^^^^^^^^^

- Dockerfile-web

  {{% codeblock fufu/Dockerfile-web label="Dockerfile-web" lexer="docker" %}}


- docker-compose.yml

  {{% codeblock fufu/docker-compose.yml label="docker-compose.yml" lexer="yaml" %}}


- mysql.cnf

  {{% codeblock fufu/mysql/conf.d/mysql.cnf label="mysql.cnf" lexer="cfg" %}}


- docker.cnf

  {{% codeblock fufu/mysql/conf.d/docker.cnf label="docker.cnf" lexer="cfg" %}}


- あとの設定ファイルは `Docker Compose で Django/MySQL 環境をつくる </docker/create-django-env-with-docker-compose-mysql>`_ と同じ


2. 最初の1回だけ実行
--------------------

web, db の docker image をビルド -> web で startproject する。 (ログを良く見ると、たぶん db コンテナの起動もしている。)

{{% codeblock startproject.log lexer="bash" %}}


3. 実行後の状態
---------------

.. code-block:: shell

  $ tree fufu
  fufu
  ├── Dockerfile-mysql
  ├── Dockerfile-web
  ├── apps
  │   ├── config
  │   │   ├── __init__.py
  │   │   ├── settings.py
  │   │   ├── urls.py
  │   │   └── wsgi.py
  │   └── manage.py
  ├── docker-compose.yml
  ├── mysql
  │   └── conf.d
  │       └── mysql.cnf
  └── requirements.txt


4. settings に mysql の定義を追記する
-------------------------------------
settings は環境ごとに分けたいので、 ``apps`` 配下に settings ディレクトリを作ってそこ移動する

.. code-block:: bash

  $ tree apps
  apps
  ├── config
  │   ├── __init__.py
  │   ├── urls.py
  │   └── wsgi.py
  ├── manage.py
  └── settings
      └── local.py  # ← ローカル環境用

- settings/local.py

  .. code-block:: python

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'fufu',
            'USER': 'fufu',
            'PASSWORD': 'fufu',
            'HOST': 'db',  # ここは docker-compose ファイルに指定したサービス名でないといけないらしい
            'PORT': 3306,
        }
    }


5. web・db コンテナを起動する
-------------------------------------

.. code-block:: bash

  $ docker-compose up


環境構築メモ
=============
**※1**: default-authentication-plugin=mysql_native_password について
-------------------------------------------------------------------------

- MySQL 8.0.4 からデフォルトの認証 plugin のデフォルト値が ``mysql_native_password`` から ``caching_sha2_password`` へ変更になった
- そのため、 ``default-authentication-plugin`` を指定していない状態で ``caching_sha2_password`` に対応していないクライアント (今回の場合は ``web`` ) から接続しようとすると、
- こんなエラー↓が出て接続できない ( ``docker-compose up`` 時にこうなる)

  {{% codeblock 1_mysql_native_password.log lexer="bash" %}}

- Django から MySQL に接続する際は、 ``caching_sha2_password`` に対応していない ``mysqlclient`` を使っているようなので、それでも接続できるように、
- ``default-authentication-plugin=mysql_native_password`` の指定が必要 (なんだと思う)
- 後から該当ユーザーの ``default-authentication-plugin`` を変更するにはこう↓

  .. code-block:: shell

    ALTER USER 'fufu'
      IDENTIFIED WITH mysql_native_password
      BY 'fufu';


**※2**: skip-host-cache, skip-name-resolve について
-------------------------------------------------------------

- Docker Hub の MySQL 公式イメージ ``mysql:latest`` からコンテナをそのまま起動すると、
- デフォルト状態で ``/etc/mysql/conf.d/docker.cnf`` の ``[mysqld]`` セクションにこのふたつが定義されている

  - 2018/12/29 の Update で追加されたように (?) 見える

- このふたつがないと、こんな感じ↓で延々とエラーになり、 db コンテナが起動できない

  {{% codeblock 2_skip-host-cache.log lexer="bash" %}}

- わたしの場合は、 docker-compose ファイルでこう↓しているので、デフォルト状態では存在した ``/etc/mysql/conf.d/docker.cnf`` を抹殺してしまっている

  .. code-block:: yaml

    volumes:
      - "./mysql/conf.d:/etc/mysql/conf.d"

- しかたがないので、自分の ``mysql.cnf`` に転記することにした
- このふたつがないとどうしてこのエラーになるのかわたしにはわかりません、だって全然関係ないこと言ってるように見えるのに...
- このふたつの説明はここです: https://dev.mysql.com/doc/refman/8.0/en/host-cache.html


使い方メモ
===========

再び image ビルドしたくなったら
-------------------------------

.. code-block:: shell

  $ docker-compose run web django-admin.py startproject config .

とか

.. code-block:: shell

  $ docker-compose run web django-admin.py startproject config .
  $ docker-compose up

したあとに、再び image ビルドしたくなったら、

.. code-block:: shell

  # web をビルド
  $ docker-compose build web

  # db をビルド
  $ docker-compose build db
