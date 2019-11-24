.. title: Django: settings.py
.. tags: django
.. date: 2019-11-24
.. slug: index
.. status: published


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


書籍/リファレンス
=================
* Djangoの設定: https://docs.djangoproject.com/ja/2.2/topics/settings/
* 設定: https://docs.djangoproject.com/ja/2.2/ref/settings/
* `現場で使える Django の教科書 <https://booth.pm/ja/items/1059917>`_ 第10章


概要
=====
* 設定オブジェクト: ``django.conf.settings``

  * Django 起動時に次のようにインスタンス化されるシングルトンなグローバルオブジェクト

    .. code-block:: python

      # django/conf/__init__.py
      settings = LazySettings()

  * ↑ は、Django のデフォルト設定ファイル ( ``django.conf.global__settings.py`` ) を読み込んだ後
  * プロジェクト作成時に生成される設定ファイル ( ``settings.py`` ) を読み込んで設定を上書きされる


* 設定ファイル: プロジェクト生成時に生成される ``settings.py``

  * Django のデフォルト設定とは異なるプロジェクト固有の設定値や
  * 自作のアプリケーションで利用する独自の変数を記述しておく

* Django で利用できる設定変数とそのデフォルト値の一覧 => https://docs.djangoproject.com/ja/2.2/ref/settings/
* View や models からアクセスするときは、オブジェクトなので、

  .. code-block:: python

    # こんな風に参照しましょう
    from django.conf import settings
    settings.LOGIN_URL

* LazySettings ??

  * その設定値にアクセスされてから初めてその属性が読み込まれる
  * 最初にその属性値にアクセスされるまでは設定を変え放題
  * settings の属性に一度でもアクセスされてしまうと、変更しようとしてもエラーになるので、
  * 基本的には、設定ファイルの中で初期設定を済ませよう


インストールするアプリケーション一覧
====================================

.. code-block:: python

  INSTALLED_APPS = [
      # 略
      # Install するアプリケーションをリスト形式で列挙
      # 各アプリディレクトリ.apps.py の AppConfig クラスのサブクラスを指定する
      'accounts.apps.AccountsConfig',
      'shop.apps.ShopConfig',
  ]

* パッケージ名を書くのは少し古い書き方
* 上に書いた方が優先順位が高い


デバッグ設定
============

.. code-block:: python

  DEBUG = False

* 開発時は True にしておくと、いろいろ便利

  * エラー発生時に画面にデバッグ情報が出力される
  * django-debug-toolbar, SQL 文のロギングは True じゃないと使えない


静的ファイル/メディアファイル
==============================

* The staticfiles app: https://docs.djangoproject.com/ja/2.2/ref/contrib/staticfiles/
* 静的ファイルのデプロイ: https://docs.djangoproject.com/ja/2.2/howto/static-files/deployment/
* ファイルのアップロード: https://docs.djangoproject.com/ja/2.2/topics/http/file-uploads/
* Djangoで静的ファイルとうまくやる: https://tell-k.github.io/djangocongressjp2019/#1


静的ファイル関連の設定
----------------------

* ``静的ファイル (static ファイル)``: リクエストに応じて中身を変更せずそのまま配信するファイル

  * CSS ファイル
  * JavaScript ファイル
  * 画像ファイルに

* 単に静的ファイルをブラウザへ返すだけの処理をアプリケーションサーバーで捌くと、無駄が多くなってしまう

  * => アプリケーションサーバーの前段に Nginx に代表される ``リバースプロキシ`` と呼ばれるサーバーを配置し、
  * => 静的ファイルを返すだけの処理はリバースプロキシが担当し、
  * => Web application の処理が必要なリクエストだけをアプリケーションサーバーへ振り分けることで、
  * => 効率よくリクエストを捌けるようにする

* セキュリティの観点から、↓は別々にするケースが多い

  * 静的ファイルの配信元
  * プロジェクトで静的ファイルをバージョン管理する際のプロジェクト内での置き場所

* 最低限↓の３つの設定必要

  .. code-block:: python

    # これしておくと便利
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    PROJECT_NAME = os.path.basename(BASE_DIR)

    # 静的ファイル配信用のディレクトリ、URL の一部になる
    # 設定値はデフォルトの `/static/` のままでよい
    STATIC_URL = '/static/'

    # アプリケーションに紐づかない静的ファイルの置き場
    STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

    # 静的ファイルの配信元
    # collectstatic コマンドで静的ファイルを集約する際のコピー先でもある
    # `STATICFILES_DIRS` とは別のディレクトリを指定する必要がある
    # DEBUG = False のときに必要
    STATIC_ROOT = '/var/www/{}/static'.format(PROJECT_NAME)


