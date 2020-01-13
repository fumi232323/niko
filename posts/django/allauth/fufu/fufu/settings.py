"""
Django settings for fufu project.

Generated by 'django-admin startproject' using Django 2.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'o=uce-pwytvkyjsg8vv12#5zvh765-w!ph==vxs#_(^nw(in$='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # django-allauth ######
    'django.contrib.sites',  # django-allauth では sites フレームワーク必須
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.github',  # GitHub とソーシャル連携
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'fufu.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fufu.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

# 日本語にするとテンプレートも勝手に日本語で表示される
LANGUAGE_CODE = 'ja'
# 英語にするとテンプレートも勝手に英語で表示される
# LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Tokyo'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

##################
# Authentication #
##################

# メールアドレスとパスワードで認証
AUTHENTICATION_BACKENDS = (
    # デフォルト: これを残しておくと管理画面はユーザー名/パスワードで認証できる
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',  # django-allauth を追加
)
# 認証⽅式を 「メールアドレスとパスワード」 に変更
ACCOUNT_AUTHENTICATION_METHOD = 'email'
# ユーザー名は使⽤しない
ACCOUNT_USERNAME_REQUIRED = False

# django-allauth にはこれが必要
SITE_ID = 1

LOGIN_REDIRECT_URL = 'home'
ACCOUNT_LOGOUT_REDIRECT_URL = '/accounts/login/'

# ログアウトリンクログアウトさせたい場合 True
# (デフォルトはログアウト画面経由で POST リクエスト)
ACCOUNT_LOGOUT_ON_GET = True

# ユーザー登録時にメールアドレス確認を行う
ACCOUNT_EMAIL_VARIFICATION = 'mandatory'
# ユーザー登録時にメールアドレス確認を行わない
# ACCOUNT_EMAIL_VARIFICATION = 'none'
# ユーザー登録画面でにEmailを必須項目にする
ACCOUNT_EMAIL_REQUIRED = True

##################
# AWS settings   #
##################
# 本当は settings には書かない
AWS_ACCESS_KEY_ID = 'MY-ACCESS-KEY-ID'
AWS_SECRET_ACCESS_KEY = 'MY-SECRET-ACCESS-KEY'

##################
# Email settings #
##################
# Amazon SES を使う場合
# https://pypi.org/project/django-ses/
EMAIL_BACKEND = 'django_ses.SESBackend'
# us-east-1 以外のAWSリージョンを使用する場合はこれも必要↓
# AWS_SES_REGION_NAME = 'us-west-2'
# AWS_SES_REGION_ENDPOINT = 'email.us-west-2.amazonaws.com'

DEFAULT_FROM_EMAIL = SERVER_EMAIL = 'no-reply <no-reply@32imuf.com>'
