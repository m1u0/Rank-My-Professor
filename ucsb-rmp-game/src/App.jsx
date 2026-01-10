import { useEffect, useState } from "react";

import StartScreen from "./components/StartScreen";
import ModeSelect from "./components/ModeSelect";
import GuessMode from "./components/GuessMode";
import HigherLowerMode from "./components/HigherLowerMode";
import professorsData from "./data/professors";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState(null);
  const [score, setScore] = useState(0);

  const [professors, setProfessors] = useState([]);
  const [leftProf, setLeftProf] = useState(null);
  const [rightProf, setRightProf] = useState(null);

  // Initialize with local data
  useEffect(() => {
    const data = professorsData;
    setProfessors(data);
    setLeftProf(data[Math.floor(Math.random() * data.length)]);
    setRightProf(data[Math.floor(Math.random() * data.length)]);
  }, []);

  const randomProf = () =>
    professors[Math.floor(Math.random() * professors.length)];

  const handleGuessRating = (guess) => {
    if (Math.abs(guess - leftProf.rating) <= 0.5) {
      setScore((s) => s + 1);
    }
    setLeftProf(randomProf());
  };

  const handleHigherLower = (choice) => {
    const correct =
      choice === "higher"
        ? leftProf.rating > rightProf.rating
        : leftProf.rating < rightProf.rating;

    if (correct) setScore((s) => s + 1);

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
    <div style={{ padding: 30 }}>
      <h2>Score: {score}</h2>

      {mode === "guess" && (
        <GuessMode prof={leftProf} onGuess={handleGuessRating} />
      )}

      {mode === "higherlower" && (
        <HigherLowerMode
          leftProf={leftProf}
          rightProf={rightProf}
          onChoose={handleHigherLower}
        />
      )}
    </div>
  );
}
