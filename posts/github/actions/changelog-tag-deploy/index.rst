.. title: GitHub Actions で deploy 時に changelog を生成してタグを打ちたい
.. tags: github
.. date: 2021-09-20
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


リファレンス・ガイド
====================

GitHub Actions
--------------

* `GitHub Actionsのワークフロー構文 <https://docs.github.com/ja/actions/reference/workflow-syntax-for-github-actions>`_

ワークフロー中で使った Actions
------------------------------

* Checkout V2: https://github.com/actions/checkout
* git-auto-commit Action: https://github.com/stefanzweifel/git-auto-commit-action
* GitHub Tag Action: https://github.com/mathieudutour/github-tag-action
* Create Pull Request: https://github.com/peter-evans/create-pull-request
* Enable Pull Request Auto-merge: https://github.com/peter-evans/enable-pull-request-automerge
* approve-pull-request-action: https://github.com/juliangruber/approve-pull-request-action

Case1: 直接 push する、 tag は手動トリガー時に入力できる
========================================================

条件
----

* private repository
* changelog push 対象のブランチに、 Branch protection rules の適用なし

workflow
--------

1. ブランチを選択・タグ名を入力して、 ``Run workflow`` (手動トリガー)
2. changelog を生成
3. ワークフローをトリガーしたブランチに、 changelog を commit & push
4. changelog の commit に、入力したタグ名でタグ打ち
5. deploy

* `ワークフローの手動実行 <https://docs.github.com/ja/actions/managing-workflow-runs/manually-running-a-workflow>`_

.. code-block:: yaml

  name: Deploy (Case1)

  on:
    workflow_dispatch:
      # 手動トリガー
      inputs:
        tag-name:
          # ここで入力したタグ名でタグを打つ
          description: 'Enter tag name (e.g. v1.2.3)'
          required: true

  env:
    # 必要な環境変数を定義する
    # ここで定義した env はすべての job から参照できる
    AWS_REGION: ap-northeast-1
    # (以下省略)

  defaults:
    run:
      shell: bash

  jobs:

    changelog:
      name: Update CHANGELOG and create new tag
      runs-on: ubuntu-latest
      outputs:
        # job の outputs として tag を打った (changelog を commit した) コミットの hash (SHA) を設定
        tagged-sha: ${{ steps.push-changelog-tag.outputs.commit_hash }}

      steps:
        - name: Checkout
          uses: actions/checkout@v2

        - name: Build services
          run: |
            cp example.env .env
            docker-compose build --parallel
          env:
            DOCKER_BUILDKIT: 1

        - name: Update CHANGELOG
          # root ユーザーで実行する
          # root で実行しないと、 towncrier が見たい dir の参照権限がなかったりして、fail する
          run: docker-compose run -u 0 --rm djangoapp towncrier --yes

        - name: Stop and remove containers, networks and volumes
          run: docker-compose down -v
          if: always()

        - name: Restore git dir owner and group
          # CHANGELOG は root:root で作成される
          # そのままだと git-auto-commit-action に失敗することがあるため元に戻す
          # ※これは正しい解決策なのか否かちょっと自信なし
          run: sudo chown -R runner:docker .git/objects/

        - name: Commit, push CHANGELOG and create new tag
          id: push-changelog-tag
          uses: stefanzweifel/git-auto-commit-action@v4
          with:
            commit_message: Updated CHANGELOG
            # 手動トリガーで受け取ったタグ名でタグを打つ
            # 手動トリガー時に受け取った inputs はこんな風に参照できる
            tagging_message: ${{ github.event.inputs.tag-name }}

    deploy:
      name: Deploy
      runs-on: ubuntu-latest
      # changelog job が正常終了したらこの job を実行する (直列で実行する)
      # needs を指定しないと並列実行される
      needs:
        - changelog

      steps:
        - name: Checkout
          uses: actions/checkout@v2
          with:
            # すべての tag も fetch する
            # これをつけないと (デフォルトだと) 、ワークフローをトリガーした ref/SHA のコミットひとつだけが fetch される
            fetch-depth: 0
            # changelog job で tag を打った (changelog を commit した) コミットをチェックアウトする
            # ※ changelog + tag のコミットを deploy したいため
            # needs に指定した job の outputs はこんな風に参照できる
            ref: ${{ needs.changelog.outputs.tagged_hash }}

        - name: Set tagged sha
          id: set-tag-sha
          # [確認用] チェックアウトしたブランチの最新の commit を取得
          run: |
            TAGGED_SHA=$(git log -1 --format='%H')
            echo $TAGGED_SHA
            echo "::set-output name=tag-sha::$TAGGED_SHA"

        - name: Echo github-ref
          run: echo "${{ github.ref }}"
        - name: Echo github-sha
          # ワークフローをトリガーしたときの SHA
          run: echo "${{ github.sha }}"
        - name: Echo changelog-tagged_hash
          # changelog job で tag を打った SHA
          # このワークフロー中で commit したので、 github.sha より一つ進んでいる
          run: echo "${{ needs.changelog.outputs.tagged_hash }}"
        - name: Echo tag-sha
          # チェックアウトしたブランチの最新の commit の SHA
          # == changelog-tagged_hash
          run: echo "${{ steps.set-tag-sha.outputs.tag-sha }}"

        # あとは deploy する (省略)


