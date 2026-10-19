import React, { useState } from 'react';

const SAMPLE_SUMMARY = `PATIENT DISCHARGE SUMMARY
Admission Date: October 12, 2026 | Discharge Date: October 19, 2026
Diagnosis: Acute Coronary Syndrome (NSTEMI) s/p Drug-Eluting Stent (DES) to LAD. Essential Hypertension. Mild T2DM.
Hospital Course: Patient underwent successful coronary angioplasty with single DES placement. Hemodynamically stable.
Discharge Medications:
1. Aspirin 81 mg oral tablet - Once daily with breakfast (Lifelong).
2. Ticagrelor (Brilinta) 90 mg oral tablet - Twice daily (Morning & Evening at 8 AM / 8 PM). DO NOT MISS DOSES - HIGH STENT THROMBOSIS RISK.
3. Atorvastatin 80 mg tablet - Once daily at bedtime.
4. Metoprolol Tartrate 25 mg - Twice daily with meals. Monitor heart rate. (Do NOT confuse with Metoprolol Succinate ER).
Diet & Activity: Low sodium (<2g/day), cardiac diet. No lifting >10 lbs for 2 weeks. Walk 10 mins 2x daily.
Warning Signs: Chest pressure, radiating arm pain, severe shortness of breath, unusual bleeding.
Follow-up: Cardiology clinic in 10 days.`;

export default function DocumentAnalysisView({ currentLang }) {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState('Discharge Summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleLoadSample = () => {
    setInputText(SAMPLE_SUMMARY);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText && !selectedFile) {
      setError('Please upload a document file or paste your medical notes.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('textContent', inputText);
      formData.append('language', currentLang || 'English');
      formData.append('docType', docType);

      const response = await fetch('http://localhost:5000/api/analyze-document', {
        method: 'POST',
        body: formData
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        setError(resData.error || 'Failed to process document. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Ensure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="module-section">
      <div className="module-header">
        <span className="module-header-badge">Clinical OCR &amp; Medical Explainer</span>
        <h2>Discharge Summary &amp; Prescription Reader</h2>
        <p>Translate clinical jargon into clear home instructions, safe schedules, and red flag warnings.</p>
      </div>

      <div className="module-body-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <label className="form-label">Upload Prescription / Document Photo or PDF</label>
            <div className="upload-drop-zone" onClick={() => document.getElementById('fileInput').click()}>
              <div className="icon">📷</div>
              <p><strong>Click to browse</strong> or drag and drop</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                PNG, JPG, PDF up to 25MB (Vision OCR enabled)
              </span>
              {selectedFile && (
                <div style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>
            <input 
              id="fileInput" 
              type="file" 
              accept="image/*,application/pdf" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Or Paste Medical Notes / Report Text</label>
              <button 
                type="button" 
                onClick={handleLoadSample}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                + Load Cardiology Sample
              </button>
            </div>
            <textarea 
              className="form-textarea"
              rows={7}
              placeholder="Paste discharge summary, clinical note, or medication instructions here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Document Type:</span>
            <select 
              className="form-select" 
              style={{ width: 'auto' }}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="Discharge Summary">Discharge Summary</option>
              <option value="Handwritten Prescription">Handwritten Prescription</option>
              <option value="Lab / Imaging Report">Lab / Imaging Report</option>
              <option value="Surgical Operative Note">Surgical Operative Note</option>
            </select>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleAnalyze} 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Analyzing with Clinical AI...' : '🔍 Analyze Document'}
          </button>
        </div>

        {error && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '12px 16px', 
            background: 'var(--danger-light)', 
            color: 'var(--danger)', 
            borderRadius: 'var(--radius-md)', 
            fontWeight: 600 
          }}>
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div style={{ marginTop: '2.5rem', borderTop: '2px solid var(--border-light)', paddingTop: '2rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                📋 Plain-Language Hospital Stay Summary
              </h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {result.summary || result.rawText}
              </p>

              {result.keyDiagnoses && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {result.keyDiagnoses.map((diag, i) => (
                    <span key={i} style={{ 
                      background: '#ffffff', 
                      color: 'var(--primary)', 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      border: '1px solid rgba(79, 70, 229, 0.2)' 
                    }}>
                      ✓ {diag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Medications List */}
            {result.medications && result.medications.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-indigo)', marginBottom: '0.5rem' }}>
                  💊 Your Prescribed Medications
                </h4>
                <div className="meds-cards-grid">
                  {result.medications.map((med, idx) => (
                    <div key={idx} className={`med-card ${med.criticalWarning ? 'critical' : ''}`}>
                      <div className="med-card-header">
                        <div className="med-name">{med.name}</div>
                        <div className="med-schedule-badge">{med.schedule}</div>
                      </div>
                      <div className="med-purpose">🎯 <strong>Purpose:</strong> {med.purpose}</div>
                      {med.instructions && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                          ℹ️ <strong>Instructions:</strong> {med.instructions}
                        </div>
                      )}
                      {med.criticalWarning && (
                        <div className="med-warning-alert">
                          ⚠️ <strong>Critical:</strong> {med.criticalWarning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist and Red Flags in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Daily Checklist */}
              {result.dailyCareChecklist && (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontWeight: 800, color: 'var(--dark-indigo)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>✅</span> Daily Home Care Checklist
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.dailyCareChecklist.map((task, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem' }}>
                        <input type="checkbox" style={{ marginTop: '4px', cursor: 'pointer' }} />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags */}
              {result.emergencyRedFlags && (
                <div style={{ background: 'var(--danger-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #fecaca' }}>
                  <h4 style={{ fontWeight: 800, color: '#b91c1c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🚨</span> Immediate Emergency Red Flags
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#991b1b', marginBottom: '0.75rem', fontWeight: 600 }}>
                    If you experience any of these symptoms, call 108 / 911 or go to the nearest emergency room immediately:
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.emergencyRedFlags.map((flag, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: '#7f1d1d', fontWeight: 600 }}>
                        <span>⚠️</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Doctor questions & follow-up */}
            {result.questionsForDoctor && (
              <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--dark-indigo)', marginBottom: '0.75rem' }}>
                  🩺 Questions to Ask Your Doctor at Follow-Up
                </h4>
                {result.followUpAppointment && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                    📅 Recommended Follow-Up: {result.followUpAppointment}
                  </p>
                )}
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {result.questionsForDoctor.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
