/*
  next.config.js:
  Next.js 全般設定
*/
// TypeScript を使うよ
const withTypescript = require("@zeit/next-typescript");
// レスポンスヘッダから X-Powered-By ヘッダを取り除く (クライアントにバージョンを知らせない)
module.exports = withTypescript({
  poweredByHeader: false
});
