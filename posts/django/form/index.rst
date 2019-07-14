.. title: Django: Form
.. tags: django
.. date: 2019-07-14
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
- `Django documentation > フォーム API <https://docs.djangoproject.com/ja/2.2/ref/forms/api/>`_
- `現場で使える Django の教科書 <https://booth.pm/ja/items/1059917>`_


役割
=====
* 入力データの保持
* バリデーション

  * OK の場合: ``cleaned_data`` (辞書) に入る

    * ユーザー入力データを Python 型へ変換してくれる

  * NG の場合: エラーメッセージ (list)


入力フィールド
===============

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


バリデーション
==============

実行される順番
--------------

#. ``Form.is_valid()``


#. ``Form.フィールド`` に定義されたバリデーション

   * 文字種チェックなど
   * フォームクラスに定義した順に実行される

#. ``Form.clean_<フィールド名>()``

   * 単項目。フィールド単体のバリデーション。
   * 妥当性チェック
   * フォームクラスに定義した順に実行される

#. ``Form.clean()``

   * 複数項目
   * 相関チェック
   * データベースとの整合性チェック

#. バリデーション OK の場合、 ``Form.cleaned_data`` に検証済みデータがセットされる

   * ``is_valid()`` 未実行の場合は ``cleaned_data`` 属性自体が存在しない


clean_<フィールド名>()
----------------------

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
          # バリデーションOK の場合は、 検証済み値を return することで cleaned_data に値を再セットできる
          # ``return 値`` しないと cleaned_data から値が消えてしまう!!
          return username


clean()
-------

.. code-block:: python

      def clean(self):
          # 入力値は cleaned_data から取得する
          username = self.cleaned_data['username']
          password = self.cleaned_data['password']

          try:
              user = User.objects.get(username=username)
          except ObjectDoesNotExist:
              # バリデーション NG の場合 `ValidationError` を raise することで
              # エラーメッセージを Form 内部の変数に追加できる
              raise forms.ValidationError("正しいユーザー名を入力してください")

          # バリデーションOK の場合、 検証済み値を return する必要はない


View からの利用
===============

* リクエストオブジェクトから入力データを取得して型変換
* 入力データをバリデーション

.. code-block:: python

  # Form に request.POST をあげる
  form = LoginForm(request.POST)
  # request から入力データを取り出して => 型変換して => バリデーションをする
  is_valid = form.is_valid()

  if not is_valid:
    # ヴァリデーションNGの場合、遷移元画面のテンプレートにフォームオブジェクトを 'form' という名前で渡している
    return render(request, 'account/login.html', {'form': form})


Template からの利用
===================

* テンプレート内でフォームの入力データやエラーメッセージを表示する

.. code-block:: python

  # これだけで入力データがセットされた入力フィールドを全て出力できる
  # * フィールドの出力順は、フォームクラスにフィールドを定義した順
  # * 順番を変更したい => Form に `field_order`
  {{form}}


