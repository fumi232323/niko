.. title: Docker Compose で Django/PostgreSQL 環境をつくる
.. tags: docker
.. date: 2018-11-26
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ガイド
======
- `Quickstart: Compose and Django <https://docs.docker.com/compose/django/>`_


リファレンス
============
- `Dockerfile reference <https://docs.docker.com/engine/reference/builder/>`_
- `Compose file version 3 reference <https://docs.docker.com/compose/compose-file/>`_
- https://docs.docker.com/compose/reference/run/


インストール
============
`Install Docker Desktop for Mac <https://docs.docker.com/docker-for-mac/install/>`_


つくりかた
============

1. ``Dockerfile`` を準備する。

    {{% codeblock fff/Dockerfile lexer="docker" %}}


2. ``requirements.txt`` を準備する。

    {{% codeblock fff/requirements.txt lexer="python" %}}


3. ``docker-compose.yml`` を準備する。

    {{% codeblock fff/docker-compose.yml lexer="yaml" %}}


4. startproject する (Docker イメージビルドもされる)

    {{% codeblock startproject.log lexer="bash" %}}


5. ``settings.py`` に DATABASE を定義する。

    .. code-block:: python

        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'postgres',
                'USER': 'postgres',
                'HOST': 'db',
                'PORT': 5432,
            }
        }


6. Docker コンテナ (db と web) を実行する

    {{% codeblock docker-compose-up.log lexer="bash" %}}


7. アクセスする。

    http://localhost:3236/

    {{% figure hello-django.png %}}


8. 実行中の コンテナを list する。

    .. code-block:: bash

      $ docker ps
      CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
      e95174b2be87        fff_web             "python3 manage.py r…"   32 minutes ago      Up 32 minutes       0.0.0.0:3236->8000/tcp   fff_web_1
      2994f0092cd4        postgres            "docker-entrypoint.s…"   41 minutes ago      Up 41 minutes       5432/tcp                 fff_db_1


9. 安全に shutdown する。

    .. code-block:: bash

      $ docker-compose down
