import {
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    Board
} from "./exports"

/* res.end(`
<!DOCTYPE html>
<html>
<head>
  <style>
    .chess-board {
      width: 640px;
      height: 640px;
      margin: 20px;
      border: 25px solid #333;
    }
    .black {
      float: left;
      width: 80px;
      height: 80px;
      background-color: #119900;
      font-size: 50px;
      text-align: center;
      display: table-cell;
      vertical-align: middle;
    }
    .white {
      float: left;
      width: 80px;
      height: 80px;
      background-color: #fff;
      font-size: 50px;
      text-align: center;
      display: table-cell;
      vertical-align: middle;
    }
    .piece.bk {
      background-image:url(bk.png);
    }
    .piece.wk {
      background-image:url(wk.png);
    }

    .piece {
      background-size: 100%;
    }

    .dragging {
      transform: translate(-300, 520, 629);
    }
  </style>
</head>
<body>
  <p>Done.</p>
  <script src="./dist/index.js"></script>
  <script>
    console.log(King)
  </script>
  <div class="chess-board">
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white bk" onclick="checkMoves(event)"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black wk"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
    <div class="piece white"></div>
    <div class="piece black"></div>
  </div>
</body>
</html>
`)*/