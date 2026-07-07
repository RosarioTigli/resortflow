import { useNavigate } from "react-router-dom";
import "../App.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <div className="card">
        <h1>🏖️ Villa dei Tigli</h1>

        <p className="subtitle">Resort & SPA</p>

        <div className="ombrellone">
          Ombrellone 18
        </div>

        <button onClick={() => navigate("/menu")}>
          🍽️ Ordina Pranzo
        </button>

        <button>🍹 Bevande e Bar</button>

        <button>🍨 Gelati e Dessert</button>

        <button>🛎️ Chiama il Personale</button>
      </div>
    </div>
  );
}