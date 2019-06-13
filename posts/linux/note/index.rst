.. title: いろいろメモ
.. tags: linux
.. date: 2019-06-11
.. slug: index
.. status: draft



ユーザーの一覧を見たい
======================

.. code-block:: bash

  $ cat /etc/passwd

#. ユーザー名
#. 暗号化されたパスワード
#. ユーザーID
#. グループID
#. コメント
#. ホームディレクトリー
#. ログインシェル（ログインした際、最初に起動するシェル）

ユーザーグループの一覧を見たい
================================

.. code-block:: bash

  $ cat /etc/group

#. グループ名
#. 暗号化されたパスワード
#. グループID
#. サブグループとして所属しているユーザーアカウントのリスト


ファイルシステムのディスク容量を表示する
========================================
$ df -h

指定したディレクトリのディスク使用量を表示する
==============================================
$ du -sh /path/to/husky


ls -la の表示項目
==================
ファイルのパーミッション、所有ユーザ、所有グループ、ファイルサイズ、タイムスタンプ、ファイル名


SELinux
============

# 有効になってる
$ sudo getenforce
Enforcing

# 無効にする
$ sudo setenforce 0
$ sudo getenforce
Permissive

* https://qiita.com/rikudai/items/884b203f4a72cfb62c02
* ちなみにSELinuxで拒否されたときのログは `/var/log/audit/audit.log` にあるのでみると参考になるかも

devel
========
python-devel と python-dev は何が違うか
=> RedHet (CentOS) 系と、Debian (Ubuntu) 系

root ユーザーのなり方
========================
$ sudo su -


圧縮転送展開
============
# 圧縮
$ ssh remote-host
$ sudo su -
$ zip -r /path/to/fumi23/husky.zip /path/to/fumi23/husky
# ディスク使用量確認
$ du -h /path/to/fumi23.zip
# 転送
$ scp -r -o "ProxyCommand ssh fumi23@fumidai -W %h:%p" fumi23@remote-host:/path/to/fumi23 ~/fumi23
# 展開
$ unzip husky.zip

gzip 圧縮・展開
=================
# 圧縮: 前のはなくなる
$ gzip husky-dump.sql
# 展開: 前のはなくなる
$ gzip -d husky-dump.sql.gz


転送 (リモートからローカル)
============================
$ scp -r -o "ProxyCommand ssh fumi23@fumidai -W %h:%p" fumi23@remote-host:/path/to/fumi23 ~/fumi23


-l
===
"-, -l, --login"
シェルをログインシェルにする。すなわち以下のような取り扱いをする: すべての環境変数を解除する。その上で `TERM'、` HOME'、 `SHELL' を前述 のように設定し、` USER'、 `LOGNAME' （スーパーユーザーであっても）を同 じく前述のように設定する。続いて` PATH' をコンパイル時のデフォルト値に 設定する。ディレクトリを user のホームディレクトリに変更する。シェル名の前に `-' を付加し、シェルに ログイン時のスタートアップファイルを読ませる。


* su するときにシェルを指定できる


よくわからぬ
=============

source って同じシェル内でコマンド実行するんですけど、 sudo って別のシェルになるんで、 source した結果が引き継がれないんですよね


debconf-utils
=============

* debconf-utils


free や top
============
free や top でリソース状態をみておくといいかも ( 原因はわからない


最初に叩くコマンド
====================
$ free -m
$ cat /etc/redhat-release
$ ls
$ pwd
$ ls /home
$ df -h
$ yum clean all
$ yum -y update


圧縮とか解凍とか
=================
# (ローカル環境で) アーカイブと圧縮
$ tar -cf husky.tar husky
$ gzip husky.tar
# husky を解凍
$ tar -zxvf husky.tar.gz

sftp
=====

$ sftp <ユーザー名>@<サーバー名>
sftp> put husky.tar.gz
sftp> quit

# 取得する場合は、 get


起動とか
========

起動:	$ sudo systemctl start mysqld
停止:	$ sudo systemctl stop mysqld
再起動:	$ sudo systemctl restart mysqld
ステータス表示:	$ systemctl status mysqld


# 起動
$ sudo service nginx start
# 起動を確認
$ sudo service nginx status


メールのログ
============

一般的にメールのログは `/var/log/mail.log` にある
-- 検証用にローカルVMにpostfixを建てるなどした場合は、localhostの `/var/log/mail.log` にログがある
- なにかしらのサーバーログを見たい場合はとりあえず (`sudo journalctl`) あたりでみる (`/var/log/syslog` でもok)