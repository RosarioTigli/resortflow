import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { getStoredGuestName, getStoredUmbrellaId } from "../services/guestSession";

export default function RestaurantCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};

  const cart = useMemo(() => {
    if (Array.isArray(locationState.cart)) {
      return locationState.cart;
    }

    try {
      return JSON.parse(localStorage.getItem("restaurantCart") || "[]");
    } catch {
      return [];
    }
  }, [locationState.cart]);

  const guestName = locationState.guestName || getStoredGuestName() || "Guest";
  const umbrellaId = locationState.umbrellaId || getStoredUmbrellaId() || "";
  const total = cart.reduce((sum, item) => sum + Number(item.prezzo || 0) * Number(item.quantity || 1), 0);

  async function confirmOrder() {
    if (cart.length === 0) {
      return;
    }

    const confirmed = window.confirm("Confermare l'ordine?");
    if (!confirmed) {
      return;
    }

    try {
      localStorage.setItem("restaurantCart", "[]");
      navigate("/restaurant/success", {
        state: {
          cart,
          guestName,
          umbrellaId,
          total,
        },
      });
    } catch (error) {
      console.error("Error saving restaurant order:", error);
      alert("Impossibile salvare l'ordine.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow Restaurant</p>
            <h1 style={styles.title}>🧾 Conferma ordine</h1>
          </div>
          <button style={styles.secondaryButton} onClick={() => navigate("/restaurant")}>
            ← Torna al menu
          </button>
        </div>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Dettagli ordine</h2>
          <div style={styles.infoRow}>
            <span style={styles.label}>Nome ospite</span>
            <span style={styles.value}>{guestName}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Ombrello</span>
            <span style={styles.value}>#{umbrellaId}</span>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Prodotti ordinati</h2>
          {cart.length === 0 ? (
            <p style={styles.emptyText}>Il carrello è vuoto.</p>
          ) : (
            <ul style={styles.list}>
              {cart.map((item) => (
                <li key={item.id} style={styles.listItem}>
                  <div>
                    <div>{item.nome}</div>
                    <div style={styles.smallText}>x{item.quantity}</div>
                  </div>
                  <span>€ {Number(item.prezzo || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={styles.card}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Totale</span>
            <span style={styles.totalValue}>€ {total.toFixed(2)}</span>
          </div>
          <button style={styles.primaryButton} onClick={confirmOrder}>
            Conferma ordine
          </button>
        </section>
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
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  sectionTitle: {
    margin: "0 0 10px",
    fontSize: "1rem",
    color: "#1f2937",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eef2f7",
    color: "#334155",
  },
  label: {
    color: "#64748b",
  },
  value: {
    fontWeight: 700,
    color: "#111827",
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eef2f7",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  totalLabel: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#334155",
  },
  totalValue: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#2e7d32",
  },
  smallText: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginTop: "2px",
  },
  primaryButton: {
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
    width: "100%",
  },
};
