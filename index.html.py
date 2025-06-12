<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Web Chess Game</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>♟ Web Chess Game</h1>

  <div id="timers">
    <div id="white-timer">Putih: 05:00</div>
    <div id="black-timer">Hitam: 05:00</div>
  </div>

  <div id="chessboard"></div>

  <div id="controls">
    <button onclick="restartGame()">🔄 Restart</button>
  </div>

  <audio id="move-sound" src="drag chess.mp3" preload="auto"></audio>

  <script src="script.js"></script>
</body>
</html>