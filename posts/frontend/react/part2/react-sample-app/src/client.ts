import Axios, {AxiosInstance, AxiosResponse, CancelToken} from 'axios';

const baseURL = 'https://us-central1-fumi23-chat-app.cloudfunctions.net/v1';

const instance: AxiosInstance = Axios.create({
  // baseURL: リクエスト先 URL のプレフィックスとして付与される
  baseURL,
  timeout: 10000
});

export interface Message {
  id?: string;
  body?: string;
  user?: {
    id?: string
    name?: string
    avatar?: string
  };
  date?: string;
}

export const fetchMessages = (channelName: string, params = {}, cancelToken: CancelToken = null): Promise<AxiosResponse<{ messages: Message[] }>> => {
  // メッセージ一覧を取得する
  return instance.get(`/channels/${channelName}/messages`, {
    params,
    cancelToken
  });
};

export const postMessage = (channelName: string, payload: Message, cancelToken: CancelToken = null): Promise < AxiosResponse < Message >> => {
  // ユーザが入力した内容をサーバサイドアプリケーションに送信する
  return instance.post(`/channels/${channelName}/messages`, payload, {
    cancelToken
  });
};
