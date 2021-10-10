.. title: ECS Fargate: コンテナごとの平均CPU使用率とメモリ使用率を見たい
.. tags: aws
.. date: 2021-10-10
.. updated: 2021-10-10
.. slug: index
.. status: published

.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


タスク定義.コンテナ定義に、コンテナごとの CPUユニット数・メモリリミットを設定しておく
=========================================================================================

↓ で、 ``%`` で見られるようになる

* CloudWatch
* => Container Insights
* => パフォーマンスのモニタリング
* => ECS Tasks
* => コンテナのパフォーマンス

こんな感じ
-------------

{{% figure container-performance.png %}}

* コンテナごとに設定した CPUユニット数・メモリリミットに対する ``%`` だと思う
* タスク数が複数だったら、その分のコンテナ分全部出る (e.g. 1タスク内にコンテナ 2つで、タスク数2 にしていたら 4コンテナ分出る)


参考ページ
-----------
* `Container Insights でコンテナ単位のCPU・メモリ使用率を表示させる方法 <https://dev.classmethod.jp/articles/how-to-check-container-cpu-usage-by-container-insights/>`_


CloudWatch Logs Insights でクエリを投げて見る
=============================================

↓ で、 ``CPUユニット数`` と ``メモリ (MiB)`` で見られるようになる

※こちらの方法だと、タスク定義.コンテナ定義に「コンテナごとの CPUユニット数・メモリリミット」を設定していなくても見られる

* CloudWatch
* => Container Insights
* => パフォーマンスのモニタリング
* => ECS Tasks
* => コンテナのパフォーマンス
* => Container name をチェックして
* => View performance logs
* => (Logs Insights ページにいくので) クエリの実行

こんな感じ
----------

`CloudWatch Logs Insights でコンテナ単位のCPU・メモリ使用量などを確認する <https://dev.classmethod.jp/articles/ways-to-check-fargate-cpu-usage/>`_ に書いていただいているとおりです、ありがとうございます。

* ほかのクエリも投げられる => 1時間平均なども取得できる

参考ページ
-----------
* `CloudWatch Logs Insights でコンテナ単位のCPU・メモリ使用量などを確認する <https://dev.classmethod.jp/articles/ways-to-check-fargate-cpu-usage/>`_
* AWS: `Fargate で Amazon ECS タスクの高いメモリ使用率をモニタリングする方法を教えてください。 <https://aws.amazon.com/jp/premiumsupport/knowledge-center/ecs-tasks-fargate-memory-utilization/>`_
* AWS: `AmazonECS用のAmazonCloudWatch ContainerInsightsの紹介 <https://aws.amazon.com/jp/blogs/mt/introducing-container-insights-for-amazon-ecs/>`_

  * 調整のしかたとか載っていておもしろそうだった

* AWS: `AmazonECSがCPUおよびメモリリソースを管理する方法 <https://aws.amazon.com/jp/blogs/containers/how-amazon-ecs-manages-cpu-and-memory-resources/>`_
* AWS: `既存の Amazon ECS クラスターでの Container Insights のセットアップ <https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-cluster.html#deploy-container-insights-ECS-existing>`_

  * 新規作成時であれば、Management Console で有効化できる

