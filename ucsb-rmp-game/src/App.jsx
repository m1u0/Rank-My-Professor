import { useEffect, useState } from "react";

import StartScreen from "./components/StartScreen";
import ModeSelect from "./components/ModeSelect";
import GuessMode from "./components/GuessMode";
import HigherLowerMode from "./components/HigherLowerMode";
import GameOverModal from "./components/GameOverModal";
import ConfirmationModal from "./components/ConfirmationModal";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState(null);
  const [score, setScore] = useState(0);
  const [lost, setLost] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [professors, setProfessors] = useState([]);
  const [leftProf, setLeftProf] = useState(null);
  const [rightProf, setRightProf] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/professors.json");
        const data = await res.json();
        
        const transformed = data.map((item) => ({
          id: item.professor.legacy_id,
          name: `${item.professor.first_name} ${item.professor.last_name}`,
          department: item.professor.department,
          rating: item.professor.avg_rating,
          difficulty: item.professor.avg_difficulty,
          ratings: item.ratings || []
        }));
        
        setProfessors(transformed);
        setLeftProf(transformed[Math.floor(Math.random() * transformed.length)]);
        setRightProf(transformed[Math.floor(Math.random() * transformed.length)]);
      } catch (e) {
        console.error("Failed to load professors:", e);
      }
    }
    load();
  }, []);

  const randomProf = () =>
    professors[Math.floor(Math.random() * professors.length)];

  const handleGuessRating = (guess) => {
    const isCorrect = Math.abs(guess - leftProf.rating) <= 0.5;
    if (isCorrect) {
      setScore((s) => s + 1);
      setLeftProf(randomProf());
    } else {
      setLost(true);
    }
  };

  const handleHigherLower = (choice) => {
    const correct =
      choice === "higher"
        ? leftProf.rating > rightProf.rating
        : leftProf.rating < rightProf.rating;

    if (correct) {
      setScore((s) => s + 1);
      setLeftProf(randomProf());
      setRightProf(randomProf());
    } else {
      setLost(true);
    }
  };

  const exitToModeSelect = () => {
    setShowConfirm(true);
    setConfirmAction("exit");
  };

  const handleConfirmYes = () => {
    if (confirmAction === "exit") {
      setLost(false);
      setMode(null);
    }
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const restartGame = () => {
    setScore(0);
    setLost(false);
    setLeftProf(randomProf());
    setRightProf(randomProf());
  };

  const goBackToMenu = () => {
    setScore(0);
    setLost(false);
    setMode(null);
    setLeftProf(randomProf());
    setRightProf(randomProf());
  };

  if (!started) {
    return (
      <StartScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={() => setStarted(true)}
      />
    );
  }

  if (!mode) {
    return <ModeSelect playerName={playerName} setMode={setMode} />;
  }

  if (!leftProf || !rightProf) {
    return <p style={{ padding: 30 }}>Loading professors...</p>;
  }

  return (
    <div style={{ padding: 30, position: "relative" }}>
      <h2>Score: {score}</h2>

      {mode === "guess" && (
        <GuessMode prof={leftProf} onGuess={handleGuessRating} onExit={exitToModeSelect} />
      )}

      {mode === "higherlower" && (
        <HigherLowerMode
          leftProf={leftProf}
          rightProf={rightProf}
          onChoose={handleHigherLower}
          onExit={exitToModeSelect}
        />
      )}

      {lost && <GameOverModal mode={mode} score={score} leftProf={leftProf} rightProf={rightProf} onRestart={restartGame} onGoBackToMenu={goBackToMenu} />}
      {showConfirm && (
        <ConfirmationModal
          message="Leave this game and go back to mode selection?"
          onConfirm={handleConfirmYes}
          onCancel={handleConfirmNo}
        />
      )}
    </div>
  );
}
