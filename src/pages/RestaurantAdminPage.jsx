import { useNavigate } from "react-router-dom";

export default function RestaurantAdminPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>ResortFlow</p>
        <h1 style={styles.title}>Restaurant Admin</h1>
        <p style={styles.message}>Coming soon</p>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.1)",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#2f6f43",
  },
  title: {
    margin: "8px 0 12px",
    fontSize: "1.8rem",
    color: "#111827",
  },
  message: {
    margin: "0 0 20px",
    fontSize: "1rem",
    color: "#475569",
  },
  backButton: {
    border: "none",
    background: "#14532d",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
