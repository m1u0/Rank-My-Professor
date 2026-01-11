import React from "react";

export default function Leaderboard({ playerName, onBack }) {
  const [leaderboards, setLeaderboards] = React.useState({ guess: [], higherlower: [] });

  React.useEffect(() => {
    const saved = localStorage.getItem("rmp_leaderboards");
    if (saved) setLeaderboards(JSON.parse(saved));
  }, []);

  const LeaderboardTable = ({ mode, title, emoji }) => {
    const sorted = [...leaderboards[mode]].sort((a, b) => b.score - a.score).slice(0, 10);
    const currentPlayerRank = sorted.findIndex(entry => entry.playerName === playerName) + 1;

    return (
      <div style={{ flex: 1, minWidth: 400 }}>
        <h3 style={{ marginBottom: 20, color: "#0066cc", fontSize: "18px", fontWeight: 700 }}>
          {emoji} {title}
        </h3>
        {sorted.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", padding: "40px 20px" }}>No scores yet. Be the first!</p>
        ) : (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#666666" }}>Rank</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#666666" }}>Player</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", fontWeight: 600, color: "#666666" }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry, index) => {
                  const isCurrentPlayer = entry.playerName === playerName;
                  return (
                    <tr
                      key={index}
                      style={{
                        background: isCurrentPlayer ? "#f0f7ff" : index % 2 === 0 ? "#ffffff" : "#fafafa"
                      }}
                    >
                      <td style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: isCurrentPlayer ? 700 : 600,
                        color: index === 0 ? "#ffc107" : index === 1 ? "#c0c0c0" : index === 2 ? "#cd7f32" : "#666666"
                      }}>
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index >= 3 && `#${index + 1}`}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: isCurrentPlayer ? 700 : 600,
                        color: isCurrentPlayer ? "#0066cc" : "#333333"
                      }}>
                        {entry.playerName}
                        {isCurrentPlayer && " (You)"}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0066cc"
                      }}>
                        {entry.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: "#000000ff",
        color: "#ffffff",
        padding: "10px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            fontSize: "20px",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center"
          }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Leaderboard</h1>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "40px 30px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 40 }}>
          <div style={{
            background: "#ffffff",
            borderRadius: 0,
            padding: 24
          }}>
            <LeaderboardTable mode="guess" title="Guess the Rating" emoji="📊" />
          </div>

          <div style={{
            background: "#ffffff",
            borderRadius: 0,
            padding: 24
          }}>
            <LeaderboardTable mode="higherlower" title="Higher or Lower" emoji="⬆️" />
          </div>
        </div>
      </div>
    </div>
  );
}
