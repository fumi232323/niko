.. title: GraphQL ガイドを読んでいる
.. tags: graphql
.. date: 2021-09-16
.. updated: 2021-09-16
.. slug: index
.. status: draft


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


GraphQL
==========

リファレンス・ガイド
--------------------

* GraphQL: https://graphql.org/
* GitHub の GraphQLガイド: https://docs.github.com/ja/graphql/guides/introduction-to-graphql


めも
-----

* クエリとミューテーション

  * クエリ: ``GET`` (取得系)
  * ミューテーション: ``POST``/``PATCH``/``DELETE`` (更新系)

* HTTP の動詞はなにをしていても基本 ``POST``

  * イントロスペクションクエリは ``GET``
  * イントロスペクションクエリ: GraphQLスキーマに関する詳細をクエリできる

* 引数を与えられる

  * たぶん、クエリの条件とか更新する情報とかを渡せるんだと思う
  * クエリの場合は、 ``WHERE id = 3`` とか ``LIMIT 5`` とかみたいなのを ``variables`` で指定できた
  * => メソッドの引数みたいにも渡せた

* クエリ書くときは何かしらの仕様に沿った形で書く

  * テーブル見て、SQL をそのまま (GraphQL のクエリで) 書くというわけでもない感じ
  * なので、サーバー側 (GraphQL API を公開している側) で何かしら定義しているはず
  * => それがスキーマ定義なのかなあ
  * 最初は SQL を json で書く、みたいに感じていたけれど、メソッドとか関数呼び出す、みたいな感じがしてきた


* クエリはこんなやつ

  * https://docs.github.com/ja/graphql/guides/forming-calls-with-graphql

  .. code-block:: python

    # 自分のリポジトリの最後から3つを取得する
    # クエリするときは、 `query` キーワード
    # ミューてションするときは、 `mutation` キーワード
    query($number_of_repos:Int!) {
      viewer {
        name
         repositories(last: $number_of_repos) {
           nodes {
             name
           }
         }
       }
    }
    variables {
       "number_of_repos": 3
    }

    # 以下のクエリはoctocat/Hello-Worldリポジトリをルックアップし、
    # 最も最近にクローズされた20個のIssueを見つけ、
    # それぞれのIssueのタイトル、URL、最初の5つのラベルを返す
    query {
      repository(owner:"octocat", name:"Hello-World") {
        issues(last:20, states:CLOSED) {
          edges {
            node {
              title
              url
              labels(first:5) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }

    # クエリに名前もつけられる
    # 名前はオプション
    # (これは SELECT)
    query FindIssueID {
      repository(owner:"octocat", name:"Hello-World") {
        issue(number:349) {
          id
        }
      }
    }

    # これはたぶん登録 (リアクションつけているから)
    mutation AddReactionToIssue {
      # 呼び出すミューテンション名
      # input は必須の引数のキー、ミューテーションではいつも input という名前
      addReaction(input:{subjectId:"MDU6SXNzdWUyMzEzOTE1NTE=",content:HOORAY}) {
        # これと
        reaction {
          content
        }
        # これは、Response にほしいものを指定している
        subject {
          id
        }
      }
    }

    # こんな風に、input に渡すものを変数に切り出すこともできる
    mutation($myVar:AddReactionInput!) {
      addReaction(input:$myVar) {
        reaction {
          content
        }
        subject {
          id
        }
      }
    }
    variables {
      "myVar": {
        "subjectId":"MDU6SXNzdWUyMTc5NTQ0OTc=",
        "content":"HOORAY"
      }
    }

* コネクション/エッジ/ノード

  * というやつもある
  * ノード はオブジェクトの総称 (まだよくわからない)


  .. code-block:: python

    # これを投げると、
    query {
      node(id:"MDQ6VXNlcjU4MzIzMQ==") {
         __typename
      }
    }

    # これが返ってきて、オブジェクトの型がわかる
    {
      "data": {
        "node": {
          "__typename": "User"
        }
      }
    }
