import React from "react";

export default function StartScreen({ playerName, setPlayerName, onStart }) {
  return (
    <div style={{ padding: 30 }}>
      <h1>🎓 UCSB Rate My Professor Game</h1>
      <input
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <br /><br />
      <button disabled={!playerName} onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}
