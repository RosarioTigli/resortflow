import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const categories = [
  { key: "pranzo", label: "🍝 Pranzo", icon: "🍝" },
  { key: "panini", label: "🥪 Panini", icon: "🥪" },
  { key: "insalate", label: "🥗 Insalate", icon: "🥗" },
  { key: "bibite", label: "🥤 Bibite", icon: "🥤" },
  { key: "cocktail", label: "🍹 Cocktail", icon: "🍹" },
  { key: "vini", label: "🍷 Vini", icon: "🍷" },
  { key: "gelati", label: "🍨 Gelati", icon: "🍨" },
  { key: "dessert", label: "🍰 Dessert", icon: "🍰" },
];

export default function RestaurantHomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

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

  const visibleProducts = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return products.filter((product) => {
      const normalizedCategory = `${product.categoria || ""}`.toLowerCase();
      return normalizedCategory.includes(selectedCategory);
    });
  }, [products, selectedCategory]);

  function addToCart(product) {
    setCart((currentCart) => [...currentCart, product]);
  }

  const total = cart.reduce((sum, item) => sum + Number(item.prezzo || 0), 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>ResortFlow Restaurant</p>
            <h1 style={styles.title}>🍽️ Seleziona una categoria</h1>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.secondaryButton} onClick={() => navigate("/restaurant/admin")}>
              Admin
            </button>
          </div>
        </div>

        <section style={styles.cartCard}>
          <div style={styles.cartHeader}>
            <h2 style={styles.sectionTitle}>Il tuo ordine</h2>
            <span style={styles.totalText}>€ {total.toFixed(2)}</span>
          </div>
          {cart.length === 0 ? (
            <p style={styles.emptyText}>Il carrello è vuoto.</p>
          ) : (
            <ul style={styles.cartList}>
              {cart.map((item, index) => (
                <li key={`${item.id}-${index}`} style={styles.cartItem}>
                  <span>{item.nome}</span>
                  <span>€ {Number(item.prezzo || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {!selectedCategory ? (
          <section style={styles.categoryGrid}>
            {categories.map((category) => (
              <button
                key={category.key}
                style={styles.categoryCard}
                onClick={() => setSelectedCategory(category.key)}
              >
                <span style={styles.categoryIcon}>{category.icon}</span>
                <span style={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </section>
        ) : (
          <section style={styles.productsSection}>
            <div style={styles.productsHeader}>
              <div>
                <p style={styles.eyebrow}>Categoria</p>
                <h2 style={styles.sectionTitle}>
                  {categories.find((item) => item.key === selectedCategory)?.label}
                </h2>
              </div>
              <button style={styles.secondaryButton} onClick={() => setSelectedCategory(null)}>
                ← Indietro
              </button>
            </div>

            {visibleProducts.length === 0 ? (
              <div style={styles.emptyState}>Nessun prodotto disponibile per questa categoria.</div>
            ) : (
              visibleProducts.map((product) => {
                const isAvailable = product.available !== false;

                return (
                  <article key={product.id} style={styles.card}>
                    <div style={styles.cardContent}>
                      <h3 style={styles.productName}>{product.nome}</h3>
                      <p style={styles.category}>{product.categoria}</p>
                      {!isAvailable && <span style={styles.soldOutBadge}>Esaurito</span>}
                    </div>
                    <div style={styles.cardFooter}>
                      <span style={styles.price}>€ {Number(product.prezzo || 0).toFixed(2)}</span>
                      <button
                        style={{
                          ...styles.addButton,
                          ...(isAvailable ? {} : styles.disabledButton),
                        }}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && addToCart(product)}
                      >
                        {isAvailable ? "➕ Aggiungi" : "Esaurito"}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}
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
  headerActions: {
    display: "flex",
    gap: "8px",
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
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  categoryCard: {
    background: "#ffffff",
    border: "none",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    color: "#111827",
    fontWeight: 700,
  },
  categoryIcon: {
    fontSize: "1.6rem",
  },
  categoryLabel: {
    fontSize: "1rem",
  },
  productsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  productsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  emptyState: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "16px",
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
  disabledButton: {
    background: "#cbd5e1",
    color: "#64748b",
    cursor: "not-allowed",
  },
  soldOutBadge: {
    display: "inline-block",
    marginTop: "6px",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 700,
  },
};
