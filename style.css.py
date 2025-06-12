body {
  font-family: Arial, sans-serif;
  background-color: #222;
  color: white;
  text-align: center;
  margin: 0;
  padding: 10px;
}

h1 {
  font-size: 1.8em;
  margin-bottom: 10px;
}

#timers {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

#white-timer, #black-timer {
  background-color: #333;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1.1em;
}

#chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  max-width: 100vmin;
  aspect-ratio: 1 / 1;
  margin: auto;
  border: 4px solid #444;
}

.square {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5vmin;
  user-select: none;
}

.white {
  background-color: #f0d9b5;
}

.black {
  background-color: #b58863;
}

.white-piece {
  color: #fff;
  text-shadow: 1px 1px 2px black;
}

.black-piece {
  color: #000;
  text-shadow: 1px 1px 2px white;
}

#controls {
  margin-top: 15px;
}

#controls button {
  padding: 12px 24px;
  font-size: 1.1em;
  background-color: #4CAF50;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#controls button:hover {
  background-color: #45a049;
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5em;
  }

  #controls button {
    width: 90%;
    font-size: 1em;
  }

  #timers {
    flex-direction: column;
    gap: 10px;
  }

  #white-timer, #black-timer {
    font-size: 1em;
  }
}