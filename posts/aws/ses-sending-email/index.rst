.. title: Amazon SES でメールを送信する
.. tags: aws
.. date: 2019-12-23
.. updated: 2020-01-06
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス/ガイド
====================
* Amazon SES とは: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/Welcome.html
* Amazon SES クイック スタート: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/quick-start.html

説明
====
`Amazon SES (Amazon Simple Email Service) <https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/Welcome.html>`_

* Amazon SES は、ユーザー自身の E メールアドレスとドメインを使用して E メールを送受信するための、簡単で費用効率の高い方法を提供する E メールプラットフォームです。


導入の流れ
==========

1. 「 `ドメイン検証 <https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-domains.html>`_ 」もしくは「 `E メールアドレス検証 <https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-email-addresses.html>`_ 」する
2. Eメールを認証する

   * Sender Policy Framework (SPF)  を使った E メールの認証
   * ドメインキーアイデンティファイドメール (DKIM) を使った E メールの認証

3. DMARC (Domain-based Message Authentication, Reporting and Conformance) に準拠する

   * ドメインの DMARC ポリシーのセットアップ
   * SPF による DMARC への準拠
   * DKIM による DMARC への準拠

4. 本番運用するには...


1. ドメイン検証
================
* 「E メールアドレスの検証」 or 「ドメイン検証」 のいずれかを行う必要がある
* ドメインごと検証すると、対象ドメインのすべての E メールアドレスを検証することになるため、(そのドメインの) E メールアドレスを個別に検証する必要がない
* 「ドメイン検証」は、AWS リージョンごとに必要
* 検証対象のドメインが Route 53 の DNS サービスを使用していて、Route 53 用の同じアカウントで AWS マネジメントコンソール にサインインしている場合、
  Amazon SES コンソール内からすぐに DNS サーバーを更新できるらしい (わたしは別の DNS プロバイダーでやった)

やりかた
---------
* このガイドのとおりにやれば、とくにハマることもなくできる

  * Amazon SES でのドメインの検証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-domains.html
  * Amazon SES でのドメインの検証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-domain-procedure.html

* 検証が完了すると、

  * Amazon SES コンソールでのドメインのステータスが「pending verification (検証中)」から「verified (検証済み)」に変わり、
  * Amazon SES から通知 E メールが届く
  * Amazon SES コンソールの「Send a Test Email」からテストメールを送信できる

    * サンドボックス内にいる場合は、TOアドレスも検証する必要あり (`Amazon SES での E メールアドレスの検証 <https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/verify-email-addresses.html>`_ )
    * 届いたメールはこんな感じ↓

      {{% figure 01_test-mail.png %}} {{% figure 02_test-mail-details.png %}}


2. Eメールの認証
=================

Amazon SES での E メールの認証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/authentication.html

* Amazon SES では、E メールの送信に Simple Mail Transfer Protocol（SMTP）が使用されるが、
* SMTP 自体は認証を提供しないので、
* ``SPF``, ``DKIM``, ``DMARC への準拠`` (後述) によって「送信ドメイン認証」対応し、
* ISP に対して、わたしが送信するメールが「なりすましメール」ではないことを証明しましょう


SPF を使った E メールの認証
----------------------------
* SPF: Sender Policy Framework

  * E メールのなりすましを防ぐために設計された E メールの検証標準
  * ドメイン所有者は SPF を使用して、自分のドメインからメールを送信できるサーバーをメールプロバイダーに通知する (承認済みメールサーバーのリストをドメインの DNS 設定に公開する)
  * E メールプロバイダーは、ドメインからメッセージを受信すると、ドメインの DNS サーバーの SPF レコードをチェックして、承認されたサーバーから E メールが送信されたことを確認する

* Amazon SES における SPF を使った E メールの認証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/spf.html

  * Amazon SES を介して E メールを送信すると、送信するメッセージはデフォルトで SPF チェックをパスするようになっているけれども、
  * オプションで、独自の SPF レコードを公開できる
  * SPF レコードを公開することにより、DMARC に準拠できる

やりかた
^^^^^^^^^
`3. DMARC に準拠する > SPF による DMARC への準拠 <#dmarc>`_ を参照のこと


