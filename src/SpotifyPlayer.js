let player;
let deviceId;
let playerReady = false;

console.log("SpotifyPlayer.js module loaded");

async function fetchSpotifyToken() {
  const res = await fetch("/auth/spotify/token", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch Spotify token: " + res.status);
  const text = (await res.text()).trim();
  if (!text) throw new Error("Empty Spotify token received");
  
  // Parse as JSON if it's a JSON string (with quotes), otherwise use as-is
  let token = text;
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      token = JSON.parse(text);
    } catch (e) {
      // If JSON parse fails, use the text as-is
    }
  }
  
  return token;
}

export { fetchSpotifyToken };

export async function initSpotifyPlayer() {
  console.log("initSpotifyPlayer called, player existing?", !!player);
  if (player) return;

  await loadSDK();
  console.log("SDK loaded");
  const token = await fetchSpotifyToken();
  console.log("Token fetched:", String(token).substring(0, 30) + "...");

  player = new window.Spotify.Player({
    name: "Trivia Player",
    getOAuthToken: cb => cb(token),
    volume: 0.8,
  });

  player.addListener("ready", ({ device_id }) => {
    deviceId = device_id;
    playerReady = true;
    console.log("Spotify ready:", deviceId);
  });

  player.addListener("account_error", e => {
    console.error("Spotify account error (might be non-premium):", e);
  });

  player.addListener("player_state_changed", state => {
    console.log("Spotify player state changed:", state);
  });

  player.addListener("authentication_error", e => {
    console.error("Spotify auth error:", e);
  });

  player.addListener("initialization_error", e => {
    console.error("Spotify init error:", e);
  });

  console.log("Calling player.connect()...");
  const connected = await player.connect();
  console.log("Player connect result:", connected);
  
  // Wait up to 5 seconds for player to be ready
  for (let i = 0; i < 50; i++) {
    if (playerReady) {
      console.log("Player ready after", i * 100, "ms");
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error("Spotify player failed to initialize within timeout - deviceId still missing");
}

export async function playTrack(uri) {
  if (!playerReady || !deviceId) {
    // Try to wait a bit more
    for (let i = 0; i < 30; i++) {
      if (playerReady && deviceId) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  if (!deviceId) throw new Error("No Spotify device available (deviceId missing)");
  if (!uri) throw new Error("No Spotify track URI provided");

  const token = await fetchSpotifyToken();
  if (token.trim().startsWith("<")) throw new Error("Unexpected HTML received instead of Spotify token");

  const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
  const body = JSON.stringify({ uris: [uri] });

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(`Spotify play failed: ${res.status} ${text}`);
  }
}

function loadSDK() {
  return new Promise(resolve => {
    if (window.Spotify) return resolve();
    window.onSpotifyWebPlaybackSDKReady = resolve;
    const s = document.createElement("script");
    s.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(s);
  });
}