* 静的ファイル集約のための管理コマンド: ``collectstatic``

  .. code-block:: bash

    $ python3 manage.py collectstatic

  * ``DEBUG = True`` のときは、 runserver がやってくれるので自分で ``collectstatic`` する必要ない

* ``STATIC_URL`` を使って画像を表示するテンプレート実装例

  .. code-block:: python

    {% load static %}
    <img src="{% static 'shop/images/no-image.png' %}">
    <img src="{% static 'images/logo.png' %}">


メディアファイル関連設定
-------------------------

* ``メディアファイル``: 静的ファイルのうち、 (システム管理者を含めた) ユーザーがサイトを利用してアップロードするファイル
* 本番環境では、メディアファイルもAPサーバーで裁かずにリバースプロキシなどで捌くことで負荷を減らす

.. code-block:: python

  # メディアファイルの設定例 (config/settings.py)
  # DEBUG =  False 時
  MEDIA_URL = '/media/'
  MEDIA_ROOT = '/var/www/{}/media'.format(PROJECT_NAME)

  # ユニットテスト時 or PaaS ? WhiteNoise 時
  MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root')

* アップロードを実装するときのコツは P.114 付近に詳しく書いてあるので、実装するときはよく見ること

runserver でメディアファイルを配信してくれる仕組みがある
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

動作確認に便利

.. code-block:: python

  # config/urls.py
  from django.conf import settings
  from django.conf.urls.static import static

  urlpatterns = [
      # ...
  ]
  # static 関数の内部で DEBUG = True でないと動作しないようにチェックしているよ
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


データベース設定
================

組み込みでサポートしているデータベースエンジン:
-----------------------------------------------

* django.db.backends.postgresql (PostgreSQL)
* django.db.backends.mysql (MySQL)
* django.db.backends.sqlite3 (SQLite)
* django.db.backends.oracle (Oracle)

設定できる項目一覧:
--------------------

* https://docs.djangoproject.com/ja/2.2/ref/settings/#databases

  * ``ATOMIC_REQUESTS``:  トランザクションの有効範囲をリクエストの開始から終了までにするかどうかを指定できる
  * ``OPTIONS``:

    * いろんなオプションを設定できる

      * トランザクションの分離レベル ``isolation_level``
      * MySQL の SQL モード ``sql_mode`` など

    * デフォルトから変更したら、Django 側だけでなくデータベース側にも同じ設定をしておくのが望ましい

MySQL で注意する点:
--------------------

* SQLモードを「厳密モード」にしておかないと振る舞いが微妙なので、設定しておいたほうがよい

  .. code-block:: python

    # 最も厳しく設定するとこうなる
    'OPTIONS': {
        'sql_mode': 'TRADITIONAL,NO_AUTO_VALUE_ON_ZERO'
    }

* MySQL を利用する際はドライバーが必要: Django 推奨は ``mysqlclient``


ロギングの設定
==============

https://docs.djangoproject.com/ja/2.2/topics/logging/

* プロジェクト作成時にはロギング設定は書かれていない
* Django の起動時に django.utils.log.py の ``DEFAUT_LOGGING`` の設定が読み込まれる


本番稼働時の LOGGING 設定例
-----------------------------

.. code-block:: python

  LOGGING = {
      # バージョンは「1」固定
      'version': 1,
      # 既存のログ設定を無効化しない
      'disable_existing_loggers': False,
      # ログフォーマット
      'formatters': {
          # 本番用
          'production': {
              'format': '%(asctime)s [%(levelname)s] %(name)s %(process)d %(thread)d '
              '%(pathname)s %(lineno)d %(message)s'
          },
      },
      # ハンドラ
      'handlers': {
          # ファイル出力用ハンドラ
          'file': {
              'level': 'INFO',
              # logging.handlers.RotatingFileHandler, logging.handlers.TimeRotatingFileHandler
              # を使うとログファイルをローテーションできて便利
              'class': 'logging.FileHandler',
              'filename': 'var/log/{}.log'.format(PROJECT_NAME),
              'formatter': 'production',
          },
      },
      # ロガー
      'loggers': {
          # 自作アプリケーション全般のログを拾うロガー
          # '' と書くと、独自に追加したアプリケーションのログを拾うことができる
          '': {
              'handlers': ['file']
              'level': 'INFO',
              'propagate': False,
          },
          # Django 本体が出すログ全般を拾うロガー
          'django': {
              'handlers': ['file']
              'level': 'INFO',
              'propagate': False,
          },
      },
  }