Case2: 直接 push する、 tag は手動トリガー時に入力できる (ちょっとだけ protected branch)
=========================================================================================

条件
----

* private repository
* changelog push 対象のブランチに、 Branch protection rules の適用あり

  * Require pull request reviews before merging: OFF
  * Require status checks to pass before merging: ON
  * Include administrators: OFF

workflow
--------

Case1 と同じ

.. code-block:: yaml

    steps:
      - name: Checkout
        uses: actions/checkout@v2
        # ここだけ変える
        with:
          # 管理者権限を持つユーザーで repo scope の PAT を作成し、
          # GitHub Actions の secrets に登録しておく
          token: ${{ secrets.REPO_SCOPED_PAT }}


* `個人アクセストークンを使用する <https://docs.github.com/ja/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token>`_
* `暗号化されたシークレット <https://docs.github.com/ja/actions/reference/encrypted-secrets>`_

ちなみに
^^^^^^^^

Branch protection rules のうち、以下のいずれかもしくは両方が ``ON`` の場合は NG です。
workflow は fail します (changelog の push に失敗する) 。

* Require pull request reviews before merging

  * 自分のローカルから push するときは、これ ON でも Include administrators が OFF なら push できるんだけれども、
    なにか、PAT の権限足すといけるのかもしれない (けれどあまり強権限持たせたくない..)
  * それに、管理者だからって、自分の頭で気をつけるんじゃなくて GitHub に助けて (チェックして) もらいたい...

* Include administrators


Case3: protected branch に PR する、 tag は auto bump (changelog と tag のコミットがずれる)
============================================================================================

条件
----

* private repository
* changelog push 対象のブランチに、 Branch protection rules の適用あり

  * Require pull request reviews before merging: ON
  * Require status checks to pass before merging: ON (今回の場合は、以下の3つを指定)

    * ci (自分のところで用意している CI)

      * push イベントで起動 (branch は特に絞り込んでいません)

    * `task-list-completed <https://github.com/marketplace/task-list-completed>`_
    * `WIP <https://github.com/marketplace/actions/wip>`_

  * Include administrators: ON

* リポジトリ内のプルリクエストの自動マージを許可: ON

  * `リポジトリ内のプルリクエストの自動マージを管理する <https://docs.github.com/ja/github/administering-a-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository>`_
  * `プルリクエストを自動的にマージする <https://docs.github.com/ja/github/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request>`_


workflow
--------

1. ブランチを選択して、 ``Run workflow`` (手動トリガー)

   * タグ version の bump up は自動でやってくれるので、通常の実行時はタグ名を指定しない
   * デフォルトが ``Patch`` になっているので、 ``Minor`` or ``Major`` の version を bump up したいときは、 ``custom_tag`` を指定する

     * ちょっとまだどんな風に version up していくか見えていないので

