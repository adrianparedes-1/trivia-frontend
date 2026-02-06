import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import MainMenu from "./MainMenu";
import GameRoom from "./GameRoom";

export default function App() {
  const [stage, setStage] = useState("login");
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    console.log("App mounted, checking sessionStorage...");
    console.log("loginCallback value:", sessionStorage.getItem("loginCallback"));
    console.log("Current pathname:", window.location.pathname);

    if (sessionStorage.getItem("loginCallback") === "true" || window.location.pathname === "/home") {
      console.log("Login callback detected, transitioning to menu");
      sessionStorage.removeItem("loginCallback");
      setStage("menu");
    } else {
      console.log("No login callback found");
    }
  }, []);

  const handlePlay = async () => {
    try {
      const response = await fetch("/game", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Game started:", data);
      setGameData(data);
      setStage("game");
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  console.log("Current stage:", stage);

  if (stage === "login") return <LoginPage />;
  return (
    <>
      {stage === "login" && <LoginPage onSuccess={() => setStage("menu")} />}
      {stage === "menu" && <MainMenu onPlay={handlePlay} />}
      {stage === "game" && <GameRoom gameData={gameData} />}
    </>
  );
}
