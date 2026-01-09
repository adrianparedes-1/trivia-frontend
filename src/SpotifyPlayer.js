let player;
let deviceId;

export async function initSpotifyPlayer() {
  if (player) return;

  await loadSDK();
  const token = await fetch("/api/spotify/token").then(r => r.text());

  player = new window.Spotify.Player({
    name: "Trivia Player",
    getOAuthToken: cb => cb(token),
    volume: 0.8,
  });

  player.addListener("ready", ({ device_id }) => {
    deviceId = device_id;
    console.log("Spotify ready:", deviceId);
  });

  player.addListener("account_error", e => {
    console.error("Premium required", e);
  });

  player.connect();
}

export async function playTrack(uri) {
  if (!deviceId) return;

  const token = await fetch("/api/spotify/token").then(r => r.text());

  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: [uri] }),
    }
  );
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
