export default function LoginPage({ onSuccess }) {
  const handleLogin = () => {
    // Store callback in sessionStorage before redirecting
    sessionStorage.setItem("loginCallback", "true");
    window.location.href = "http://localhost:8000/auth";
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "sans-serif",
    }}>
      <h1>Music Trivia</h1>
      <p>Click below to login with Spotify</p>

      <button 
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
        }}>
        Login with Spotify
      </button>
    </div>
  );
}
