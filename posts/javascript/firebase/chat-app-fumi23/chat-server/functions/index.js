// Firebase Functions SDK: HTTPリクエストをトリガする
const functions = require('firebase-functions');
// Firebase Admin SDK で、 Realtime Database の処理および認証をする
// 事前に環境変数 GOOGLE_APPLICATION_CREDENTIALS に、サービス アカウント キーが含まれる JSON ファイルのファイルパスを設定する。
// $ export GOOGLE_APPLICATION_CREDENTIALS="path/to/fumi23-chat-app-firebase-adminsdk-e09li-560aa95e27.json"
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://fumi23-chat-app.firebaseio.com'
});

// Express モジュールをインポートして、 app としてインスタンス化
const express = require('express');
const app = express();

// CORS モジュールをインポートして、 app にロード
const cors = require('cors')({origin:true});
app.use(cors);

const anonymousUser = {
  id:"anon",
  name:"Anonymous",
  avatar:""
};

const checkUser = (req, res, next) => {
  req.user = anonymousUser;
  if(req.query.auth_token != undefined) {
    let idToken = req.query.auth_token;
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
      let authUser = {
        id: decodedIdToken.user_id,
        name: decodedIdToken.name,
        avatar: decodedIdToken.picture
      };
      req.user = authUser;
      next();
    }).catch(error => {
      next();
    });
  } else {
    next();
  }
};

app.use(checkUser);

/**
 * チャンネルを作成するAPI
 * 
 * 引数 cname で Realtime Database のパス channels/:cname にデータを挿入する
 */
function createChannel(cname) {
  // AdminSDK による Realtime Database の操作は、 admin.database() を使う
  // 特定のノードを参照するには .ref() を使う
  let channelsRef = admin.database().ref('channels');
  let date1 = new Date();
  let date2 = new Date();
  date2.setSeconds(date2.getSeconds() + 1);
  const defaultData = `{
    "messages":{
      "1": {
        "body": "Welcome to #${cname} channel!",
        "date": "${date1.toJSON()}",
        "user": {
          "avatar": "",
          "id": "robot",
          "name": "Robot"
        }
      },
      "2": {
        "body": "はじめてのメッセージを投稿してみましょう。",
        "date": "${date2.toJSON()}",
        "user": {
          "avatar": "",
          "id": "robot",
          "name": "Robot"
        }
      }
    }
  }`;
  // 子ノードの参照は .child() と使う
  // データの挿入は .set()
  channelsRef.child(cname).set(JSON.parse(defaultData));
}

// app.post(): 第一引数のパスへ POST リクエストが行われた際の処理を記述する
app.post('/channels', (req, res) => {
  let cname = req.body.cname;
  createChannel(cname);
  res.header('ContentType', 'application/json; charset=utf8');
  res.status(201).json({result: 'ok'});
});

/**
 * チャンネル一覧を取得するAPI
 * 
 * /channels に GETリクエストが行われたときに Realtime Datastore からチャンネル名を取得し、一覧を JSON データで返す
 */
app.get('/channels', (req,res) => {
  let channelsRef = admin.database().ref('channels');
  // value イベント: データを読み出すとき使う
  // .once: 1回だけコールバック
  channelsRef.once('value', function(snapshot) {
    let items = new Array();
    snapshot.forEach(function(childSnapshot) {
      let cname = childSnapshot.key;
      items.push(cname);
    });
    res.header('ContentType', 'application/json;charset=utf8');
    res.send({channels:items});
  });
});

/**
 * 指定したチャンネルへメッセージを追加するAPI
 */
app.post('/channels/:cname/messages', (req, res) => {
  // POST リクエストの :cname の位置にある値が req.params.cname にセットされる
  let cname = req.params.cname;
  let message = {
    date: new Date().toJSON(),
    body: req.body.body,
    user: req.user
  };
  let messagesRef = admin.database().ref(`channels/${cname}/messages`);
  // .push() で message オブジェクトを `channels/${cname}/messages` にセット
  messagesRef.push(message);
  res.header('ContentType', 'application/json;charset=utf8');
  res.status(201).send({result:"ok"});
});

/**
 * チャンネル内メッセージ一覧を取得するAPI
 */
app.get('/channels/:cname/messages', (req, res) => {
  let cname = req.params.cname;
  // .orderByChild(): 子キー date による並べ替え
  // .limitToLast(): 最後から 20件
  let messagesRef = admin.database().ref(`channels/${cname}/messages`).orderByChild('date').limitToLast(20);
  messagesRef.once('value', function(snapshot) {
    let items = new Array();
    snapshot.forEach(function(childSnapshot) {
      let message = childSnapshot.val();
      message.id = childSnapshot.key;
      items.push(message);
    });
    items.reverse();
    res.header('ContentType', 'application/json;charset=utf8');
    res.send({messages: items});
  });
});

/**
 * 初期状態に戻すAPI
 */
app.post('/reset', (req, res) => {
  createChannel('general');
  createChannel('random');
  res.header('ContentType', 'application/json; charset=utf8');
  res.status(201).send({result:"ok"});
});

// appオブジェクトを外部から呼び出せるようにする
// functions.http.onRequest() を使うことで、HTTPリクエストのイベント処理を行うことができます。
// ここでは、.onResquest(app) の引数に app を指定し  v1関数から app を利用できるようにしています。
exports.v1 = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
