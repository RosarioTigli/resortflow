import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { umbrellaId } = useParams();
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    setGuestName(localStorage.getItem("guestName") || "");
    if (umbrellaId) {
      localStorage.setItem("umbrellaId", umbrellaId);
    }
  }, [umbrellaId]);

  return (
    <div className="app">
      <div className="card">
        <h1>🏖️ Villa dei Tigli</h1>

        <p className="subtitle">
          {guestName ? `👋 Benvenuto, ${guestName}` : "👋 Benvenuto"}
        </p>

        <div className="ombrellone">
          Ombrellone {umbrellaId}
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