.. code-block:: python

  {# form オブジェクトをイテレートすると form に定義した fields が順番に取り出せるよ! #}
  {% for field in form %}
    <div class="field">
      {{ field }}
    </div>
    {% if field.errors %}
      {# field に関連する error messages は errors 属性にリスト形式で入っている #}
      {{ field.errors.0 }}
    {% endif %}
  {% endfor %}

  {# 全体エラーメッセージ #}
  {# Form.clean() で追加したエラーメッセージは、 form オブジェクトの non_field_errors 属性にリストで入っている #}
  {% if form.non_field_errors %}
  <div class="ui red message">
    <ul class="list">
      {% for non_field_error in form.non_field_errors %}
        <li>{{ non_field_error }}</li>
      {% endfor %}
    </ul>
  </div>
  {% endif %}


CSRF
====

* シーサーフ、クロスサイトリクエストフォージェリーと呼ばれるセキュリティ攻撃の一種
* POST リクエストに CSRF 対策のトークン ``csrfmiddlewaretoken`` を加えられる

.. code-block:: python

  # template の form 内にこれを書くよ
  {% csrf_token %}


ModelForm
=========

こんなときに利用価値が高い
----------------------------

* モデルに定義したフィールドのうちのいくつかが画面の入力フィールドと合致する
* モデルの登録や変更を伴う


.. code-block:: python

  from django import forms
  from django.contrib.auth.models import User

  # django.forms.models.ModelForm を継承する
  class RegisterForm(forms.ModelForm):
      """ユーザー登録画面用のフォーム"""
      class Meta:
          # 利用するモデルクラスを指定
          model = User
          # 利用するモデルのフィールドを指定
          fields = ('username', 'email', 'password', )


ModelForm の Field
-------------------

* ModelForm は、モデルの django.db.models.fields.Field のサブクラスを自動判別してそれに対応するフォームの django.forms.fields.Field のサブクラスに変換してくれる

  * 対応表は P.92

* 変換されたフォームの Field をそのまま使えない場合は、いろいろカスタマイズできる。

  .. code-block:: python

    class RegisterForm(forms.ModelForm):
        """ユーザー登録画面用のフォーム"""

        class Meta:
            model = User
            fields = ('username', 'email', 'password',)
            # widget を TextInput から PasswordInput に変更
            widgets = {
                'password': forms.PasswordInput(attrs={'placeholder': 'パスワード'})
            }

        # User モデルにはない「確認用パスワード」フィールドを追加
        password2 = forms.CharField(
            label='確認用パスワード',
            required=True,
            strip=False,
            widgets=forms.PasswordInput(attrs={'placeholder': '確認用パスワード'})
        )

        def __init__(self, *args, **kwargs):
            super(RegisterForm, self).__init__(*args, *kwargs)
            # プレースホルダーをつける
            self.fields['username'].widget.attrs = {'placeholder': 'ユーザー名'}
            # email に必須を設定
            self.fields['email'].required = True
            # プレースホルダーをつける
            self.fields['email'].widget.attrs = {'placeholder': 'メールアドレス'}


ModelForm のバリデーションが実行される順番 (P.94 の絵がとてもよい)
-------------------------------------------------------------------

1. フィールドのバリデーション

   * 文字種などの形式チェック

2. フォームのバリデーション

   * 値の妥当性チェック
   * ``clean_<フィールド名>()`` => ``clean()``

3. モデルのバリデーション

   * ユニーク制約などのデータベースとの整合性チェック

     * モデルの各フィールドに定義された ``unique=True`` の制約にしたがって、レコードがユニークになっているか否かチェックしてくれる! ので、
     * モデルの登録変更を伴うフォームでは、親クラスの ``clean()`` を明示的に呼び出すとよい

        .. code-block:: python

          def clean(self):
              # 明示的に親クラスの clean() を呼び出すことで、
              # Form を `_validate_unique = True` に更新する
              # そうすると、 validate_unique() が実行されるようになる
              super(RegisterForm, self).clean()
              password = self.changed_data['password']
              password2 = self.changed_data['password2']
              if password != password2:
                  raise forms.ValidationError("パスワードと確認用パスワードが合致しません")

View からの利用
----------------

* 登録の場合

  .. code-block:: python

    # GET や POST オブジェクトをあげる
    form = RegisterForm(request.POST)
    # 対象のモデルをデータベースに保存
    user = form.save()


* request からもらったものだけでは足りない場合

  .. code-block:: python

    # モデルにセットするけれど、データベースには登録していない
    user = form.save(commit=False)
    # 補完してあげる
    user.set_password(form.cleaned_data['password']
    # データベースに登録する
    user.save()


* 更新の場合

  .. code-block:: python

    # 更新したい model オブジェクトを DB から取得
    user = User.objects.get(pk=request.user.id)
    # `instance` キーワード引数にあげる
    form = ProfileForm(request.POST, instance=user)
    # 更新前のデータをベースにして request で上書きしてくれる


こんなのある
============

インラインフォームセット
------------------------
使い方はよくわかっていない

- https://docs.djangoproject.com/ja/2.2/topics/forms/modelforms/#inline-formsets
- https://docs.djangoproject.com/ja/2.2/ref/forms/models/#inlineformset-factory
