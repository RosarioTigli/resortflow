import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const umbrellaId = localStorage.getItem("umbrellaId") || "18";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowForm(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  function handleEnter() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    localStorage.setItem("guestName", trimmedName);
    navigate(`/${umbrellaId}`);
  }

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, ...(showForm ? styles.cardVisible : styles.cardHidden) }}>
        <div style={styles.brandBar}>
          <div style={styles.logoMark}>V</div>
          <div style={styles.brandText}>
            <p style={styles.logoLabel}>Villa dei Tigli</p>
            <p style={styles.logoSub}>Resort & Spa</p>
          </div>
        </div>

        {!showForm ? (
          <div style={styles.introScreen}>
            <p style={styles.introHeadline}>Un benvenuto riservato.</p>
            <p style={styles.tagline}>
              Lascia che la luce calda della costa e il comfort della nostra villa siano il primo ricordo della tua giornata.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.hero}>
              <p style={styles.eyebrow}>Benvenuto</p>
              <h1 style={styles.title}>Comincia la tua esperienza esclusiva.</h1>
              <p style={styles.heroCopy}>
                Confermiamo il tuo accesso a Villa dei Tigli con un momento di calma, cura e dettagli su misura.
              </p>
            </div>

            <div style={styles.detailGrid}>
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Umbrella</span>
                <strong style={styles.infoValue}>{umbrellaId}</strong>
              </div>
              <div style={styles.infoBoxAlt}>
                <span style={styles.infoLabel}>Stile</span>
                <strong style={styles.infoValue}>Elegante</strong>
              </div>
            </div>

            <label style={styles.label} htmlFor="guestName">
              Nome ospite
            </label>
            <input
              id="guestName"
              style={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Inserisci il tuo nome"
            />

            <button style={styles.button} onClick={handleEnter}>
              Accedi alla tua esperienza
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px",
    backgroundColor: "#F4E8DE",
    backgroundImage:
      "radial-gradient(circle at top left, rgba(255, 255, 255, 0.95), transparent 28%), radial-gradient(circle at bottom right, rgba(191, 162, 108, 0.18), transparent 32%)",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "rgba(255, 255, 255, 0.96)",
    borderRadius: "32px",
    padding: "32px",
    boxShadow: "0 30px 80px rgba(47, 43, 40, 0.12)",
    border: "1px solid rgba(199, 161, 90, 0.16)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    transform: "translateY(0)",
    opacity: 1,
    transition: "opacity 0.55s ease, transform 0.55s ease",
  },
  cardHidden: {
    opacity: 0,
    transform: "translateY(26px)",
  },
  cardVisible: {
    opacity: 1,
    transform: "translateY(0)",
  },
  brandBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "4px",
    borderBottom: "1px solid rgba(199, 161, 90, 0.16)",
  },
  logoMark: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #D6B87F 0%, #BFA26C 100%)",
    color: "#2F2B28",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    fontWeight: 800,
    boxShadow: "0 16px 28px rgba(191, 162, 108, 0.18)",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  logoLabel: {
    margin: 0,
    fontSize: "1rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 800,
    color: "#2F2B28",
  },
  logoSub: {
    margin: 0,
    fontSize: "0.75rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#6c6a62",
  },
  introScreen: {
    minHeight: "320px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    textAlign: "center",
    paddingTop: "12px",
  },
  introHeadline: {
    margin: 0,
    fontSize: "2rem",
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#2F2B28",
    maxWidth: "340px",
  },
  tagline: {
    margin: 0,
    color: "#6b655d",
    fontSize: "1rem",
    lineHeight: 1.8,
    maxWidth: "360px",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.8rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#7d8c73",
    fontWeight: 700,
  },
  title: {
    margin: 0,
    fontSize: "1.95rem",
    lineHeight: 1.15,
    fontWeight: 800,
    color: "#2F2B28",
  },
  heroCopy: {
    margin: 0,
    color: "#6b655d",
    fontSize: "1rem",
    lineHeight: 1.75,
    maxWidth: "460px",
  },
  detailGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
  },
  infoBox: {
    flex: "1 1 160px",
    minWidth: "160px",
    background: "#F8F4ED",
    border: "1px solid rgba(199, 161, 90, 0.24)",
    borderRadius: "20px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoBoxAlt: {
    flex: "1 1 160px",
    minWidth: "160px",
    background: "rgba(191, 162, 108, 0.06)",
    border: "1px solid rgba(191, 162, 108, 0.16)",
    borderRadius: "20px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoLabel: {
    margin: 0,
    color: "#6b655d",
    fontSize: "0.95rem",
    fontWeight: 700,
  },
  infoValue: {
    margin: 0,
    color: "#2F2B28",
    fontSize: "1.2rem",
    fontWeight: 800,
  },
  label: {
    fontWeight: 700,
    color: "#4b463f",
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    border: "1px solid #e4d8c8",
    borderRadius: "16px",
    padding: "14px 16px",
    fontSize: "1rem",
    outline: "none",
    background: "#fff",
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.05)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  button: {
    border: "none",
    background: "linear-gradient(135deg, #9E8C64 0%, #BFA26C 100%)",
    color: "#2F2B28",
    padding: "16px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "1rem",
    letterSpacing: "0.02em",
    boxShadow: "0 18px 32px rgba(191, 162, 108, 0.22)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};
