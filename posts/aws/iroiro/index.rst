.. title: AWS のいろいろなサービス
.. tags: aws
.. date: 2019-06-27
.. updated: 2019-10-06
.. slug: index
.. status: draft


AWS ドキュメント
=================
https://docs.aws.amazon.com/


ECS (Amazon Elastic Container Service)
========================================
コンテナオーケストレーションサービス

* Amazon Elastic Container Service (Amazon ECS) は、Amazon EC2 インスタンスのクラスターで Docker コンテナの実行、停止、管理を簡単に行うことのできる、高度にスケーラブルで高速なコンテナ管理サービスです。


リファレンス/ガイド
-------------------
* https://docs.aws.amazon.com/ecs/index.html

メモ
----
* クラスター

  * サービス

    * タスク定義

        * 起動するとタスクになる
        * タスク定義は、タスクに含まれるコンテナの数、それらが使用するリソース、それらが一緒にリンクされる方法、および使用するホストポートなど、アプリケーションのコンテナ情報を指定します。

* Fargate

  * 起動タイプって書いてある
  * AWS FargateとECSの違いは？: https://qiita.com/ABCompany1/items/5f3fcea04052415dc875
  * Fargate を使用した Amazon ECS の使用開始: https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ECS_GetStarted_Fargate.html
  * くろのて: Django を ECS(Fargate) に手動デプロイしたログ:

* やってみた

  * Docker/Kubernetes 実践コンテナ開発入門 > B.3 AWS Fargate を用いた ECS でのコンテナオーケストレーション
  * クラスターつくると、全部セットでできあがるのすごいな


ECR (Amazon Elastic Container Registry)
========================================
コンテナイメージを簡単に保存、管理、デプロイ

リファレンス/ガイド
-------------------
* https://aws.amazon.com/jp/ecr/


ALB (Application Load Balancer)
================================
* Elastic Load Balancing は、EC2 インスタンスなどの複数のターゲット間で、アプリケーションの着信トラフィックを自動的に分散します。
* 登録されているターゲットの状態をモニタリングし、正常なターゲットのみにトラフィックをルーティングします。
* Elastic Load Balancing は、Application Load Balancer、Network Load Balancer、Classic Load Balancer の 3 つのタイプのロードバランサーをサポートします。

リファレンス/ガイド
-------------------
https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/introduction.html


VPC (Amazon Virtual Private Cloud)
==================================
ユーザーが定義した仮想ネットワーク内で AWS リソースの起動が可能な、アマゾン ウェブ サービス (AWS) クラウドのローカルで隔離されたセクションのプロビジョニング。

リファレンス/ガイド
-------------------
* https://aws.amazon.com/jp/vpc/
* https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/what-is-amazon-vpc.html

めもめも
---------
* 閉じたクラウドの仮装ネットワークなのみたいなこと言ってるよ...

CFn (AWS CloudFormation)
===========================
すべてのクラウドインフラストラクチャリソースのモデル化とプロビジョニング

リファレンス/ガイド
-------------------
* https://aws.amazon.com/jp/cloudformation/
* https://aws.amazon.com/jp/cloudformation/features/

めも
----
* テンプレート
* スタック

* クラウド環境内のすべてのインフラストラクチャリソースを記述してプロビジョニングするための共通言語を提供します
* AWS CloudFormation は追加料金なしでご利用いただけます

* 利点

  * `インフラストラクチャ全体をテキストファイルでモデル化できます`
  * モデル化したテキストファイルのことを ``テンプレート`` というらしい

    * サンプルテンプレートを使ったり、独自のテンプレートを作ったりできるらしい
    * JSON/YAML で書くらしい

  * `このテンプレートは、インフラストラクチャにおける真の単一ソースとなります。` ふむう

* 自動化とデプロイ

  * `AWS CloudFormation では、安全で繰り返し可能な方法でリソースがプロビジョニングされるため、
    手作業やカスタムスクリプト作成を必要とせずにインフラストラクチャとアプリケーションの構築と再構築が可能になります。`
  * `エラーが検出された場合は変更が自動的にロールバックされます。` なぬ、しゅごいな....
  *  CloudWatch アラームを指定できるんだって
  * `AWS リソース、およびアプリケーションを実行するために必要な関連するすべての依存関係やランタイムパラメータを記述できる` んですって
  * ``スタック`` というキーワードが登場、それなにおいしいの??


* 単なるコード

  * `インフラストラクチャをコード化することで、インフラストラクチャを単なるコードとして扱えるようになります。` ほうほう

* わたしの理解

  * Ansible の AWS よう、みたいなイメージだろうか....
  * ``スタック`` なに.....

* https://tech.bitbank.cc/cfn-vpc/

  * `Infrastructure as Codeってやつですね。` とのこと。ほーう。
  * `AWSで利用するEC2やVPCなどのインフラをコードでビルドできるわけです。` ほうほうー
  * バージョン管理が可能になり
  * 冪等性を担保したデプロイが可能になる
  * テンプレートを元にして、AWSのCloudFormation上にスタックというものができあがります。
  * スタックはリソース(EC2とかVPCなど)の変更点を1まとめにしたものです。


EKS (Amazon Elastic Kubernetes Service)
========================================
可用性が高く、スケーラブルで安全な Kubernetes サービス

* AWS のマネージド Kubernetes サービス

リファレンス/ガイド
-------------------
https://aws.amazon.com/jp/eks/


RDS (Amazon Relational Database Service)
==========================================
クラウド上のリレーショナルデータベースのセットアップ、オペレーション、スケールを数回のクリックで実現


Amazon S3 Glacier と S3 Glacier Deep Archive
==============================================
https://docs.aws.amazon.com/ja_jp/glacier/

1 テラバイトあたり月額 1 USD から利用できる、データアーカイブのための長期保存用の安全で耐久性に優れた Amazon S3 オブジェクトストレージクラス


AWS CodeBuild
==============
https://docs.aws.amazon.com/ja_jp/codebuild/

AWS CodeBuild は完全マネージド型のビルドサービスです。ソースコードのコンパイル、ユニットテストの実行、すぐにデプロイできるアーティファクトの生成を行います。


* AWS のいろいろなサービスについて知りたいなあ
  * 全体を俯瞰して
  * こんなんあるんだなあと、ちょっとした使い方使い道を知りたい
  * いざ使うとなったら詳しく調べて使えるように
