// メッセージフォームComponentの実装
import * as React from 'react';
import {postMessage, Message} from '../client';
import {Button, Form, Segment, TextArea} from 'semantic-ui-react';

interface MessageFormProps {
  channelName: string;
  setShouldReload: (shouldReload: boolean) => void;
}

interface MessageFormState {
  // ユーザが入力するテキストを管理する
  body? : string;
}

export class MessageForm extends React.Component < MessageFormProps, MessageFormState > {

  constructor(props: MessageFormProps) {
    super(props);
    this.state = {
      // body の初期状態は空文字
      body: ''
    };
    // this をバインドしておく
    // this のコンテキストを明確にする方法はいくつかあるが、この方法はプラクティスの１つとされているとのこと。
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  public render() {
    return (
      <Segment basic textAlign='center'>
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Field>
            <TextArea
              autoheight="true"
              placeholder='Write your message'
              value={this.state.body}
              // 文字が入力されるたびにこれが呼ばれるよ
              onChange={this.handleTextAreaChange}
            />
          </Form.Field>
          < Button primary type='submit'>Send</Button>
        </Form>
        <p>入力中の値: {this.state.body}</p>
      </Segment>
    );
  }

  private handleTextAreaChange(event: React.FormEvent<HTMLTextAreaElement>) {
    // textarea の内容が変更された場合に呼び出されるメソッド
    // event: フォームのイベント
    // 本来の HTML イベントの発生を抑止
    event.preventDefault();
    // currentTarget.value: TextArea に入力された値を取り出している
    this.setState({body: event.currentTarget.value});
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      // textarea に入力された値を取得
      body: this.state.body,
      user: {
        id: '123',
        name: 'fumi23'
      }
    } as Message;
    postMessage(this.props.channelName, payload)
      .then(() => {
        // リクエストが成功した場合
        this.setState({body: ''});
        this.props.setShouldReload(true)
      })
      .catch(err => {
        console.log(err);
      });
  }
}