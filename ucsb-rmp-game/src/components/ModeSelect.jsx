import React from "react";

export default function ModeSelect({ playerName, setMode }) {
  return (
    <div style={{ padding: 30 }}>
      <h2>Hello, {playerName} 👋</h2>
      <h3>Select Mode</h3>
      <button onClick={() => setMode("guess")}>Guess the Rating</button>
      <button onClick={() => setMode("higherlower")} style={{ marginLeft: 10 }}>
        Higher or Lower
      </button>
    </div>
  );
}
