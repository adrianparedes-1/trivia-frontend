import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import MainMenu from "./MainMenu";
import GameRoom from "./GameRoom";

export default function App() {
  const [stage, setStage] = useState("login");

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

  console.log("Current stage:", stage);

  if (stage === "login") return <LoginPage />;
  return (
    <>
      {stage === "login" && <LoginPage onSuccess={() => setStage("menu")} />}
      {stage === "menu" && <MainMenu onPlay={() => setStage("game")} />}
      {stage === "game" && <GameRoom />}
    </>
  );
}
