.. title: Amazon RDS for PostgreSQL から Aurora PostgreSQL への移行
.. tags: aws
.. date: 2021-12-5
.. updated: 2021-12-5
.. slug: index
.. status: published


.. raw:: html

  <details><summary>目次</summary>

.. contents::

.. raw:: html

  </details>


AWS ドキュメントメモ
=====================

AWS ユーザーガイド
------------------

* `PostgreSQL と互換性がある Amazon Aurora にデータを移行する <https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html>`_
* `Amazon Aurora PostgreSQL のエンジンのバージョン <https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Updates.20180305.html>`_

概要
----

* 方法は3つある

  1. スナップショットを使用して RDS for PostgreSQL DB インスタンスを移行する

     * データは、RDS for PostgreSQL DB スナップショットから Aurora PostgreSQL DB クラスターに直接移行できます。
     * 作成された Aurora PostgreSQL DB クラスターには、元の RDS for PostgreSQL DB インスタンスのデータが格納されます。
     * AWS Management Console から移行すると、中身 (データ) を移すだけじゃなく、外身 (DBクラスターと DBインスタンス) もいっしょに作ることができる
     * AWS CLI だと 外身 (DBクラスター, DB インスタンス) => **TODO: ちょっと確認**

  2. Aurora リードレプリカを使用して RDS for PostgreSQL DB インスタンスを移行する
  3. S3 データを Aurora PostgreSQL にインポートする


* 早いうちに、マイナーバージョンの自動アップグレードを無効にしておくべし

  * 近い将来 RDS for PostgreSQL DB インスタンスを Aurora PostgreSQL DB クラスターに移行する予定がある場合は、
    移行計画フェーズの早い段階で DB インスタンスのマイナーバージョンの自動アップグレードを無効にすることを強くお勧めします。
    RDS for PostgreSQL バージョンが Aurora PostgreSQL でサポートされていない場合、Aurora PostgreSQL への移行が遅れる可能性があります。
    Aurora PostgreSQL バージョンについては、 `Amazon Aurora PostgreSQL のエンジンのバージョン <https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Updates.20180305.html>`_
    を参照してください。
  * 移行元の RDS for PostgreSQL のバージョンが、 Aurora PostgreSQL でサポートされていないバージョンの場合、 AWS Management Console の当該メニューが非活性になって、使えない

    * 「スナップショットの移行」「Aurora リードレプリカの作成」メニューが非活性になっているときは、サポート外バージョンであろう


移行手順 覚書き
===============

1. スナップショットを使用して RDS for PostgreSQL DB インスタンスを移行する
--------------------------------------------------------------------------

1. パラメータグループを作っておく
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Aurora の場合、パラメータグループが 2種類ある

* DB クラスターパラメータグループ: ``timezone``, ``lc_monetary``, ``lc_numeric``, ``lc_time`` はこちら (``lc_messages`` もあった)
* DB パラメータグループ: ``lc_messages`` はこちら

.. note:: 参考ドキュメント:

  * AWS ユーザーガイド: `Amazon Aurora PostgreSQL のリファレンス <https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Reference.html>`_
  * AWS ナレッジセンター: `Amazon Aurora DB クラスターのタイムゾーンを変更するにはどうすればよいですか? <https://aws.amazon.com/jp/premiumsupport/knowledge-center/aurora-mysql-change-timezone/>`_


2. DB インスタンスを移行する
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

AWS Management Console からぽちぽちする
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* `AWS ユーザーガイド: RDS for PostgreSQL DB インスタンスの スナップショットを Aurora PostgreSQL DB クラスターに移行する <https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html#AuroraPostgreSQL.Migrating.RDSPostgreSQL.Replica>`_ の通りでとくに迷うところはない

* 「DB インスタンス識別子」は、以下に使われる

  * DB 識別子 (DB クラスター名)

    * ``{ここで入力した DB 識別子}-cluster`` という名前の DB クラスターが作成された (e.g. ``devfumi23-a1-cluster``)
    * エントポイント名はこんな感じ

      * ライターインスタンス: ``devfumi23-a1-cluster.cluster-xxxxxxxxxxxx.ap-northeast-1.rds.amazonaws.com``
      * リーダーインスタンス: ``devfumi23-a1-cluster.cluster-ro-xxxxxxxxxxxx.ap-northeast-1.rds.amazonaws.com``

  * DB インスタンス名

    * ``{ここで入力した DB 識別子}`` という名前の DB インスタンスが作成された (e.g. ``devfumi23-a1``)
    * エンドポイント名はこんな感じ: ``devfumi23-a1.cbagdidnvhla.ap-northeast-1.rds.amazonaws.com``
    * ※リーダーインスタンスもあったらどういう名前になるかはわからない

* 「暗号を有効化」は、このタイミングでないとできない (あとから変更できない) ので注意

  * 移行元スナップショットが 「暗号化: 有効でない」であっても、移行先にはここで「暗号を有効化」にできる


結果イメージ
~~~~~~~~~~~~

{{% figure devfumi23-a1-cluster.png %}}

* DB クラスターはすぐできあがったが、DBインスタンスの作成はだいぶ時間かかる

  * スナップショットは、Djangoチュートリアルその2くらいの状態でレコードもほとんどなかったんだけれど、3時間くらいかかった気がする。

