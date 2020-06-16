import * as React from "react";
import {Menu, Icon} from 'semantic-ui-react';
import {Link,NavLink} from 'react-router-dom';


export class ChannelList extends React.Component<{}, {}> {
  /* チャンネル一覧 */

  public render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // 本当はサーバーサイドから動的に取得するけれど、今は簡略化のためチャンネル一覧をここで定義
    const channels = ['general', 'random'];

    // 配列と map() を利用して Component の配列を戻す場合、必ずkeyを付与する。
    // key は配列内でユニークな必要がある。

    // NavLink: a要素としてレンダリングされる Component
    // to にパスを指定しておくと、 a要素が選択されたときに URL を指定したパスに変更する働きがある。
    // 同時に、選択された要素のクラス名に active が付与される。
    return (
      <Menu inverted vertical fixed={'left'}>
        <Menu.Item>
          Channels
          <Menu.Menu>
            {channels.map(channel =>
              <Menu.Item
                key={channel}
                as={NavLink}
                to={{ pathname: `/channels/${channel}` }}>
                {channel}
              </Menu.Item>
            )}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}
