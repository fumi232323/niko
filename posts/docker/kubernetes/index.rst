.. title: 5. Kubernetes 入門 --- Docker/Kubernetes 実践コンテナ開発入門
.. tags: docker
.. date: 2019-11-16
.. slug: index
.. status: draft


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


5.1 Kubernetes とは
===================

* Google 社主導で開発された、コンテナの運用を自動化するためのコンテナオーケストレーションシステム
* コンテナオーケストレーションを実現・管理するための統合的なシステム
* その操作のための API や CLI ツールも併せて提供する
* コンテナを用いたアプリケーションのデプロイをはじめ、様々な運用管理の自動化を実現する

  * Docker ホストの管理
  * サーバーリソースの空き具合を考慮したコンテナ配置
  * スケーリング
  * 複数のコンテナ群へのアクセスを取りまとめるロードバランサー
  * 死活監視

* ``クーバネティス`` と読むらしい

クラウドプラットフォームの Kubernetes サポート
-----------------------------------------------

* Google: GKE
* Microsoft Azure: AKS
* AWS: Amazon EKS


5.2 ローカル環境で Kubernetes を実行する
========================================

1. Docker for Mac の Kubernetes 連携を有効にする

.. code-block:: bash

  # 2. kubectl (Kubernetes を操作するためのコマンドラインツール) をインストールする
  # https://kubernetes.io/docs/tasks/tools/install-kubectl/
  # けっこう長かった
  $ brew install kubectl

  # 3. ダッシュボードの適用 (追加)
  # https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
  # これはすぐだった
  $ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta4/aio/deploy/recommended.yaml

  # 4. ダッシュボードへのプロキシサーバーを立ち上げる
  $ kubectl proxy

5. http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/. へアクセスする


5.3 Kubernetes の概念
=====================

* P.173 に一覧表になっている


5.4 Kubernetes クラスタと Node
==============================

* 大きい順: ``クラスタ`` >>> ``Node`` >>> ``Pod`` >>> ``コンテナ``
* クラスタ: Kubernetes の様々なリソースを管理する集合体

  * 全体を管理するサーバーである Master が少なくとも1つは配置されている


5.6 Pod を作成してデプロイする
==============================

* Pod: コンテナの集合体の単位

  * 少なくとも 1つのコンテナを持つ
  * Kubernetes では Pod 単位でコンテナをひとくくりにしてデプロイする

* Pod を定義したマニフェストファイルを作成する

  * kubectl だけで Pod を作成することもできるが、バージョン管理の観点から yaml ファイルとして定義することがほとんど
  * kubernetes の各種リソースを定義するファイルを ``マニフェストファイル`` と呼ぶ

  {{% codeblock simple-pod.yaml label="simple-pod.yaml" lexer="yaml" %}}

* Kubernetes クラスタに反映する

  .. code-block:: bash

    # apply: 新規作成/内容に変更があったときだけ反映される
    $ kubectl apply -f simple-pod.yaml
    pod/simple-echo created

    # Pod の状態を一覧表示
    $ kubectl get pod
    # STATUS Running:  Pod 内のすべてのコンテナが実行状態
    # READY 2/2: 実行状態になったコンテナ数/Pod に定義されたコンテナ数
    NAME          READY   STATUS    RESTARTS   AGE
    simple-echo   2/2     Running   0          2m49s

    # コンテナに入る
    $ kubectl exec -it simple-echo sh -c nginx
    / #

    # Pod 内のコンテナの標準出力を表示する
    $ kubectl logs -f simple-echo -c echo
    2019/11/17 04:50:42 start server

    # Pod を削除する
    $ kubectl delete pod simple-echo
    pod "simple-echo" deleted

    # マニフェストファイルベースで Pod を削除する
    $ kubectl delete -f simple-pod.yaml

* Pod と Pod 内コンテナのアドレス

  * Pod にはそれぞれ固有の IPアドレスが割り振られる
  * Pod に割り振られた仮想 IPアドレスは、その Pod に所属するすべてのコンテナと共有される => 同一 Pod 内の全てのコンテナの仮想IPアドレスは同じ


5.7 ReplicaSet
==============

同じ仕様の Pod を複数生成/管理するためのリソース

{{% codeblock simple-replicaset.yaml label="simple-replicaset.yaml" lexer="yaml" %}}

.. code-block:: bash

  $ kubectl apply -f simple-replicaset.yaml
  replicaset.apps/echo created

  # Pod が 3つ作成されている
  # ReplicaSet を操作して Pod の数を減らすと、減らした分の Pod は削除されて元に戻せない => Stateless なものに向いてる
  $ kubectl get pod
  NAME         READY   STATUS    RESTARTS   AGE
  echo-69gln   2/2     Running   0          39s
  echo-hm7ns   2/2     Running   0          39s
  echo-x9729   2/2     Running   0          39s

  # ReplicaSet を削除する
  $ kubectl delete -f simple-replicaset.yaml


5.8  Deployment
===============

* アプリケーションデプロイの基本単位となるリソース
* ``Deployment`` >>> ``ReplicaSet`` >>> ``Pod`` たち
* ReplicaSet を管理/操作する
* Deployment は ReplicaSet の世代管理できる

{{% codeblock simple-deployment.yaml label="simple-deployment.yaml" lexer="yaml" %}}

