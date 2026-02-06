import { useEffect, useState } from "react";
import { initSpotifyPlayer, playTrack, fetchSpotifyToken } from "./SpotifyPlayer";

export default function GameRoom({ gameData }) {
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initSpotifyPlayer().catch(err => {
      console.error("Failed to init Spotify player:", err);
    });
  }, []);

  // gameData shape: [animeList, status?] - animeList is an array of entries
  function pickSongTitle(data) {
    if (!data) return null;
    const list = Array.isArray(data) ? data[0] : data;
    if (!Array.isArray(list)) return null;

    for (const entry of list) {
      if (entry.openings && entry.openings.length) {
        const t = entry.openings[0].title;
        if (t) return t;
      }
      if (entry.endings && entry.endings.length) {
        const t = entry.endings[0].title;
        if (t) return t;
      }
    }
    return null;
  }

  async function searchAndPlay() {
    if (!gameData) return;
    const title = pickSongTitle(gameData);
    if (!title) return alert("No opening or ending title found in game data");

    setQuery(title);
    setLoading(true);
    try {
      const token = await fetchSpotifyToken();
      if (token.trim().startsWith("<")) throw new Error("Unexpected HTML received instead of Spotify token");
      console.log("Token length:", token.length, "First 50 chars:", token.substring(0, 50));

      const q = encodeURIComponent(title);
      const searchUrl = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`;
      const res = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "<no body>");
        throw new Error(`Spotify search failed: ${res.status} ${t}`);
      }
      const json = await res.json();
      const items = json.tracks && json.tracks.items;
      if (!items || items.length === 0) {
        alert("No matching track found on Spotify for: " + title);
        return;
      }
      const uri = items[0].uri;
      if (!uri) throw new Error("No URI returned from Spotify search");
      await playTrack(uri);
    } catch (err) {
      console.error("Failed to search/play track:", err);
      alert("Failed to play track: " + (err && err.message ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Guess the Song</h2>
      <div>
        <button onClick={searchAndPlay} disabled={loading}>
          {loading ? "Searching..." : "Search & Play from Game"}
        </button>
      </div>
      {query && (
        <div style={{ marginTop: 8 }}>Searching for: <strong>{query}</strong></div>
      )}
    </div>
  );
}
