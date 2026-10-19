import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

const SAMPLES = [
  'Metoprolol Tartrate vs Succinate ER',
  'Hydralazine vs Hydroxyzine',
  'Celebrex vs Celexa',
  'Aspirin with Ibuprofen together',
  'Warfarin with Cranberry juice'
];

export default function ConfusionGuardView() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async (textToCheck) => {
    const searchText = textToCheck || query;
    if (!searchText.trim()) {
      setError('Please enter a medication name or pair to check.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/confusion-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchText })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to check medication safety.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'critical': return { bg: '#fef2f2', border: '#f87171', text: '#b91c1c' };
      case 'high': return { bg: '#fff7ed', border: '#fb923c', text: '#c2410c' };
      case 'moderate': return { bg: '#fffbeb', border: '#fcd34d', text: '#b45309' };
      default: return { bg: '#ecfdf5', border: '#6ee7b7', text: '#047857' };
    }
  };

  return (
    <section className="module-section">
      <div className="module-header">
        <span className="module-header-badge">Clinical Safety Protocol</span>
        <h2>Medication Confusion &amp; LASA Guard</h2>
        <p>Prevent fatal sound-alike / look-alike drug mix-ups and dangerous contraindications.</p>
      </div>

      <div className="module-body-card">
        <div className="form-group">
          <label className="form-label">Enter Drug Name, Pair, or Medical Term</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Metoprolol Tartrate, Hydralazine, or Prednisone dose..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
            <button 
              className="btn-primary" 
              onClick={() => handleCheck()}
              disabled={loading}
              style={{ minWidth: '160px' }}
            >
              {loading ? 'Evaluating...' : '🛡️ Safety Scan'}
            </button>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Popular Clinical Checks:</span>
          {SAMPLES.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(s);
                handleCheck(s);
              }}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ marginTop: '1.5rem', padding: '12px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', borderTop: '2px solid var(--border-light)', paddingTop: '2rem' }}>
            {/* Risk Badge */}
            {result.riskLevel && (
              <div style={{
                ...getRiskColor(result.riskLevel),
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${getRiskColor(result.riskLevel).border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800 }}>Assessed Risk Severity</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{result.riskLevel} Clinical Confusion Risk</h3>
                </div>
                <div style={{ fontSize: '2rem' }}>
                  {result.riskLevel === 'Critical' || result.riskLevel === 'High' ? '🚨' : '🛡️'}
                </div>
              </div>
            )}

            {/* Alert & Guidance */}
            {result.safetyAlert && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--dark-indigo)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  ⚠️ Clinical Safety Analysis
                </h4>
                <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{result.safetyAlert}</p>
              </div>
            )}

            {/* Look-Alike Breakdown */}
            {result.lookAlikeDrugs && result.lookAlikeDrugs.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--dark-indigo)', marginBottom: '1rem' }}>
                  🔄 Commonly Confused Medications &amp; Critical Distinctions
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {result.lookAlikeDrugs.map((item, i) => (
                    <div key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                        {item.name}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {item.distinction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable guidance */}
            {result.actionableGuidance && (
              <div style={{ background: 'var(--primary-light)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.25rem' }}>
                  📌 What You Must Check on the Box / Bottle Right Now:
                </strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{result.actionableGuidance}</p>
              </div>
            )}

            {/* Questions for pharmacist */}
            {result.questionsToConfirmWithPharmacist && (
              <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  💬 Double-check with your pharmacist:
                </strong>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {result.questionsToConfirmWithPharmacist.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
