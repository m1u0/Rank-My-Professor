/*
  VISUAL STYLE (canonical)

  - Centralized styles live in `src/index.css`. Use the defined variables only.
  - Use `--primary-blue`/`--dark-blue` for all blue buttons and `--light-gray` for gray buttons.
  - Prefer `.btn-primary` and `.btn-secondary` classes for consistency across components.
  - Avoid adding new hex colors; update `src/index.css` if the palette must change.
*/

import React from "react";

export default function HigherLowerMode({ leftProf, rightProf, onChoose, onExit, score, difficulty }) {
  if (!leftProf || !rightProf) return null;

  // Get 3 random comments for each professor
  const getRandomComments = (prof) => {
    if (!prof.ratings || prof.ratings.length === 0) return [];
    const shuffled = [...prof.ratings].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const leftComments = getRandomComments(leftProf);
  const rightComments = getRandomComments(rightProf);

  const ProfessorCard = ({ prof, comments }) => (
      <div style={{ flex: 1 }}>
      <div style={{
        background: "var(--white)",
        borderRadius: 0,
        padding: 24,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 700, color: "var(--black)" }}>
          {prof.name}
        </h3>
        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--black)" }}>
          {prof.department}
        </p>

        <div style={{
          background: "var(--light-gray)",
          padding: 12,
          borderRadius: 0,
          marginBottom: 16
        }}>
          <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--black)" }}>Rating</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "var(--primary-blue)" }}>
            {prof.rating.toFixed(1)} ⭐
          </p>
        </div>

        <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>
          Recent Reviews:
        </h4>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
          {comments.length > 0 ? (
            comments.map((comment, i) => {
              const getQualityColor = (rating) => {
                if (rating >= 4.5) return "var(--green)";
                if (rating >= 3) return "var(--yellow)";
                return "var(--red)";
              };
              const getDifficultyColor = (rating) => {
                if (rating >= 4) return "var(--red)";
                if (rating >= 2) return "var(--yellow)";
                return "var(--green)";
              };

              // Format date with ordinal suffix
              const formatDate = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const day = date.getDate();
                let suffix = "th";
                if (day === 1 || day === 21 || day === 31) suffix = "st";
                else if (day === 2 || day === 22) suffix = "nd";
                else if (day === 3 || day === 23) suffix = "rd";
                return `${months[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
              };

              const formattedDate = formatDate(comment.date);

              return (
                <div
                  key={i}
                  style={{
                    marginBottom: 16,
                    padding: "16px",
                    borderRadius: 0,
                    background: "var(--light-gray)",
                    border: "1px solid var(--surface-border)",
                    display: "grid",
                    gridTemplateColumns: "70px 1fr",
                    gap: "16px",
                    gridTemplateRows: "auto auto"
                  }}
                >
                  {/* Left: Quality & Difficulty boxes */}
                  <div style={{ gridRow: "1 / 3", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                    {/* Quality */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--black)" }}>QUALITY</div>
                      <div
                        style={{
                          background: getQualityColor(comment.clarityRating || 3),
                          padding: "6px",
                          borderRadius: 0,
                          textAlign: "center",
                          width: 70,
                          aspectRatio: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--black)" }}>
                          {comment.clarityRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                    {/* Difficulty */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--black)" }}>DIFFICULTY</div>
                      <div
                        style={{
                          background: "var(--dark-gray)",
                          padding: "6px",
                          borderRadius: 0,
                          textAlign: "center",
                          width: 70,
                          aspectRatio: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--black)" }}>
                          {comment.difficultyRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right top: Class name and metadata */}
                  <div style={{ gridColumn: 2, gridRow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--black)" }}>
                        {comment.class?.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{formattedDate}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>
                      {difficulty !== "hard" && <span>Grade: <span style={{ fontWeight: 600, color: "var(--black)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{comment.grade || "N/A"}</span> &nbsp;&nbsp;</span>}
                      Textbook: <span style={{ fontWeight: 600, color: "var(--black)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{comment.textbook || "N/A"}</span>
                    </div>
                  </div>

                  {/* Right middle: Comment text */}
                  <div style={{ gridColumn: 2, gridRow: 2, marginTop: -8 }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--black)", lineHeight: "1.5" }}>
                      {comment.comment}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>No reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
const ProfessorCardRight = ({ prof, comments }) => (
      <div style={{ flex: 1 }}>
      <div style={{
        background: "var(--white)",
        borderRadius: 0,
        padding: 24,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 700, color: "var(--black)" }}>
          {prof.name}
        </h3>
        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--black)" }}>
          {prof.department}
        </p>

        <div style={{
          background: "var(--light-gray)",
          padding: 12,
          borderRadius: 0,
          marginBottom: 16
        }}>
          <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--black)" }}>Rating</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "var(--primary-blue)" }}>
            ?? ⭐
          </p>
        </div>

        <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>
          Recent Reviews:
        </h4>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
          {comments.length > 0 ? (
            comments.map((comment, i) => {
              const getQualityColor = (rating) => {
                if (rating >= 4.5) return "var(--green)";
                if (rating >= 3) return "var(--yellow)";
                return "var(--red)";
              };
              const getDifficultyColor = (rating) => {
                if (rating >= 4) return "var(--red)";
                if (rating >= 2) return "var(--yellow)";
                return "var(--green)";
              };

              // Format date with ordinal suffix
              const formatDate = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const day = date.getDate();
                let suffix = "th";
                if (day === 1 || day === 21 || day === 31) suffix = "st";
                else if (day === 2 || day === 22) suffix = "nd";
                else if (day === 3 || day === 23) suffix = "rd";
                return `${months[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
              };

              const formattedDate = formatDate(comment.date);

              return (
                <div
                  key={i}
                  style={{
                    marginBottom: 16,
                    padding: "16px",
                    borderRadius: 0,
                    background: "var(--light-gray)",
                    border: "1px solid var(--surface-border)",
                    display: "grid",
                    gridTemplateColumns: "70px 1fr",
                    gap: "16px",
                    gridTemplateRows: "auto auto"
                  }}
                >
                  {/* Left: Quality & Difficulty boxes */}
                  <div style={{ gridRow: "1 / 3", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                    {/* Quality */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--black)" }}>QUALITY</div>
                      <div
                        style={{
                          background: getQualityColor(comment.clarityRating || 3),
                          padding: "6px",
                          borderRadius: 0,
                          textAlign: "center",
                          width: 70,
                          aspectRatio: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--black)" }}>
                          {comment.clarityRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                    {/* Difficulty */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--black)" }}>DIFFICULTY</div>
                      <div
                        style={{
                          background: "var(--dark-gray)",
                          padding: "6px",
                          borderRadius: 0,
                          textAlign: "center",
                          width: 70,
                          aspectRatio: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--black)" }}>
                          {comment.difficultyRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right top: Class name and metadata */}
                  <div style={{ gridColumn: 2, gridRow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--black)" }}>
                        {comment.class?.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{formattedDate}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.4" }}>
                      {difficulty !== "hard" && <span>Grade: <span style={{ fontWeight: 600, color: "var(--black)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{comment.grade || "N/A"}</span> &nbsp;&nbsp;</span>}
                      Textbook: <span style={{ fontWeight: 600, color: "var(--black)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{comment.textbook || "N/A"}</span>
                    </div>
                  </div>

                  {/* Right middle: Comment text */}
                  <div style={{ gridColumn: 2, gridRow: 2, marginTop: -8 }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--black)", lineHeight: "1.5" }}>
                      {comment.comment}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>No reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ background: "var(--light-gray)", minHeight: "100vh", paddingBottom: 40, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: "var(--black)",
        color: "var(--white)",
        padding: "10px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <button
          onClick={onExit}
          style={{
            background: "none",
            border: "none",
            color: "var(--white)",
            fontSize: "20px",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center"
          }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, flex: 1, textAlign: "center" }}>Higher or Lower?</h2>
        <div style={{ width: 60 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "30px", width: "100%", boxSizing: "border-box" }}>
        {/* Score - Top Left */}
        <div style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--black)",
          marginBottom: "20px"
        }}>
          Score: <span style={{ color: "var(--primary-blue)", fontSize: "18px" }}>{score}</span>
        </div>

        {/* Professors Comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 1fr", gap: 20, alignItems: "flex-start", marginBottom: 30 }}>
          <ProfessorCard prof={leftProf} comments={leftComments} position="left" />

          {/* Buttons Center */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            justifyContent: "flex-start",
            paddingTop: 24
          }}>
            <button
              onClick={() => onChoose("higher")}
              style={{
                padding: "12px 16px",
                background: "var(--primary-blue)",
                color: "var(--white)",
                border: "none",
                borderRadius: 30,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--dark-blue)";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--primary-blue)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ⬆️ Higher
            </button>

            <button
              onClick={() => onChoose("lower")}
              style={{
                padding: "12px 16px",
                background: "var(--primary-blue)",
                color: "var(--white)",
                border: "none",
                borderRadius: 30,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--dark-blue)";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--primary-blue)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ⬇️ Lower
            </button>
          </div>

          <ProfessorCardRight prof={rightProf} comments={rightComments} position="right" />
        </div>
      </div>
    </div>
  );
}


