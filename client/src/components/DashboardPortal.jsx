import React, { useState, useEffect } from 'react';
import HandwrittenOCRView from './HandwrittenOCRView';
import ConfusionGuardView from './ConfusionGuardView';
import DietPlannerView from './DietPlannerView';
import TimelineView from './TimelineView';
import DocumentAnalysisView from './DocumentAnalysisView';
import { playMedicalChime, triggerBrowserNotification } from '../utils/audioChime';

export default function DashboardPortal({ 
  userProfile, 
  setUserProfile, 
  onViewLandingPage, 
  openEmergencyModal, 
  openProfileModal, 
  setToastMessage,
  onSignOut,
  initialStep
}) {
  // Current active step in the recovery pipeline
  // 'overview' | 'prescriptions' | 'upload' | 'verify' | 'reminders' | 'followup' | 'recovery' | 'diet' | 'confusion'
  const [activeStep, setActiveStep] = useState(initialStep || 'overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (initialStep) {
      setActiveStep(initialStep);
    }
  }, [initialStep]);

  // Latest Prescriptions State (stored in localStorage)
  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem('carebridge_portal_prescriptions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rx_1',
        title: 'Post-Stent Hospital Discharge Prescription',
        doctor: 'Dr. Eleanor Vance, MD (Cardiologist)',
        clinic: 'St. Elizabeth Heart Center • Suite 402',
        date: '2026-10-19',
        diagnosis: 'Acute Coronary Syndrome s/p LAD Stent Placement',
        status: 'Active',
        refill: '1 Refill Remaining (30-day supply)',
        documentType: 'Handwritten Doctor Note (OCR Verified)',
        imagePreview: '/sample_prescription.jpg',
        medications: [
          {
            name: 'Aspirin (Cardio)',
            dosage: '81 mg',
            schedule: 'Once Daily (8:00 AM)',
            instructions: 'Take with breakfast. Lifelong antiplatelet therapy to protect coronary stent.',
            critical: false
          },
          {
            name: 'Ticagrelor (Brilinta)',
            dosage: '90 mg',
            schedule: 'Twice Daily (8:00 AM & 8:00 PM)',
            instructions: 'DO NOT MISS A DOSE. High stent thrombosis risk if abruptly stopped.',
            critical: true
          },
          {
            name: 'Atorvastatin',
            dosage: '80 mg',
            schedule: 'Once Daily (9:00 PM Bedtime)',
            instructions: 'Take at bedtime. High-intensity plaque stabilization and lipid management.',
            critical: false
          },
          {
            name: 'Metoprolol Tartrate',
            dosage: '25 mg',
            schedule: 'Twice Daily (8:00 AM & 8:00 PM)',
            instructions: 'Take with food. Monitor heart rate (<60 bpm consult MD). Do NOT confuse with Succinate ER.',
            critical: false
          }
        ],
        notes: 'Strict low-sodium cardiac diet. Avoid NSAIDs (ibuprofen) without cardiologist consultation.'
      },
      {
        id: 'rx_2',
        title: 'Surgical Wound & Post-Op Recovery Protocol',
        doctor: 'Dr. Marcus Brody, MD (Surgical Team)',
        clinic: 'Memorial Outpatient Surgical Center',
        date: '2026-10-14',
        diagnosis: 'Surgical Incision & Prophylaxis',
        status: 'Active',
        refill: 'Course Complete (Finish remaining antibiotic)',
        documentType: 'Digital Outpatient Prescription',
        imagePreview: null,
        medications: [
          {
            name: 'Cephalexin (Keflex)',
            dosage: '500 mg',
            schedule: '4x Daily (6 AM, 12 PM, 6 PM, 10 PM)',
            instructions: 'Finish entire 7-day antibiotic course even if feeling better.',
            critical: false
          },
          {
            name: 'Acetaminophen (Tylenol)',
            dosage: '500 mg',
            schedule: 'Every 6 hrs PRN (As needed for pain)',
            instructions: 'Do not exceed 3,000 mg in 24 hours. Avoid alcohol.',
            critical: false
          }
        ],
        notes: 'Keep surgical incision dry for 48 hours. Inspect daily for redness or drainage.'
      }
    ];
  });

  // Filter for prescriptions tab
  const [prescriptionFilter, setPrescriptionFilter] = useState('all'); // 'all' | 'active' | 'refills'
  const [previewModalRx, setPreviewModalRx] = useState(null);

  // Sample appointments for the follow-up step
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('carebridge_portal_appointments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'apt_1',
        doctor: 'Dr. Eleanor Vance, MD (Cardiologist)',
        clinic: 'St. Elizabeth Heart Center • Suite 402',
        date: '2026-11-02',
        time: '10:30 AM',
        daysRemaining: 10,
        specialty: 'Post-Stent & Echo Evaluation',
        prepNotes: 'Bring current medication list and 7-day blood pressure log.',
        alarmSet: false
      },
      {
        id: 'apt_2',
        doctor: 'Dr. Marcus Brody, MD (Surgical Team)',
        clinic: 'Memorial Hospital Outpatient Surgical Clinic',
        date: '2026-10-28',
        time: '02:00 PM',
        daysRemaining: 5,
        specialty: 'Incision & Wound Healing Inspection',
        prepNotes: 'Keep surgical dressing clean and dry prior to visit.',
        alarmSet: true
      }
    ];
  });

  // New appointment form state
  const [showAddApt, setShowAddApt] = useState(false);
  const [newDoctor, setNewDoctor] = useState('');
  const [newClinic, setNewClinic] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newPrep, setNewPrep] = useState('');

  // Recovery Vitals State
  const [painLevel, setPainLevel] = useState(3);
  const [temperature, setTemperature] = useState('98.6');
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [energyLevel, setEnergyLevel] = useState(4);
  const [woundStatus, setWoundStatus] = useState('Clean & Healing');
  const [vitalsNotes, setVitalsNotes] = useState('');
  const [recoveryLogs, setRecoveryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('carebridge_portal_vitals_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        date: 'Today, 08:30 AM',
        painLevel: 3,
        temperature: '98.4°F',
        bloodPressure: '122/78',
        energyLevel: 'Good Mobility',
        woundStatus: 'Clean & Healing',
        status: 'Normal Healing'
      }
    ];
  });

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      const cleared = { name: '', email: '', phone: '', diagnosis: '', isLoggedIn: false };
      setUserProfile(cleared);
      localStorage.removeItem('carebridge_user');
      localStorage.removeItem('carebridge_auth_token');
      setToastMessage('Signed out successfully.');
    }
  };

  const handleToggleAlarm = (id) => {
    playMedicalChime();
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const next = !a.alarmSet;
        if (next) {
          triggerBrowserNotification('Follow-Up Reminder Set', `Reminder active for ${a.doctor} on ${a.date}`);
          setToastMessage(`🔔 Reminder alarm active for ${a.doctor}`);
        } else {
          setToastMessage(`Reminder muted for ${a.doctor}`);
        }
        return { ...a, alarmSet: next };
      }
      return a;
    }));
  };

  // Calendar export (.ics)
  const handleExportIcs = (apt) => {
    try {
      const dateClean = (apt.date || '2026-11-02').replace(/-/g, '');
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CareBridge AI//Post-Discharge Medical Checkup//EN',
        'BEGIN:VEVENT',
        `SUMMARY:Medical Checkup: ${apt.doctor}`,
        `DESCRIPTION:${apt.specialty} - ${apt.prepNotes}. Location: ${apt.clinic}`,
        `LOCATION:${apt.clinic}`,
        `DTSTART:${dateClean}T103000Z`,
        `DTEND:${dateClean}T113000Z`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `checkup_${apt.doctor.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToastMessage(`📅 Saved calendar event (.ics) for ${apt.doctor}!`);
    } catch {
      setToastMessage('Could not export calendar invite.');
    }
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    if (!newDoctor || !newDate) {
      setToastMessage('Please enter doctor name and appointment date.');
      return;
    }

    const newObj = {
      id: `apt_${Date.now()}`,
      doctor: newDoctor,
      clinic: newClinic || 'Outpatient Clinic',
      date: newDate,
      time: newTime || '10:00 AM',
      daysRemaining: Math.max(1, Math.round((new Date(newDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      specialty: newSpecialty || 'Clinical Follow-up',
      prepNotes: newPrep || 'Bring current discharge paperwork and active medications.',
      alarmSet: true
    };

    const updated = [newObj, ...appointments];
    setAppointments(updated);
    localStorage.setItem('carebridge_portal_appointments', JSON.stringify(updated));
    setShowAddApt(false);
    setNewDoctor('');
    setNewClinic('');
    setNewDate('');
    setNewTime('');
    setNewSpecialty('');
    setNewPrep('');
    setToastMessage(`✅ Saved follow-up appointment with ${newObj.doctor}`);
  };

  const handleSaveVitals = (e) => {
    e.preventDefault();
    playMedicalChime();

    const tempNum = parseFloat(temperature);
    const isFever = !isNaN(tempNum) && tempNum >= 100.4;
    const isHighPain = painLevel >= 8;
    const isWoundIssue = woundStatus.includes('Redness') || woundStatus.includes('Drainage');

    const status = (isFever || isHighPain || isWoundIssue) ? 'Red Flag Alert' : 'Normal Healing';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      date: `Today, ${timeStr}`,
      painLevel,
      temperature: `${temperature}°F`,
      bloodPressure: `${systolic}/${diastolic}`,
      energyLevel: energyLevel >= 4 ? 'Good Mobility' : 'Resting / Fatigue',
      woundStatus,
      notes: vitalsNotes,
      status
    };

    const updated = [newLog, ...recoveryLogs.slice(0, 8)];
    setRecoveryLogs(updated);
    localStorage.setItem('carebridge_portal_vitals_logs', JSON.stringify(updated));

    if (status === 'Red Flag Alert') {
      setToastMessage('🚨 High Red-Flag symptom logged! Please consult your doctor.');
    } else {
      setToastMessage("✅ Today's recovery vitals recorded successfully!");
    }
    setVitalsNotes('');
  };

  const tempNum = parseFloat(temperature);
  const showFeverAlert = !isNaN(tempNum) && tempNum >= 100.4;
  const showPainAlert = painLevel >= 8;

  // Print/Export prescription summary
  const handlePrintPrescription = (rx) => {
    const textLines = [
      `CAREBRIDGE AI - CLINICAL PRESCRIPTION SUMMARY`,
      `----------------------------------------------`,
      `Patient Name: ${userProfile?.name || 'Patient'}`,
      `Diagnosis: ${rx.diagnosis}`,
      `Prescribing Doctor: ${rx.doctor}`,
      `Clinic / Hospital: ${rx.clinic}`,
      `Date Issued: ${rx.date}`,
      `Refill Status: ${rx.refill}`,
      ``,
      `ACTIVE MEDICATIONS:`,
      ...rx.medications.map((m, idx) => `${idx + 1}. ${m.name} - ${m.dosage}\n   Schedule: ${m.schedule}\n   Instructions: ${m.instructions}`),
      ``,
      `CLINICAL PRECAUTIONS & NOTES:`,
      rx.notes || 'None recorded.',
      `----------------------------------------------`,
      `Generated by CareBridge AI Patient Portal.`
    ].join('\n');

    const blob = new Blob([textLines], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Prescription_${rx.id}_${userProfile?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Patient'}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`📄 Exported prescription summary for ${rx.doctor}`);
  };

  // Pipeline navigation items
  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Recovery Overview', sub: 'Health status & tools' },
    { id: 'prescriptions', icon: '💊', label: 'Latest Prescriptions', sub: 'Active meds & refills', badge: `${prescriptions.length} Active` },
    { id: 'upload', icon: '📤', label: 'Upload Prescription', sub: 'Scan photo, note or PDF' },
    { id: 'verify', icon: '🔍', label: 'Verify Medicines', sub: 'OCR & Latin check' },
    { id: 'reminders', icon: '⏰', label: 'Dose Timetable', sub: 'Hourly alarms & chimes' },
    { id: 'followup', icon: '📅', label: 'Schedule Follow-up', sub: 'Doctor checkups & dates' },
    { id: 'recovery', icon: '📈', label: 'Track Recovery', sub: 'Pain & vitals roadmap' },
    { id: 'diet', icon: '🥗', label: 'Diet & Nutrition', sub: 'Foods to eat & avoid' },
    { id: 'confusion', icon: '⚠️', label: 'Confusion Guard', sub: 'LASA drug safety' }
  ];

  const filteredPrescriptions = prescriptions.filter(rx => {
    if (prescriptionFilter === 'active') return rx.status === 'Active';
    if (prescriptionFilter === 'refills') return rx.refill.toLowerCase().includes('refill');
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`dashboard-mobile-backdrop ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sticky Header (Visible on <= 900px) */}
      <header className="dashboard-mobile-header">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#1e293b',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>☰</span>
          <span>Menu</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: '#4f46e5',
            borderRadius: '7px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '0.95rem'
          }}>
            ✚
          </div>
          <strong style={{ fontSize: '1rem', color: 'var(--navy)' }}>CareBridge AI</strong>
        </div>

        <button
          type="button"
          onClick={openEmergencyModal}
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
          }}
        >
          🚨 911
        </button>
      </header>

      {/* ======================= SLEEK CLINICAL SIDEBAR ======================= */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Logo Brand Header */}
          <div style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#4f46e5',
                borderRadius: '8px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem'
              }}>
                ✚
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--navy)' }}>
                CareBridge <span style={{ color: '#4f46e5' }}>AI</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: '#eef2ff',
                color: '#4f46e5',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #c7d2fe'
              }}>
                PORTAL
              </span>

              {/* Mobile Close Button */}
              <button
                type="button"
                className="mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* User Welcome Card */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#4f46e5',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
            }}>
              {userProfile?.name ? userProfile.name[0].toUpperCase() : 'P'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontWeight: 800,
                fontSize: '0.9rem',
                color: 'var(--navy)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {userProfile?.name || 'Patient'}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                {userProfile?.diagnosis || 'Post-Discharge Recovery'}
              </div>
            </div>
          </div>



          {/* Sidebar Navigation Items */}
          <div style={{ padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.6px',
              padding: '0.25rem 0.75rem 0.5rem 0.75rem'
            }}>
              Recovery Workspace
            </div>

            {sidebarItems.map((item) => {
              const isActive = activeStep === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveStep(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? '#eef2ff' : 'transparent',
                    color: isActive ? '#4f46e5' : '#334155',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? 'inset 3px 0 0 #4f46e5' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.84rem', lineHeight: 1.2 }}>{item.label}</div>
                      <div style={{ fontSize: '0.69rem', color: isActive ? '#6366f1' : '#94a3b8', fontWeight: 500 }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span style={{
                      background: isActive ? '#c7d2fe' : '#f1f5f9',
                      color: isActive ? '#3730a3' : '#475569',
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '9999px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer with Caregiver Profile, Emergency, Landing toggle & Sign Out */}
        <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              openProfileModal();
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '9999px',
              padding: '8px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>👤</span>
            <span>Profile &amp; Caregiver</span>
          </button>

          <button
            type="button"
            onClick={() => {
              openEmergencyModal();
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
            }}
          >
            <span>🚨</span>
            <span>Emergency 911</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              borderRadius: '9999px',
              padding: '8px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ======================= MAIN DASHBOARD WORKSPACE ======================= */}
      <main className="dashboard-main-content">
        
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🏥</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                Patient Recovery Dashboard
              </h1>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Logged in as <strong>{userProfile?.name || 'Patient'}</strong> • {userProfile?.diagnosis || 'Post-Discharge Recovery'}
            </p>
          </div>
        </div>

        {/* ================= STEP CONTENT AREA ================= */}

        {/* 1. OVERVIEW: CLEAN CLINICAL HEALTH DASHBOARD */}
        {activeStep === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Welcome banner & Platform Purpose */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
              border: '1px solid #e0e7ff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem 2.5rem',
              color: '#1e293b',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div>
                <span style={{
                  background: '#eef2ff',
                  color: '#4338ca',
                  border: '1px solid #c7d2fe',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  display: 'inline-block'
                }}>
                  POST-DISCHARGE CLINICAL SAFETY PROTOCOL • DAY 3 OF 14
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '10px 0 6px 0', color: '#0f172a' }}>
                  Welcome to CareBridge AI, <span style={{ color: '#4f46e5' }}>{userProfile?.name || 'Patient'}</span>!
                </h2>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', maxWidth: '620px', lineHeight: 1.6 }}>
                  CareBridge AI bridges the vulnerable transition from hospital to home. We decode doctor prescriptions, verify dangerous drug interactions, and schedule automated alarms so you never miss a dose.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep('upload')}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '11px 22px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>📤</span>
                  <span>Upload Prescription</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep('reminders')}
                  style={{
                    background: '#ffffff',
                    color: '#334155',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '9999px',
                    padding: '11px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>⏰</span>
                  <span>Dose Timetable &amp; Alarms</span>
                </button>
              </div>
            </div>

            {/* Clinical Status Overview: 3 Real-time Recovery Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {/* Metric 1: Active Meds */}
              <div 
                onClick={() => setActiveStep('prescriptions')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    Active Medications
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>💊</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--navy)' }}>
                  3 On Schedule
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#4338ca', fontWeight: 600 }}>
                  Aspirin 81mg, Clopidogrel 75mg, Atorvastatin 40mg
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>✓</span> All verified via Clinical OCR
                </div>
              </div>

              {/* Metric 2: Next Dose */}
              <div 
                onClick={() => setActiveStep('reminders')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    Next Scheduled Dose
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>⏰</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--navy)' }}>
                  8:00 PM Tonight
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Clopidogrel (Plavix) 75mg • Evening with water
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#4338ca', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔔</span> Web Audio chime alarms enabled
                </div>
              </div>

              {/* Metric 3: Doctor Checkup */}
              <div 
                onClick={() => setActiveStep('followup')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    Post-Op Checkup
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>📅</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--navy)' }}>
                  Nov 02 (in 10 days)
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Dr. Eleanor Vance • Cardiology Follow-up
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>📍</span> St. Elizabeth Heart Center
                </div>
              </div>
            </div>

            {/* What CareBridge AI Does - 3 Clean Tool Cards */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{
                  background: '#eef2ff',
                  color: '#4338ca',
                  border: '1px solid #c7d2fe',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.4px'
                }}>
                  CAREBRIDGE AI PLATFORM SERVICES
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '8px 0 4px 0' }}>
                  Everything you need for safe recovery at home
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Select any tool below or use the sidebar navigation to manage your recovery journey.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem'
              }}>
                {/* Tool 1 */}
                <div 
                  onClick={() => setActiveStep('upload')}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📄</div>
                    <strong style={{ fontSize: '1rem', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                      Handwritten OCR &amp; Decoder
                    </strong>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                      Upload prescription photos or hospital discharge summaries. Our clinical OCR translates doctor handwriting and expands Latin medical abbreviations.
                    </p>
                  </div>
                  <div style={{ marginTop: '1rem', color: '#4f46e5', fontSize: '0.82rem', fontWeight: 800 }}>
                    Upload or Scan &rarr;
                  </div>
                </div>

                {/* Tool 2 */}
                <div 
                  onClick={() => setActiveStep('confusion')}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🛡️</div>
                    <strong style={{ fontSize: '1rem', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                      Confusion Guard (LASA Safety)
                    </strong>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                      Screen medications for dangerous Look-Alike / Sound-Alike errors (e.g. Metoprolol vs Hydralazine) and detect adverse drug-drug conflicts.
                    </p>
                  </div>
                  <div style={{ marginTop: '1rem', color: '#4f46e5', fontSize: '0.82rem', fontWeight: 800 }}>
                    Check Drug Safety &rarr;
                  </div>
                </div>

                {/* Tool 3 */}
                <div 
                  onClick={() => setActiveStep('diet')}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🥗</div>
                    <strong style={{ fontSize: '1rem', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                      Clinical Recovery Diet
                    </strong>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                      Personalized dietary plans tailored to your specific surgery or cardiac stent to support tissue repair and prevent food-drug interactions.
                    </p>
                  </div>
                  <div style={{ marginTop: '1rem', color: '#4f46e5', fontSize: '0.82rem', fontWeight: 800 }}>
                    Generate Diet Plan &rarr;
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Prescriptions Spotlight */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                    💊 Latest Prescriptions On File ({prescriptions.length})
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                    Your active physician prescriptions and medication dosages parsed by clinical OCR.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep('prescriptions')}
                    style={{
                      background: '#eef2ff',
                      color: '#4f46e5',
                      border: '1px solid #c7d2fe',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View All Details →
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep('upload')}
                    style={{
                      background: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Upload New Scan
                  </button>
                </div>
              </div>

              {/* Showcase the top prescription */}
              {prescriptions[0] && (
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #c7d2fe' }}>
                        ✓ {prescriptions[0].status} • Issued {prescriptions[0].date}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                        {prescriptions[0].title}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Prescribed by <strong>{prescriptions[0].doctor}</strong> • {prescriptions[0].clinic}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePrintPrescription(prescriptions[0])}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      📄 Download Summary (.txt)
                    </button>
                  </div>

                  {/* Medications badges */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                    {prescriptions[0].medications.map((m, idx) => (
                      <div key={idx} style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderLeft: m.critical ? '4px solid #ef4444' : '4px solid #4f46e5',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: 'var(--navy)', fontSize: '0.9rem' }}>{m.name}</strong>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', padding: '2px 6px', borderRadius: '4px' }}>
                            {m.dosage}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px' }}>
                          {m.schedule}
                        </div>
                        {m.critical && (
                          <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                            ⚠️ Do NOT miss doses
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. LATEST PRESCRIPTIONS TAB */}
        {activeStep === 'prescriptions' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    Medical Records
                  </span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                    Your Latest Prescriptions &amp; Active Medications
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    All doctor prescriptions recognized from handwritten scans, outpatient notes, and hospital discharge summaries.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep('upload')}
                    style={{
                      background: '#ffffff',
                      color: '#4f46e5',
                      border: '1.5px solid #c7d2fe',
                      borderRadius: '9999px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>📤</span>
                    <span>Upload New Scan</span>
                  </button>
                </div>
              </div>

              {/* Filters row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setPrescriptionFilter('all')}
                  style={{
                    background: prescriptionFilter === 'all' ? '#4f46e5' : '#f8fafc',
                    color: prescriptionFilter === 'all' ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  All Prescriptions ({prescriptions.length})
                </button>

                <button
                  type="button"
                  onClick={() => setPrescriptionFilter('active')}
                  style={{
                    background: prescriptionFilter === 'active' ? '#4f46e5' : '#f8fafc',
                    color: prescriptionFilter === 'active' ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Active Courses ({prescriptions.filter(p => p.status === 'Active').length})
                </button>

                <button
                  type="button"
                  onClick={() => setPrescriptionFilter('refills')}
                  style={{
                    background: prescriptionFilter === 'refills' ? '#4f46e5' : '#f8fafc',
                    color: prescriptionFilter === 'refills' ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Refills Available
                </button>
              </div>

              {/* Prescriptions List Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.75rem',
                      background: '#ffffff',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {/* Prescription Top Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            background: '#eef2ff',
                            color: '#4f46e5',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            border: '1px solid #c7d2fe'
                          }}>
                            ✓ {rx.status}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            📅 Prescribed: <strong>{rx.date}</strong>
                          </span>
                          <span style={{
                            background: '#e0e7ff',
                            color: '#4338ca',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {rx.documentType}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', margin: '8px 0 4px 0' }}>
                          {rx.title}
                        </h3>

                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                          Prescribing Physician: <strong>{rx.doctor}</strong> • 📍 {rx.clinic}
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
                          Diagnosis / Indication: <strong>{rx.diagnosis}</strong> • Refill: <strong>{rx.refill}</strong>
                        </div>
                      </div>

                      {/* Right top actions */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {rx.imagePreview && (
                          <button
                            type="button"
                            onClick={() => setPreviewModalRx(rx)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              borderRadius: 'var(--radius-sm)',
                              padding: '8px 14px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>🔍</span>
                            <span>View Scan</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handlePrintPrescription(rx)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            borderRadius: 'var(--radius-sm)',
                            padding: '8px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>📄</span>
                          <span>Export / Print</span>
                        </button>
                      </div>
                    </div>

                    {/* Prescribed Medications Grid */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        Active Prescribed Medications ({rx.medications.length})
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                        {rx.medications.map((med, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#f8fafc',
                              border: `1px solid ${med.critical ? '#fecaca' : '#e2e8f0'}`,
                              borderLeft: `4px solid ${med.critical ? '#ef4444' : '#4f46e5'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '12px 14px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>{med.name}</strong>
                              <span style={{
                                background: '#eef2ff',
                                color: '#4f46e5',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                {med.dosage}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#4338ca', fontWeight: 700, marginBottom: '4px' }}>
                              ⏰ {med.schedule}
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                              {med.instructions}
                            </div>

                            {med.critical && (
                              <div style={{
                                marginTop: '6px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.725rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span>⚠️ Critical:</span>
                                <span>Do not miss doses. Risk of stent thrombosis.</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Physician Notes & Precautions */}
                    {rx.notes && (
                      <div style={{
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        fontSize: '0.825rem',
                        color: '#92400e',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>💡</span>
                        <span><strong>Physician Directions:</strong> {rx.notes}</span>
                      </div>
                    )}

                    {/* Action buttons on card footer */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        type="button"
                        onClick={() => {
                          playMedicalChime();
                          setToastMessage(`⏰ Medication alarms armed for ${rx.doctor}'s prescription!`);
                          setActiveStep('reminders');
                        }}
                        style={{
                          background: '#eef2ff',
                          border: '1px solid #c7d2fe',
                          color: '#4f46e5',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>⏰</span>
                        <span>Arm Dose Alarms for this Prescription</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveStep('verify')}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>🔍</span>
                        <span>Verify OCR Transcription</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveStep('confusion')}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>⚠️</span>
                        <span>Check LASA Confusions</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Upload CTA box */}
              <div style={{
                marginTop: '2rem',
                border: '2px dashed #cbd5e1',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                textAlign: 'center',
                background: '#f8fafc'
              }}>
                <span style={{ fontSize: '2.5rem' }}>📄</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', margin: '8px 0 4px 0' }}>
                  Have another prescription or hospital discharge summary?
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
                  Upload a smartphone photo of doctor's cursive handwriting or PDF hospital report. It will automatically be decoded and saved here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveStep('upload')}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '10px 24px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                  }}
                >
                  📤 Upload Prescription Now
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 3. STEP 1: UPLOAD PRESCRIPTION */}
        {activeStep === 'upload' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    Step 1 of 5
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                    Upload Discharge Summary or Doctor's Prescription
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Upload a smartphone photo or PDF scan. Our clinical OCR extracts doctors' cursive and abbreviations.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep('prescriptions')}
                    style={{
                      background: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View Latest Prescriptions ({prescriptions.length})
                  </button>

                  <button
                    type="button"
                    className="btn-hero-launch"
                    onClick={() => setActiveStep('verify')}
                    style={{ padding: '8px 16px', fontSize: '0.825rem' }}
                  >
                    <span>Go to Step 2: Verify Medicines</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Document Analysis / Upload Component */}
              <DocumentAnalysisView />
            </div>
          </div>
        )}

        {/* 4. STEP 2: VERIFY MEDICINES */}
        {activeStep === 'verify' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    Step 2 of 5
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                    Verify Extracted Medicines &amp; Abbreviation Check
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Compare the AI transcription with physical prescription labels. Expand Latin medical codes (*Rx, tid, od, sos*).
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-hero-launch"
                  onClick={() => {
                    playMedicalChime();
                    setToastMessage('✅ Medicines verified! Moving to Set Reminders & Alarms.');
                    setActiveStep('reminders');
                  }}
                  style={{ padding: '8px 18px', fontSize: '0.825rem' }}
                >
                  <span>Verify &amp; Proceed to Set Reminders</span>
                  <span>→</span>
                </button>
              </div>

              {/* Handwritten OCR View */}
              <HandwrittenOCRView />
            </div>
          </div>
        )}

        {/* 5. STEP 3: SET REMINDERS */}
        {activeStep === 'reminders' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    Step 3 of 5
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                    Set Medication Reminders &amp; Audio Alarm Chimes
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Arm synthesized Web Audio alarm chimes for morning, afternoon, and evening doses. Check off completed doses.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-hero-launch"
                  onClick={() => setActiveStep('followup')}
                  style={{ padding: '8px 18px', fontSize: '0.825rem' }}
                >
                  <span>Go to Step 4: Schedule Follow-up</span>
                  <span>→</span>
                </button>
              </div>

              {/* Timeline Reminders View */}
              <TimelineView setToastMessage={setToastMessage} />
            </div>
          </div>
        )}

        {/* 6. STEP 4: SCHEDULE FOLLOW-UP */}
        {activeStep === 'followup' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    Step 4 of 5
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                    Upcoming Medical Follow-Ups &amp; Clinic Checkups
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Never miss a crucial postoperative appointment. Sync reminders with your phone's calendar (.ics).
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddApt(!showAddApt)}
                    style={{
                      background: '#eef2ff',
                      color: '#4f46e5',
                      border: '1px solid #c7d2fe',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 16px',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {showAddApt ? '✕ Close Form' : '➕ Add Checkup'}
                  </button>

                  <button
                    type="button"
                    className="btn-hero-launch"
                    onClick={() => setActiveStep('recovery')}
                    style={{ padding: '8px 18px', fontSize: '0.825rem' }}
                  >
                    <span>Go to Step 5: Track Recovery</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Add Checkup Form */}
              {showAddApt && (
                <form onSubmit={handleSaveAppointment} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, color: 'var(--navy)' }}>
                    Schedule New Follow-Up Checkup
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Doctor Name *
                      </label>
                      <input 
                        type="text"
                        className="auth-input"
                        placeholder="e.g. Dr. Jennifer Wu, MD"
                        value={newDoctor}
                        onChange={(e) => setNewDoctor(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Clinic / Hospital Location
                      </label>
                      <input 
                        type="text"
                        className="auth-input"
                        placeholder="e.g. St. Elizabeth Outpatient Clinic"
                        value={newClinic}
                        onChange={(e) => setNewClinic(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Date *
                      </label>
                      <input 
                        type="date"
                        className="auth-input"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Time
                      </label>
                      <input 
                        type="text"
                        className="auth-input"
                        placeholder="e.g. 10:30 AM"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Specialty
                      </label>
                      <input 
                        type="text"
                        className="auth-input"
                        placeholder="e.g. Cardiology"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Preparation Notes (e.g. Fasting 8 hrs, bring medication list)
                    </label>
                    <input 
                      type="text"
                      className="auth-input"
                      placeholder="e.g. Fast 8 hours prior to appointment; hold morning blood pressure medicine"
                      value={newPrep}
                      onChange={(e) => setNewPrep(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-hero-launch" 
                    style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  >
                    Save Appointment &amp; Arm Reminder
                  </button>
                </form>
              )}

              {/* Appointments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>
                            {apt.doctor}
                          </span>
                          <span style={{
                            background: '#e0e7ff',
                            color: '#4338ca',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {apt.specialty}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
                          📍 {apt.clinic}
                        </div>
                      </div>

                      <span style={{
                        background: apt.daysRemaining <= 5 ? '#fef2f2' : '#eef2ff',
                        color: apt.daysRemaining <= 5 ? '#dc2626' : '#4f46e5',
                        border: `1px solid ${apt.daysRemaining <= 5 ? '#fecaca' : '#c7d2fe'}`,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 800
                      }}>
                        🗓️ {apt.date} • {apt.time} (In {apt.daysRemaining} days)
                      </span>
                    </div>

                    {apt.prepNotes && (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        fontSize: '0.825rem',
                        color: '#475569'
                      }}>
                        <strong>Preparation:</strong> {apt.prepNotes}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleAlarm(apt.id)}
                        style={{
                          background: apt.alarmSet ? '#eef2ff' : '#ffffff',
                          border: `1px solid ${apt.alarmSet ? '#6366f1' : '#cbd5e1'}`,
                          color: apt.alarmSet ? '#4f46e5' : '#475569',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{apt.alarmSet ? '🔔' : '🔕'}</span>
                        <span>{apt.alarmSet ? 'Alarm Armed' : 'Set Alarm'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportIcs(apt)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>📅</span>
                        <span>Export to Calendar (.ics)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. STEP 5: TRACK RECOVERY */}
        {activeStep === 'recovery' && (
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    Step 5 of 5
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', margin: '6px 0 2px 0' }}>
                    Daily Recovery Progress &amp; Symptom Tracker
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Log pain, temperature, blood pressure, and incision healing to spot complications early.
                  </p>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.825rem'
                }}>
                  🌱 Day 3 of 14 Recovery Milestone (21%)
                </div>
              </div>

              {/* Red-Flag Alert Warning */}
              {(showFeverAlert || showPainAlert) && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  lineHeight: 1.5
                }}>
                  🚨 <strong>CLINICAL ALERT:</strong> {showFeverAlert ? 'Temperature is above 100.4°F (Fever). ' : ''}{showPainAlert ? 'Severe pain reported (Score >= 8). ' : ''}Please contact your treating hospital immediately or call emergency dispatch.
                </div>
              )}

              {/* Vitals Form */}
              <form onSubmit={handleSaveVitals} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {/* Pain Score Slider */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>
                      Current Pain Score (0 = No Pain, 10 = Severe)
                    </label>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: painLevel <= 3 ? '#6366f1' : painLevel <= 6 ? '#f59e0b' : '#ef4444',
                      background: painLevel <= 3 ? '#dcfce7' : painLevel <= 6 ? '#fef3c7' : '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {painLevel} / 10 {painLevel <= 3 ? 'Mild' : painLevel <= 6 ? 'Moderate' : 'Severe'}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#4f46e5', cursor: 'pointer' }}
                  />
                </div>

                {/* Temperature & BP */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Body Temperature (°F)
                    </label>
                    <input 
                      type="number"
                      step="0.1"
                      className="auth-input"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      style={{ borderColor: showFeverAlert ? '#ef4444' : '#cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Blood Pressure (mmHg)
                    </label>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <input 
                        type="number"
                        className="auth-input"
                        placeholder="120"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                      />
                      <span>/</span>
                      <input 
                        type="number"
                        className="auth-input"
                        placeholder="80"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobility & Wound status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Energy &amp; Mobility
                    </label>
                    <select
                      className="form-select"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Normal Activity</option>
                      <option value={4}>⭐⭐⭐⭐ Good Walking</option>
                      <option value={3}>⭐⭐⭐ Mild Fatigue / Resting</option>
                      <option value={2}>⭐⭐ Restricted / Weakness</option>
                      <option value={1}>⭐ Bedbound / Dizziness</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Incision / Wound Status
                    </label>
                    <select
                      className="form-select"
                      value={woundStatus}
                      onChange={(e) => setWoundStatus(e.target.value)}
                    >
                      <option value="Clean & Healing">Clean &amp; Healing</option>
                      <option value="Mild Discomfort / Swelling">Mild Swelling</option>
                      <option value="Redness / Drainage (Warning)">⚠️ Redness / Drainage</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Notes / Symptoms to Report
                  </label>
                  <input 
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Mild pain around incision when getting out of bed"
                    value={vitalsNotes}
                    onChange={(e) => setVitalsNotes(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-hero-launch" 
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  💾 Save Daily Recovery Log
                </button>
              </form>

              {/* Past Vitals Logs */}
              <div>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)' }}>
                  Recent Recovery Records ({recoveryLogs.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recoveryLogs.map((log, i) => (
                    <div 
                      key={i}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${log.status.includes('Alert') ? '#fecaca' : '#e2e8f0'}`,
                        background: log.status.includes('Alert') ? '#fef2f2' : '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div>
                        <strong>{log.date}</strong> — Pain: <strong>{log.painLevel}/10</strong> • Temp: <strong>{log.temperature}</strong> • BP: <strong>{log.bloodPressure}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Incision: {log.woundStatus} {log.notes && `• "${log.notes}"`}
                        </div>
                      </div>

                      <span style={{
                        color: log.status.includes('Alert') ? '#dc2626' : '#15803d',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 8. DIET & NUTRITION TAB */}
        {activeStep === 'diet' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <DietPlannerView />
          </div>
        )}

        {/* 9. CONFUSION SAFETY GUARD TAB */}
        {activeStep === 'confusion' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <ConfusionGuardView />
          </div>
        )}

      </main>

      {/* Lightbox Modal for Prescription Document Scan */}
      {previewModalRx && (
        <div 
          className="modal-overlay" 
          onClick={() => setPreviewModalRx(null)}
          style={{ zIndex: 10000 }}
        >
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '640px', width: '90%' }}
          >
            <button 
              type="button" 
              onClick={() => setPreviewModalRx(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              ×
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📄</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                {previewModalRx.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Physician: <strong>{previewModalRx.doctor}</strong> • Date: <strong>{previewModalRx.date}</strong>
            </p>

            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              textAlign: 'center',
              maxHeight: '480px'
            }}>
              <img 
                src={previewModalRx.imagePreview || '/sample_prescription.jpg'} 
                alt="Doctor prescription note scan" 
                style={{ width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setPreviewModalRx(null);
                  setActiveStep('verify');
                }}
                className="btn-hero-launch"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                🔍 Analyze in OCR Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
