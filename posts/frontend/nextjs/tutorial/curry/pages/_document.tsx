import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

/*
  Custom Document
  ※ サーバーサイド (Node.js側) でのみレンダリングされる
  ※ https://nextjs.org/docs/advanced-features/custom-document

  ※ すべてのページ（メニューやツールバーなど）で共有コンポーネントが必要な場合は、App を使う
*/
export default class MyDocument extends Document {
  // 自分のアプリケーションの <html> and <body> tags を拡張するために使う感じ
  static async getInitialProps(ctx: any) {
    // 非同期のサーバーサイドレンダリング
    // Props に初期値を設定できる
    // styled-components をサーバーサイドレンダリング
    // https://www.styled-components.com/docs/advanced#server-side-rendering
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
          sheet.collectStyles(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [...(initialProps.styles as any), ...sheet.getStyleElement()]
    };
  }

  public render(): JSX.Element {
    return (
      // <Html>, <Head />, <Main /> and <NextScript /> は必須
      <html lang="ja">
        <Head>
          <meta charSet="UTF-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <meta name="author" content="Curry Lover"/>
          <link rel="stylesheet" href="/static/reset.css"/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </html>
    )
  }
}
