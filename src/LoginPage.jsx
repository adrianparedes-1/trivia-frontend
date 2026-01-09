import { useEffect } from "react";

export default function LoginPage({ onSuccess }) {
  const login = () => {
    window.location.href = "/api/spotify/login";
  };

  useEffect(() => {
    fetch("/api/me").then(r => {
      if (r.ok) onSuccess();
    });
  }, []);

  return (
    <div>
      <h1>Music Trivia</h1>
      <button onClick={login}>Login with Spotify</button>
    </div>
  );
}
