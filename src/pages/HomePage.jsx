import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const cards = [
    {
      icon: "🍽️",
      title: "Restaurant",
      subtitle: "Enjoy a curated lunch experience",
      action: () => navigate("/restaurant"),
      accent: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      textColor: "#92400e",
      isPrimary: true,
    },
    {
      icon: "💆",
      title: "Massaggi & SPA",
      subtitle: "Discover our wellness rituals",
      action: () => navigate("/spa"),
      accent: "linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)",
      textColor: "#1d4ed8",
    },
    {
      icon: "🛎️",
      title: "Call Staff",
      subtitle: "Coming soon",
      accent: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      textColor: "#166534",
    },
    {
      icon: "ℹ️",
      title: "Resort Information",
      subtitle: "Coming soon",
      accent: "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)",
      textColor: "#6d28d9",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>Villa dei Tigli Experience</p>
          <h1 style={styles.title}>🏖️ Villa dei Tigli</h1>
          <p style={styles.welcome}>
            {guestName ? `👋 Welcome, ${guestName}` : "👋 Welcome"}
          </p>
          <div style={styles.umbrellaBadge}>🏖️ Umbrella {umbrellaId || "18"}</div>
        </section>

        <div style={styles.grid}>
          {cards.map((card) => {
            const cardContent = (
              <>
                <div style={styles.cardIcon}>{card.icon}</div>
                <div>
                  <h2 style={styles.cardTitle}>{card.title}</h2>
                  <p style={styles.cardSubtitle}>{card.subtitle}</p>
                </div>
              </>
            );

            if (card.action) {
              return (
                <button
                  key={card.title}
                  style={{ ...styles.card, background: card.accent, color: card.textColor }}
                  onClick={card.action}
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <div
                key={card.title}
                style={{ ...styles.card, background: card.accent, color: card.textColor }}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #eefbf3 100%)",
    padding: "20px 16px 32px",
    display: "flex",
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  hero: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#4b7f52",
  },
  title: {
    margin: 0,
    fontSize: "1.6rem",
    color: "#111827",
  },
  welcome: {
    margin: 0,
    fontSize: "1rem",
    color: "#334155",
    fontWeight: 600,
  },
  umbrellaBadge: {
    alignSelf: "flex-start",
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gap: "12px",
  },
  card: {
    border: "none",
    borderRadius: "20px",
    padding: "18px",
    minHeight: "112px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
    textAlign: "left",
    cursor: "pointer",
  },
  cardIcon: {
    fontSize: "1.5rem",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 700,
  },
  cardSubtitle: {
    margin: "2px 0 0",
    fontSize: "0.92rem",
    opacity: 0.9,
  },
};