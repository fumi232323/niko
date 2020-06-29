/* static async getInitialProps() でインドカレーの画像群を返す */
import * as React from "react";

import { ICurry } from "../models/Curry"
import { CurryList } from "../components/CurryList";
import { MainTitle, MainContent } from "../styled/Page";
// import fetch from "isomorphic-unfetch";

interface IProps {
  // ICurry型の配列
  // この書き方なつかしい
  curries: ICurry[];
}

export default class BlogsPage extends React.Component<IProps> {
  // React の Component 継承するときは、Props と State の型を指定する↑
  static async getInitialProps(ctx: any) {
    // https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
    // `getInitialProps` is used to asynchronously fetch some data, which then populates `props`.
    // サーバーサイドレンダリングを有効にし、初期データ設定できる (SEO に役立つらしい)
    // static メソッドとして任意の Page にくっつけられる。 async で。
    // async は非同期
    // ctx は context の略だな: https://nextjs.org/docs/api-reference/data-fetching/getInitialProps#context-object
    try {
      // const response = await fetch('https://??????.???/curries/india');
      // const json = await response.json();

      // 通常では上記のように外部APIサーバーに対してデータを取得しにいきますが、今回は簡潔に済ますために
      // static async getInitialProps() で直接データを returnすることにします。
      // 下記のデータがAPIサーバーから返ってくると想定して、進めます。
      // 画像はpixabay様の著作権フリー・帰属表示不要の画像を使っています。
      // https://pixabay.com/ja/
       const json: ICurry[] = [
        {
          id: 1,
          name: "Curry1",
          imageUrl: "/static/curry1.jpg"
        },
        {
          id: 2,
          name: "Curry2",
          imageUrl: "/static/curry2.jpg"
        },
        {
          id: 3,
          name: "Curry3",
          imageUrl: "/static/curry3.jpg"
        },
        {
          id: 4,
          name: "Curry4",
          imageUrl: "/static/curry4.jpg"
        },
        {
          id: 5,
          name: "Curry5",
          imageUrl: "/static/curry5.jpg"
        },
        {
          id: 6,
          name: "Curry6",
          imageUrl: "/static/curry6.jpg"
        }
      ];

       return {
         // このメソッドは Props に初期値を設定するので、返すのは Props
         // この Component の Props の型は IProps (Interface)
         // というわけで、 curries プロパティ持ってるよね
         curries: json
       };
    } catch (e) {
      console.error(e)
      return {
        // エラー時は空のカレー配列を返す
        curries: []
      }
    }
  }

  public render() {
    return (
      <MainContent>
        <MainTitle>Indian Curries</MainTitle>
        <CurryList curries={this.props.curries} />
      </MainContent>
    );
  }
}
