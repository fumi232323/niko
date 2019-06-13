.. title: Docker Compose で Django/PostgreSQL/MySQL 環境をつくろう
.. tags: docker
.. date: 2019-05-01
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス・参考サイト書籍
=============================
ありがとうございました


- Python プロフェッショナルプログラミング第３版 > 01-01 Python のセットアップ

- `ubuntu Docker Official Images <https://hub.docker.com/_/ubuntu>`_

  - ``en_US.utf8`` を ``apt-get`` するくだりを参考にした

    - Ubuntu イメージにはデフォルトで ``C``, ``C.UTF-8``, and ``POSIX`` locales が含まれている、これで UTF-8 locale を使うほとんどのひとには十分なはずだけれども、
    - 足りない場合は、``locales`` package からインストールしてね

- `Best practices for writing Dockerfiles <https://docs.docker.com/develop/develop-images/dockerfile_best-practices/>`_

  - ``RUN`` で ``apt-get`` するときはこうすると良さそう

    - ``apt-get upgrade`` , ``dist-upgrade`` するのは避けよう
    - ``apt-get update && apt-get install -y`` はセットでやろう

      - こうすると、 latest package versions が install できる
      - このテクニックは、 ``cache busting`` として知られているらしい

    - packages はアルファベット順に並べる

      - 重複に気づけるし、後から足したり減らしたりするのが容易になるから

    - 最後に ``rm -rf /var/lib/apt/lists/*`` して apt キャッシュを clean up すると、 image size を減らせる

  - 良い見本

    .. code-block:: docker

      RUN apt-get update && apt-get install -y \
          aufs-tools \
          automake \
          build-essential \
          curl \
          dpkg-sig \
          libcap-dev \
          libsqlite3-dev \
          mercurial \
          reprepro \
          ruby1.9.1 \
          ruby1.9.1-dev \
          s3cmd=1.1.* \
       && rm -rf /var/lib/apt/lists/*


- `Docker development best practices <https://docs.docker.com/develop/dev-best-practices/>`_

  - ``RUN`` で ``apt-get`` するときはこうすると良さそう

    - 2行で書くより、1行で書く
    - 1行で書くと、イメージを小さくできる ( ``layers`` がなんのことなのかはよくわからない)
    - `The first creates two layers in the image, while the second only creates one.`

      .. code-block:: docker

        RUN apt-get -y update
        RUN apt-get install -y python


      .. code-block:: docker

        RUN apt-get -y update && apt-get install -y python


- `くろのて勉強会 > DRF勉強会 (全6回) > djample <https://github.com/righ/djample/>`_
- 現場で使える Django の教科書 > D: Docker でラクラク開発
- `Docker Ubuntu18.04でtzdataをinstallするときにtimezoneの選択をしないでinstallする <https://qiita.com/yagince/items/deba267f789604643bab>`_

  - 途中で何も尋ねてほしくないときは、 ``ENV DEBIAN_FRONTEND=noninteractive`` すると良さそう

- `ModuleNotFoundError: No module named '_ctypes' の解決方法 <https://stackoverflow.com/questions/27022373/python3-importerror-no-module-named-ctypes-when-using-value-from-module-mul/48045929>`_

  - 事前に ``libffi-dev`` パッケージのインストールが必要

- `[Linux]タイムゾーン(Timezone)をUTCから日本標準時(JST)に変更する <https://www.t3a.jp/blog/infrastructure/set-timezone/>`_

  - シンボリックリンクを張り替える
  - ``ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime``

- `2.2. Python のビルド <https://docs.python.org/ja/3/using/unix.html#building-python>`_

  - ``make install`` の代わりに ``make altinstall`` 推奨
  - `警告 make install は python3 バイナリを上書きまたはリンクを破壊してしまうかもしれません。そのため、make install の代わりに exec_prefix/bin/pythonversion のみインストールする make altinstall が推奨されています。` だそうです。


つくりかた
==========

実際には、 PostgreSQL か MySQL かどちらか使うほうのみを生きとする。

構成
-----

.. code-block:: bash

  $ tree fufufu
  fufufu
  ├── Dockerfile-app        # 1. Django プロジェクト作るよう Dockerfile
  ├── Dockerfile-mysql      # 2. MySQL よう Dockerfile
  ├── Dockerfile-postgres   # 3. PostgreSQL よう Dockerfile
  ├── docker-compose.yml    # 4. Composeファイル
  └── requirements.txt      # 5. requirements.txt


設定ファイル
-------------

1. ``Dockerfile-app`` : Django プロジェクトを入れるコンテナ

    {{% codeblock fufufu/Dockerfile-app label="Dockerfile-app" lexer="docker" %}}


2. ``Dockerfile-mysql`` : MySQL を入れるコンテナ

    {{% codeblock fufufu/Dockerfile-mysql label="Dockerfile-mysql" lexer="docker" %}}


3. ``Dockerfile-postgres`` : PostgreSQL を入れるコンテナ

    {{% codeblock fufufu/Dockerfile-postgres label="Dockerfile-postgres" lexer="docker" %}}


4. ``docker-compose.yml`` : Composeファイル

    {{% codeblock fufufu/docker-compose.yml label="docker-compose.yml" lexer="yaml" %}}


5. ``requirements.txt`` : requirements.txt

    {{% codeblock fufufu/requirements.txt label="requirements.txt" lexer="ini" %}}


起動
----

.. code-block:: bash

  $ docker-compose up
  # 再度 image ビルドからやり直したい
  $ docker-compose up --build


つかいかた
==========

app コンテナ
------------

.. code-block:: bash

  # Django プロジェクトのコンテナに入る
  $ docker container exec -it fufufu_app bash
  # Django プロジェクトを作成する
  $ cd /fufufu
  $ /opt/python3.7.3/lib/python3.7/site-packages/django/bin/django-admin.py startproject config .
  # runserver する ( settings.py の ``ALLOWED_HOSTS`` に ``'0.0.0.0'`` を書いておかないと ``DisallowedHost`` になります)
  $ python manage.py runserver 0.0.0.0:8000


MySQL, PostgreSQL コンテナ
--------------------------

.. code-block:: bash

  # MySQL のコンテナに入る
  $ docker container exec -it fufufu_mysql bash
  # MySQL に入る
  $ mysql -u fufufu -D fufufu -p

  # PostgreSQL のコンテナに入る
  $ docker container exec -it fufufu_postgres bash
  # PostgreSQL に入る
  $ psql -U fufufu fufufu


感想
====
- ``Python をソースファイルからビルドしてインストール`` するのは時間がかかる
- Django プロジェクトを作成するのに、venv を作らず、

  - ``/opt/python3.7.3/lib/python3.7/site-packages/django/bin/django-admin.py startproject config .`` じゃなくて、 ``django-admin.py startproject config .`` できる方法ないのだろうか...
  - 手動で ``/opt/python3.7.3/lib/python3.7/site-packages/django/bin/`` に PATH を通せばできるけどそうじゃなくて自動でやってくれないのかな...


その他
======

Python 公式イメージのルーツ
-----------------------------

python:latest, python:3 => buildpack-deps:stretch => debian:stretch

- ubuntu は Debian-based ということだけれど、 Debian と ubuntu はどんな風に違うんだろうなあ
- MySQL, PostgreSQL の公式イメージも Debian (debian:stretch-slim) だった

Docker Hub
^^^^^^^^^^

- `python Docker Official Images <https://hub.docker.com/_/python>`_
- `buildpack-deps Docker Official Images <https://hub.docker.com/_/buildpack-deps>`_

  - `A collection of common build dependencies used for installing various modules, e.g., gems.`

- `Debian Docker Official Images <https://hub.docker.com/_/debian>`_