.. code-block:: bash

  # コマンドを記録できる ``--record`` オプションをつけて反映
  $ kubectl apply -f simple-deployment.yaml --record
  deployment.apps/echo created

  $ kubectl get pod,replicaset,deployment --selector app=echo
  NAME                        READY   STATUS    RESTARTS   AGE
  pod/echo-679c46ddf9-8rhgm   2/2     Running   0          107s
  pod/echo-679c46ddf9-hl22n   2/2     Running   0          107s
  pod/echo-679c46ddf9-kbm2g   2/2     Running   0          107s

  NAME                                    DESIRED   CURRENT   READY   AGE
  replicaset.extensions/echo-679c46ddf9   3         3         3       107s

  NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
  deployment.extensions/echo   3/3     3            3           107s

  # Deployment のリビジョンを確認する
  $ kubectl rollout history deployment echo
  deployment.extensions/echo
  REVISION  CHANGE-CAUSE
  1         kubectl apply --filename=simple-deployment.yaml --record=true

ReplicaSet のライフサイクル
-----------------------------

* Kubernetes では Deployment を 1つの単位としてアプリケーションをデプロイする
* 実運用では ReplicaSet を直接用いることはほとんどない
* Deployment のマニフェストファイルを扱う運用にする
* ReplicaSet 大事

  * 指定された Pod 数の確保
  * 新しいバージョンの Pod への入れ替え
  * 以前のバージョンへの Pod のロールバック

挙動まとめ
^^^^^^^^^^^

* Pod 数を変更: 新規 ReplicaSet 生まれない
* コンテナ定義を更新: 新しいリビジョンが作成される

.. code-block:: bash

  # 特定のリビジョンの内容を確認できる
  $ kubectl rollout history deployment echo  --revision=1
  deployment.extensions/echo with revision #1
  Pod Template:
    Labels:	app=echo
    pod-template-hash=679c46ddf9
    Annotations:	kubernetes.io/change-cause: kubectl apply --filename=simple-deployment.yaml --record=true
    Containers:
     nginx:
      Image:	gihyodocker/nginx-proxy:latest
      Port:	80/TCP
      Host Port:	0/TCP
      Environment:
        BACKEND_HOST:	localhost:8080
      Mounts:	<none>
     echo:
      Image:	gihyodocker/echo:latest
      Port:	8080/TCP
      Host Port:	0/TCP
      Environment:	<none>
      Mounts:	<none>
    Volumes:	<none>

  # 直前の操作のリビジョンに Deployment をロールバックできる
  $ kubectl rollout undo deployment echo
  deployment.extensions/echo rolled back

  # 削除: 関連する ReplicaSet と Pod もいっしょに削除される
  $ kubectl delete -f simple-deployment.yaml
  deployment.apps "echo" deleted


5.9 Service
============

* Kubernetes クラスタ内において、 Pod の集合 (主に ReplicaSet) に対する経路やサービスディスカバリを提供するためのリソース
* Service のターゲットとなる一連の Pod は、 Service で定義するラベルセレクタによって決定される

{{% codeblock simple-replicaset-with-label.yaml label="simple-replicaset-with-label.yaml" lexer="yaml" %}}

.. code-block:: bash

  # apply
  $ kubectl apply -f simple-replicaset-with-label.yaml
  replicaset.apps/echo-spring created
  replicaset.apps/echo-summer created

  # release ラベルに spring/summer を持つ Pod がそれぞれつくられる
  # release ラベルに spring を持つ Pod
  $ kubectl get pod -l app=echo -l release=spring
  NAME                READY   STATUS    RESTARTS   AGE
  echo-spring-67s58   2/2     Running   0          92s

  # release ラベルに summer を持つ Pod
  $ kubectl get pod -l app=echo -l release=summer
  NAME                READY   STATUS    RESTARTS   AGE
  echo-summer-tnwb9   2/2     Running   0          110s
  echo-summer-vb44t   2/2     Running   0          110s


{{% codeblock simple-service.yaml label="simple-service.yaml" lexer="yaml" %}}

.. code-block:: bash

  # apply して Service を作成する
  $ kubectl apply -f simple-service.yaml
  service/echo created

  $ kubectl get svc echo
  NAME   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
  echo   ClusterIP   10.106.145.240   <none>        80/TCP    51s

  # 基本的に Service は Kubernetes クラスタの中からしかアクセスできないので、
  # Kubernetes クラスタ内に一時的なデバッグコンテナをデプロイ
  $ kubectl run -i --rm --tty debug --image=gihyodocker/fundamental:0.1.0 --restart=Never -- bash -il
  If you don't see a command prompt, try pressing enter.

  # curl で HTTP リクエストを送信してみる
  debug:/# curl http://echo/
  Hello Docker!!debug:/# curl http://echo/
  Hello Docker!!debug:/# curl http://echo/
  Hello Docker!!debug:/# curl http://echo/
  Hello Docker!!debug:/# curl http://echo/
  Hello Docker!!debug:/#

  # summer にはリクエストが来ている
  $ kubectl logs -f echo-summer-vb44t -c echo
  2019/11/17 06:56:15 start server
  2019/11/17 07:23:53 received request
  2019/11/17 07:23:54 received request
  2019/11/17 07:23:56 received request

  $ kubectl logs -f echo-summer-tnwb9 -c echo
  2019/11/17 06:56:12 start server
  2019/11/17 07:18:24 received request
  2019/11/17 07:23:45 received request

  # spring にはリクエストが来ていない
  $ kubectl logs -f echo-spring-67s58 -c echo
  2019/11/17 06:56:09 start server

* Service による名前解決は欠かせません

Service の名前解決
-------------------

Kubernetes クラスタ内の DNS では、 Service を ``Service名.Namespace名.svc.local`` で名前解決できるようになっている

.. code-block:: bash

  # echo は default の Namespace に配置しているので、
  $ curl http://echo.default.svc.local

  # .svc.local は省略可能
  # 異なる Namespace の Service の名前解決は↓が最短
  $ curl http://echo.default

  # 同一の Namespace だと Service 名だけで名前解決できる
  $ curl http://echo
