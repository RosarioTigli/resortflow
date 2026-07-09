import { useNavigate } from "react-router-dom";

const adminCards = [
  { key: "menu", title: "🍽 Gestione Menu", description: "Gestisci il menu" },
  { key: "orders", title: "📦 Ordini", description: "Coming soon" },
  { key: "kitchen", title: "👨‍🍳 Cucina", description: "Coming soon" },
  { key: "reception", title: "👩‍💼 Reception", description: "Coming soon" },
  { key: "stats", title: "📊 Statistiche", description: "Coming soon" },
  { key: "settings", title: "⚙️ Impostazioni", description: "Coming soon" },
];

export default function RestaurantAdminPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow Admin</p>
            <h1 style={styles.title}>🏪 Pannello Restaurant</h1>
          </div>
          <button style={styles.secondaryButton} onClick={() => navigate("/restaurant")}>
            ← Indietro
          </button>
        </div>

        <div style={styles.grid}>
          {adminCards.map((card) => {
            const isMenu = card.key === "menu";

            return (
              <button
                key={card.key}
                style={styles.card}
                onClick={() => isMenu && navigate("/admin/menu")}
              >
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardDescription}>
                  {isMenu ? card.description : "Coming soon"}
                </p>
              </button>
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
    background: "#f5f7f5",
    padding: "20px 16px 32px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#4b7f52",
  },
  title: {
    margin: "4px 0 0",
    fontSize: "1.5rem",
    color: "#1f2937",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    padding: "10px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  card: {
    background: "#ffffff",
    border: "none",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    cursor: "pointer",
    textAlign: "left",
  },
  cardTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "1rem",
  },
  cardDescription: {
    margin: "6px 0 0",
    color: "#64748b",
  },
};
