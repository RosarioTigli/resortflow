import { useNavigate } from "react-router-dom";
import { getStoredUmbrellaId } from "../services/guestSession";

const services = [
  {
    icon: "💆",
    title: "Relax Massage",
    duration: "50 minutes",
    description: "A calming full-body massage designed to melt away tension.",
  },
  {
    icon: "🏝️",
    title: "Hot Stone Massage",
    duration: "60 minutes",
    description: "Warm volcanic stones bring deep relaxation and comfort.",
  },
  {
    icon: "🌸",
    title: "Facial Treatment",
    duration: "45 minutes",
    description: "A restorative facial with nourishing botanicals and glow.",
  },
  {
    icon: "🧖",
    title: "SPA Wellness Path",
    duration: "90 minutes",
    description: "A complete ritual for balance, serenity, and renewal.",
  },
];

export default function SpaPage() {
  const navigate = useNavigate();

  function handleBooking() {
    alert("Booking available soon");
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <button style={styles.backButton} onClick={() => navigate(`/${getStoredUmbrellaId() || "welcome"}`)}>
          ← Back to Home
        </button>

        <section style={styles.hero}>
          <p style={styles.eyebrow}>Villa dei Tigli SPA</p>
          <h1 style={styles.title}>✨ Restore your rhythm</h1>
          <p style={styles.subtitle}>
            Discover our signature treatments in a serene seaside setting.
          </p>
        </section>

        <div style={styles.grid}>
          {services.map((service) => (
            <article key={service.title} style={styles.card}>
              <div style={styles.icon}>{service.icon}</div>
              <h2 style={styles.cardTitle}>{service.title}</h2>
              <p style={styles.duration}>{service.duration}</p>
              <p style={styles.description}>{service.description}</p>
              <button style={styles.button} onClick={handleBooking}>
                Book now
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f6fdf9 100%)",
    padding: "20px 16px 32px",
    display: "flex",
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    maxWidth: "560px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  backButton: {
    border: "none",
    background: "transparent",
    color: "#2e7d32",
    fontWeight: 700,
    fontSize: "0.95rem",
    padding: 0,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  hero: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
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
    margin: "6px 0 6px",
    fontSize: "1.5rem",
    color: "#111827",
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.5,
  },
  grid: {
    display: "grid",
    gap: "12px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  icon: {
    fontSize: "1.5rem",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#111827",
  },
  duration: {
    margin: 0,
    fontWeight: 700,
    color: "#2e7d32",
  },
  description: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.5,
  },
  button: {
    marginTop: "4px",
    border: "none",
    alignSelf: "flex-start",
    background: "#22c55e",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
