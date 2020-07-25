import "../styles/global.css"
import { AppProps } from "next/app";

// すべてのページにスタイルを適用したいときは App Compnent を使う
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
