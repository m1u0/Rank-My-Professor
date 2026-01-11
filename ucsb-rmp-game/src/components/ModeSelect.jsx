/*
  VISUAL STYLE (canonical)

  - This project centralizes the visual design in `src/index.css`.
  - Use only the CSS variables defined in `src/index.css` for colors:
    --white, --light-gray, --primary-blue, --dark-blue, --black,
    --green, --red, --yellow, --surface, --muted, --muted-2, --surface-border.
  - Buttons:
    * Primary: use `className="btn-primary"` or `background: var(--primary-blue); color: var(--white)`.
      On hover use `var(--dark-blue)`.
    * Secondary (gray): use `className="btn-secondary"` or `background: var(--light-gray); color: var(--primary-blue); border: 1px solid var(--primary-blue)`.
      On hover become dark-blue fill with white text.
  - Do NOT use hardcoded hex color literals (e.g. `#0066cc`, `#ffffff`) — always use the variables above.
  - When adding inline styles prefer `style={{ background: 'var(--primary-blue)' }}` or add/compose utility classes.
  - Keep this header at the top of each component so code-generating tools and contributors can follow the palette.
*/

import React, { useState } from "react";
import user_ava from "../assets/user_ava.svg";

export default function ModeSelect({ playerName, setMode, difficulty, setDifficulty, onViewLeaderboard, onSignOut }) {
  const [showGuessMenu, setShowGuessMenu] = useState(false);
  return (
    <div style={{ background: "var(--white)", minHeight: "100vh" }}>
      {/* Header */}
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    background: "var(--black)",
    color: "var(--white)",
    padding: "10px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    boxSizing: "border-box",
    zIndex: 1000,
  }}
>
  {/* Sign Out button */}
  <button
    onClick={onSignOut}
    style={{
      position: "absolute",
      left: 30,
      background: "none",
      border: "none",
      color: "var(--white)",
      fontSize: "20px",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
    }}
  >
    ◀ Sign Out
  </button>
  {/* Absolutely centered title */}
  <h1
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      margin: 0,
      fontSize: "24px",
      fontWeight: 700,
      whiteSpace: "nowrap"
    }}
  >
    Select Gamemode
  </h1>

  {/* Right-side user info */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8
    }}
  >
    <img
      src={user_ava}
      alt="avatar"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%"
      }}
    />
    <span
      style={{
        fontSize: "16px",
        fontWeight: 500,
        maxWidth: 120,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
      title={playerName}
    >
      {playerName}
    </span>
  </div>
</div>


      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 30px", paddingTop: 80 }}>
        {/* Difficulty Selector */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--black)", marginBottom: 16 }}>
            Select Difficulty
          </h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[
              { label: "Normal", value: "normal" },
              { label: "Hard", value: "hard" }
            ].map((diff) => (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                style={{
                  padding: "12px 20px",
                  background: difficulty === diff.value ? "var(--primary-blue)" : "var(--white)",
                  color: difficulty === diff.value ? "var(--white)" : "var(--primary-blue)",
                  border: "1px solid " + (difficulty === diff.value ? "var(--primary-blue)" : "var(--primary-blue)"),
                  borderRadius: 30,
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (difficulty !== diff.value) {
                    e.target.style.background = "var(--dark-blue)";
                    e.target.style.color = "var(--white)";
                    e.target.style.borderColor = "var(--dark-blue)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (difficulty !== diff.value) {
                    e.target.style.background = "var(--white)";
                    e.target.style.color = "var(--primary-blue)";
                    e.target.style.borderColor = "var(--primary-blue)";
                  }
                }}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Guess Mode Card */}
          <div style={{
            background: "var(--light-gray)",
            borderRadius: 0,
            padding: 24,
            cursor: "pointer"
          }}
          >
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--black)", margin: "0 0 12px 0" }}>
              Guess the Rating
            </h3>
            <p style={{ color: "var(--black)", lineHeight: "1.6", marginBottom: 20 }}>
              Read student reviews and guess the professor's average rating. Stay within half a point. Choose a mode and play!
            </p>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => difficulty && setShowGuessMenu((v) => !v)}
                disabled={!difficulty}
                className={difficulty ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                Play <span style={{ fontSize: 12 }}>▼</span>
              </button>

              {showGuessMenu && (
                <div style={{
                  position: "absolute",
                  top: 50,
                  left: 0,
                  right: 0,
                  background: "var(--white)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: 12,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  overflow: "hidden"
                }}>
                  <button
                    onClick={() => { setShowGuessMenu(false); difficulty && setMode("guess"); }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "var(--dark-gray)"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    Arcade
                  </button>
                  <div style={{ height: 1, background: "var(--surface-border)" }} />
                  <button
                    onClick={() => { setShowGuessMenu(false); difficulty && setMode("guess10"); }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "var(--dark-gray)"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    Best Out of 10
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Higher/Lower Mode Card */}
          <div style={{
            background: "var(--light-gray)",
            borderRadius: 0,
            padding: 24,
            cursor: "pointer"
          }}
          >
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--black)", margin: "0 0 12px 0" }}>
              Higher or Lower
            </h3>
            <p style={{ color: "var(--black)", lineHeight: "1.6", marginBottom: 20 }}>
              Compare two professors and decide who has the higher rating. One wrong answer and it's game over!
            </p>
            <button
              onClick={() => difficulty && setMode("higherlower")}
              disabled={!difficulty}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: difficulty ? "var(--primary-blue)" : "var(--light-gray)",
                color: "var(--white)",
                border: "none",
                borderRadius: 30,
                fontSize: "16px",
                fontWeight: 600,
                cursor: difficulty ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (difficulty) {
                  e.target.style.backgroundColor = "var(--dark-blue)";
                  e.target.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (difficulty) {
                  e.target.style.backgroundColor = "var(--primary-blue)";
                  e.target.style.transform = "scale(1)";
                }
              }}
            >
              Play Now
            </button>
          </div>
        </div>

        {/* Leaderboard Button */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={onViewLeaderboard}
            style={{
              padding: "12px 32px",
              background: "var(--light-gray)",
              color: "var(--primary-blue)",
              border: "1px solid var(--primary-blue)",
              borderRadius: 30,
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              marginTop: "25px"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--dark-blue)";
              e.target.style.color = "var(--white)";
              e.target.style.borderColor = "var(--dark-blue)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--white)";
              e.target.style.color = "var(--primary-blue)";
              e.target.style.borderColor = "var(--primary-blue)";
              e.target.style.transform = "scale(1)";
            }}
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