2. changelog を生成
3. ワークフローをトリガーしたコミットにタグ打ち (タグのバージョンは自動 bump up)

   * changelog の PR が merge されるのをワークフロー中で待てないので、
   * あきらめて「ワークフローをトリガーしたコミット」にタグを打つ。
   * changelog のコミットは、「タグを打ったコミット」より後の別のコミットになる。

4. changelog を PR
5. changelog の PR の自動マージを有効化
6. changelog を PR を自動 approve
7. deploy


.. code-block:: yaml

  name: Deploy (Case3)

  on:
    workflow_dispatch:
      inputs:
        custom_tag:
          description: 'メジャー/マイナーバージョンをインクリメントしたいときのみ指定してください (e.g. 1.2.0)'

  env:
    AWS_REGION: ap-northeast-1
    # (以下省略)

  defaults:
    run:
      shell: bash

  jobs:

    changelog:
      name: Update CHANGELOG and create new tag
      runs-on: ubuntu-latest
      outputs:
        # changelog job の outputs として version を bump したタグ名設定
        new_tag: ${{ steps.create-tag.outputs.new_tag }}

      steps:
        - name: Checkout
          uses: actions/checkout@v2

        - name: Build services
          run: |
            cp example.env .env
            docker-compose build --parallel
          env:
            DOCKER_BUILDKIT: 1

        - name: Update CHANGELOG
          run: docker-compose run -u 0 --rm djangoapp towncrier --yes

        - name: Stop and remove containers, networks and volumes
          run: docker-compose down -v
          if: always()

        - name: Bump version and push tag
          # changelog の PR が merge されるのをワークフロー中で待てないので、
          # あきらめて「ワークフローをトリガーしたコミット」にタグを打つ。
          # changelog のコミットは、「タグを打ったコミット」より後の別のコミットになる。
          id: create-tag
          uses: mathieudutour/github-tag-action@v5.6
          # main 以外のブランチで実行した場合は `v1.2.3-{branch_name}.0` のようなタグがつくため、
          # main ブランチの bump には影響しない。
          # ※ custom_tag に、 main ブランチのタグと同じ形式のタグ名を指定すると影響する
          with:
            # secrets.GITHUB_TOKEN は github.token と同義だそうです
            github_token: ${{ secrets.GITHUB_TOKEN }}
            # 手動トリガー時に custom_tag を受け取った場合は、
            # 受け取ったタグ名でタグを打つ
            custom_tag: ${{ github.event.inputs.custom_tag }}

        - name: Create Pull Request
          id: cpr
          uses: peter-evans/create-pull-request@v3
          env:
            TAG_MAME: ${{ steps.create-tag.outputs.new_tag }}
          with:
            token: ${{ secrets.PR_CHANGELOG_PAT }}
            branch: 'deploy/${{ env.TAG_MAME }}'
            commit-message: 'Updated CHANGELOG ${{ env.TAG_MAME }}'
            title: 'Update CHANGELOG ${{ env.TAG_MAME }}'
            # どのコミットにタグを打ったかわからなくならないようにメモ↓
            body: 'Commit SHA: ${{ github.sha }}'

        - name: Enable Pull Request Automerge
          if: steps.cpr.outputs.pull-request-operation == 'created'
          uses: peter-evans/enable-pull-request-automerge@v1
          with:
            # repo scope の PAT を作成し、
            # GitHub Actions の secrets に登録しておく
            token: ${{ secrets.PR_CHANGELOG_PAT }}
            pull-request-number: ${{ steps.cpr.outputs.pull-request-number }}
            merge-method: squash

        - name: Auto approve Pull Request
          if: steps.cpr.outputs.pull-request-operation == 'created'
          uses: juliangruber/approve-pull-request-action@v1
          with:
            github-token: ${{ secrets.GITHUB_TOKEN }}
            number: ${{ steps.cpr.outputs.pull-request-number }}

    deploy:
      name: Deploy
      runs-on: ubuntu-latest
      needs:
        - changelog

      steps:
        - name: Checkout
          uses: actions/checkout@v2
          with:
            # changelog job で タグを打ったコミットをチェックアウトする
            # とはいえ、「ワークフローをトリガーしたコミット == タグを打ったコミット」なので、
            # 正直付けなくて良い
            fetch-depth: 0
            ref: ${{ needs.changelog.outputs.new_tag }}

        - name: Set tagged sha
          id: set-tag-sha
          # [確認用] チェックアウトしたブランチの最新の commit を取得
          run: |
            TAGGED_SHA=$(git log -1 --format='%H')
            echo $TAGGED_SHA
            echo "::set-output name=tag-sha::$TAGGED_SHA"

        - name: Echo github-ref
          run: echo "${{ github.ref }}"
        - name: Echo github-sha
          # ワークフローをトリガーしたときの SHA
          run: echo "${{ github.sha }}"
        - name: Echo tag-sha
          # チェックアウトしたブランチの最新の commit の SHA
          # == changelog job で tag を打った SHA
          # == github-sha
          run: echo "${{ steps.set-tag-sha.outputs.tag-sha }}"

        # あとは deploy する (省略)


