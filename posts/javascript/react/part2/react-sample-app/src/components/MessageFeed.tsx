import * as React from 'react';
import {fetchMessages, Message} from '../client';
import {Segment, Image, Comment, Header} from 'semantic-ui-react';

interface MessageFeedProps {
  channelName: string;
  shouldReload: boolean;
  setShouldReload: (shouldReload:boolean) => void;
}

interface MessageFeedState {
  messages: Message[];
}

export class MessageFeed extends React.Component<MessageFeedProps, MessageFeedState> {
  // TypeScriptでReactのコードを書く場合、React.Componentを継承する際にpropsの型とstateの型を指定する

  constructor(props: MessageFeedProps) {
    super(props);
    this.state = {
      // state の初期状態を定義する
      messages: []
    };
  }

  public render() {
    return (
      <Comment.Group>
        <Header as='h3' dividing>{this.props.channelName}</Header>
        {this.state.messages.slice().reverse().map(message =>
          <Comment key={message.id}>
            <Comment.Avatar src={message.user.avatar || '/img/avatar.png'}/>
            <Comment.Content>
              <Comment.Author as='a'>{message.user.name}</Comment.Author>
              <Comment.Metadata>
                <div>{message.date}</div>
              </Comment.Metadata>
              <Comment.Text>
                {message.body}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        )}
      </Comment.Group>
    );
  }

  private fetchMessages = (channelName: string) => {
    // XMLHttpRequest を利用して GET Request をサーバサイドアプリケーションに送信します。
    // 親Component の state である shouldReload をfalseに戻す
    this.props.setShouldReload(false);
    fetchMessages(channelName)
      .then(response => {
        // データが取得できた場合、取得結果を Component の state に反映します。
        // Component の state を更新するには、 setState() を利用します。
        // React では、 this.state を直接変更せず、必ず setState() から変更します。
        this.setState({messages: response.data.messages});
      })
      .catch(err => {
        console.log(err);
      });
  };

  public componentDidMount() {
    // Component のマウント時の一度だけ実行される
    this.fetchMessages(this.props.channelName);
  }

  public componentDidUpdate(prevProps: MessageFeedProps) {
    // propsの変化を利用してメッセージ一覧を再取得する
    if(prevProps.channelName !== this.props.channelName ||
      !prevProps.shouldReload && this.props.shouldReload){
      // 違うチャンネルが選択された、
      // もしくは、 shouldReload が false から true に変更された場合
      this.fetchMessages(this.props.channelName);
    }
  }
}
