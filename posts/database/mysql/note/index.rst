.. title: MySQL のメモ
.. tags: mysql, database
.. date: 2019-04-30
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス
============

- `MySQL 8.0 Reference Manual <https://dev.mysql.com/doc/refman/8.0/en/>`_
- `Chapter 25 INFORMATION_SCHEMA Tables <https://dev.mysql.com/doc/refman/8.0/en/information-schema.html>`_
- `4.5.4 mysqldump <https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html>`_
- `12.21 Window Functions <https://dev.mysql.com/doc/refman/8.0/en/window-functions.html>`_


ログイン
========

.. code-block:: bash

  # ログイン
  $ mysql -u user_name -D db_mame -p


データベース情報
================

.. code-block:: mysql

  -- データベース一覧
  SHOW DATABASES;

  -- データベースの切り替え
  USE db_mame;

.. code-block:: mysql

  -- 現在の Character Sets 設定を表示する
  SHOW VARIABLES LIKE "char%";

  -- 現在のタイムゾーン設定を表示する
  SHOW VARIABLES LIKE '%time_zone%';

  -- 現在の状態を表示する
  STATUS;

.. code-block:: mysql

  -- データサイズを確認する
  -- https://dev.mysql.com/doc/refman/8.0/en/tables-table.html
  SELECT
    SUM(data_length) / 1024 / 1024 / 1024 AS db_size_gb,
    SUM(data_length) / 1024 / 1024 AS db_size_mb,
    SUM(data_length) / 1024 AS db_size_kb
  FROM
    information_schema.tables
  WHERE
    table_schema = 'mmm'
  ;


テーブル情報
============

.. code-block:: mysql

  -- テーブル一覧
  SHOW tables;

  -- テーブルの列一覧
  SHOW COLUMNS FROM table_name;

  -- テーブル定義を確認する
  DESC table_name;
  SHOW FULL COLUMNS FROM table_name;
  SHOW CREATE TABLE table_name;


INDEX
=====

.. code-block:: mysql

  -- テーブルの INDEX 一覧
  SHOW INDEX FROM table_name;

  -- インデックス作成
  ALTER TABLE table_name ADD INDEX index_name(index_col_name1, index_col_name2, ...);
  -- インデックス削除
  ALTER TABLE table_name DROP INDEX index_name;

  /* インデックスヒント */
  -- インデックスを指定
  SELECT * FROM table1 USE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

  -- インデックスを強制
  SELECT * FROM table1 FORCE INDEX (col1_index,col2_index)
  WHERE col1=1 AND col2=2 AND col3=3;

  -- 指定したインデックスを無視
  SELECT * FROM table1 IGNORE INDEX (col3_index)
  WHERE col1=1 AND col2=2 AND col3=3;

https://dev.mysql.com/doc/refman/5.7/en/index-hints.html


CACHE
=====

.. code-block:: mysql

  -- クエリキャッシュクリア
  RESET QUERY CACHE;

  -- キャッシュ状態確認
  SHOW STATUS LIKE 'Qcache%';


dump
====

.. code-block:: bash

  # dump を作る
  $ mysqldump -u root -p db_mame > dump_filename.sql

  # dump を入れる
  $ mysql -h localhost -u root -p db_mame < dump_filename.sql


便利
====

.. code-block:: mysql

  -- 拡張表示
  SELECT * FROM users WHERE login = 'fumi23'\G


おぼえがき
==========
- Window 関数は 8.0.2 から利用可能

  - `MySQL 8.0.2: Introducing Window Functions <https://mysqlserverteam.com/mysql-8-0-2-introducing-window-functions/>`_

* MySQL 8.0.4 からデフォルトの認証 plugin のデフォルト値が mysql_native_password から caching_sha2_password へ変更になった

  - `default-authentication-plugin=mysql_native_password について </docker/create-django-env-with-docker-compose-mysql-2/#default-authentication-plugin-mysql-native-password>`_

* Database Character Set and Collation

  * https://dev.mysql.com/doc/refman/5.7/en/charset-database.html

    * CREATE TABLE 時、指定しないとデータベースの Character Set と Collation が使われる
    * LOAD DATA 時、指定しないとデータベースの Character Set と Collation が使われる
