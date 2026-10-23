import React, { useState } from 'react';
import { playMedicalChime } from '../utils/audioChime';

export default function Navbar({
  activeTab,
  setActiveTab,
  userProfile,
  setUserProfile,
  openProfileModal,
  openEmergencyModal,
  setToastMessage,
  onOpenDashboard,
  onSignOut
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTestChime = () => {
    playMedicalChime();
    setToastMessage("🔔 Medical chime sound tested successfully!");
  };

  const scrollToSection = (tabId, elementId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

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
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Get 2-letter initials
  const getInitials = (nameStr) => {
    if (!nameStr) return 'P';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <nav className="navbar-dribbble">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div 
          className="logo-dribbble" 
          onClick={() => scrollToSection('home', 'hero-section')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginRight: '3rem', flexShrink: 0 }}
        >
          <div className="logo-cross-icon" style={{
            width: '34px',
            height: '34px',
            background: '#4f46e5',
            borderRadius: '9px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.15rem',
            fontWeight: 900,
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            ✚
          </div>
          <div className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#1e1b4b', textTransform: 'uppercase' }}>
            <span>CareBridge</span>
            <span style={{ color: '#4f46e5', marginLeft: '6px' }}>AI</span>
          </div>
        </div>

        {/* Desktop Nav Menu */}
        <ul className="nav-menu-dribbble">
          <li>
            <button
              className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home', 'hero-section')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="nav-link-btn"
              onClick={() => scrollToSection('about', 'about-section')}
            >
              About
            </button>
          </li>
          <li>
            <button
              className="nav-link-btn"
              onClick={() => scrollToSection('prescriptions')}
            >
              Prescriptions
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${activeTab === 'verify' ? 'active' : ''}`}
              onClick={() => scrollToSection('verify')}
            >
              Handwritten OCR
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${activeTab === 'confusion' ? 'active' : ''}`}
              onClick={() => scrollToSection('confusion')}
            >
              Confusion Guard
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${activeTab === 'reminders' ? 'active' : ''}`}
              onClick={() => scrollToSection('reminders')}
            >
              Timetable &amp; Alarms
            </button>
          </li>
          <li>
            <button
              className={`nav-link-btn ${activeTab === 'diet' ? 'active' : ''}`}
              onClick={() => scrollToSection('diet')}
            >
              Diet Plan
            </button>
          </li>
        </ul>

        {/* Right Actions: Search, Chime, Profile / Sign In / Sign Out */}
        <div className="navbar-right-actions">
          <div className="search-box-pill desktop-only">
            <input
              type="text"
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  scrollToSection('confusion', 'workspace-section');
                }
              }}
            />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>🔍</span>
          </div>

          {/* User Sign In / Profile dropdown */}
          {!userProfile?.isLoggedIn && !userProfile?.name ? (
            <button
              className="btn-signin-pill"
              onClick={openProfileModal}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span>Sign In</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>Patient Dashboard →</span>
                </button>
              )}

              <div className="user-menu-wrapper">
                <button
                  className="user-pill-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar-initials">
                    {getInitials(userProfile.name)}
                  </div>
                  <span className="user-name-text">{userProfile.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>⌵</span>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown-card">
                    <div className="dropdown-user-header">
                      <strong>{userProfile.name}</strong>
                      <span>{userProfile.diagnosis || 'Post-Discharge Recovery'}</span>
                      {userProfile.phone && <span>📞 {userProfile.phone}</span>}
                    </div>

                    {onOpenDashboard && (
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenDashboard();
                        }}
                      >
                        📊 Open Recovery Dashboard
                      </button>
                    )}

                    <button
                      className="dropdown-item-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        scrollToSection('timeline', 'workspace-section');
                      }}
                    >
                      ⏰ My Recovery Timetable
                    </button>

                    <button
                      className="dropdown-item-btn"
                      onClick={() => {
                        setDropdownOpen(false);
                        openProfileModal();
                      }}
                    >
                      ⚙️ Edit Clinical Profile
                    </button>

                    <button
                      className="dropdown-item-btn signout"
                      onClick={handleSignOut}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-list">
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => scrollToSection('home', 'hero-section')}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                className="mobile-nav-link"
                onClick={() => scrollToSection('about', 'about-section')}
              >
                ℹ️ About CareBridge
              </button>
            </li>
            <li>
              <button
                className="mobile-nav-link"
                onClick={() => scrollToSection('prescriptions')}
              >
                💊 Latest Prescriptions
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'verify' ? 'active' : ''}`}
                onClick={() => scrollToSection('verify')}
              >
                📝 Handwritten Prescription OCR
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'confusion' ? 'active' : ''}`}
                onClick={() => scrollToSection('confusion')}
              >
                🧠 Confusion &amp; LASA Guard
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'reminders' ? 'active' : ''}`}
                onClick={() => scrollToSection('reminders')}
              >
                ⏰ Timetable &amp; Hourly Alarms
              </button>
            </li>
            <li>
              <button
                className={`mobile-nav-link ${activeTab === 'diet' ? 'active' : ''}`}
                onClick={() => scrollToSection('diet')}
              >
                🥗 Clinical Diet Planner
              </button>
            </li>
          </ul>

          <div className="mobile-drawer-footer">
            {userProfile?.isLoggedIn && onOpenDashboard && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="btn-mobile-action"
                style={{ background: '#4f46e5', color: '#ffffff', fontWeight: 800 }}
              >
                📊 Open Recovery Dashboard
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                handleTestChime();
                setMobileMenuOpen(false);
              }}
              className="btn-mobile-action"
            >
              🔔 Test Medical Chime Audio
            </button>

            {userProfile?.isLoggedIn && (
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-mobile-action signout"
              >
                🚪 Sign Out ({userProfile.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
