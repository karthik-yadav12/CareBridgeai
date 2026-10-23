import React, { useState, useEffect } from 'react';
import { playMedicalChime, triggerBrowserNotification } from '../utils/audioChime';

const INITIAL_MEDS = [
  { id: 'm1', text: 'Aspirin (81mg) — take only as directed by the cardiac surgeon.', category: 'Confirmed Medications', done: false, time: '08:00 AM' },
  { id: 'm2', text: 'Atorvastatin (80mg) — take only as directed by the cardiac surgeon.', category: 'Confirmed Medications', done: false, time: '10:00 PM' },
  { id: 'm3', text: 'Metoprolol (25mg) — take only as directed by the cardiac surgeon.', category: 'Confirmed Medications', done: false, time: '08:00 AM / 08:00 PM' },
  { id: 'm4', text: 'Ticagrelor (90mg) — follow the actual hospital discharge medication list.', category: 'Confirmed Medications', done: false, time: '08:00 PM' }
];

const INITIAL_ADVICE = [
  { id: 'a1', text: "Take medicines according to the treating team's written instructions.", category: 'Discharge Advice', done: false },
  { id: 'a2', text: "Follow the hospital's instructions for keeping the surgical wound clean and dry.", category: 'Discharge Advice', done: false },
  { id: 'a3', text: 'Walk and increase activity gradually, as advised by the surgeon (10 mins twice daily).', category: 'Discharge Advice', done: false },
  { id: 'a4', text: 'Attend the scheduled cardiac surgery follow-up appointment in 10 days.', category: 'Discharge Advice', done: false }
];

const INITIAL_DIET = [
  { id: 'd1', text: 'Follow low-sodium cardiac diet (<2,000 mg/day).', category: 'Diet & Lifestyle', done: false },
  { id: 'd2', text: 'Avoid heavy lifting over 10 lbs for 2 weeks.', category: 'Diet & Lifestyle', done: false }
];

