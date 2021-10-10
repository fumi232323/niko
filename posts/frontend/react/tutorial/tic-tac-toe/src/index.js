import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square (props) {
  // 正方形のマス目
  // React 用語でいうと、Square コンポーネントは制御されたコンポーネント (controlled component) になった
  // これは関数コンポーネント
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // 盤面
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        // マス目がクリックされた時に Square が呼び出すためのもの
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // 盤面と、プレースホルダーを描画
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        // 9つのマス目に対応する Array
        // 最初は手なしのひとつ
        squares: Array(9).fill(null),
      }],
      // いま何手目の状態を見ているのかを表す
      stepNumber: 0,
      // どちらのプレーヤの手番なのか
      xIsNext: true,
    };
  }

  handleClick(i) {
    /*マス目をクリックしたときに実行される*/
    // 登録済み履歴を 0 から最新の要素までスライス
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // 今保持している履歴のうちの最新を取得 (つまりは今クリックした着手の一つ前の着手)
    const current = history[history.length - 1];
    // .slice() で配列のコピーを作成
    // 直接的なデータのミューテートを避けることで、ゲームの以前のヒストリをそのまま保って後で再利用することができるようになります。
    // ミュータブルなオブジェクト変更の検出のためには、以前のコピーと比較してオブジェクトツリーの全体を走査する必要があります。
    // 一つ前のマス目状態をコピーしている
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      // ゲームの決着が既についている場合やクリックされたマス目が既に埋まっている場合に早期に return する
      return;
    }
    // 今打った手を記録 (一つ前に追加してるから)
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // concat() は元の配列をミューテートしない
      history: history.concat([{
        // 今打った手を履歴登録
        squares: squares,
      }]),
      stepNumber: history.length,
      // 次の着手のために手番を反転
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsnext: (step % 2) === 0,  // 型も同じで値も同じ
    })
  }

  render() {
    /*
      ゲーム履歴内のどの手番をクリックした場合でも、三目並べの盤面は、
      該当の着手が発生した直後の状態を表示するように更新される
     */
    const history = this.state.history;
    // history のうち、最新のもの
    // const current = history[history.length - 1];
    // 現在選択されている着手をレンダーする
    const current = history[this.state.stepNumber];
    // 勝敗判定
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // move は配列の要素番号
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      // どちらのプレーヤの手番なのかを表示する
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  // ゲーム勝者の判定
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
