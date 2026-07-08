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

export default function ReceptionPage() {
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

  async function markAsPaid(orderId) {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paid: true,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow</p>
            <h1 style={styles.title}>🏨 Reception Orders</h1>
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
              const paid = Boolean(order.paid);

              return (
                <article key={order.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <p style={styles.label}>Umbrella number</p>
                      <h2 style={styles.umbrella}>{order.umbrella ?? "—"}</h2>
                    </div>
                    <span style={{ ...styles.statusPill, ...(paid ? styles.paidPill : styles.pendingPill) }}>
                      {paid ? "Paid" : "Pending"}
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
                      <p style={styles.total}>€{Number(order.total || 0).toFixed(2)}</p>
                    </div>

                    <div>
                      <p style={styles.label}>Status</p>
                      <p style={styles.statusText}>{order.status || "new"}</p>
                    </div>
                  </div>

                  <button
                    style={styles.button}
                    onClick={() => markAsPaid(order.id)}
                    disabled={paid}
                  >
                    {paid ? "✅ Paid" : "💳 Mark as Paid"}
                  </button>
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
    background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
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
    color: "#2f6f43",
  },
  title: {
    margin: "4px 0 0",
    fontSize: "1.6rem",
    color: "#111827",
  },
  badge: {
    background: "#dcfce7",
    color: "#166534",
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
  paidPill: {
    background: "#dcfce7",
    color: "#166534",
  },
  pendingPill: {
    background: "#fef3c7",
    color: "#92400e",
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
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  total: {
    margin: "4px 0 0",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#111827",
  },
  statusText: {
    margin: "4px 0 0",
    color: "#334155",
    textTransform: "capitalize",
  },
  button: {
    border: "none",
    background: "#22c55e",
    color: "#ffffff",
    padding: "10px 12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