* ぽちぽち中に指定できた ``DB クラスターパラメータグループ``, ``DB パラメータグループ``, ``VPC セキュリティグループ``, ``サブネットグループ`` などなどもちゃんとくっついた
* ``マスターユーザー名``, ``マスターパスワード``, ``DB名`` はスナップショットから引き継がれた

* 移行元スナップショットが 「マルチ AZ: なし」の場合、「ライターインスタンス」のみが作成される

  * => あとから「リーダーインスタンス」を追加する場合は、「データベース」 > 「当該クラスター」 > 「アクション」 > 「リーダーの追加」でできる

    * 「DB インスタンス識別子」は好きにつけられた
    * その他新しく DBインスタンス作るときと同じ感じのものがだいたいは指定できる感じだった
    * リーダーの追加は、何時間もかからなかった。すぐできた。
    * 「リーダーインスタンス」追加後の様子

      {{% figure devfumi23-a1-cluster-ro.png %}}

* エンドポイント: Aurora にはクラスターのエンドポイントと、DB インスタンスのエンドポイントがある

  * どっちからでも RDS と同じように DB 接続できる
  * ライター・リーダー両方ある場合:

    * クラスターのエンドポイント:

      * ライターインスタンス: 書き込み・読み取り両方可
      * リーダーインスタンス: 読み取りのみ

        * 試しに UPDATE かけてみたら、 `[25006] ERROR: cannot execute UPDATE in a read-only transaction`

    * インスタンスのエンドポイント: クラスターのエンドポイントと同様に

      * ライターインスタンス: 書き込み・読み取り両方可
      * リーダーインスタンス: 読み取りのみ

  * ライター しかない場合:

    * クラスターのエンドポイント:

      * ライターインスタンス: 書き込み・読み取り両方可
      * リーダーインスタンス: 書き込み・読み取り両方可

    * インスタンスのエンドポイント:

      * ライターインスタンス: 書き込み・読み取り両方可
      * リーダーインスタンス: -

* `AWS ユーザーガイド: Amazon Aurora DB クラスターへの接続 <https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Connecting.html#Aurora.Connecting.AuroraPostgreSQL>`_

  * クラスターエンドポイント: DB クラスターのプライマリインスタンスに接続

    * クラスターエンドポイントを使用して、読み取りと書き込みの両方のオペレーションを実行できる
    * クラスターエンドポイントは常にプライマリインスタンスをポイントします。
    * プライマリインスタンスが失敗し、置き換えられると、クラスターエンドポイントは新しいプライマリインスタンスをポイントします。

  * DB インスタンスエンドポイント: クラスターの特定の DB インスタンスに直接接続できる

    * それぞれ、クラスターエンドポイントとは別に一意のエンドポイントを持つ


AWS Management Console の、「スナップショットの移行」が非活性の場合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

AWS CLI の ``restore-db-cluster-from-snapshot`` を使って移行できるもよう

* と思ったら、 ``restore-db-cluster-from-snapshot`` はクラスターしか作ってくれないらしい (中の DBインスタンスは移行してくれないらしい)
* だから、AWS のガイドにも AWS CLI の例が載っていなかったのかも...??

=> 一応やってみたが、たしかに DBインスタンスは復元されない

* 試したバージョン: PostgreSQL 11.12、Aurora PostgreSQL リリース 3.6
* コマンド例

  .. code-block:: bash

    # RDS のスナップショットから Aurora DB クラスター を復元
    $ aws rds restore-db-cluster-from-snapshot \
       --db-cluster-identifier devfumi23-a1-c \
       --snapshot-identifier arn:aws:rds:ap-northeast-1:xxxxxxxxxxxx:snapshot:devfumi23-s1 \
       --engine aurora-postgresql \
       --engine-version 11.12 \
       --db-subnet-group-name dev-fumi23-db-subnet-gr-pv \
       --vpc-security-group-ids sg-xxxxxxxxxxxxxxxxx \
       --enable-cloudwatch-logs-exports postgresql \
       --db-cluster-parameter-group-name devfumi23-aurora-postgres11-c \
       --no-deletion-protection \
       --copy-tags-to-snapshot

* 結果イメージ

  {{% figure devfumi23-a1-c.png %}}

  * エンドポイントは払い出された
  * DB クラスターのパラメータグループもちゃんとくっついた
  * ``マスターユーザー名``, ``マスターパスワード`` はスナップショットから引き継がれたもよう

  * **TODO: create-db-instance もやってみよ...**

    * もしかして、クラスターはスナップショットから作るので、 create-db-instance すると中身が出来上がったりして.....??

.. note:: [参考ドキュメント]

  * `RDS for PostgreSQL から Aurora PostgreSQL へのスナップショットやAurora リードレプリカを利用した移行がマネジメントコンソールから行えない場合の対処方法 <https://dev.classmethod.jp/articles/tsnote-migrate-from-rds-for-postgresql-to-aurora/>`_
  * AWS CLI Command Reference: `restore-db-cluster-from-snapshot <https://awscli.amazonaws.com/v2/documentation/api/latest/reference/rds/restore-db-cluster-from-snapshot.html>`_


2. Aurora リードレプリカを使用して RDS for PostgreSQL DB インスタンスから Aurora PostgreSQL DB クラスターにデータを移行する
----------------------------------------------------------------------------------------------------------------------------

**TODO: 今度やってみる**

