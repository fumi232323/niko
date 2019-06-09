# ベースイメージ
FROM python:3
# Docker コンテナ内で使える環境変数を指定
ENV PYTHONUNBUFFERED 1
# イメージビルド時に mkdir /code する
RUN mkdir /code
# この後の指令は /code で実行する
WORKDIR /code
# requirements.txt をイメージ内の /code/ ディレクトリにコピーする
ADD requirements.txt /code/
# イメージビルド時に requirements.txt から pip install する
RUN pip install -r requirements.txt
# カレントディレクトリ配下を /code 配下にコピーする
ADD . /code/