export default function TimelineView({ setToastMessage }) {
  const [meds, setMeds] = useState(() => {
    const saved = localStorage.getItem('carebridge_meds_checklist');
    return saved ? JSON.parse(saved) : INITIAL_MEDS;
  });

  const [advice, setAdvice] = useState(() => {
    const saved = localStorage.getItem('carebridge_advice_checklist');
    return saved ? JSON.parse(saved) : INITIAL_ADVICE;
  });

  const [diet, setDiet] = useState(() => {
    const saved = localStorage.getItem('carebridge_diet_checklist');
    return saved ? JSON.parse(saved) : INITIAL_DIET;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('carebridge_activity_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('carebridge_meds_checklist', JSON.stringify(meds));
    localStorage.setItem('carebridge_advice_checklist', JSON.stringify(advice));
    localStorage.setItem('carebridge_diet_checklist', JSON.stringify(diet));
    localStorage.setItem('carebridge_activity_logs', JSON.stringify(activityLogs));
  }, [meds, advice, diet, activityLogs]);

  const allItems = [...meds, ...advice, ...diet];
  const completedCount = allItems.filter(i => i.done).length;
  const totalCount = allItems.length;
  const adherenceRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleItem = (id, listType) => {
    playMedicalChime();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (listType === 'meds') {
      setMeds(prev => prev.map(item => {
        if (item.id === id) {
          const newDone = !item.done;
          if (newDone) {
            logAction(`Took dose: ${item.text.split('—')[0].trim()} at ${nowStr}`);
            setToastMessage(`✅ Marked dose completed: ${item.text.split('—')[0].trim()}`);
          }
          return { ...item, done: newDone };
        }
        return item;
      }));
    } else if (listType === 'advice') {
      setAdvice(prev => prev.map(item => {
        if (item.id === id) {
          const newDone = !item.done;
          if (newDone) {
            logAction(`Completed: ${item.text.slice(0, 45)}... at ${nowStr}`);
          }
          return { ...item, done: newDone };
        }
        return item;
      }));
    } else if (listType === 'diet') {
      setDiet(prev => prev.map(item => {
        if (item.id === id) {
          const newDone = !item.done;
          if (newDone) {
            logAction(`Adhered to: ${item.text.slice(0, 40)}... at ${nowStr}`);
          }
          return { ...item, done: newDone };
        }
        return item;
      }));
    }
  };

  const logAction = (text) => {
    setActivityLogs(prev => [text, ...prev.slice(0, 6)]);
  };

  const handleMarkAllDone = () => {
    playMedicalChime();
    setMeds(prev => prev.map(i => ({ ...i, done: true })));
    setAdvice(prev => prev.map(i => ({ ...i, done: true })));
    setDiet(prev => prev.map(i => ({ ...i, done: true })));
    logAction(`All tasks marked completed for today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setToastMessage('🎉 Outstanding! 100% adherence achieved for today.');
  };

  const handleReset = () => {
    setMeds(prev => prev.map(i => ({ ...i, done: false })));
    setAdvice(prev => prev.map(i => ({ ...i, done: false })));
    setDiet(prev => prev.map(i => ({ ...i, done: false })));
    setToastMessage('Checklist reset for new cycle.');
  };

  const handleSoundChime = (label) => {
    triggerBrowserNotification(
      '⏰ CareBridge Medication Alarm',
      `Time for: ${label}. Please take your prescribed dose with water.`
    );
    setToastMessage(`🔔 Audio chime sounded for: ${label}`);
  };

  return (
    <div className="recovery-journey-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.85fr', gap: '2.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Daily Recovery Checklist */}
        <div className="checklist-column">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.6rem' }}>📋</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>
              Daily Recovery Checklist
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Check off items as you complete them throughout your day.
          </p>

          {/* Section 1: Confirmed Medications */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.25rem' }}>💊</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>
                Confirmed Medications
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>🔗</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {meds.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item.id, 'meds')}
                  style={{
                    background: item.done ? '#f8fafc' : '#ffffff',
                    border: `1px solid ${item.done ? '#bbf7d0' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={item.done} 
                      onChange={() => {}} 
                      style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#4f46e5' }}
                    />
                    <span style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      color: item.done ? '#15803d' : 'var(--navy)',
                      textDecoration: item.done ? 'line-through' : 'none'
                    }}>
                      {item.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Play synthesized audio alarm chime"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSoundChime(item.text.split('—')[0].trim());
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #e2e8f0',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}
                  >
                    🔔
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Discharge Advice */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.85rem' }}>
              🩺 Discharge Advice
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {advice.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item.id, 'advice')}
                  style={{
                    background: item.done ? '#f8fafc' : '#ffffff',
                    border: `1px solid ${item.done ? '#bbf7d0' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={item.done} 
                    onChange={() => {}} 
                    style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#4f46e5' }}
                  />
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    color: item.done ? '#15803d' : '#334155',
                    textDecoration: item.done ? 'line-through' : 'none'
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Diet & Lifestyle */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.85rem' }}>
              🥗 Diet &amp; Lifestyle Instructions
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {diet.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item.id, 'diet')}
                  style={{
                    background: item.done ? '#f8fafc' : '#ffffff',
                    border: `1px solid ${item.done ? '#bbf7d0' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={item.done} 
                    onChange={() => {}} 
                    style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#4f46e5' }}
                  />
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    color: item.done ? '#15803d' : '#334155',
                    textDecoration: item.done ? 'line-through' : 'none'
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Activity Tracker */}
        <div className="tracker-column">
          {/* Dark Navy Hero Box */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📈</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Live Activity Tracker</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Real-time adherence log beside your checklist.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tasks Completed
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '2px' }}>
                  {completedCount} / {totalCount}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Adherence Rate
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: adherenceRate >= 80 ? '#4ade80' : '#fbbf24', marginTop: '2px' }}>
                  {adherenceRate}%
                </div>
              </div>
            </div>
          </div>

          {/* 3-Day Adherence Streak Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            color: '#4338ca',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontWeight: 800,
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid #c7d2fe',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>🔥</span>
            <span>3-Day Adherence Streak</span>
          </div>

          {/* Recent Activity Log */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
              <span>🕒</span>
              <span>Recent Activity Log</span>
            </div>

            {activityLogs.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                ⚪ No activity recorded yet today. Check off your first task on the left to start tracking!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activityLogs.map((log, idx) => (
                  <div key={idx} style={{ fontSize: '0.825rem', color: '#334155', background: '#f8fafc', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    • {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Control Buttons: Mark All Done & Reset */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              type="button"
              className="btn-primary"
              onClick={handleMarkAllDone}
              style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '10px 14px' }}
            >
              ✅ Mark All Done
            </button>

            <button 
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '10px 14px' }}
            >
              🔄 Reset Checklist
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
