import * as React from 'react';
import {render} from 'react-dom';
import {Switch} from 'react-router';
import {BrowserRouter, Redirect, Route} from 'react-router-dom';
import {ChannelList} from './components';
import {Channel} from "./containers";
import {Container} from 'semantic-ui-react';


// Switch、BrowserRouter、Route: react-router から提供される Component。Routing設定に関するもの。
// Container: スタイル調整
// BrowserRouter は、ブラウザの HistoryAPI を利用する方式の Routing を行うために利用します。
// ChannelList はいわゆるグローバルナビゲーションの位置に収めたいため、 Switch よりも上位に記述します。

const routes = <BrowserRouter>
  <div id='wrapper'>
    <ChannelList/>
    <main style={{ margin: '1rem 0 1rem 16rem'}}>
      <Container>
        <Switch>
          <Route
            exact={true}
            path='/channels/:channelName'
            component={Channel}
          />
          <Route
            exact={true} path='/'
            render={() => <h1>Sample Application</h1>} />
        </Switch>
      </Container>
    </main>
  </div>
</BrowserRouter>;

// React のアプリケーション自体を読み込む。
// index.html の id属性が app である要素の位置にアプリケーションをレンダリングします。
render(routes, document.getElementById('app'));
