import { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

function groupItems(items = []) {
  return items.reduce((acc, item) => {
    const name = item?.nome || item?.name || item;
    const quantity = Number(item?.quantity || 1);
    const existing = acc.find((entry) => entry.name === name);

    if (existing) {
      existing.quantity += quantity;
      return acc;
    }

    acc.push({ name, quantity });
    return acc;
  }, []);
}

function formatArrivalTime(timestamp) {
  if (!timestamp) {
    return "—";
  }

  const date = typeof timestamp?.toDate === "function" ? timestamp.toDate() : new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getDateString(date) {
  const normalized = new Date(date);
  return `${normalized.getFullYear()}-${String(normalized.getMonth() + 1).padStart(2, "0")}-${String(normalized.getDate()).padStart(2, "0")}`;
}

function getHistoryRange(filter, selectedDate) {
  const baseDate = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  const start = new Date(baseDate);
  const end = new Date(baseDate);

  if (filter === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate());
  } else if (filter === "week") {
    const day = start.getDay();
    const diff = (day + 6) % 7;
    start.setDate(start.getDate() - diff);
    end.setDate(start.getDate() + 7);
  } else {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  if (filter !== "week") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  if (filter === "yesterday") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return {
    start,
    end,
  };
}

function playReceptionTone() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(640, now);
  oscillator.frequency.linearRampToValueAtTime(760, now + 0.9);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.16, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.9);

  setTimeout(() => audioContext.close(), 1000);
}

