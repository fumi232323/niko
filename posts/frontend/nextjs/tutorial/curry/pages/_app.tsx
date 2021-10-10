/* カスタムの共通レイアウトを作成 */
import React from "react";
import App, { Container } from "next/app";
import { GlobalNav } from "../components/GlobalNav";

/* 
  カスタム共通処理
  ※ サーバーサイド側とクライアント側、両方で実行される
  ※ Custom App :
    https://nextjs.org/docs/basic-features/typescript#custom-app
    https://nextjs.org/docs/advanced-features/custom-app
*/
export default class MyApp extends App {
  static async getInitialProps(ctx: any) {
    // この辺決まり文句なのかなー...
    let pageProps = {};

    if (ctx.Component.getInitialProps) {
      pageProps = await ctx.Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    // どのページでも表示される上部ナビゲーションバーを作成
    // Container は廃止だよ Warning が出るなあ..
    return (
      <Container>
        <GlobalNav />
        <Component {...pageProps} />
      </Container>
    );
  }
}


/*
//関数版だとこう
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
*/
