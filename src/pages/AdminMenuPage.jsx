import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "../services/firebase";

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewRows, setPreviewRows] = useState([]);
  const [previewMessage, setPreviewMessage] = useState("");

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

  async function handleExcelImport(event) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      setPreviewRows([]);
      setPreviewMessage("Please select a .xlsx file.");
      return;
    }

    try {
      const workbook = XLSX.read(await selectedFile.arrayBuffer(), { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const normalizedRows = rows
        .map((row) => {
          const categoria = row.Categoria ?? row.categoria ?? row.CATEGORIA ?? "";
          const nome = row.Nome ?? row.nome ?? row.NOME ?? "";
          const prezzo = row.Italiano ?? row.italiano ?? row.prezzo ?? row.Prezzo ?? "";

          return {
            categoria,
            nome,
            prezzo,
          };
        })
        .filter((row) => row.categoria || row.nome || row.prezzo);

      if (normalizedRows.length === 0) {
        setPreviewRows([]);
        setPreviewMessage("The selected file is empty.");
        return;
      }

      setPreviewRows(normalizedRows);
      setPreviewMessage("");
    } catch (error) {
      console.error("Error reading Excel file:", error);
      setPreviewRows([]);
      setPreviewMessage("Unable to read the selected Excel file.");
    }
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={handleExcelImport}
          />
          <button
            style={styles.importButton}
            onClick={() => fileInputRef.current?.click()}
          >
            📥 Importa da Excel
          </button>
        </section>

        {(previewMessage || previewRows.length > 0) && (
          <section style={styles.previewCard}>
            <h3 style={styles.previewTitle}>Preview</h3>
            {previewMessage ? (
              <p style={styles.previewMessage}>{previewMessage}</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Categoria</th>
                      <th style={styles.tableHeader}>Nome</th>
                      <th style={styles.tableHeader}>Prezzo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr key={`${row.nome}-${index}`}>
                        <td style={styles.tableCell}>{row.categoria}</td>
                        <td style={styles.tableCell}>{row.nome}</td>
                        <td style={styles.tableCell}>€ {String(row.prezzo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

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
  previewCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  previewTitle: {
    margin: "0 0 10px",
    color: "#1f2937",
    fontSize: "1rem",
  },
  previewMessage: {
    margin: 0,
    color: "#64748b",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontWeight: 700,
  },
  tableCell: {
    padding: "8px 10px",
    borderBottom: "1px solid #f1f5f9",
    color: "#475569",
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
