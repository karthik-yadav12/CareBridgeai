import React from 'react';

export default function ServicesGrid({ onOpenWorkspace }) {
  const services = [
    {
      id: 'handwritten',
      icon: '✍️',
      title: 'Handwritten Prescription OCR',
      desc: 'Automates identification and recognition of messy doctor cursive handwriting into normal typed text with expanded Latin abbreviations.'
    },
    {
      id: 'confusion',
      icon: '🧠',
      title: 'Medication Confusion & LASA Guard',
      desc: 'Prevents dangerous Look-Alike / Sound-Alike drug mix-ups (e.g. Metoprolol Tartrate vs Succinate) and drug-drug interactions.'
    },
    {
      id: 'timeline',
      icon: '⏰',
      title: 'Recovery Timetable & Chimes',
      desc: 'Personalized hourly medication schedule with synthesized Web Audio medical chime alarms and browser notifications.'
    },
    {
      id: 'document',
      icon: '📄',
      title: 'Discharge Summary Explainer',
      desc: 'Translates dense hospital paperwork, surgical notes, and complex medical jargon into clear everyday language for patients.'
    },
    {
      id: 'diet',
      icon: '🥗',
      title: 'Clinical Recovery Diet',
      desc: 'Tailored nutrition plans (cardiac stent, diabetic wound healing, post-op abdominal) with foods to emphasize and foods to avoid.'
    },
    {
      id: 'timeline',
      icon: '🚨',
      title: 'Emergency Red-Flag Triage',
      desc: 'Immediate clinical symptom screening for post-discharge warning signs (chest pain, shortness of breath, fever) with direct emergency routing.'
    }
  ];

  return (
    <section className="services-dribbble-section">
      <div className="services-header">
        <span className="services-pill-tag">Clinical Recovery Pillars</span>
        <h2 className="services-heading">
          Comprehensive post-discharge<br />
          care &amp; medication safety services
        </h2>
      </div>

      <div className="services-grid-6">
        {services.map((s, idx) => (
          <div 
            key={idx} 
            className="service-card-dribbble"
            onClick={() => onOpenWorkspace(s.id)}
          >
            <div className="service-icon-box">{s.icon}</div>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
            <div className="service-learn-more">
              <span>Open Tool</span>
              <span>↗</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
