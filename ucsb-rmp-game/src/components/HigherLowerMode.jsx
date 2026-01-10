import React from "react";

export default function HigherLowerMode({ leftProf, rightProf, onChoose, onExit }) {
  if (!leftProf || !rightProf) return null;

  // Get 3 random comments for each professor
  const getRandomComments = (prof) => {
    if (!prof.ratings || prof.ratings.length === 0) return [];
    const shuffled = [...prof.ratings].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const leftComments = getRandomComments(leftProf);
  const rightComments = getRandomComments(rightProf);

  const CommentBox = ({ prof, comments }) => (
    <div style={{ width: "45%" }}>
      <h3>{prof.name}</h3>
      <p style={{ color: "#666" }}>{prof.department}</p>
      
      <div style={{ marginTop: 12 }}>
        <h4 style={{ fontSize: "13px", marginBottom: 8 }}>Student Reviews:</h4>
        {comments.map((comment, i) => (
          <div 
            key={i} 
            style={{ 
              marginBottom: 12, 
              padding: 10, 
              border: "1px solid #e0e0e0", 
              borderRadius: 4,
              fontSize: "12px",
              maxHeight: "120px",
              overflowY: "auto"
            }}
          >
            <p style={{ margin: "0 0 6px 0", fontStyle: "italic" }}>"{comment.comment}"</p>
            <div style={{ fontSize: "11px", color: "#999", marginTop: 6 }}>
              📚 {comment.class} | Grade: {comment.grade} | Clarity: {comment.clarityRating} | Difficulty: {comment.difficultyRating} | Helpful: {comment.helpfulRating}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
      <CommentBox prof={leftProf} comments={leftComments} />

      <div style={{ width: "10%", textAlign: "center", marginTop: 20 }}>
        <button 
          onClick={() => onChoose("higher")}
          style={{ marginBottom: 12, padding: "10px 12px", width: "100%", fontSize: "14px", fontWeight: "bold" }}
        >
          ⬆ Higher
        </button>
        <button 
          onClick={() => onChoose("lower")}
          style={{ marginBottom: 12, padding: "10px 12px", width: "100%", fontSize: "14px", fontWeight: "bold" }}
        >
          ⬇ Lower
        </button>
        <button 
          onClick={onExit}
          style={{ 
            padding: "10px 12px", 
            width: "100%",
            background: "#ff6b6b", 
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "bold"
          }}
        >
          Back
        </button>
      </div>

      <CommentBox prof={rightProf} comments={rightComments} />
    </div>
  );
}
