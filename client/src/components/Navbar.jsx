import React, { useState } from 'react';
import { playMedicalChime } from '../utils/audioChime';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  userProfile, 
  setUserProfile,
  openProfileModal, 
  openEmergencyModal,
  setToastMessage 
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
    const cleared = { name: '', email: '', phone: '', diagnosis: '', isLoggedIn: false };
    setUserProfile(cleared);
    localStorage.removeItem('carebridge_user');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setToastMessage('Signed out successfully.');
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
        <div className="logo-dribbble" onClick={() => scrollToSection('handwritten', 'hero-section')}>
          <div className="logo-cross-icon">✚</div>
          <div className="logo-text">CareBridge <span>AI</span></div>
        </div>

        {/* Desktop Nav Menu */}
        <ul className="nav-menu-dribbble">
          <li>
            <button 
              className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('handwritten', 'hero-section')}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className="nav-link-btn"
              onClick={() => scrollToSection('handwritten', 'about-section')}
            >
              About
            </button>
          </li>
          <li>
            <button 
              className={`nav-link-btn ${activeTab === 'handwritten' ? 'active' : ''}`}
              onClick={() => scrollToSection('handwritten', 'workspace-section')}
            >
              Handwritten OCR
            </button>
          </li>
          <li>
            <button 
              className={`nav-link-btn ${activeTab === 'confusion' ? 'active' : ''}`}
              onClick={() => scrollToSection('confusion', 'workspace-section')}
            >
              Confusion Guard
            </button>
          </li>
          <li>
            <button 
              className={`nav-link-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => scrollToSection('timeline', 'workspace-section')}
            >
              Timetable &amp; Alarms
            </button>
          </li>
          <li>
            <button 
              className={`nav-link-btn ${activeTab === 'diet' ? 'active' : ''}`}
              onClick={() => scrollToSection('diet', 'workspace-section')}
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

          <button 
            type="button" 
            onClick={handleTestChime}
            className="btn-signin-pill desktop-only"
            title="Test Web Audio Chime"
            style={{ padding: '8px 12px' }}
          >
            🔔
          </button>

          {/* User Sign In / Profile dropdown */}
          {!userProfile?.isLoggedIn && !userProfile?.name ? (
            <button 
              className="btn-signin-pill" 
              onClick={openProfileModal}
            >
              <span>👤</span>
              <span className="signin-text">Sign In</span>
            </button>
          ) : (
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
                onClick={() => scrollToSection('handwritten', 'hero-section')}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button 
                className="mobile-nav-link"
                onClick={() => scrollToSection('handwritten', 'about-section')}
              >
                ℹ️ About CareBridge
              </button>
            </li>
            <li>
              <button 
                className={`mobile-nav-link ${activeTab === 'handwritten' ? 'active' : ''}`}
                onClick={() => scrollToSection('handwritten', 'workspace-section')}
              >
                📝 Handwritten Prescription OCR
              </button>
            </li>
            <li>
              <button 
                className={`mobile-nav-link ${activeTab === 'confusion' ? 'active' : ''}`}
                onClick={() => scrollToSection('confusion', 'workspace-section')}
              >
                🧠 Confusion &amp; LASA Guard
              </button>
            </li>
            <li>
              <button 
                className={`mobile-nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => scrollToSection('timeline', 'workspace-section')}
              >
                ⏰ Timetable &amp; Hourly Alarms
              </button>
            </li>
            <li>
              <button 
                className={`mobile-nav-link ${activeTab === 'diet' ? 'active' : ''}`}
                onClick={() => scrollToSection('diet', 'workspace-section')}
              >
                🥗 Clinical Diet Planner
              </button>
            </li>
          </ul>

          <div className="mobile-drawer-footer">
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
