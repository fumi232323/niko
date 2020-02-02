.. title: MySQL のメモ
.. tags: mysql, database
.. date: 2019-04-30
.. updated: 2020-02-02
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
- https://www.mysqltutorial.org/


ログイン
========

.. code-block:: bash

  # ログイン
  $ mysql -h host_name -P port_number -u user_name -D db_mame -p


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
  SELECT
    SUM(data_length) / 1024 / 1024 / 1024 AS db_size_gb,
    SUM(data_length) / 1024 / 1024 AS db_size_mb,
    SUM(data_length) / 1024 AS db_size_kb
  FROM
    information_schema.tables
  WHERE
    table_schema = 'db_name'
  ;

* 25.36 The INFORMATION_SCHEMA TABLES Table: https://dev.mysql.com/doc/refman/8.0/en/tables-table.html
* Chapter 25 INFORMATION_SCHEMA Tables: https://dev.mysql.com/doc/refman/8.0/en/information-schema.html>
* ``information_schema`` はいろいろ便利なものがあるもよう


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

* 13.1.14 CREATE INDEX Statement: https://dev.mysql.com/doc/refman/5.7/en/create-index.html

.. code-block:: mysql

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

* 8.9.4 Index Hints: https://dev.mysql.com/doc/refman/5.7/en/index-hints.html


CACHE
=====

.. code-block:: mysql

  -- クエリキャッシュクリア
  RESET QUERY CACHE;

  -- キャッシュ状態確認
  SHOW STATUS LIKE 'Qcache%';

* 8.10.3 The MySQL Query Cache: https://dev.mysql.com/doc/refman/5.7/en/query-cache.html
* 8.10.3.4 Query Cache Status and Maintenance: https://dev.mysql.com/doc/refman/5.7/en/query-cache-status-and-maintenance.html
* `The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0.` だそうです


dump
====

.. code-block:: bash

  # dump を作る
  $ mysqldump -u root -p db_mame > dump_filename.sql

  # dump を入れる
  $ mysql -h localhost -u root -p db_mame < dump_filename.sql

* 4.5.4 mysqldump — A Database Backup Program: https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html


EXPLAIN
========

.. code-block:: mysql

  -- EXPLAIN: クエリ実行プラン（MySQL がクエリをどのように実行するか）を取得する
  -- DESCRIBE: テーブル構造に関する情報を取得する
  {EXPLAIN | DESCRIBE | DESC}
      tbl_name [col_name | wild]

  {EXPLAIN | DESCRIBE | DESC}
      [explain_type]
      {explainable_stmt | FOR CONNECTION connection_id}

  explain_type: {
      EXTENDED
    | PARTITIONS
    | FORMAT = format_name
  }

  format_name: {
      TRADITIONAL
    | JSON
  }

  explainable_stmt: {
      SELECT statement
    | DELETE statement
    | INSERT statement
    | REPLACE statement
    | UPDATE statement
  }

* 13.8.2 EXPLAIN Statement: https://dev.mysql.com/doc/refman/5.7/en/explain.html
* 8.8.2 EXPLAIN Output Format: https://dev.mysql.com/doc/refman/5.7/en/explain-output.html

  * 出力項目の説明が載っている


便利
====

.. code-block:: mysql

  -- 拡張表示
  SELECT * FROM users WHERE login = 'fumi23'\G

  -- 実行中のスレッドを表示する
  SHOW [FULL] PROCESSLIST
  -- スレッドを終了する
  KILL [CONNECTION | QUERY] processlist_id

* 13.7.5.29 SHOW PROCESSLIST Statement: https://dev.mysql.com/doc/refman/5.7/en/show-processlist.html
* 13.7.6.4 KILL Statement: https://dev.mysql.com/doc/refman/5.7/en/kill.html


おぼえがき
==========

* 8.1 Optimization Overview: https://dev.mysql.com/doc/refman/5.7/en/optimize-overview.html

  * MySQL 最適化のことがいろいろ書いてある
  * 放っておいても (デフォルトでも) MySQL はかなりいろいろやってくれるし、
  * その上で人間ができることも書いてある

- Window 関数は 8.0.2 から利用可能

  - `12.21 Window Functions <https://dev.mysql.com/doc/refman/8.0/en/window-functions.html>`_
  - `MySQL 8.0.2: Introducing Window Functions <https://mysqlserverteam.com/mysql-8-0-2-introducing-window-functions/>`_

* MySQL 8.0.4 からデフォルトの認証 plugin のデフォルト値が mysql_native_password から caching_sha2_password へ変更になった

  - `default-authentication-plugin=mysql_native_password について </docker/create-django-env-with-docker-compose-mysql-2/#default-authentication-plugin-mysql-native-password>`_

* Database Character Set and Collation

  * https://dev.mysql.com/doc/refman/5.7/en/charset-database.html

    * CREATE TABLE 時、指定しないとデータベースの Character Set と Collation が使われる
    * LOAD DATA 時、指定しないとデータベースの Character Set と Collation が使われる
