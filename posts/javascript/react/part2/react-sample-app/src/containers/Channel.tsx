// Routing 設定に対応する Component であるため、 components ディレクトリとは別の containers ディレクトリに配置する
import * as React from 'react';
import {match} from 'react-router-dom';
import { MessageFeed, MessageForm } from '../components';
import {Dimmer, Loader} from 'semantic-ui-react';
import {isWhiteSpace} from "tslint";


interface ChannelMatch {
  channelName: string;
}


interface ChannelProps {
  // チャンネル詳細Component の props
  // react-router の機能で受け渡される props.match を利用するため
  match: match<ChannelMatch>;
}


interface ChannelState {
  // メッセージを再取得すべきフラグ
  shouldReload: boolean;
  isLoading: boolean;
}


export class Channel extends React.Component<ChannelProps, ChannelState> {
  // チャンネル詳細
  constructor(props: ChannelProps){
    super(props);
    this.state = {
      // 初期状態では False
      shouldReload: false,
      isLoading: false
    }
  }

  public render() {
    // channelName は、 react-router の RouteComponent で定義したパス
    // /channels/:channelName のパラメータ部分に対応している
    const { channelName } = this.props.match.params;
    if(this.state.isLoading){
      // ここは現在動いていません
      return(
        <Dimmer active><Loader/></Dimmer>
      );
    }
    return(
      // render() で複数の Component を戻すときに配列を利用できる
      [
        <MessageFeed key='message-feed'
          channelName={channelName}
          shouldReload={this.state.shouldReload}
          setShouldReload={this.setShouldReload}
        />,
        <MessageForm key='message-form'
          channelName={channelName}
          setShouldReload={this.setShouldReload}
        />
      ]
    );
  }

  private setShouldReload = (shouldReload: boolean) => {
    // 引数を持ちたいので、コンストラクタで this をバインドする方法ではなく Arrow Function として定義する
    this.setState({shouldReload});
  }

  private setIsLoading = (isLoading: boolean) => {
    // 引数を持ちたいので、コンストラクタで this をバインドする方法ではなく Arrow Function として定義する
    this.setState({isLoading});
  }

}
