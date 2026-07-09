import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { getStoredGuestName, getStoredUmbrellaId } from "../services/guestSession";

export default function RestaurantSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) {
      return;
    }

    const cart = Array.isArray(locationState.cart) ? locationState.cart : [];
    const guestName = locationState.guestName || getStoredGuestName() || "Guest";
    const umbrellaId = locationState.umbrellaId || getStoredUmbrellaId() || "";
    const total = Number(locationState.total || 0);

    if (cart.length > 0) {
      hasSubmitted.current = true;
      addDoc(collection(db, "orders"), {
        umbrella: Number(umbrellaId),
        items: cart,
        total,
        status: "new",
        guestName,
        createdAt: serverTimestamp(),
      })
        .then(() => {
          localStorage.setItem("restaurantCart", "[]");
        })
        .catch((error) => {
          console.error("Error saving restaurant order:", error);
        });
    } else {
      localStorage.setItem("restaurantCart", "[]");
    }
  }, [locationState.cart, locationState.guestName, locationState.umbrellaId, locationState.total]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.eyebrow}>ResortFlow Restaurant</p>
          <h1 style={styles.title}>Grazie per il tuo ordine!</h1>
          <p style={styles.message}>
            Il tuo ordine è stato inviato con successo. La preparazione richiederà circa 15-20 minuti.
          </p>
          <button style={styles.primaryButton} onClick={() => navigate(`/${getStoredUmbrellaId() || "welcome"}`)}>
            Torna alla Home
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
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    textAlign: "center",
    width: "100%",
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
    margin: "8px 0 0",
    fontSize: "1.6rem",
    color: "#1f2937",
  },
  message: {
    margin: "12px 0 18px",
    color: "#64748b",
    lineHeight: 1.6,
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
