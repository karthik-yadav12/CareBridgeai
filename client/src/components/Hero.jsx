import React from 'react';

export default function Hero({ onOpenWorkspace, isLoggedIn, onOpenDashboard }) {
  return (
    <section id="hero-section" className="hero-dribbble">
      <div className="hero-dribbble-inner">
        {/* Left column */}
        <div className="hero-left-column">
          <div className="hero-tag">
            <span>~</span>
            <span>Post-Discharge Care &amp; Medication Safety</span>
          </div>

          <h1 className="hero-heading">
            Your Recovery<br />
            Our Priority
          </h1>

          <p className="hero-paragraph">
            Bridging the vulnerable transition from hospital to home. We translate messy handwritten doctor prescriptions into clean digital text, detect dangerous drug confusions, and automate medication alarms so you recover safely.
          </p>

          <div className="hero-action-pill-bar">
            <div className="hero-select-segment" onClick={() => onOpenWorkspace('prescriptions')}>
              <span>💊 Latest Prescriptions</span>
              <span style={{ fontSize: '0.75rem' }}>⌵</span>
            </div>

            <div className="hero-divider" />

            <div className="hero-select-segment" onClick={() => onOpenWorkspace('confusion')}>
              <span>🧠 Confusion Guard</span>
              <span style={{ fontSize: '0.75rem' }}>⌵</span>
            </div>

            {isLoggedIn && onOpenDashboard ? (
              <button 
                className="btn-hero-launch" 
                onClick={onOpenDashboard}
                style={{ background: '#4f46e5' }}
              >
                <span>Open Dashboard</span>
                <span>→</span>
              </button>
            ) : (
              <button 
                className="btn-hero-launch" 
                onClick={() => onOpenWorkspace('upload')}
              >
                <span>Upload Prescription</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>

        {/* Right column: Cutout photo + 3 Floating Badges */}
        <div className="hero-doctor-wrapper">
          <img 
            src="/doctor_hero.jpg" 
            alt="Doctor caring for patient" 
            className="hero-doctor-img"
          />

          {/* Floating Pill Badge 1 */}
          <div 
            className="floating-badge badge-cardiology"
            onClick={() => onOpenWorkspace('confusion')}
          >
            <span>🫀</span>
            <span>Cardiology &amp; Meds</span>
          </div>

          {/* Floating Pill Badge 2 */}
          <div 
            className="floating-badge badge-neurology"
            onClick={() => onOpenWorkspace('handwritten')}
          >
            <span>🧠</span>
            <span>LASA Safety Guard</span>
          </div>

          {/* Floating Pill Badge 3 */}
          <div 
            className="floating-badge badge-orthopedics"
            onClick={() => onOpenWorkspace('timeline')}
          >
            <span>⏰</span>
            <span>Recovery Timetable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
