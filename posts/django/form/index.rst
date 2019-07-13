.. title: Django: Form
.. tags: django
.. date: 2019-05-12
.. slug: index
.. status: draft


.. raw:: html

  <details>
    <summary>目次</summary>

.. contents::

.. raw:: html

  </details>


書籍/リファレンス
=================
- TBD

Form
=========

役割
----
* 入力データの保持
* バリデーション

  * OK の場合: ``cleaned_data`` (辞書) に入る、型変換してくれる
  * NG の場合: エラーメッセージ (list)

入力フィールド
--------------

.. code-block:: python

  from django import forms

  class LoginForm(forms.Form):
      # この変数名が画面の入力フィールドの name 属性になる
      password = forms.CharField(  # django.forms.fields.Field クラスのサブクラスを指定
          # widget でどんな部品で画面に表示するか指定できる。 Field ごとにデフォルトもある。
          widget=forms.PasswordInput(render_value=True),
          # そのほかにも、いろいろ指定できる。指定できるものは Field により異なる。
          label='パスワード',
          strip=False,
      )


バリデーションの順番
--------------------

入り口: ``is_valid()``


#. ``Form.フィールド`` に定義されたバリデーション: 文字種チェックなど ※フォームクラスに定義した順にやられる

    * 一. to_python(): フィールドに自作クラスを使うとか
    * 二. validate(): フィールドに自作クラスを使うとか
    * 三. run_validators(): フィールドの validators 属性に何か入れてるとき

#. ``Form.clean_<フィールド名>()``: 単項目、妥当性チェック ※フォームクラスに定義した順にやられる
#. ``Form.clean()``: 複数項目、相関チェック、データベースとの整合性チェック


clean
------

.. code-block:: python

  from django import forms

  class LoginForm(forms.Form):
      username = UsernameField(
          label='ユーザー名',
          max_length=255,
      )

      # ``clean_<フィールド名>`` というメソッド名にする
      def clean_username(self):
          # 入力値は cleaned_data から取得する
          username = self.cleaned_data['username']
          if len(username) < 3:
              # バリデーション NG の場合
              raise forms.ValidationError(
                  # ValidationError を raise すると Form 内部の変数にエラーメッセージを追加できる
                  # ValidationError には↓のように、メッセージを設定できる
                  '%(min_length)s 文字以上で入力してください', params={'min_length': 3}
              )
          # cleaned_data に値を再セットする
          # ``return 値`` しないと値が消えてしまう
          return username


こんなのある
============

インラインフォームセット
------------------------
使い方はよくわかっていない

- https://docs.djangoproject.com/ja/1.11/topics/forms/modelforms/#inline-formsets
- https://docs.djangoproject.com/ja/1.11/ref/forms/models/#inlineformset-factory
