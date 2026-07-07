function MenuPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🍽️ Menù del Giorno</h1>

      <div style={card}>
        <h3>Lasagna alla Bolognese</h3>
        <p>€14</p>
      </div>

      <div style={card}>
        <h3>Caprese con Bufala</h3>
        <p>€12</p>
      </div>

      <div style={card}>
        <h3>Panino Crudo e Mozzarella</h3>
        <p>€9</p>
      </div>

      <div style={card}>
        <h3>Spritz</h3>
        <p>€8</p>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
  boxShadow: "0 0 10px rgba(0,0,0,.1)"
};

export default MenuPage;

