import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const assetModules = import.meta.glob('../assets/**/*.{svg,png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const logoSrc = Object.entries(assetModules).find(([assetPath]) =>
  /villa|tigli|logo/i.test(assetPath)
)?.[1];

const splashImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80';

const sandImage =
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80';

const pageStyle = {
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: '#f7efe4',
  fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(135deg, rgba(47, 38, 21, 0.45), rgba(138, 112, 72, 0.2))',
};

const splashStyle = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `linear-gradient(135deg, rgba(66, 51, 26, 0.6), rgba(72, 56, 32, 0.3)), url(${splashImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fdf8f2',
  textAlign: 'center',
  transition: 'opacity 0.8s ease',
};

const cardStyle = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `linear-gradient(135deg, rgba(255, 247, 233, 0.85), rgba(236, 221, 196, 0.9)), url(${sandImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '24px',
  transition: 'opacity 0.8s ease',
};

const cardInnerStyle = {
  width: '100%',
  maxWidth: '500px',
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '28px',
  padding: '42px 36px',
  boxShadow: '0 24px 60px rgba(55, 41, 21, 0.18)',
  border: '1px solid rgba(182, 151, 92, 0.24)',
  backdropFilter: 'blur(14px)',
};

const logoStyle = {
  width: 'clamp(180px, 28vw, 270px)',
  height: 'auto',
  display: 'block',
  margin: '0 auto 18px',
  filter: 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.16))',
};

const splashTitleStyle = {
  margin: '0 0 10px',
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

const splashLineStyle = {
  margin: '0',
  fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  opacity: 0.9,
};

const splashWelcomeStyle = {
  margin: '20px 0 10px',
  fontSize: 'clamp(2.2rem, 4.2vw, 3.3rem)',
  fontWeight: 600,
  lineHeight: 1.2,
};

const splashCaptionStyle = {
  margin: '0',
  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
  lineHeight: 1.7,
  color: 'rgba(255, 248, 242, 0.88)',
  maxWidth: '360px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const titleStyle = {
  margin: '0 0 10px',
  fontSize: 'clamp(2.1rem, 3.8vw, 2.8rem)',
  color: '#2f2a1f',
  fontWeight: 700,
  letterSpacing: '0.02em',
};

const subtitleStyle = {
  margin: '0 0 28px',
  color: '#6f604b',
  fontSize: '1.05rem',
  lineHeight: 1.7,
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: '#5c4d3a',
  fontSize: '0.95rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  border: '1px solid rgba(132, 111, 77, 0.24)',
  borderRadius: '14px',
  padding: '14px 16px',
  fontSize: '1rem',
  outline: 'none',
  marginBottom: '18px',
  background: '#fcfaf6',
  color: '#2f2a1f',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  border: 'none',
  borderRadius: '999px',
  padding: '15px 20px',
  fontSize: '1rem',
  fontWeight: 700,
  color: '#ffffff',
  background: 'linear-gradient(135deg, #6e8f67, #5b7754)',
  cursor: 'pointer',
  marginTop: '8px',
  boxShadow: '0 12px 24px rgba(91, 119, 84, 0.24)',
};

function WelcomePage({
  onContinue,
  initialGuestName = '',
  initialUmbrellaNumber = '',
}) {
  const [phase, setPhase] = useState('splash');
  const [guestName, setGuestName] = useState(initialGuestName);
  const [umbrellaNumber, setUmbrellaNumber] = useState(initialUmbrellaNumber);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('card'), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setGuestName(initialGuestName);
    setUmbrellaNumber(initialUmbrellaNumber);
  }, [initialGuestName, initialUmbrellaNumber]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onContinue === 'function') {
      onContinue({ guestName, umbrellaNumber });
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ ...splashStyle, opacity: phase === 'splash' ? 1 : 0 }}>
        <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
          {logoSrc ? (
            <img src={logoSrc} alt="Villa dei Tigli" style={logoStyle} />
          ) : (
            <div
              style={{
                ...logoStyle,
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 700,
                textAlign: 'center',
                color: '#fffdf8',
                letterSpacing: '0.08em',
              }}
            >
              Villa dei Tigli
            </div>
          )}
          <p style={splashTitleStyle}>Villa dei Tigli</p>
          <p style={splashLineStyle}>Resort & Spa</p>

          <h1 style={splashWelcomeStyle}>
            Benvenuto
            <br />
            in Villa dei Tigli
          </h1>

          <p style={splashCaptionStyle}>
            Ogni momento è pensato
            <br />
            per il tuo relax.
          </p>
        </div>
        <div style={overlayStyle} />
      </div>

      <div style={{ ...cardStyle, opacity: phase === 'card' ? 1 : 0 }}>
        <div style={cardInnerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            {logoSrc ? (
              <img src={logoSrc} alt="Villa dei Tigli" style={{ ...logoStyle, width: '180px', marginBottom: '12px' }} />
            ) : (
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#2f2a1f',
                  marginBottom: '12px',
                }}
              >
                Villa dei Tigli
              </div>
            )}
          </div>

          <h2 style={titleStyle}>Benvenuto</h2>
          <p style={subtitleStyle}>
            Siamo felici di accompagnarti
            <br />
            nella tua esperienza.
          </p>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle} htmlFor="umbrellaNumber">
              Umbrella number
            </label>
            <input
              id="umbrellaNumber"
              type="number"
              min="1"
              value={umbrellaNumber}
              onChange={(event) => setUmbrellaNumber(event.target.value)}
              placeholder="Numero ombrellone"
              style={inputStyle}
            />

            <label style={labelStyle} htmlFor="guestName">
              Guest Name
            </label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              placeholder="Il tuo nome"
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Entra nella tua esperienza
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
