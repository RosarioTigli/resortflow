import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        setOrders(fetchedOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function updateOrderStatus(orderId, nextStatus) {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: nextStatus,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  function getStatusLabel(status = "new") {
    switch (status) {
      case "in-preparation":
        return "In Preparation";
      case "delivered":
        return "Delivered";
      default:
        return "New";
    }
  }

  function getStatusStyle(status = "new") {
    switch (status) {
      case "in-preparation":
        return {
          background: "#fff7d6",
          color: "#8a6500",
        };
      case "delivered":
        return {
          background: "#e8f5e9",
          color: "#2e7d32",
        };
      default:
        return {
          background: "#eef2ff",
          color: "#4338ca",
        };
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow</p>
            <h1 style={styles.title}>🍽️ Kitchen Orders</h1>
          </div>
          <div style={styles.badge}>{orders.length} orders</div>
        </div>

        {loading ? (
          <div style={styles.stateCard}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={styles.stateCard}>No orders yet.</div>
        ) : (
          <div style={styles.grid}>
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const statusStyle = getStatusStyle(order.status);

              return (
                <article key={order.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <p style={styles.label}>Umbrella number</p>
                      <h2 style={styles.umbrella}>{order.umbrella ?? "—"}</h2>
                    </div>
                    <span style={{ ...styles.statusPill, ...statusStyle }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div style={styles.section}>
                    <p style={styles.label}>Products</p>
                    <ul style={styles.list}>
                      {items.length > 0 ? (
                        items.map((item, index) => {
                          const name = item?.nome || item?.name || item;
                          return <li key={`${order.id}-${index}`}>{name}</li>;
                        })
                      ) : (
                        <li>No products listed</li>
                      )}
                    </ul>
                  </div>

                  <div style={styles.footer}>
                    <div>
                      <p style={styles.label}>Total</p>
                      <p style={styles.total}>
                        €{Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>

                    <div style={styles.actions}>
                      <button
                        style={styles.yellowButton}
                        onClick={() => updateOrderStatus(order.id, "in-preparation")}
                      >
                        🟡 In Preparation
                      </button>
                      <button
                        style={styles.greenButton}
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                      >
                        🟢 Delivered
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #eefbf2 100%)",
    padding: "24px 16px 40px",
  },
  container: {
    maxWidth: "980px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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
    fontSize: "1.6rem",
    color: "#111827",
  },
  badge: {
    background: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "999px",
    padding: "10px 14px",
    fontWeight: 700,
  },
  stateCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    color: "#475569",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  label: {
    margin: 0,
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
  },
  umbrella: {
    margin: "4px 0 0",
    fontSize: "1.3rem",
    color: "#111827",
  },
  statusPill: {
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "0.8rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  list: {
    margin: 0,
    paddingLeft: "18px",
    color: "#334155",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  total: {
    margin: "4px 0 0",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#111827",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "170px",
  },
  yellowButton: {
    border: "none",
    background: "#fef3c7",
    color: "#92400e",
    padding: "9px 12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
  greenButton: {
    border: "none",
    background: "#dcfce7",
    color: "#166534",
    padding: "9px 12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
