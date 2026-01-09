export default function MainMenu({ onPlay }) {
  return (
    <div>
      <h2>Main Menu</h2>
      <button onClick={onPlay}>Start Game</button>
    </div>
  );
}