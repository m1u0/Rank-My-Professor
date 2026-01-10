import React from "react";

export default function GameOverModal({ mode, score, leftProf, rightProf, onRestart, onGoBackToMenu }) {
  const leftRmpUrl = `https://www.ratemyprofessors.com/professor/${leftProf?.id}`;
  const rightRmpUrl = `https://www.ratemyprofessors.com/professor/${rightProf?.id}`;

  const ProfessorCard = ({ prof, label }) => (
    <div style={{
      padding: "12px",
      background: "#f9f9f9",
      borderRadius: "6px",
      marginBottom: "8px"
    }}>
      <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold", color: "#000" }}>
        {prof.name}
      </p>
      <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#666" }}>
        Rating: {prof.rating.toFixed(1)} ⭐
      </p>
      <a
        href={`https://www.ratemyprofessors.com/professor/${prof.id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "6px 12px",
          background: "#1976d2",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold"
        }}
      >
        View on RMP →
      </a>
    </div>
  );

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        padding: 40,
        borderRadius: 12,
        width: mode === "higherlower" ? 600 : 500,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        color: "#000",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        <h2 style={{ margin: "0 0 16px 0", color: "#000", fontSize: "28px" }}>Game Over 🎓</h2>
        <p style={{ margin: "0 0 24px 0", color: "#333", fontSize: "18px" }}>Your score: <b style={{ fontSize: "24px", color: "#d32f2f" }}>{score}</b></p>
        
        {mode === "guess" && leftProf && (
          <div style={{
            margin: "20px 0",
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "8px",
            borderLeft: "4px solid #d32f2f"
          }}>
            <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
              <strong>The correct answer was:</strong>
            </p>
            <p style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#000" }}>
              {leftProf.name}
            </p>
            <p style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#d32f2f", fontWeight: "bold" }}>
              Rating: {leftProf.rating.toFixed(1)} ⭐
            </p>
            <a
              href={leftRmpUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "8px 16px",
                background: "#1976d2",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "bold"
              }}
            >
              View on RateMyProfessors →
            </a>
          </div>
        )}
        
        {mode === "higherlower" && (
          <div style={{
            margin: "20px 0",
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "8px",
            borderLeft: "4px solid #d32f2f"
          }}>
            <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "14px" }}>
              <strong>Professor Ratings Comparison:</strong>
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <ProfessorCard prof={leftProf} label="Left" />
              </div>
              <div style={{ flex: 1 }}>
                <ProfessorCard prof={rightProf} label="Right" />
              </div>
            </div>
          </div>
        )}
        
        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
          <button 
            onClick={onRestart} 
            style={{ 
              padding: "12px 24px",
              fontSize: "16px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Play Again
          </button>
          <button 
            onClick={onGoBackToMenu} 
            style={{ 
              padding: "12px 24px",
              fontSize: "16px",
              background: "#666",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Go Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
