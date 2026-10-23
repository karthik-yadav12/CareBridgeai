import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

const PRESET_CONDITIONS = [
  'Post-Cardiac Stent / Angioplasty (Low-Sodium, Antiplatelet Safe)',
  'Orthopedic Knee / Hip Replacement (High-Collagen, Anti-Inflammatory)',
  'Post-Abdominal Surgery (Low-Residue, High-Protein Healing)',
  'Type 2 Diabetes with Surgical Wound Healing',
  'Hypertension with Renal Sparing'
];

export default function DietPlannerView() {
  const [condition, setCondition] = useState(PRESET_CONDITIONS[0]);
  const [preference, setPreference] = useState('Vegetarian / Mediterranean');
  const [allergies, setAllergies] = useState('None');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/diet-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition,
          dietaryPreference: preference,
          allergies
        })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate dietary plan.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-section">
      <div className="module-header">
        <span className="module-header-badge">Clinical Nutritionist</span>
        <h2>Condition-Specific Recovery Diet Planner</h2>
        <p>Accelerate tissue healing, manage drug-food interactions, and reduce systemic inflammation.</p>
      </div>

      <div className="module-body-card">
        {/* Condition presets */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Select Clinical Condition Protocol</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {PRESET_CONDITIONS.map((cond, idx) => {
              const isSelected = condition === cond;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCondition(cond)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : '#eef2ff',
                    color: isSelected ? '#ffffff' : '#4338ca',
                    border: `1px solid ${isSelected ? '#4f46e5' : '#c7d2fe'}`,
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
                  }}
                >
                  {cond.split(' (')[0]}
                </button>
              );
            })}
          </div>

          <input 
            type="text" 
            className="form-input" 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)} 
          />
        </div>

        <div className="diet-inputs-grid">
          <div>
            <label className="form-label">Dietary Preference</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Vegetarian, Halal, Low-Carb..."
              value={preference} 
              onChange={(e) => setPreference(e.target.value)} 
            />
          </div>

          <div>
            <label className="form-label">Food Allergies / Intolerances</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Gluten, Nuts, Lactose, Shellfish..."
              value={allergies} 
              onChange={(e) => setAllergies(e.target.value)} 
            />
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleGenerate} 
          disabled={loading}
          style={{ 
            width: '100%', 
            justifyContent: 'center',
            padding: '14px 28px',
            fontSize: '1rem',
            marginTop: '0.5rem',
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.32)'
          }}
        >
          {loading ? 'Consulting Clinical Nutrition Engine...' : '🥗 Generate Clinical Recovery Diet'}
        </button>

        {error && (
          <div style={{ marginTop: '1.5rem', padding: '12px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ marginTop: '2.5rem', borderTop: '2px solid var(--border-light)', paddingTop: '2rem' }}>
            {/* Rationale */}
            {result.dietaryRationale && (
              <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  🧬 Recovery Nutrition Rationale
                </h4>
                <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{result.dietaryRationale}</p>
              </div>
            )}

            {/* Foods to Emphasize & Avoid in 2 columns */}
            <div className="diet-columns-grid">
              {/* Emphasize */}
              <div style={{ background: '#eef2ff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #c7d2fe' }}>
                <h4 style={{ color: '#312e81', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🟢</span> Foods to Emphasize
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.foodsToEmphasize?.map((f, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #d1fae5' }}>
                      <strong style={{ color: '#4338ca' }}>{f.food}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{f.benefit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid */}
              <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #fecaca' }}>
                <h4 style={{ color: '#991b1b', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔴</span> Foods to Strictly Avoid
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.foodsToStrictlyAvoid?.map((f, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #fee2e2' }}>
                      <strong style={{ color: '#b91c1c' }}>{f.food}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{f.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Meal Plan */}
            {result.sampleMealPlan && (
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--dark-indigo)', marginBottom: '1rem' }}>
                  🍽️ Sample Daily Recovery Menu
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Breakfast</span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '4px' }}>{result.sampleMealPlan.breakfast}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lunch</span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '4px' }}>{result.sampleMealPlan.lunch}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Snack</span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '4px' }}>{result.sampleMealPlan.eveningSnack || result.sampleMealPlan.midMorningSnack}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dinner</span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '4px' }}>{result.sampleMealPlan.dinner}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hydration */}
            {result.hydrationGoal && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💧</span>
                <div>
                  <strong style={{ color: '#0369a1' }}>Daily Hydration Target:</strong>
                  <span style={{ marginLeft: '6px', fontSize: '0.9rem', color: '#0c4a6e' }}>{result.hydrationGoal}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
