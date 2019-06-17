.. title: Linux いろいろメモ
.. tags: linux
.. date: 2019-06-16
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


ユーザー/ユーザーグループを確認したい
=====================================

.. code-block:: bash

  # ユーザーの一覧
  $ cat /etc/passwd
  # ユーザー名:暗号化されたパスワード:ユーザーID:グループID:コメント:ホームディレクトリー:ログインシェル（ログインした際、最初に起動するシェル）
  fumi23:x:1061:1001::/home/fumi23:/bin/bash

  # ユーザーグループの一覧
  $ cat /etc/group
  # グループ名:暗号化されたパスワード:グループID:サブグループとして所属しているユーザーアカウントのリスト
  dev:x:1001:


ディスク容量/使用量を確認したい
===============================

.. code-block:: bash

  # ファイルシステムの使用領域と空き領域を表示する
  $ df -h

  # 指定したディレクトリのディスク使用量を表示する
  $ du -sh /path/to/husky


圧縮・展開
===========

.. code-block:: bash

  # 圧縮: 前のはなくなる
  $ gzip husky-dump.sql
  # 展開: 前のはなくなる
  $ gzip -d husky-dump.sql.gz

  # アーカイブと圧縮: 前のはなくならない
  $ tar -cf husky.tar husky
  $ gzip husky.tar
  # 展開: 前のはなくならない
  $ tar -zxvf husky.tar.gz

  # zip 圧縮
  $ zip -r /path/to/husky.zip /path/to/husky
  # zip 展開
  $ unzip /path/to/husky.zip


転送
====

SCP
----
.. code-block:: bash

  # サーバー => ローカル (踏み台サーバーを経由)
  $ scp -r -o "ProxyCommand ssh <ユーザー名>@<踏み台サーバー名> -W %h:%p" <ユーザー名>@<サーバー名>:<転送元: サーバー上のファイルパス> <転送先: ローカルのパス>
  $ scp -r -o "ProxyCommand ssh fumi23@fumidai-server -W %h:%p" fumi23@remote-server:/path/to/fumi23 ~/fumi23

SFTP
-----

.. code-block:: bash

  $ sftp <ユーザー名>@<サーバー名>
  # ローカル => サーバー
  sftp> put husky.tar.gz
  # サーバー => ローカル
  sftp> get husky.tar.gz
  # sftp をおしまいにする
  sftp> quit


サービスの起動/停止とか
========================

.. code-block:: bash

  # 起動
  $ sudo systemctl start mysqld
  # 停止
  $ sudo systemctl stop mysqld
  # 再起動
  $ sudo systemctl restart mysqld
  # ステータス表示
  $ systemctl status mysqld

  # 起動
  $ sudo service nginx start
  # ステータス表示
  $ sudo service nginx status


ls -l
======

.. code-block:: bash

  # . から始まるファイルも全部表示する
  $ ls -la
  # ファイルのパーミッション、所有ユーザ、所有グループ、ファイルサイズ、タイムスタンプ、ファイル名
  -rw-------  1 fumi23 dev   1047  5月 30 16:20 .viminfo
  -rwxr-xr-x  1 root   root 35359  5月 30 12:15 shiba.dog
  drwxrwxr-x  2 fumi23 dev   4096  4月 18 13:38 husky

  # 更新日の新しい順
  $ ls -lt

  # 更新日の古い順
  $ ls -ltr


su
==

.. code-block:: bash

  # ユーザーを指定しないと root に切り替わる
  $ sudo su -

  # ユーザーを  www-data に切り替える
  $ su -l -s /bin/bash www-data


:``-``, ``-l``, ``--login``: 切り替え後のユーザーの設定を使用する

  :``-`` なし: カレントディレクトリも環境変数も、切り替え前ユーザーのものを引き継ぐ
  :``-`` あり: カレントディレクトリも環境変数も、切り替え後のユーザーのデフォルトを使用する、切り替え前ユーザーのものは引き継がない

:-s: 切り替え後のユーザーが使用するシェルを指定できる


sudo
=====

.. code-block:: bash

  $ sudo -iH

:``-H``: 環境変数「HOME」をrootユーザーのホームディレクトリに変更してコマンドを実行する
:``-i``: rootユーザーのデフォルトのシェルをログインシェルとして実行する。コマンドを指定しなかった場合は対話シェルとなる。
:``-u``: コマンドを実行するユーザーを指定する (指定しないと root)

* sudoを実行するには、あらかじめ /etc/sudoers ファイルに権限を与えられるユーザーとコマンドを設定しておく必要がある。


最初に叩くコマンドまとめ
========================

.. code-block:: bash

  # メモリーの使用状況をMバイト単位で表示する
  $ free -m
  # ディストリビューションのバージョンを確認する
  $ cat /etc/redhat-release
  $ ls
  $ pwd
  $ ls /home
  $ df -h
  # パッケージキャッシュの削除
  $ yum clean all
  # パッケージの更新
  $ yum -y update

* これがわかりやすかった:

  * `「yum」を使ったパッケージ管理まとめ【Red Hat Enterprise Linux・CentOS】 <https://linuxfan.info/yum>`_
  * `CentOS、UbuntuなどLinux OSのバージョン確認をするコマンド <https://uxmilk.jp/13610>`_


dev と devel の違い
====================

:python-devel: RedHat (CentOS) 系
:python-dev: Debian (Ubuntu) 系


debconf-utils
=============

* パッケージインストール中の設定に関する質問への返答を、あらかじめ設定しておける

  * インストール中に質問されなくなる
  * 設定しておいた返答が使用される

* インストールを自動化するときに便利


SELinux
========

.. code-block:: bash

  # 有効になっている
  $ sudo getenforce
  Enforcing

  # 無効にする
  $ sudo setenforce 0

  # 無効になっている
  $ sudo getenforce
  Permissive


* SELinux で拒否されたときのログは ``/var/log/audit/audit.log`` にある
* https://qiita.com/rikudai/items/884b203f4a72cfb62c02


メールのログ
============

* 一般的にメールのログは ``/var/log/mail.log`` にある

  * 検証用にローカルVMにpostfixを建てるなどした場合は、localhostの ``/var/log/mail.log`` にログがある

* なにかしらのサーバーログを見たい場合はとりあえず ( ``sudo journalctl`` ) あたりでみる ( ``/var/log/syslog`` でもok)


未整理
======

* source って同じシェル内でコマンド実行するんですけど、 sudo って別のシェルになるんで、 source した結果が引き継がれないんですよね
* top: display Linux tasks
* これはものすごく便利... (ありがとうございました) : https://explainshell.com/
