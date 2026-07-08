import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import menu from "../data/menu";
import { db } from "../services/firebase";

export default function MenuPage() {
  const navigate = useNavigate();
  const [carrello, setCarrello] = useState([]);

  function aggiungiAlCarrello(prodotto) {
    setCarrello([...carrello, prodotto]);
  }

  async function inviaOrdine() {
    if (carrello.length === 0) {
      alert("The cart is empty.");
      return;
    }

    const umbrellaId = Number(localStorage.getItem("umbrellaId") || 18);
    const prodotti = carrello.map((item) => `- ${item.nome}`).join("\n");
    const conferma = window.confirm(
      `Villa dei Tigli Resort\n\nUmbrella: ${umbrellaId}\n\nProducts:\n${prodotti}\n\nTotal: €${totale.toFixed(2)}\n\nConfirm order?`
    );

    if (!conferma) {
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        umbrella: Number(localStorage.getItem("umbrellaId")),
        items: carrello,
        total: totale,
        status: "new",
        guestName: localStorage.getItem("guestName") || "",
        createdAt: serverTimestamp(),
      });

      setCarrello([]);
      alert("✅ Order sent!");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to send order.");
    }
  }

  const totale = carrello.reduce(
    (somma, prodotto) => somma + prodotto.prezzo,
    0
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow</p>
            <h1 style={styles.title}>🍽️ Villa dei Tigli Menu</h1>
          </div>
          <div style={styles.badge}>🛒 {carrello.length}</div>
        </div>

        <section style={styles.cartCard}>
          <div style={styles.cartHeader}>
            <h2 style={styles.sectionTitle}>Your order</h2>
            <span style={styles.totalText}>€ {totale.toFixed(2)}</span>
          </div>

          {carrello.length === 0 ? (
            <p style={styles.emptyText}>Your cart is empty.</p>
          ) : (
            <ul style={styles.cartList}>
              {carrello.map((item, index) => (
                <li key={`${item.id}-${index}`} style={styles.cartItem}>
                  <span>{item.nome}</span>
                  <span>€ {item.prezzo.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={styles.productsSection}>
          {menu.map((prodotto) => (
            <article key={prodotto.id} style={styles.card}>
              <div>
                <h3 style={styles.productName}>{prodotto.nome}</h3>
                <p style={styles.category}>{prodotto.categoria}</p>
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.price}>€ {prodotto.prezzo.toFixed(2)}</span>
                <button
                  style={styles.addButton}
                  onClick={() => aggiungiAlCarrello(prodotto)}
                >
                  ➕ Add
                </button>
              </div>
            </article>
          ))}
        </section>

        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate(`/${localStorage.getItem("umbrellaId") || 18}`)}
          >
            ⬅ Back to Home
          </button>
          <button style={styles.primaryButton} onClick={inviaOrdine}>
            📤 Send Order
          </button>
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
    maxWidth: "760px",
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
  badge: {
    background: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 700,
  },
  cartCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  cartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "1rem",
    color: "#1f2937",
  },
  totalText: {
    fontWeight: 700,
    color: "#2e7d32",
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
  },
  cartList: {
    listStyle: "none",
    padding: 0,
    margin: "8px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eef2f7",
    color: "#334155",
  },
  productsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  productName: {
    margin: 0,
    fontSize: "1rem",
    color: "#111827",
  },
  category: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  price: {
    fontWeight: 700,
    color: "#1f2937",
  },
  addButton: {
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    flex: 1,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    padding: "12px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
  primaryButton: {
    flex: 1,
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "12px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};