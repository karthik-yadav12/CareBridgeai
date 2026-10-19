import React from 'react';

export default function TopBanner({ currentLang, setLanguage }) {
  return (
    <div className="top-bar-dribbble">
      <div className="top-bar-left">
        <div className="top-bar-item">
          <span>📍</span>
          <span>2702 Hospital Recovery Blvd, Suite 400</span>
        </div>
        <div className="top-bar-item">
          <span>🕒</span>
          <span>Monday - Sunday: 24/7 Clinical Monitoring</span>
        </div>
        <div className="top-bar-item">
          <span>📞</span>
          <span>Emergency Line: 1-800-CARE-AI (or 108 / 911)</span>
        </div>
      </div>

      <div className="top-bar-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span>🌐</span>
          <select 
            value={currentLang} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="English" style={{ color: '#0f172a' }}>English</option>
            <option value="Español" style={{ color: '#0f172a' }}>Español</option>
            <option value="हिन्दी" style={{ color: '#0f172a' }}>हिन्दी</option>
            <option value="తెలుగు" style={{ color: '#0f172a' }}>తెలుగు</option>
          </select>
        </div>
      </div>
    </div>
  );
}
