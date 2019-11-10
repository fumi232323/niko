.. title: AWS Lambda
.. tags: aws
.. date: 2019-11-10
.. updated: 2019-11-10
.. slug: index
.. status: draft


AWS Lambda
==========

AWS Lambda はサーバーをプロビジョニングしたり管理する必要なくコードを実行できるコンピューティングサービスです。

* AWS Lambda 開始方法: https://aws.amazon.com/jp/lambda/getting-started/
* AWS Lambda 料金: https://aws.amazon.com/jp/lambda/pricing/

  * データ転送

    * Lambda 関数が実行されたリージョン外からの AWS Lambda 関数に対する、または Lambda 関数からのデータの転送は、 EC2 データ転送料金が課金される
    * 同じ AWS リージョン内における Amazon S3、Amazon Glacier、Amazon DynamoDB、Amazon SES、Amazon SQS、Amazon Kinesis、Amazon ECR、Amazon SNS、または Amazon SimpleDB と AWS Lambda 関数の間でのデータ転送は無料
    * AWS Lambda 関数での VPC または VPC ピアリングの使用には、追加料金が発生する

* AWS Lambda ドキュメント: https://docs.aws.amazon.com/ja_jp/lambda/

  * AWS Lambda 開発者ガイド: https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/welcome.html

    * AWS Lambda とは: https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/welcome.html
    * AWS Lambda の制限: https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/limits.html

* チュートリアル: Amazon S3 で AWS Lambda を使用する: https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-s3-example.html

  * サンプル Amazon S3 関数コード: https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-s3-example-deployment-pkg.html#with-s3-example-deployment-pkg-python


AWS SAM
=======

* AWSサーバーレスアプリケーションモデル（AWS SAM）とは何ですか？: https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/what-is-sam.html

  * AWS SAMを使用するといろいろ良いことがある

    * すべての関連リソースを単一のバージョン管理されたエンティティとして一緒にデプロイできる
    * AWS SAMはAWS CloudFormationの拡張機能であるため、AWS CloudFormationの信頼できるデプロイ機能を利用できる
    * インフラストラクチャを構成として定義およびデプロイできる
    * 数行の設定で、CodeDeployを使用して安全なデプロイを有効にし、AWS X-Rayを使用してトレースを有効にできる
    * AWS SAMテンプレートで定義されたサーバーレスアプリケーションをローカルで構築、テスト、およびデバッグできる

      * https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/

    * Deep integration with development tools

      * AWS Serverless Application Repository
      * CodeBuild, CodeDeploy, and CodePipeline
      * AWS CodeStar


* macOSにAWS SAM CLIをインストールする: https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html
* チュートリアル: Hello Worldアプリケーションのデプロイ: https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html

  .. code-block:: bash

    # Make sure that the Region for this bucket aligns with where you deploy
    # aws s3 mb s3://bucketname --region region  # Example regions: us-east-1, ap-east-1, eu-central-1, sa-east-1
    $ aws s3 mb s3://fumi23-sam-repo --region ap-northeast-1

    # Step 1 - Download a sample application
    $ sam init --runtime python3.7 --dependency-manager pip --app-template hello-world --name sam-app

    # Step 2 - Build your application
    $ cd sam-app
    $ sam build

    # Step 3 - Package your application
    # sam package --output-template packaged.yaml --s3-bucket bucketname
    $ sam package --output-template-file packaged.yaml --s3-bucket fumi23-sam-repo

    # Step 4 - Deploy your application
    # sam deploy --template-file packaged.yaml --region us-west-2 --capabilities CAPABILITY_IAM --stack-name aws-sam-getting-started
    $ sam deploy --template-file packaged.yaml --region ap-northeast-1 --capabilities CAPABILITY_IAM --stack-name aws-sam-getting-started

    # ステップ5: AWSクラウドでアプリケーションをテストする
    $ aws cloudformation describe-stacks --stack-name aws-sam-getting-started --region ap-northeast-1 --query "Stacks[].Outputs"
    $ curl https://06eju0fof6.execute-api.ap-northeast-1.amazonaws.com/Prod/hello/

    # ステップ6: アプリケーションをローカルでテストする（オプション）
    $ sam local start-api
    $ curl http://127.0.0.1:3000/hello

  * 「Lambda > アプリケーション」 に ``aws-sam-getting-started`` アプリケーションができあがる
  * 「CloudFormation > スタック」 に ``aws-sam-getting-started`` スタックができあがる
  * 「Amazon S3/fumi23-sam-repo」 に何かができあがる => これはスタックを削除しても消えない


AWS Serverless Application Repository
======================================
https://aws.amazon.com/jp/serverless/serverlessrepo/

* Serverless Application Repository の使用に追加料金はかかりません。デプロイするアプリケーションで使用する AWS リソースに対してのみ料金をお支払いいただきます。


serverless framework
======================
https://serverless.com/

* The complete solution for building & operating serverless applications

  * サーバーレスアプリケーション構築/運用のためのフレームワーク
  * AWS Lambda、Azure Functions、Google CloudFunctions などに対応

* Serverless Frameworkの使い方まとめ: https://qiita.com/horike37/items/b295a91908fcfd4033a2
* Serverless Frameworkを使ってAWSでお手軽APIを作ってみよう: https://developer.cybozu.io/hc/ja/articles/360020409231-Serverless-Framework%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6AWS%E3%81%A7%E3%81%8A%E6%89%8B%E8%BB%BDAPI%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86

  * 「やってみるとわかるのですが、複数のLambda関数やAPIを開発する場合に都度、LambdaやAPI Gatewayの設定を手作業で行うのはわりと面倒くさい」らしい
  * サーバーレスなアーキテクチャをかんたんに作成できるオープンソースのフレームワーク
