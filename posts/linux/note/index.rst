.. title: いろいろメモ
.. tags: linux
.. date: 2019-06-11
.. slug: index
.. status: draft


メールのログ
============

一般的にメールのログは `/var/log/mail.log` にある
-- 検証用にローカルVMにpostfixを建てるなどした場合は、localhostの `/var/log/mail.log` にログがある
- なにかしらのサーバーログを見たい場合はとりあえず (`sudo journalctl`) あたりでみる (`/var/log/syslog` でもok)


SELinux
============
*
* ちなみにSELinuxで拒否されたときのログは `/var/log/audit/audit.log` にあるのでみると参考になるかも

環境変数
========

環境変数の一覧を表示する
------------------------

.. code-block:: console

  $ printenv


環境変数を追加する
------------------

やりかたがわからない


本体がどこに行ったかわからなくなったとき
========================================

.. code-block:: console

  $ which python