開発時の LOGGING 設定例
-----------------------------

.. code-block:: python

  LOGGING = {
      # バージョンは「1」固定
      'version': 1,
      # 既存のログ設定を無効化しない
      'disable_existing_loggers': False,
      # ログフォーマット
      'formatters': {
          # 開発用
          'develop': {
              'format': '%(asctime)s [%(levelname)s] %(pathname)s %(lineno)d %(message)s'
          },
      },
      # ハンドラ
      'handlers': {
          # コンソール出力用ハンドラ
          'console': {
              'level': 'DEBUG',
              # logging.handlers.RotatingFileHandler, logging.handlers.TimeRotatingFileHandler
              # を使うとログファイルをローテーションできて便利
              'class': 'logging.StreamHandler',
              'filename': 'var/log/{}.log'.format(PROJECT_NAME),
              'formatter': 'develop',
          },
      },
      # ロガー
      'loggers': {
          # 自作アプリケーション全般のログを拾うロガー
          '': {
              'handlers': ['console']
              'level': 'DEBUG',
              'propagate': False,
          },
          # Django 本体が出すログ全般を拾うロガー
          'django': {
              'handlers': ['console']
              'level': 'INFO',
              'propagate': False,
          },
          # 発行される SQL 文を出力するための設定
          # パフォーマンスの観点から DEBUG = True でないと出力されないようになっている
          'django.db.backends': {
              'handlers': ['console']
              'level': 'DEBUG',
              'propagate': False,
          },
      },
  }


ロガーを取得する
----------------

.. code-block:: python

  logger = logging.getLogger(__name__)


その他の重要な設定
===================

* ``TEMPLATES`` テンプレートに関する設定: https://docs.djangoproject.com/ja/2.2/ref/settings/#std:setting-TEMPLATES

  .. code-block:: python

    TEMPLATES = [
        {
            # テンプレートエンジン
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            # ビューから指定されるテンプレート名に対してどのディレクトリを優先してテンプレートを探しに行くかの順番を指定する
            'DIRS': [os.path.join(BASE_DIR, 'templates')],
            # テンプートを探す際に、各アプリケーションディレクトリ直下の templates を優先する場合 True
            'APP_DIRS': True,
            'OPTIONS': {
                # テンプレートから参照できる変数を渡すための context_processors
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

* ``LANGUAGE_CODE`` 言語コード: https://docs.djangoproject.com/ja/2.2/ref/settings/#language-code

  .. code-block:: python

    # デフォルトは 'en-us'
    # 管理サイトの表示もここで指定した言語に
    LANGUAGE_CODE = 'ja'  # 日本語

* ``TIME_ZONE`` タイムゾーン: https://docs.djangoproject.com/ja/2.2/ref/settings/#std:setting-TIME_ZONE

  .. code-block:: python

    # 時刻を表示する際のタイムゾーンを指定
    # デフォルトは 'UTC'
    TIME_ZONE = 'Asia/Tokyo'  # 日本

* ``MIDDLEWARE`` ミドルウェアの設定: https://docs.djangoproject.com/ja/2.2/ref/settings/#middleware
* ``ALLOWED_HOSTS`` 許可するホスト : https://docs.djangoproject.com/ja/2.2/ref/settings/#allowed-hosts
* ``SECRET_KEY`` シークレットキー: https://docs.djangoproject.com/ja/2.2/ref/settings/#std:setting-SECRET_KEY

  * Django 内部で暗号署名やハッシュ生成に利用されるシークレットな文字列
  * SECRET_KEY が設定されていない場合、Django は起動しない
  * django-admin startproject コマンドを実行すると、新しいプロジェクトを作成するたびに、ランダムに生成された SECRET_KEY を自動的に設定してくれる
  * 環境ごとに固有であることが望ましい

* ``SITE_ID`` サイトID: https://docs.djangoproject.com/ja/2.2/ref/settings/#sites


ベストプラクティス
===================
* 個人の開発環境の設定は ``local_settings.py`` に書く

  .. code-block:: bash

    $ python3 manage.py runserver 0.0.0.0:8000 --settings config.local_settings

    # もしくは
    $ export DJANGO_SETTINGS_MODULE=config.local_settings
    $ python3 manage.py runserver 0.0.0.0:8000

* シークレットな変数は ``.env`` に書く

  * バージョン管理下に置かない
  * settings.py には書かない
  * django-environ 便利
