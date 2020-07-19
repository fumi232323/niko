import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head"
import Date from '../../components//date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  /* page を返す */
  // 受け取った `postData` を使って page を生成
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  /* ブログIDの一覧を返す
  *
  * `/posts/{id}.js` というパスで page を返すべき ID の一覧を返すよ。
  * 取得するのは単なる文字列の配列ではなく、オブジェクトの配列である必要がある。
  * 各オブジェクトには `params` キーが必要、かつ、 `id` キーを持つオブジェクトが含まれている必要がある。
  * (`[id]` をファイル名に使用しているため。でないと `getStaticPaths` がこけちゃうよ。)
  */
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
    // fallback: true
  }
}

export async function getStaticProps({ params }) {
  /* ブログID に紐づく、ページの生成に必要なデータを返す
  *
  * 引数の `params` の中に `id` が入ってる
  * (この page は `/posts/{id}.js` というパスでアクセスされる)
  */
  // どこぞから id をキーにブログのデータを取得している
  const postData = await getPostData(params.id)
  // The value of the `props` key will be
  //  passed to the `Post` component
  return {
    props: {
      // `props` key の inside で結果を返す
      postData
    }
  }
}
