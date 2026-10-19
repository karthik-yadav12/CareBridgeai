import React from 'react';

export default function WhyPatientsChooseUs({ onOpenWorkspace }) {
  return (
    <section className="why-us-section">
      <div className="why-us-left">
        <span className="about-content-pill">Why CareBridge AI</span>
        <h2 className="why-us-heading">
          Why Patients &amp; Doctors<br />
          Trust CareBridge AI
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          We eliminate the anxiety and guesswork of recovering at home with continuous safety checks and intelligent reminders.
        </p>

        <div className="why-us-item" onClick={() => onOpenWorkspace('confusion')} style={{ cursor: 'pointer' }}>
          <div className="why-us-icon">🛡️</div>
          <div className="why-us-text">
            <h5>Zero Medication Confusion</h5>
            <p>Our LASA Safety Guard proactively alerts you if prescribed medications look or sound dangerously similar to others.</p>
          </div>
        </div>

        <div className="why-us-item" onClick={() => onOpenWorkspace('handwritten')} style={{ cursor: 'pointer' }}>
          <div className="why-us-icon">✍️</div>
          <div className="why-us-text">
            <h5>Messy Handwriting Decoded</h5>
            <p>Converts illegible cursive doctor scripts into clean digital text and expands cryptic Latin abbreviations (Rx, tid, od, sos).</p>
          </div>
        </div>

        <div className="why-us-item" onClick={() => onOpenWorkspace('timeline')} style={{ cursor: 'pointer' }}>
          <div className="why-us-icon">⏰</div>
          <div className="why-us-text">
            <h5>Automated Timetable &amp; Audio Chimes</h5>
            <p>Pleasant, browser-synthesized medical audio alarms keep your medicine schedule strictly on track without annoying noise.</p>
          </div>
        </div>
      </div>

      <div className="doctor-hello-card">
        <img 
          src="/doctor_recommend.jpg" 
          alt="Clinical Doctor Available 24/7" 
          className="doctor-hello-img"
        />

        <div className="hello-badge">
          <strong>CareBridge 24/7</strong>
          <span>⏱ Clinical Post-Discharge Companion</span>
        </div>
      </div>
    </section>
  );
}
