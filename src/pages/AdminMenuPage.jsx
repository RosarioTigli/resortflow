import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
      const docs = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setProducts(docs);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.nome || ""} ${product.categoria || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [products, searchTerm]);

  async function toggleAvailability(product) {
    const productRef = doc(db, "menu", product.id);
    await updateDoc(productRef, {
      available: !product.available,
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow Admin</p>
            <h1 style={styles.title}>🍽️ Menu Management</h1>
          </div>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/")}
          >
            ⬅ Back
          </button>
        </div>

        <section style={styles.toolbar}>
          <input
            style={styles.searchInput}
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
          />
          <button
            style={styles.importButton}
            onClick={() => alert("Excel import coming soon.")}
          >
            📥 Import Excel
          </button>
        </section>

        <section style={styles.productsSection}>
          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>No products available.</div>
          ) : (
            filteredProducts.map((product) => {
              const isAvailable = product.available === true;

              return (
                <article key={product.id} style={styles.card}>
                  <div style={styles.cardContent}>
                    <div style={styles.productHeader}>
                      <h3 style={styles.productName}>{product.nome}</h3>
                      <span style={isAvailable ? styles.availableBadge : styles.unavailableBadge}>
                        {isAvailable ? "🟢 Available" : "🔴 Unavailable"}
                      </span>
                    </div>
                    <p style={styles.category}>{product.categoria}</p>
                    <p style={styles.price}>€ {Number(product.prezzo || 0).toFixed(2)}</p>
                  </div>
                  <button style={styles.primaryButton} onClick={() => toggleAvailability(product)}>
                    Toggle Availability
                  </button>
                </article>
              );
            })
          )}
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
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
    padding: "14px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    border: "1px solid #cbd5e1",
    padding: "10px 12px",
    borderRadius: "999px",
    outline: "none",
    fontSize: "0.95rem",
  },
  importButton: {
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
  productsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  emptyState: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "18px",
    textAlign: "center",
    color: "#64748b",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
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
    flexWrap: "wrap",
  },
  cardContent: {
    flex: 1,
    minWidth: "220px",
  },
  productHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  productName: {
    margin: 0,
    fontSize: "1rem",
    color: "#111827",
  },
  availableBadge: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  unavailableBadge: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  category: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "0.95rem",
  },
  price: {
    margin: "6px 0 0",
    fontWeight: 700,
    color: "#1f2937",
  },
  primaryButton: {
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 700,
  },
};
