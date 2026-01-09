import { useEffect } from "react";
import { initSpotifyPlayer, playTrack } from "./SpotifyPlayer";

export default function GameRoom() {
  useEffect(() => {
    initSpotifyPlayer();
  }, []);

  return (
    <div>
      <h2>Guess the Song</h2>
      <button onClick={() => playTrack("spotify:track:4cOdK2wGLETKBW3PvgPWqT")}>
        Play
      </button>
    </div>
  );
}
