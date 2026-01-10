import React from "react";

export default function GuessMode({ prof, onGuess, onExit }) {
  if (!prof) return null;

  // Get 6 random comments with their attributes
  const getRandomComments = () => {
    if (!prof.ratings || prof.ratings.length === 0) return [];
    
    const shuffled = [...prof.ratings].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const comments = getRandomComments();

  return (
    <div style={{ display: "flex", gap: 30 }}>
      <div style={{ width: "50%" }}>
        <h3>{prof.name}</h3>
        <p>{prof.department}</p>
        <p><b>Avg Difficulty:</b> {prof.difficulty.toFixed(1)}</p>
        
        <div style={{ marginTop: 20 }}>
          <h4>Student Reviews:</h4>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {comments.map((comment, i) => (
              <div 
                key={i} 
                style={{ 
                  marginBottom: 16, 
                  padding: 12, 
                  border: "1px solid #e0e0e0", 
                  borderRadius: 6,
                  fontSize: "13px"
                }}
              >
                <p style={{ margin: "0 0 8px 0", fontStyle: "italic" }}>{comment.comment}</p>
                <div style={{ fontSize: "12px", color: "#666", margin: "8px 0 0 0" }}>
                  <span style={{ marginRight: 12 }}>📚 {comment.class}</span>
                  <span style={{ marginRight: 12 }}>Grade: {comment.grade}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
                  <span style={{ marginRight: 12 }}>💡 Clarity: {comment.clarityRating}/5</span>
                  <span style={{ marginRight: 12 }}>📊 Difficulty: {comment.difficultyRating}/5</span>
                  <span>👍 Helpful: {comment.helpfulRating}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: "50%" }}>
        <h3>Guess the Average Rating</h3>
        <p>Based on the reviews, what is the professor's average rating?</p>
        {[1, 2, 3, 4, 5].map((r) => (
          <button key={r} onClick={() => onGuess(r)} style={{ marginRight: 6, marginBottom: 8, padding: "10px 16px" }}>
            {r} ⭐
          </button>
        ))}

        <div style={{ marginTop: 20 }}>
          <button 
            onClick={onExit}
            style={{ 
              padding: "10px 16px", 
              background: "#ff6b6b", 
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            ← Back to Modes
          </button>
        </div>
      </div>
    </div>
  );
}