DKIM を使った E メールの認証
-----------------------------
* DKIM: ドメインキーアイデンティファイドメール

  * E メールメッセージに署名することで、自分のメッセージが本物であることと送信中に改ざんされていないことを ISP に証明するための標準規格

    * 送信者が暗号化キーで E メールメッセージを署名できる
    * E メールプロバイダーはこの署名を使用して、メッセージが転送中に第三者によって改ざんされていないことを検証する
    * 詳しくは、 http://dkim.org/ に書いてあるそうです

* Amazon SES における DKIM を使った E メールの認証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/dkim.html

  * 「送信元」アドレスで使用するドメインでのみ Easy DKIM 設定が必要
  * リージョンごとに Easy DKIM 設定が必要

やりかた
^^^^^^^^^
`3. DMARC に準拠する > DKIM による DMARC への準拠 <#dmarc>`_ を参照のこと


3. DMARC に準拠する
===================
* 送信ドメイン認証技術「DMARC」によるなりすましメール対策とDMARCレポートの活用: https://www.dekyo.or.jp/info/2019/02/seminar/5684/
* なりすまし対策ポータルナリタイ: https://www.naritai.jp/index.html
* Amazon SES での DMARC への準拠: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/dmarc.html

  * DMARC (Domain-based Message Authentication, Reporting and Conformance) は、
    SPF (Sender Policy Framework) およびドメインキーアイデンティファイドメール (DKIM) を使用してメールスプーフィングを検出するためのメール認証プロトコルです。
    DMARC に準拠するため、メッセージは SPF または DKIM のいずれか、または両方で認証される必要があります。

やりかた
---------

ドメインの DMARC ポリシーのセットアップ
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
TBD

SPF による DMARC への準拠
^^^^^^^^^^^^^^^^^^^^^^^^^^
* カスタムの MAIL FROM ドメインの設定: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/mail-from.html

  * デフォルトでは、Amazon SES から送信するメッセージには、MAIL FROM ドメインとして amazonses.com のサブドメインが使用される
  * デフォルトの MAIL FROM ドメインが E メールを送信したアプリケーション (この場合は Amazon SES) と一致するため、Sender Policy Framework (SPF) 認証はこれらのメッセージを正常に検証するけれども、
  * カスタム MAIL FROM ドメインを設定することにより、E メールはドメインベースのメッセージ認証、レポート、および適合性 (DMARC: Domain-based Message Authentication, Reporting and Conformance) に準拠できる

DKIM による DMARC への準拠
^^^^^^^^^^^^^^^^^^^^^^^^^^
* このガイドのとおりにやれば、とくにハマることもなくできる

  * Amazon SES の Easy DKIM: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/easy-dkim.html
  * ドメインにおける Easy DKIM のセットアップ: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/easy-dkim-setup-domain.html

* 検証が完了すると、

  * Amazon SES コンソールでのドメインのステータスが「pending verification (検証中)」から「verified (検証済み)」に変わり、
  * Amazon SES から通知 E メールが届く
  * Amazon SES コンソールの「Send a Test Email」からテストメールを送信できる

    * 届いたメールはこんな感じ (Easy DKIM セットアップ前となんだかちょっと違う)

      {{% figure 03_test-mail.png %}} {{% figure 04_test-mail-details.png %}}


4. 本番運用するには...
======================

* バウンスや苦情の処理方法の検討
* `Amazon SES サンドボックスの外への移動 <https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/request-production-access.html>`_

もやる


参考
=====
* `https://ja.wikipedia.org/wiki/DNSレコードタイプの一覧 <https://ja.wikipedia.org/wiki/DNSレコードタイプの一覧>`_
* 主なレコードの意味

  :A(Address) レコード: ホスト名にIPv4 IPアドレスをマッピングする (返されるのはIPアドレス)
  :CNAME レコード: 正規ホスト名に対する別名を定義する
  :MX レコード: 対象ドメイン宛のメールの配送先（メールサーバ）のホスト名を定義する
  :TXT レコード: ホスト名に関連付けるテキスト情報（文字列）を定義する

    * 送信ドメイン認証の認証情報などを記述する




