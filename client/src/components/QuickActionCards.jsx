import React from 'react';

export default function QuickActionCards({ onOpenWorkspace, openEmergencyModal }) {
  return (
    <div className="quick-action-row">
      <div className="quick-action-cards-grid">
        <div 
          className="dribbble-action-card"
          onClick={() => onOpenWorkspace('diet')}
        >
          <div className="dribbble-card-icon" style={{ background: '#faf5ff', color: '#7c3aed' }}>
            🥗
          </div>
          <div className="dribbble-card-text">
            <h4>Clinical Recovery<br />Diet &amp; Nutrition</h4>
          </div>
        </div>

        <div 
          className="dribbble-action-card"
          onClick={() => onOpenWorkspace('handwritten')}
        >
          <div className="dribbble-card-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            ✍️
          </div>
          <div className="dribbble-card-text">
            <h4>Handwritten<br />Prescription OCR</h4>
          </div>
        </div>

        <div 
          className="dribbble-action-card"
          onClick={() => onOpenWorkspace('confusion')}
        >
          <div className="dribbble-card-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
            ⚠️
          </div>
          <div className="dribbble-card-text">
            <h4>Medication Confusion<br />&amp; LASA Guard</h4>
          </div>
        </div>

        <div 
          className="dribbble-action-card"
          onClick={() => onOpenWorkspace('timeline')}
        >
          <div className="dribbble-card-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            ⏰
          </div>
          <div className="dribbble-card-text">
            <h4>Recovery Timetable<br />&amp; Audio Chimes</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
