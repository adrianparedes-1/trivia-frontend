import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import MainMenu from "./MainMenu";
import GameRoom from "./GameRoom";

export default function App() {
  const [stage, setStage] = useState("login");

  return (
    <>
      {stage === "login" && <LoginPage onSuccess={() => setStage("menu")} />}
      {stage === "menu" && <MainMenu onPlay={() => setStage("game")} />}
      {stage === "game" && <GameRoom />}
    </>
  );
}
