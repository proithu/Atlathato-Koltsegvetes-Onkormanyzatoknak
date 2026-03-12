import React, { useState, useEffect } from 'react';
import { fetchAndParseData } from './utils/excelParser';
import StatCards from './components/StatCards';
import BudgetChart from './components/BudgetChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import KeyIndicators from './components/KeyIndicators';
import PlannedInvestments from './components/PlannedInvestments';
import MayorMessage from './components/MayorMessage';
import BudgetExplanation from './components/BudgetExplanation';
import { Activity } from 'lucide-react';
import config from './config/config.json';

// Szekció kapcsolók (ha nincs a configban, alapból true = megjelenik)
const show = (key) => config.szekciok?.[key] !== false;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(config.alapEv);

  useEffect(() => {
    const loadData = async () => {
      const parsedData = await fetchAndParseData();
      setData(parsedData);
      setLoading(false);

      if (parsedData.length > 0) {
        // Default to the planned year (alapEv from config) for immediate impact, fallback to latest
        const defaultYear = parsedData.find(d => d.year === config.alapEv) ? config.alapEv : parsedData[parsedData.length - 1].year;
        setSelectedYear(defaultYear);
      }
    };
    loadData();

    // Inject dynamic colors from config.json
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', config.szinek.elsodleges);
    root.style.setProperty('--accent-income', config.szinek.masodlagos);
  }, []);

  if (loading) {
    return (
      <div className="app-container justify-center items-center" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Adatok betöltése és feldolgozása…</p>
      </div>
    );
  }

  const selectedData = data.find(d => d.year === selectedYear);

  // Dinamikus évtartomány az adatokból
  const firstYear = data.length > 0 ? data[0].year : '?';
  const lastYear = data.length > 0 ? data[data.length - 1].year : '?';

  return (
    <div className="app-container">
      <header className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={config.kepek.cimer} alt={`${config.varosNeve} Címere`} style={{ width: '120px', height: 'auto', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '2rem', border: '1px solid var(--brand-primary-glow)' }}>
          <Activity size={18} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 600 }}>Önkormányzati költségvetés</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2 }}>{config.varosNeve} <br /><span className="gradient-text">átlátható költségvetése</span></h1>
        <p style={{ marginTop: '0.5rem' }}>Ismerje meg településünk részletes és átlátható pénzügyi adatait ({firstYear}–{lastYear}), beleértve a {config.alapEv}. évi tervezetet.</p>
      </header>

      {/* Select Year Buttons */}
      <div className="flex justify-center" style={{ gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {data.map(item => (
          <button
            key={item.year}
            onClick={() => setSelectedYear(item.year)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '2rem',
              border: item.year === selectedYear ? '1px solid var(--brand-primary)' : '1px solid var(--glass-border)',
              background: item.year === selectedYear ? 'var(--brand-primary)' : 'var(--surface)',
              color: item.year === selectedYear ? '#ffffff' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {item.year} {item.isPlan && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(terv)</span>}
          </button>
        ))}
      </div>

      {show('polgarmesteriUzenet') && <MayorMessage data={selectedData} />}

      <StatCards data={selectedData} />

      {show('beruhazasok') && <PlannedInvestments data={selectedData} />}

      {show('kulcsindikatorok') && <KeyIndicators data={selectedData} historicalData={data} />}

      <BudgetChart data={data} selectedYear={selectedYear} onYearClick={setSelectedYear} />

      <div className="grid-charts">
        {show('bevetelMegoszlas') && <CategoryBreakdown data={selectedData} type="income" />}
        {show('kiadasMegoszlas') && <CategoryBreakdown data={selectedData} type="expense" />}
      </div>

      {show('koltsegvetesiKisokos') && <BudgetExplanation />}

      <footer style={{ marginTop: '2rem', padding: '2rem', background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{config.varosNeve}</h4>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}><strong>Cím:</strong> {config.elerhetoseg.cim}</p>
          {config.elerhetoseg.adoszam && <p style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}><strong>Adószám:</strong> {config.elerhetoseg.adoszam}</p>}
          <p style={{ fontSize: '0.95rem' }}><strong>Web:</strong> <a href={config.elerhetoseg.weboldal} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>{config.elerhetoseg.weboldal.replace(/^https?:\/\/(www\.)?/, '')}</a></p>
        </div>
        <div style={{ width: '100%', maxWidth: '600px', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '0.5rem 0' }}></div>
        <p style={{ fontSize: '0.85rem', textAlign: 'center', opacity: 0.8 }}>
          A {config.alapEv - 1}. év előtti adatok tényadatok (zárszámadás), a {config.alapEv}. évi adatok a tervezet (eredeti előirányzat) alapján jelennek meg.
        </p>
      </footer>
    </div>
  );
}

export default App;
