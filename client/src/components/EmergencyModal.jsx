import React from 'react';

export default function EmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚨</span> Clinical Emergency Protocol
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ×
          </button>
        </div>

        <div style={{ background: 'var(--danger-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
          <strong style={{ color: '#991b1b', display: 'block', marginBottom: '4px' }}>
            Immediate Action Required for Any of These Red Flags:
          </strong>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.6 }}>
            <li>Sudden chest pain, crushing pressure, or pain radiating to left arm/jaw</li>
            <li>Sudden severe shortness of breath or inability to catch breath while resting</li>
            <li>Signs of stroke: facial drooping, arm weakness, speech difficulty (FAST)</li>
            <li>Uncontrolled surgical wound bleeding or black tarry stools</li>
            <li>High fever (&gt;101°F / 38.3°C) accompanied by shaking chills or confusion</li>
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <a 
            href="tel:911" 
            style={{ 
              textDecoration: 'none', 
              background: '#dc2626', 
              color: '#ffffff', 
              textAlign: 'center', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            📞 Call 911 / 108 Emergency
          </a>

          <a 
            href="tel:1800227324" 
            style={{ 
              textDecoration: 'none', 
              background: '#1e1b4b', 
              color: '#ffffff', 
              textAlign: 'center', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: 700 
            }}
          >
            🏥 1-800-CARE-AI Helpline
          </a>
        </div>

        <button type="button" className="btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Close Protocol
        </button>
      </div>
    </div>
  );
}