Note
^^^^

* Create Pull Request, Enable Pull Request Automerge, Auto approve Pull Request の ``token``, ``github-token`` は、
  以下のとおり指定しないとうまくいかない (`Can not approve your own pull request` になっちゃう)

  1. Create Pull Request: ``secrets.PR_CHANGELOG_PAT``
  2. Enable Pull Request Automerge: ``secrets.PR_CHANGELOG_PAT``
  3. Auto approve Pull Request: ``secrets.GITHUB_TOKEN``


  * ※ https://github.com/peter-evans/enable-pull-request-automerge#example に書いてある順番
  * 例えば、1 は ``secrets.GITHUB_TOKEN`` も指定可能ですが、そうすると、
  * 1. PR つくるひと -> 2. PR の自動マージ有効化するひと -> 3. PR を approve するひと => 1 と 3 がいっしょになっちゃう!!


Case4: protected branch に PR する、 tag は auto bump (changelog と tag のコミットがいっしょ!)
===============================================================================================

条件
----

Case3 と同じ

workflow
--------

workflow は二本用意します

1. changelog 生成, next tag 払い出し
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. ブランチを選択して、 ``Run workflow`` (手動トリガー)

   * タグ version の bump up は自動でやってくれるので、通常の実行時はタグ名を指定しない
   * デフォルトが ``Patch`` になっているので、 ``Minor`` or ``Major`` の version を bump up したいときは、 ``custom_tag`` を指定する

     * デフォルトは変えられます

2. changelog を生成
3. bump up したタグ名 (``next tag``) 払い出し

   * タグ打ちはまだしない (``dry_run: true``)

4. changelog を PR

   * ``deploy`` ラベルをつける
   * body に 3 で払い出した ``next tag`` を書いておく

5. changelog の PR の自動マージを有効化
6. changelog を PR を自動 approve => Automerge される

