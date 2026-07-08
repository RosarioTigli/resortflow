import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  function handleEnter() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    localStorage.setItem("guestName", trimmedName);
    const umbrellaId = localStorage.getItem("umbrellaId") || "18";
    navigate(`/${umbrellaId}`);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.hero}>
          <p style={styles.eyebrow}>Villa dei Tigli Experience</p>
          <h1 style={styles.title}>🌴 Welcome to your seaside escape</h1>
          <p style={styles.subtitle}>
            Start your stay with a personalized experience at Villa dei Tigli.
          </p>
        </div>

        <div style={styles.infoBox}>
          <span style={styles.infoLabel}>Umbrella number</span>
          <strong style={styles.infoValue}>18</strong>
        </div>

        <label style={styles.label} htmlFor="guestName">
          What is your name?
        </label>
        <input
          id="guestName"
          style={styles.input}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
        />

        <button style={styles.button} onClick={handleEnter}>
          Enter Experience
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5fff7 0%, #e8f5e9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 16px",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 16px 35px rgba(15, 23, 42, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#2e7d32",
  },
  title: {
    margin: 0,
    fontSize: "1.7rem",
    color: "#111827",
    lineHeight: 1.2,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.5,
  },
  infoBox: {
    background: "#f1f8f2",
    borderRadius: "16px",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "#4b5563",
    fontWeight: 600,
  },
  infoValue: {
    color: "#166534",
    fontSize: "1.1rem",
  },
  label: {
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    border: "none",
    background: "#22c55e",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1rem",
  },
};
