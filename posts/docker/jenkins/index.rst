.. title: Jenkins のなぞ
.. tags: docker
.. date: 2020-09-24
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


なぞ
====

Docker (docker-compose) で動かしている Jenkins から Docker (docker-compose) を動かせるのが不思議だったので調べたメモ

* Jenkins 自体も Docker コンテナ
* Jenkins の Dockerfile あり (こんな感じ↓)

  .. code-block:: docker

    FROM jenkins/jenkins:lts

    # install docker
    USER root
    RUN curl -fL -o docker.tgz "https://download.docker.com/linux/static/test/x86_64/docker-19.03.9.tgz" \
        && tar --strip-components=1 -xvzf docker.tgz -C /usr/bin \
        # dockerグループの ID は環境によって変わるので調べておく
        # cat /etc/group | grep docker
        # docker グループ作成, グループID==999
        && groupadd -g 999 docker \
        # docker グループに jenkins ユーザーを追加してる
        && gpasswd -a jenkins docker

    RUN apt update && \
        apt install -y python-pip && \
        pip install docker-compose
    USER jenkins

* Jenkins 立ち上げるための docker-compose.yml もあり (こんな感じ↓)

  .. code-block:: yaml

    version: '3'

    services:
      jenkins:
        build:
          context: .
        restart: always
        ports:
          # コンテナ外にポート開放してる
          - 2323:8080
        privileged: true
        environment:
          # https://github.com/jenkinsci/docker/blob/master/README.md#configuring-reverse-proxy
          JENKINS_OPTS: '--prefix=/jenkins'
        volumes:
          # volume 使ってる、じゃないと down したら workspace 消えちゃうからね
          - jenkins_home:/var/jenkins_home
          # ここがみそだ!
          # ホストの dockerデーモンが使用しているソケット (/var/run/docker.sock) をマウントして
          # jenkins からアクセスできるようにしている
          - /var/run/docker.sock:/var/run/docker.sock
    volumes:
      jenkins_home:
        # Compose の外ですでに作成済みの volume なんだぜ
        external: true

* Jenkins 画面の URL はこんな感じ: http://our.web.application:2323/jenkins
* workspace はこんな感じ: /var/jenkins_home/workspace/our_app

  * これは jenikins コンテナの中だった
  * ここにコードがある
  * Jenkins ジョブのビルド開始時に workspace は削除される (そういう設定にしている)

* ジョブ自体は、

  * GitHub のリポジトリからアプリを clone してきて、
  * Docker イメージを build して、
  * アプリ起動している (docker-compose up --build している)
  * 本番は gunicorn なので

* これだ! https://www.mmj.ne.jp/mmjblog/docker-on-jenkins/

  * ホストの docker デーモンを共有しているので、 docker (jenkins) から自分達の services が docker-compose up できているわけだ
  * ありがとうございました

* これもありがとうございます: https://techblog.recochoku.jp/1544
* https://github.com/jenkinsci/docker/blob/master/README.md
