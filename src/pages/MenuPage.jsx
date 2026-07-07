import menu from "../data/menu";

function MenuPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🍽️ Menù Villa dei Tigli</h1>

      {menu.map((prodotto) => (
        <div key={prodotto.id} style={card}>
          <h3>{prodotto.nome}</h3>

          <p>
            <strong>{prodotto.categoria}</strong>
          </p>

          <p>€ {prodotto.prezzo}</p>

          <button>Aggiungi</button>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
  boxShadow: "0 0 10px rgba(0,0,0,.1)",
};

export default MenuPage;