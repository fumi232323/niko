.. title: Amazon SES でメールを送信する
.. tags: aws
.. date: 2019-12-23
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
Amazon SES (Amazon Simple Email Service)

* Amazon SES は、ユーザー自身の E メールアドレスとドメインを使用して E メールを送受信するための、簡単で費用効率の高い方法を提供する E メールプラットフォームです。


導入
=====

1. ドメイン検証
-----------------
* AWS リージョンごとに「ドメイン検証」が必要
* 「E メールアドレスの検証」 or 「ドメイン検証」 のいずれかを行う必要がある
* ドメインごと検証すると、そのドメインのすべての E メールアドレスを検証することになるため、そのドメインの E メールアドレスを個別に検証する必要がない
* 検証対象のドメインが Route 53 の DNS サービスを使用していて、Route 53 用の同じアカウントで AWS マネジメントコンソール にサインインしている場合、
  Amazon SES コンソール内からすぐに DNS サーバーを更新できるらしい (わたしは別の DNS プロバイダーでやった)

やりかた
^^^^^^^^^
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


2. DKIM を使った E メールの認証
--------------------------------
* DKIM: ドメインキーアイデンティファイドメール

  * 送信者が暗号化キーで E メールメッセージを署名できる規格
  * E メールプロバイダーはこの署名を使用して、メッセージが転送中に第三者によって改ざんされていないことを検証します。
  * 詳しくは、 http://dkim.org/ に書いてあるそうです

* Amazon SES における DKIM を使った E メールの認証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/dkim.html
* Amazon SES の Easy DKIM: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/easy-dkim.html

  * 「送信元」アドレスで使用するドメインでのみ Easy DKIM 設定が必要
  * リージョンごとに Easy DKIM 設定が必要

やりかた
^^^^^^^^^

* このガイドのとおりにやれば、とくにハマることもなくできる

  * ドメインにおける Easy DKIM のセットアップ: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/easy-dkim-setup-domain.html

* 検証が完了すると、

  * Amazon SES コンソールでのドメインのステータスが「pending verification (検証中)」から「verified (検証済み)」に変わり、
  * Amazon SES から通知 E メールが届く
  * Amazon SES コンソールの「Send a Test Email」からテストメールを送信できる

    * 届いたメールはこんな感じ (Easy DKIM セットアップ前となんだかちょっと違う)

      {{% figure 03_test-mail.png %}} {{% figure 04_test-mail-details.png %}}


3. カスタムの MAIL FROM ドメインの設定
---------------------------------------
これも要るかな...

* カスタムの MAIL FROM ドメインの設定: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/mail-from.html

  * デフォルトでは、Amazon SES から送信するメッセージには、MAIL FROM ドメインとして amazonses.com のサブドメインが使用される
  * デフォルトの MAIL FROM ドメインが E メールを送信したアプリケーション (この場合は Amazon SES) と一致するため、Sender Policy Framework (SPF) 認証はこれらのメッセージを正常に検証するけれども、
  * カスタム MAIL FROM ドメインを設定することにより、E メールはドメインベースのメッセージ認証、レポート、および適合性 (DMARC: Domain-based Message Authentication, Reporting and Conformance) に準拠できる
  * のでやると良さそう??

* Amazon SES での E メールの認証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/authentication.html

  * Amazon Simple Email Service（Amazon SES）では、E メールの送信に Simple Mail Transfer Protocol（SMTP）が使用される
  * SMTP 自体は認証を提供しない
  * 実際の送信元を隠蔽したスパムの発信者から、他人を装って E メールメッセージが送信される可能性があります。スパムの発信者は、E メールヘッダーを改ざんし、送信元 IP アドレスを偽装することにより、そのメールメッセージが本物であると受取人に思い込ませることができます。なのか...
  * メールトラフィックを転送するほとんどの ISP は、E メールの正当性を評価するための対策を講じています。E メールが認証されているかどうかの確認は、ISP が講じているそうした対策の 1 つです。

  * Sender Policy Framework (SPF)

    * E メールメッセージをその送信元のシステムにまでさかのぼって追跡することができます。
    * Amazon SES における SPF を使った E メールの認証: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/spf.html

  * ドメインキーアイデンティファイドメール (DKIM)

    * E メールメッセージに署名することで、自分のメッセージが本物であることと送信中に改ざんされていないことを ISP に証明するための標準規格です。

* Amazon SES での DMARC への準拠: https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/dmarc.html

  * DMARC (Domain-based Message Authentication, Reporting and Conformance) は、SPF (Sender Policy Framework) およびドメインキーアイデンティファイドメール (DKIM) を使用してメールスプーフィングを検出するためのメール認証プロトコルです。DMARC に準拠するため、メッセージは SPF または DKIM のいずれか、または両方で認証される必要があります。

=> やろう。 これ↑、下から読めば良かったなあ...やったらまとめなおそう...

* 送信ドメイン認証技術「DMARC」によるなりすましメール対策とDMARCレポートの活用: https://www.dekyo.or.jp/info/2019/02/seminar/5684/


4. 本番運用する場合は...
------------------------

* バウンスや苦情の処理方法の検討
* `Amazon SES サンドボックスの外への移動 <https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/request-production-access.html>`_

もやる


参考
=====
* `https://ja.wikipedia.org/wiki/DNSレコードタイプの一覧 <https://ja.wikipedia.org/wiki/DNSレコードタイプの一覧>`_

:A(Address) レコード: ホスト名にIPv4 IPアドレスをマッピングする (返されるのはIPアドレス)
:CNAME レコード: 正規ホスト名に対する別名を定義する
:MX レコード: 対象ドメイン宛のメールの配送先（メールサーバ）のホスト名を定義する
:TXT レコード: ホスト名に関連付けるテキスト情報（文字列）を定義する

  * 送信ドメイン認証の認証情報などを記述する




