import React, { useState, useEffect } from 'react';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickActionCards from './components/QuickActionCards';
import AboutTrustSection from './components/AboutTrustSection';
import ServicesGrid from './components/ServicesGrid';
import HandwrittenOCRView from './components/HandwrittenOCRView';
import ConfusionGuardView from './components/ConfusionGuardView';
import TimelineView from './components/TimelineView';
import DietPlannerView from './components/DietPlannerView';
import WhyPatientsChooseUs from './components/WhyPatientsChooseUs';
import ProfileModal from './components/ProfileModal';
import EmergencyModal from './components/EmergencyModal';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('handwritten');
  const [currentLang, setLanguage] = useState('English');
  const [toastMessage, setToastMessage] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Default user state is NOT logged in (No hardcoded demo patient)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('carebridge_user');
      return saved ? JSON.parse(saved) : { name: '', phone: '', diagnosis: '', isLoggedIn: false };
    } catch {
      return { name: '', phone: '', diagnosis: '', isLoggedIn: false };
    }
  });

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleOpenWorkspace = (tabName) => {
    setActiveTab(tabName);
    setTimeout(() => {
      const el = document.getElementById('workspace-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="carebridge-landing-page">
      {/* 1. Top Utility Banner */}
      <TopBanner 
        currentLang={currentLang} 
        setLanguage={setLanguage} 
      />

      {/* 2. Main Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={handleOpenWorkspace}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        openProfileModal={() => setIsProfileOpen(true)}
        openEmergencyModal={() => setIsEmergencyOpen(true)}
        setToastMessage={setToastMessage}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #e0f2fe 100%)',
          borderBottom: '1px solid #a7f3d0',
          padding: '10px 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: '#065f46',
          fontWeight: 700
        }}>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, color: '#065f46' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Hero Section (Dribbble Layout) */}
      <Hero onOpenWorkspace={handleOpenWorkspace} />

      {/* 4. Floating 4 Quick Action Cards */}
      <QuickActionCards 
        onOpenWorkspace={handleOpenWorkspace} 
        openEmergencyModal={() => setIsEmergencyOpen(true)}
      />

      {/* 5. About Us Section (Hospital Team Photo & TrustScore) */}
      <AboutTrustSection onOpenWorkspace={handleOpenWorkspace} />

      {/* 6. Services Grid (6 Cards from Dribbble) */}
      <ServicesGrid onOpenWorkspace={handleOpenWorkspace} />

      {/* 7. The Core Interactive Clinical Tool Workspace */}
      <section id="workspace-section" className="workspace-section">
        <div className="workspace-card">
          <div className="workspace-tabs-header">
            <button 
              className={`ws-tab-btn ${activeTab === 'handwritten' ? 'active' : ''}`}
              onClick={() => setActiveTab('handwritten')}
            >
              <span>✍️</span>
              <span>Handwritten Prescription OCR</span>
            </button>

            <button 
              className={`ws-tab-btn ${activeTab === 'confusion' ? 'active' : ''}`}
              onClick={() => setActiveTab('confusion')}
            >
              <span>🧠</span>
              <span>Confusion Safety Guard</span>
            </button>

            <button 
              className={`ws-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <span>⏰</span>
              <span>Recovery Timetable &amp; Alarms</span>
            </button>

            <button 
              className={`ws-tab-btn ${activeTab === 'diet' ? 'active' : ''}`}
              onClick={() => setActiveTab('diet')}
            >
              <span>🥗</span>
              <span>Clinical Diet Plan</span>
            </button>
          </div>

          <div className="workspace-body">
            {activeTab === 'handwritten' && (
              <HandwrittenOCRView />
            )}

            {activeTab === 'confusion' && (
              <ConfusionGuardView />
            )}

            {activeTab === 'timeline' && (
              <TimelineView setToastMessage={setToastMessage} />
            )}

            {activeTab === 'diet' && (
              <DietPlannerView />
            )}
          </div>
        </div>
      </section>

      {/* 8. Why Our Patients Recommend Us */}
      <WhyPatientsChooseUs onOpenWorkspace={handleOpenWorkspace} />

      {/* 9. Hospital Footer */}
      <Footer onOpenWorkspace={handleOpenWorkspace} />

      {/* Modals */}
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        setToastMessage={setToastMessage}
      />

      <EmergencyModal 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
