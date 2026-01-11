/*
  VISUAL STYLE (canonical)

  - Centralized styles live in `src/index.css`. Use the defined variables only.
  - Use `--primary-blue`/`--dark-blue` for all blue buttons and `--light-gray` for gray buttons.
  - Prefer `.btn-primary` and `.btn-secondary` classes for consistency across components.
  - Avoid adding new hex colors; update `src/index.css` if the palette must change.
*/

import React, { useState, useRef, useEffect, useMemo } from "react";
import user_ava from "../assets/user_ava.svg";

export default function HigherLowerMode({
  leftProf,
  rightProf,
  onChoose,
  onExit,
  score,
  difficulty,
  playerName,
}) {
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null); // 'left' or 'right'
  const canvasRef = useRef(null);
  const shakeElementRef = useRef(null);
  const lastChoiceRef = useRef(null);

  if (!leftProf || !rightProf) return null;

  // Get 3 random comments for each professor
  const getRandomComments = (prof) => {
    if (!prof.ratings || prof.ratings.length === 0) return [];
    const shuffled = [...prof.ratings].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const playSuccessSound = () => {
    // Create a simple success sound using Web Audio API
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const now = audioContext.currentTime;

    // Create a cheerful ascending arpeggio
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = freq;
      osc.type = "sine";

      gain.gain.setValueAtTime(0.3, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.2);
    });
  };

  const playErrorSound = () => {
    // Create an error sound using Web Audio API
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const now = audioContext.currentTime;

    // Create a descending buzzer
    const notes = [349.23, 293.66]; // F4, D4
    notes.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = freq;
      osc.type = "square";

      gain.gain.setValueAtTime(0.2, now + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.25);

      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.25);
    });
  };

  const shakeElement = () => {
    if (!shakeElementRef.current) return;

    const element = shakeElementRef.current;
    let shakes = 0;
    const maxShakes = 6;

    const shake = () => {
      const offset = (shakes % 2) * 10 - 5;
      element.style.transform = `translateX(${offset}px)`;
      shakes++;

      if (shakes < maxShakes) {
        setTimeout(shake, 50);
      } else {
        element.style.transform = "translateX(0)";
      }
    };

    shake();
  };

  const createConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const confetti = [];

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 8 + 4,
        color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"][
          Math.floor(Math.random() * 5)
        ],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let hasConfetti = false;
      confetti.forEach((piece) => {
        if (piece.y < canvas.height) {
          hasConfetti = true;
          piece.x += piece.vx;
          piece.y += piece.vy;
          piece.vy += 0.1; // gravity
          piece.rotation += piece.rotationSpeed;

          ctx.save();
          ctx.translate(piece.x, piece.y);
          ctx.rotate(piece.rotation);
          ctx.fillStyle = piece.color;
          ctx.fillRect(
            -piece.size / 2,
            -piece.size / 2,
            piece.size,
            piece.size
          );
          ctx.restore();
        }
      });

      if (hasConfetti) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const handleChoice = (side) => {
    // side is 'left' or 'right'
    lastChoiceRef.current = side;
    
    // Convert card click to "higher"/"lower" for parent API
    // Clicking left card means user thinks left is higher (pass "higher")
    // Clicking right card means user thinks right is higher, so left is lower (pass "lower")
    const choiceForParent = side === "left" ? "higher" : "lower";
    
    // Check correctness using the same logic as parent component
    // Parent checks: if "higher" then leftProf.rating > rightProf.rating
    // Parent checks: if "lower" then leftProf.rating < rightProf.rating
    const correct = choiceForParent === "higher"
      ? leftProf.rating > rightProf.rating
      : leftProf.rating < rightProf.rating;

    if (correct) {
      setShowCorrect(true);
      playSuccessSound();
      createConfetti();
      setTimeout(() => {
        setShowCorrect(false);
        onChoose(choiceForParent);
      }, 500);
    } else {
      setShowIncorrect(true);
      playErrorSound();
      shakeElement();
      // Hide incorrect message after 1500ms, then trigger game over 500ms later
      setTimeout(() => {
        setShowIncorrect(false);
      }, 1500);
      setTimeout(() => {
        onChoose(choiceForParent);
      }, 2000);
    }
  };

  // Memoize comments so they don't regenerate on hover state changes
  const leftComments = useMemo(
    () => getRandomComments(leftProf),
    [leftProf?.id, leftProf?.ratings?.length]
  );
  const rightComments = useMemo(
    () => getRandomComments(rightProf),
    [rightProf?.id, rightProf?.ratings?.length]
  );

  const ProfessorCard = ({ prof, comments, difficulty, onClick, isHovered }) => (
    <div style={{ flex: 1 }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHoveredCard("left")}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          background: "var(--white)",
          borderRadius: 0,
          padding: 24,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          border: isHovered ? "5px solid var(--primary-blue)" : "5px solid transparent",
          transition: "border 0.2s ease",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--black)",
          }}
        >
          {prof.name}
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "13px",
            color: "var(--black)",
          }}
        >
          Department: {prof.department}
        </p>

        <h4
          style={{
            margin: "0 0 12px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--muted)",
          }}
        >
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
                const months = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                const day = date.getDate();
                let suffix = "th";
                if (day === 1 || day === 21 || day === 31) suffix = "st";
                else if (day === 2 || day === 22) suffix = "nd";
                else if (day === 3 || day === 23) suffix = "rd";
                return `${
                  months[date.getMonth()]
                } ${day}${suffix}, ${date.getFullYear()}`;
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
                    gridTemplateRows: "auto auto",
                  }}
                >
                  {/* Left: Quality & Difficulty boxes */}
                  <div
                    style={{
                      gridRow: "1 / 3",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    {/* Quality */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "var(--black)",
                        }}
                      >
                        QUALITY
                      </div>
                      <div
                        style={{
                          background:
                            difficulty === "hard"
                              ? "var(--dark-gray)"
                              : getQualityColor(comment.clarityRating || 3),
                          padding: "6px",
                          borderRadius: 0,
                          textAlign: "center",
                          width: 70,
                          aspectRatio: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--black)",
                          }}
                        >
                          {difficulty === "hard"
                            ? "??"
                            : comment.clarityRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                    {/* Difficulty */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "var(--black)",
                        }}
                      >
                        DIFFICULTY
                      </div>
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
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--black)",
                          }}
                        >
                          {difficulty === "hard"
                            ? "??"
                            : comment.difficultyRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right top: Class name and metadata */}
                  <div style={{ gridColumn: 2, gridRow: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--black)",
                        }}
                      >
                        {comment.class?.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--muted)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {formattedDate}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        lineHeight: "1.4",
                      }}
                    >
                      For Credit:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard" ? "??" : "Yes"}
                      </span>{" "}
                      &nbsp; Attendance:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard" ? "??" : "Not Mandatory"}
                      </span>{" "}
                      &nbsp; Grade:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard"
                          ? "??"
                          : comment.grade || "N/A"}
                      </span>{" "}
                      &nbsp; Textbook:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard"
                          ? "??"
                          : comment.textbook || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Right middle: Comment text */}
                  <div style={{ gridColumn: 2, gridRow: 2, marginTop: -8 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "var(--black)",
                        lineHeight: "1.5",
                      }}
                    >
                      {comment.comment}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>
              No reviews available
            </p>
          )}
        </div>
      </div>
    </div>
  );
  const ProfessorCardRight = ({ prof, comments, difficulty, onClick, isHovered }) => (
    <div style={{ flex: 1 }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHoveredCard("right")}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          background: "var(--white)",
          borderRadius: 0,
          padding: 24,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          border: isHovered ? "5px solid var(--primary-blue)" : "5px solid transparent",
          transition: "border 0.2s ease",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--black)",
          }}
        >
          {prof.name}
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "13px",
            color: "var(--black)",
          }}
        >
          Department: {prof.department}
        </p>

        <h4
          style={{
            margin: "0 0 12px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--muted)",
          }}
        >
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
                const months = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                const day = date.getDate();
                let suffix = "th";
                if (day === 1 || day === 21 || day === 31) suffix = "st";
                else if (day === 2 || day === 22) suffix = "nd";
                else if (day === 3 || day === 23) suffix = "rd";
                return `${
                  months[date.getMonth()]
                } ${day}${suffix}, ${date.getFullYear()}`;
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
                    gridTemplateRows: "auto auto",
                  }}
                >
                  {/* Left: Quality & Difficulty boxes */}
                  <div
                    style={{
                      gridRow: "1 / 3",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    {/* Quality */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "var(--black)",
                        }}
                      >
                        QUALITY
                      </div>
                      <div
                        style={{
                          background:
                            difficulty === "hard"
                              ? "var(--dark-gray)"
                              : getQualityColor(comment.clarityRating || 3),
                          padding: "6px",
                          borderRadius: 0,
                          textAlign: "center",
                          width: 70,
                          aspectRatio: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--black)",
                          }}
                        >
                          {difficulty === "hard"
                            ? "??"
                            : comment.clarityRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                    {/* Difficulty */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "var(--black)",
                        }}
                      >
                        DIFFICULTY
                      </div>
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
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--black)",
                          }}
                        >
                          {difficulty === "hard"
                            ? "??"
                            : comment.difficultyRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right top: Class name and metadata */}
                  <div style={{ gridColumn: 2, gridRow: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--black)",
                        }}
                      >
                        {comment.class?.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--muted)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {formattedDate}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        lineHeight: "1.4",
                      }}
                    >
                      For Credit:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard" ? "??" : "Yes"}
                      </span>{" "}
                      &nbsp; Attendance:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard" ? "??" : "Not Mandatory"}
                      </span>{" "}
                      &nbsp; Grade:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard"
                          ? "??"
                          : comment.grade || "N/A"}
                      </span>{" "}
                      &nbsp; Textbook:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--black)",
                          fontFamily:
                            '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        }}
                      >
                        {difficulty === "hard"
                          ? "??"
                          : comment.textbook || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Right middle: Comment text */}
                  <div style={{ gridColumn: 2, gridRow: 2, marginTop: -8 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "var(--black)",
                        lineHeight: "1.5",
                      }}
                    >
                      {comment.comment}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "var(--muted-2)", fontSize: "13px" }}>
              No reviews available
            </p>
          )}
        </div>
      </div>
    </div>
  );
  return (
    <div
      style={{
        background: "var(--light-gray)",
        minHeight: "100vh",
        paddingBottom: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 999,
        }}
        width={typeof window !== "undefined" ? window.innerWidth : 0}
        height={typeof window !== "undefined" ? window.innerHeight : 0}
      />

      {/* Success Message Overlay */}
      {showCorrect && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--green)",
            color: "var(--white)",
            padding: "30px 60px",
            borderRadius: 12,
            fontSize: "32px",
            fontWeight: 700,
            zIndex: 1001,
            animation: "scaleIn 0.3s ease-out",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          ✨ Correct! ✨
          <style>{`
            @keyframes scaleIn {
              from {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
              }
              to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* Incorrect Message Overlay */}
      {showIncorrect && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--red)",
            color: "var(--white)",
            padding: "30px 60px",
            borderRadius: 12,
            fontSize: "32px",
            fontWeight: 700,
            zIndex: 1001,
            animation: "scaleIn 0.3s ease-out",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          ✗ Incorrect! ✗
          <style>{`
            @keyframes scaleIn {
              from {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
              }
              to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
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
        {/* Back button */}
        <button
          onClick={onExit}
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
          ← Back
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
          Higher or Lower?
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
      <div
        ref={shakeElementRef}
        style={{
          flex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "30px",
          paddingTop: 80,
          width: "100%",
          boxSizing: "border-box",
          transition: "transform 0.05s linear",
        }}
      >
        {/* Score - Centered */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: "var(--black)",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Score:{" "}
          <span style={{ color: "var(--primary-blue)", fontSize: "40px" }}>
            {score}
          </span>
        </div>

        {/* Professors Comparison */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "flex-start",
            marginBottom: 30,
          }}
        >
          <ProfessorCard
            prof={leftProf}
            comments={leftComments}
            difficulty={difficulty}
            onClick={() => handleChoice("left")}
            isHovered={hoveredCard === "left"}
          />

          <ProfessorCardRight
            prof={rightProf}
            comments={rightComments}
            difficulty={difficulty}
            onClick={() => handleChoice("right")}
            isHovered={hoveredCard === "right"}
          />
        </div>
      </div>
    </div>
  );
}