export default function ReceptionPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active");
  const [historyFilter, setHistoryFilter] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
  const [highlightedOrderIds, setHighlightedOrderIds] = useState([]);
  const previousOrderIdsRef = useRef(new Set());
  const initialLoadRef = useRef(true);
  const viewRef = useRef("active");

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (viewRef.current === "history") {
      const ordersRef = collection(db, "orders");
      const historyDate = selectedDate || getDateString(new Date());
      const { start, end } = getHistoryRange(historyFilter, historyDate);
      const q = query(
        ordersRef,
        where("createdAt", ">=", Timestamp.fromDate(start)),
        where("createdAt", "<", Timestamp.fromDate(end)),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedOrders = snapshot.docs
            .map((docSnapshot) => ({
              id: docSnapshot.id,
              ...docSnapshot.data(),
            }))
            .filter((order) => ["delivered", "completed"].includes(order.status));

          setOrders(fetchedOrders);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        const filteredOrders = fetchedOrders.filter((order) => order.status === "ready");

        setOrders(filteredOrders);
        setLoading(false);

        if (!initialLoadRef.current) {
          const newlySeenIds = filteredOrders
            .filter((order) => !previousOrderIdsRef.current.has(order.id))
            .map((order) => order.id);

          if (newlySeenIds.length > 0) {
            playReceptionTone();

            setHighlightedOrderIds((current) => [...new Set([...current, ...newlySeenIds])]);
            newlySeenIds.forEach((orderId) => {
              window.setTimeout(() => {
                setHighlightedOrderIds((current) => current.filter((id) => id !== orderId));
              }, 5000);
            });
          }
        }

        previousOrderIdsRef.current = new Set(filteredOrders.map((order) => order.id));
        initialLoadRef.current = false;
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedDate, view, historyFilter]);

  async function markAsPaid(orderId) {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paid: true,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  }

  async function markAsDelivered(orderId) {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "delivered",
      });
    } catch (error) {
      console.error("Error updating delivery status:", error);
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

        <div style={styles.adminCards}>
          <button style={styles.adminCard} onClick={() => navigate("/admin/menu")}>
            <span style={styles.adminIcon}>🍽️</span>
            <span style={styles.adminText}>Menu Admin</span>
          </button>
          <button style={styles.adminCard} onClick={() => navigate("/admin/restaurant")}>
            <span style={styles.adminIcon}>🍴</span>
            <span style={styles.adminText}>Restaurant Admin</span>
          </button>
        </div>

        <div style={styles.toolbar}>
          <div style={styles.filterGroup}>
            <button
              style={{ ...styles.filterButton, ...(view === "active" ? styles.filterButtonActive : {}) }}
              onClick={() => setView("active")}
            >
              Active
            </button>
            <button
              style={{ ...styles.filterButton, ...(view === "history" ? styles.filterButtonActive : {}) }}
              onClick={() => setView("history")}
            >
              History
            </button>
          </div>

          {view === "history" ? (
            <div style={styles.historyControls}>
              <div style={styles.quickFilterGroup}>
                <button
                  style={{ ...styles.quickFilterButton, ...(historyFilter === "today" ? styles.quickFilterButtonActive : {}) }}
                  onClick={() => {
                    setHistoryFilter("today");
                    setSelectedDate(getDateString(new Date()));
                  }}
                >
                  Today
                </button>
                <button
                  style={{ ...styles.quickFilterButton, ...(historyFilter === "yesterday" ? styles.quickFilterButtonActive : {}) }}
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setHistoryFilter("yesterday");
                    setSelectedDate(getDateString(yesterday));
                  }}
                >
                  Yesterday
                </button>
                <button
                  style={{ ...styles.quickFilterButton, ...(historyFilter === "week" ? styles.quickFilterButtonActive : {}) }}
                  onClick={() => {
                    setHistoryFilter("week");
                    setSelectedDate(getDateString(new Date()));
                  }}
                >
                  This Week
                </button>
              </div>

              <label style={styles.dateLabel}>
                <span style={styles.dateLabelText}>Day</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    setHistoryFilter("custom");
                    setSelectedDate(event.target.value);
                  }}
                  style={styles.dateInput}
                />
              </label>

              <button
                style={styles.clearButton}
                onClick={() => {
                  setHistoryFilter("today");
                  setSelectedDate(getDateString(new Date()));
                }}
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <div style={styles.stateCard}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={styles.stateCard}>{view === "history" ? "No delivered orders for this day." : "No ready orders for this day."}</div>
        ) : (
          <div style={styles.grid}>
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              const paid = Boolean(order.paid);
              const isHighlighted = highlightedOrderIds.includes(order.id);

              return (
                <article
                  key={order.id}
                  style={{
                    ...styles.card,
                    ...(isHighlighted ? styles.highlightedCard : {}),
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div>
                      <p style={styles.label}>Guest name</p>
                      <h2 style={styles.guestName}>{order.guestName || "Guest"}</h2>
                    </div>
                    <div style={styles.headerActions}>
                      {isHighlighted ? <span style={styles.newBadge}>NEW</span> : null}
                      <span style={{ ...styles.statusPill, ...(paid ? styles.paidPill : styles.pendingPill) }}>
                        {paid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.metaRow}>
                    <div>
                      <p style={styles.label}>Arrival time</p>
                      <p style={styles.metaValue}>{formatArrivalTime(order.createdAt)}</p>
                    </div>
                    <div>
                      <p style={styles.label}>Umbrella</p>
                      <p style={styles.metaValue}>{order.umbrella ?? "—"}</p>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <p style={styles.label}>Items</p>
                    <ul style={styles.list}>
                      {items.length > 0 ? (
                        groupItems(items).map((entry, index) => (
                          <li key={`${order.id}-${index}`}>
                            {entry.name} x{entry.quantity}
                          </li>
                        ))
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
                  </div>

                  <div style={styles.actions}>
                    <button style={styles.secondaryButton} onClick={() => markAsPaid(order.id)} disabled={paid}>
                      {paid ? "✅ Paid" : "💳 Mark as Paid"}
                    </button>
                    <button style={styles.primaryButton} onClick={() => markAsDelivered(order.id)}>
                      Delivered
                    </button>
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
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    gap: "8px",
  },
  filterButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  filterButtonActive: {
    background: "#14532d",
    color: "#ffffff",
    borderColor: "#14532d",
  },
  historyControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  quickFilterGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  quickFilterButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  quickFilterButtonActive: {
    background: "#14532d",
    color: "#ffffff",
    borderColor: "#14532d",
  },
  dateLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    padding: "8px 12px",
    borderRadius: "999px",
  },
  dateLabelText: {
    fontSize: "0.85rem",
    color: "#475569",
    fontWeight: 700,
  },
  dateInput: {
    border: "none",
    outline: "none",
    fontSize: "0.9rem",
    color: "#111827",
    background: "transparent",
  },
  clearButton: {
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#334155",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 700,
    cursor: "pointer",
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
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
  },
  highlightedCard: {
    boxShadow: "0 0 0 2px #f59e0b, 0 16px 35px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-2px)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  label: {
    margin: 0,
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
  },
  guestName: {
    margin: "4px 0 0",
    fontSize: "1.2rem",
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
  newBadge: {
    borderRadius: "999px",
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "6px 10px",
    fontSize: "0.75rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    flexWrap: "wrap",
  },
  metaValue: {
    margin: "4px 0 0",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
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
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  secondaryButton: {
    border: "none",
    background: "#fef3c7",
    color: "#92400e",
    padding: "10px 12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
  primaryButton: {
    border: "none",
    background: "#22c55e",
    color: "#ffffff",
    padding: "10px 12px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