.. code-block:: yaml

  # Branch protection rules が適用されているブランチであれば、
  # main 以外のブランチでも実行できます

  name: Deploy dev (Case4-1. changelog)

  on:
    workflow_dispatch:
      inputs:
        custom_tag:
          description: 'メジャー/マイナーバージョンをインクリメントしたいときのみ指定してください (e.g. 1.2.0)'

  defaults:
    run:
      shell: bash

  jobs:

    changelog:
      name: Update CHANGELOG
      runs-on: ubuntu-latest

      steps:
        - name: Checkout
          uses: actions/checkout@v2

        - name: Build services
          run: |
            cp example.env .env
            docker-compose build --parallel
          env:
            DOCKER_BUILDKIT: 1

        - name: Update CHANGELOG
          run: docker-compose run -u 0 --rm djangoapp towncrier --yes

        - name: Stop and remove containers, networks and volumes
          run: docker-compose down -v
          if: always()

        - name: Bump tag version
          # bump up したタグ名を払い出す
          # main 以外のブランチで実行した場合は `v1.2.3-{branch_name}.0` のようなタグがつくため、
          #  main ブランチの bump には影響しない。
          #  ※ custom_tag に、 main ブランチのタグと同じ形式のタグ名を指定すると影響します
          id: bump-tag
          uses: mathieudutour/github-tag-action@v5.6
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            custom_tag: ${{ github.event.inputs.custom_tag }}
            # タグ打ちはまだしない
            dry_run: true

        - name: Create Pull Request
          id: cpr
          uses: peter-evans/create-pull-request@v3
          env:
            TAG_MAME: ${{ steps.bump-tag.outputs.new_tag }}
          with:
            # repo scope の PAT を作成し、
            # GitHub Actions の secrets に登録しておく
            token: ${{ secrets.PR_CHANGELOG_PAT }}
            branch: 'deploy/${{ env.TAG_MAME }}'
            commit-message: 'Updated CHANGELOG ${{ env.TAG_MAME }}'
            title: 'Update CHANGELOG ${{ env.TAG_MAME }}'
            # `deploy` label を付けておく
            labels: deploy, automerge
            # deploy workflow でタグ打ちするので、 next tag を body に書いておく
            body: ${{ env.TAG_MAME }}

        - name: Enable Pull Request Automerge
          if: steps.cpr.outputs.pull-request-operation == 'created'
          uses: peter-evans/enable-pull-request-automerge@v1
          with:
            token: ${{ secrets.PR_CHANGELOG_PAT }}
            pull-request-number: ${{ steps.cpr.outputs.pull-request-number }}
            merge-method: squash

        - name: Auto approve Pull Request
          if: steps.cpr.outputs.pull-request-operation == 'created'
          uses: juliangruber/approve-pull-request-action@v1
          with:
            github-token: ${{ secrets.GITHUB_TOKEN }}
            number: ${{ steps.cpr.outputs.pull-request-number }}


2. tag 打ちして deploy
^^^^^^^^^^^^^^^^^^^^^^

1. PR の close イベントで起動
2. 以下の条件に合致する場合に deploy job を実行する

   * ワークフローをトリガーした PR が merge 済み、かつ、
   * ワークフローをトリガーした PR の labels に ``deploy`` が含まれる

3. changelog のコミットにタグ打ち

   * タグ名には、 PR の body から取得した next tag を使用する

4. deploy


.. code-block:: yaml

  name: Deploy dev (Case4-2. deploy)

  on:
    pull_request:
      types: [closed]

  env:
    AWS_REGION: ap-northeast-1
    # (以下省略)

  defaults:
    run:
      shell: bash

  jobs:

    deploy:
      name: Tag and Deploy
      runs-on: ubuntu-latest
      # PR が merge 済み、かつ、`deploy` label 付きの場合だけ実行
      # ほかのトピックブランチが merge -> close されたときには、 Skip されるよ
      if: github.event.pull_request.merged == true && contains(github.event.pull_request.labels.*.name, 'deploy')

      steps:
        - name: Checkout
          uses: actions/checkout@v2
          # ワークフローをトリガーした PR の マージブランチの直近のマージコミット
          # がチェックアウトされる

        - name: Echo github-ref
          # ワークフローをトリガーした PR のマージブランチ
          # 例えば、PR のブランチが main から生えていたら、 `main` 、
          #  ブランチA から生えていたら `branchA`
          run: echo "${{ github.ref }}"
        - name: Echo github-sha
          # ワークフローをトリガーした PR の マージブランチの直近のマージコミット
          # == changelog の commit
          # (タイミングによっては違っちゃうこともあるかもしれない、頻度は低いが可能性としてはありえそう)
          run: echo "${{ github.sha }}"
        - name: Echo github-head-sha
          # PR のブランチで changelog を commit したときの commit
          run: echo "${{ github.event.pull_request.head.sha }}"

        - name: Push tag
          env:
            # ワークフローをトリガーした PR の body から取得した next tag
            TAG_MAME: ${{ github.event.pull_request.body }}
            COMMIT: ${{ github.sha }}
          run: |
            git tag $TAG_MAME $COMMIT
            git push origin $TAG_MAME

        # あとは deploy する (省略)


その他
------

* GitHub Actions はスケジュール実行もできる。
  ``next tag`` がデフォルトの挙動通りで良いシーンでは、夜間に定期 deploy などしても。

  * `スケジュールしたイベント <https://docs.github.com/ja/actions/reference/events-that-trigger-workflows#scheduled-events>`_
