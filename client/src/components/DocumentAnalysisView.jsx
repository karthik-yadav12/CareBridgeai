import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

const SAMPLES = {
  cardiology: {
    title: "Post-Stent Hospital Discharge Prescription",
    doctor: "Dr. Eleanor Vance, MD (Cardiologist)",
    clinic: "St. Elizabeth Heart Center • Suite 402",
    date: "2026-10-19",
    type: "Discharge Summary",
    text: `PATIENT DISCHARGE SUMMARY
Admission Date: October 12, 2026 | Discharge Date: October 19, 2026
Diagnosis: Acute Coronary Syndrome (NSTEMI) s/p Drug-Eluting Stent (DES) to LAD. Essential Hypertension. Mild T2DM.
Hospital Course: Patient underwent successful coronary angioplasty with single DES placement. Hemodynamically stable.
Discharge Medications:
1. Aspirin 81 mg oral tablet - Once daily with breakfast (Lifelong antiplatelet therapy).
2. Ticagrelor (Brilinta) 90 mg oral tablet - Twice daily (Morning & Evening at 8 AM / 8 PM). DO NOT MISS DOSES - HIGH STENT THROMBOSIS RISK.
3. Atorvastatin 80 mg tablet - Once daily at bedtime (High-intensity lipid stabilization).
4. Metoprolol Tartrate 25 mg - Twice daily with meals. Monitor heart rate (<60 bpm consult MD). (Do NOT confuse with Metoprolol Succinate ER).
Diet & Activity: Low sodium (<2g/day), cardiac diet. No lifting >10 lbs for 2 weeks. Walk 10 mins 2x daily.
Warning Signs: Chest pressure, radiating arm pain, severe shortness of breath, unusual bleeding.
Follow-up: Cardiology clinic in 10-14 days.`
  },
  surgical: {
    title: "Surgical Wound & Post-Op Recovery Protocol",
    doctor: "Dr. Marcus Brody, MD (Surgical Team)",
    clinic: "Memorial Outpatient Surgical Center",
    date: "2026-10-14",
    type: "Discharge Summary",
    text: `POST-OPERATIVE DISCHARGE PROTOCOL
Discharge Date: October 14, 2026
Procedure: Laparoscopic Abdominal Surgery.
Wound Status: Incisions closed with surgical staples / Dermabond. Clean and dry.
Medications:
1. Cephalexin (Keflex) 500 mg - Take 1 capsule 4 times daily (every 6 hours) for 7 days. Complete full course.
2. Acetaminophen (Tylenol) 500 mg - Take 1-2 tablets every 6 hours as needed for mild pain. Max 3,000 mg/day.
3. Docusate Sodium 100 mg - Take 1 capsule twice daily for stool softening while on pain meds.
Wound Care: Keep incisions clean and dry. Shower after 48 hours; gently pat dry. No tub baths or swimming.
Red Flags: Fever >100.4°F, increasing redness spreading from incisions, foul-smelling drainage, or persistent nausea.`
  },
  endocrine: {
    title: "Endocrine & Glycemic Recovery Plan",
    doctor: "Dr. Rajesh Patel, MD (Endocrinology)",
    clinic: "University Metabolic Clinic • Room 210",
    date: "2026-10-16",
    type: "Discharge Summary",
    text: `POST-DISCHARGE METABOLIC CARE PLAN
Discharge Date: October 16, 2026
Diagnosis: Type 2 Diabetes with elevated post-prandial glucose. Mild Renal Insufficiency.
Medications:
1. Metformin 500 mg - Take 1 tablet twice daily with morning and evening meals to minimize GI distress.
2. Glipizide 5 mg - Take 1 tablet once daily 30 minutes before first main meal of the day.
3. Lisinopril 10 mg - Take 1 tablet once daily in morning for kidney protection and blood pressure.
Monitoring: Check fasting blood glucose every morning before breakfast (Target 90-130 mg/dL).
Emergency Warnings: Shakiness, sweating, confusion, dizziness (hypoglycemia <70 mg/dL - treat with 15g fast sugars).`
  }
};

export default function DocumentAnalysisView({ currentLang, onSavePrescription, onNavigateToPrescriptions }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste' | 'samples'
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [docType, setDocType] = useState('Discharge Summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setError('');
    setResult(null);
    setSavedSuccess(false);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSelectSample = (key) => {
    const sample = SAMPLES[key];
    if (!sample) return;
    setInputText(sample.text);
    setDocType(sample.type);
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setActiveTab('paste');
    setError('');
    setResult(null);
    setSavedSuccess(false);
  };

  const handleAnalyze = async () => {
    if (!inputText && !selectedFile) {
      setError('Please select a file to upload or paste your prescription/discharge text.');
      return;
    }

    setLoading(true);
    setError('');
    setSavedSuccess(false);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('textContent', inputText);
      formData.append('language', currentLang || 'English');
      formData.append('docType', docType);

      const response = await fetch(`${API_BASE_URL}/api/analyze-document`, {
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

  const handleSaveToMyPrescriptions = () => {
    if (!result) return;

    const newPrescription = {
      id: `rx_${Date.now()}`,
      title: docType === 'Handwritten Prescription' ? 'Handwritten Doctor Prescription' : 'Hospital Discharge Summary Rx',
      doctor: result.detectedDoctor || 'Attending Physician',
      clinic: result.detectedClinic || 'Outpatient Specialty Clinic',
      date: new Date().toISOString().split('T')[0],
      diagnosis: (result.keyDiagnoses && result.keyDiagnoses.join(', ')) || 'Clinical Post-Discharge Treatment',
      status: 'Active',
      refill: '1 Refill Remaining (30-day supply)',
      documentType: selectedFile ? `${selectedFile.type.includes('pdf') ? 'PDF Scan' : 'Camera Photo'} (Vision OCR)` : 'Clinical Text Record',
      imagePreview: filePreviewUrl || null,
      medications: (result.medications || []).map(m => ({
        name: m.name || 'Medication',
        dosage: m.dosage || 'As directed',
        schedule: m.schedule || 'Daily',
        instructions: m.instructions || m.purpose || 'Follow physician instructions.',
        critical: !!m.criticalWarning
      })),
      notes: result.summary || 'Uploaded and verified by CareBridge AI Clinical Vision OCR.'
    };

    if (onSavePrescription) {
      onSavePrescription(newPrescription);
    } else {
      try {
        const saved = localStorage.getItem('carebridge_portal_prescriptions');
        const list = saved ? JSON.parse(saved) : [];
        const updated = [newPrescription, ...list];
        localStorage.setItem('carebridge_portal_prescriptions', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save prescription to localStorage', err);
      }
    }

    setSavedSuccess(true);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px' }}>
      {/* Module Title & Introduction */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            background: '#e0e7ff',
            color: '#4338ca',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '9999px'
          }}>
            Clinical Vision OCR &amp; Medical Translation
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Instant AI extraction of medicines, doses &amp; schedules
          </span>
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', margin: '4px 0' }}>
          Upload Document or Doctor's Prescription
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
          Choose how you want to provide your medical paperwork: upload a photo from your phone, select a PDF discharge summary, or paste doctor notes.
        </p>
      </div>

      {/* Mode Selection Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '6px',
        background: '#f1f5f9',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          style={{
            flex: '1 1 200px',
            padding: '10px 16px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'upload' ? '#ffffff' : 'transparent',
            color: activeTab === 'upload' ? '#4f46e5' : '#475569',
            fontWeight: activeTab === 'upload' ? 800 : 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'upload' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📤</span>
          <span>Upload File (Photo or PDF)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          style={{
            flex: '1 1 200px',
            padding: '10px 16px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'paste' ? '#ffffff' : 'transparent',
            color: activeTab === 'paste' ? '#4f46e5' : '#475569',
            fontWeight: activeTab === 'paste' ? 800 : 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'paste' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>✍️</span>
          <span>Paste Medical Notes / Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          style={{
            flex: '1 1 200px',
            padding: '10px 16px',
            borderRadius: '9px',
            border: 'none',
            background: activeTab === 'samples' ? '#ffffff' : 'transparent',
            color: activeTab === 'samples' ? '#4f46e5' : '#475569',
            fontWeight: activeTab === 'samples' ? 800 : 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'samples' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📑</span>
          <span>Try Pre-loaded Demo Prescriptions</span>
        </button>
      </div>

      {/* ================= TAB 1: UPLOAD FILE ================= */}
      {activeTab === 'upload' && (
        <div style={{ marginBottom: '1.5rem' }}>
          {/* Active File Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              border: isDragOver ? '2.5px dashed #4338ca' : '2px dashed #6366f1',
              background: isDragOver ? '#e0e7ff' : 'linear-gradient(180deg, #f8faff 0%, #eef2ff 100%)',
              borderRadius: '18px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isDragOver ? '0 8px 24px rgba(79, 70, 229, 0.18)' : '0 2px 10px rgba(79, 70, 229, 0.05)',
              position: 'relative'
            }}
          >
            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.heic,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {!selectedFile ? (
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#4f46e5',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.15)',
                  border: '1px solid #c7d2fe'
                }}>
                  📄
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px 0' }}>
                  Click to Browse or Drag &amp; Drop Prescription Here
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
                  Upload a photo of handwritten doctor cursive, smartphone snapshot of prescription, or digital hospital PDF summary.
                </p>

                {/* Prominent Action Buttons inside the dropzone */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{
                      background: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '11px 22px',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)'
                    }}
                  >
                    <span>📂</span>
                    <span>Choose File from Device (PDF / Image)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                    style={{
                      background: '#ffffff',
                      color: '#4f46e5',
                      border: '1.5px solid #6366f1',
                      borderRadius: '10px',
                      padding: '11px 20px',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📷</span>
                    <span>Take Photo / Camera</span>
                  </button>
                </div>

                <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Supported formats: JPG, PNG, PDF, HEIC up to 25MB • Vision AI OCR enabled
                </div>
              </div>
            ) : (
              /* Selected File Banner */
              <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #c7d2fe',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                }}>
                  {filePreviewUrl ? (
                    <img
                      src={filePreviewUrl}
                      alt="Prescription preview"
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      background: '#eef2ff',
                      color: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem'
                    }}>
                      📑
                    </div>
                  )}

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        background: '#eef2ff',
                        color: '#4f46e5',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid #c7d2fe'
                      }}>
                        ✓ Ready to Scan
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div style={{
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: 'var(--navy)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {selectedFile.name}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Type: {selectedFile.type || 'Document'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Choose a different file
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PASTE TEXT ================= */}
      {activeTab === 'paste' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Paste Hospital Discharge Summary or Prescription Text
            </label>
            <button
              type="button"
              onClick={() => handleSelectSample('cardiology')}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              + Load Sample Text
            </button>
          </div>

          <textarea
            rows={8}
            placeholder="Paste clinical discharge summary, medication instructions, physician handwritten notes, or pharmacy labels here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>
      )}

      {/* ================= TAB 3: DEMO SAMPLES ================= */}
      {activeTab === 'samples' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Don't have a document ready to upload? Select any of these real-world clinical discharge summaries to test the AI extractor:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div
              onClick={() => handleSelectSample('cardiology')}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>❤️</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5' }}>CARDIOLOGY</span>
              </div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)' }}>
                Dr. Eleanor Vance, MD
              </h5>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                Post-Stent NSTEMI discharge summary with Aspirin, Ticagrelor, Atorvastatin &amp; Metoprolol.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5' }}>
                Use this sample →
              </div>
            </div>

            <div
              onClick={() => handleSelectSample('surgical')}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>🩹</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5' }}>SURGERY / WOUND</span>
              </div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)' }}>
                Dr. Marcus Brody, MD
              </h5>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                Post-op wound care protocol with Cephalexin antibiotic, pain control &amp; staple precautions.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5' }}>
                Use this sample →
              </div>
            </div>

            <div
              onClick={() => handleSelectSample('endocrine')}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>🩺</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706' }}>ENDOCRINE / DIABETES</span>
              </div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)' }}>
                Dr. Rajesh Patel, MD
              </h5>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                Metabolic discharge with Metformin, Glipizide, Lisinopril, and hypoglycemia red flags.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#d97706' }}>
                Use this sample →
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Document Type & Primary Analyze Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem',
        background: '#f8fafc',
        borderRadius: '14px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
            Document Classification:
          </span>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#1e293b',
              background: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="Discharge Summary">Hospital Discharge Summary</option>
            <option value="Handwritten Prescription">Handwritten Doctor Prescription</option>
            <option value="Lab / Imaging Report">Lab / Bloodwork / Imaging Report</option>
            <option value="Surgical Operative Note">Surgical Operative Protocol</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || (!selectedFile && !inputText)}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 28px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: loading || (!selectedFile && !inputText) ? 'not-allowed' : 'pointer',
            opacity: loading || (!selectedFile && !inputText) ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
          }}
        >
          {loading ? (
            <>
              <span>⏳</span>
              <span>Running Clinical OCR &amp; AI Analysis...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Scan &amp; Extract Medications</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '1.25rem',
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          color: '#b91c1c',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ================= RESULTS DISPLAY ================= */}
      {result && (
        <div style={{ marginTop: '2rem', borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem' }}>
          
          {/* Top Success Banner with "Add to Latest Prescriptions" action */}
          <div style={{
            background: savedSuccess ? '#eef2ff' : '#eef2ff',
            border: savedSuccess ? '1.5px solid #c7d2fe' : '1.5px solid #c7d2fe',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{savedSuccess ? '✅' : '🎉'}</span>
                <h4 style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: savedSuccess ? '#312e81' : '#312e81'
                }}>
                  {savedSuccess ? 'Prescription Saved to Your Dashboard!' : 'Document Successfully Extracted & Decoded!'}
                </h4>
              </div>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '0.85rem',
                color: savedSuccess ? '#4338ca' : '#4338ca'
              }}>
                {savedSuccess
                  ? 'This prescription is now active in your Latest Prescriptions tab with dose reminders.'
                  : 'Extracted medical directives, doses, and critical warning precautions.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!savedSuccess ? (
                <button
                  type="button"
                  onClick={handleSaveToMyPrescriptions}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                  }}
                >
                  <span>💾</span>
                  <span>Add to My Latest Prescriptions</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNavigateToPrescriptions}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>💊</span>
                  <span>View in Latest Prescriptions →</span>
                </button>
              )}
            </div>
          </div>

          {/* Plain-Language Summary Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span>
              <span>Plain-Language Patient Summary</span>
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
              {result.summary || result.rawText}
            </p>

            {result.keyDiagnoses && result.keyDiagnoses.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.keyDiagnoses.map((diag, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#ffffff',
                      color: '#4f46e5',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: '1px solid #c7d2fe'
                    }}
                  >
                    ✓ {diag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Extracted Prescribed Medications Cards */}
          {result.medications && result.medications.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💊</span>
                  <span>Prescribed Medications ({result.medications.length})</span>
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {result.medications.map((med, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: med.criticalWarning ? '1.5px solid #fecaca' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      background: med.criticalWarning ? '#fffbfb' : '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy)' }}>
                        {med.name}
                      </div>
                      <span style={{
                        background: '#e0e7ff',
                        color: '#4338ca',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}>
                        {med.schedule}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                      🎯 <strong>Purpose:</strong> {med.purpose}
                    </div>

                    {med.instructions && (
                      <div style={{ fontSize: '0.825rem', color: '#334155', marginBottom: '0.5rem' }}>
                        ℹ️ <strong>Instructions:</strong> {med.instructions}
                      </div>
                    )}

                    {med.criticalWarning && (
                      <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        marginTop: '0.5rem'
                      }}>
                        ⚠️ <strong>Critical:</strong> {med.criticalWarning}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Checklist and Emergency Red Flags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Daily Care Checklist */}
            {result.dailyCareChecklist && result.dailyCareChecklist.length > 0 && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✅</span>
                  <span>Daily Home Care Checklist</span>
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.dailyCareChecklist.map((task, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#334155' }}>
                      <input type="checkbox" style={{ marginTop: '3px', cursor: 'pointer' }} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emergency Red Flags */}
            {result.emergencyRedFlags && result.emergencyRedFlags.length > 0 && (
              <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '14px', border: '1.5px solid #fecaca' }}>
                <h4 style={{ fontWeight: 800, color: '#b91c1c', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🚨</span>
                  <span>Immediate Emergency Red Flags</span>
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#991b1b', marginBottom: '0.75rem', fontWeight: 600 }}>
                  If you experience any of these symptoms, call emergency services (108 / 911) or visit the nearest ER immediately:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.emergencyRedFlags.map((flag, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#7f1d1d', fontWeight: 700 }}>
                      <span>⚠️</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Follow-up & Questions */}
          {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '14px' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🩺</span>
                <span>Questions to Ask Your Doctor at Follow-Up</span>
              </h4>
              {result.followUpAppointment && (
                <div style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 800, marginBottom: '0.75rem' }}>
                  📅 Recommended Follow-Up: {result.followUpAppointment}
                </div>
              )}
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {result.questionsForDoctor.map((q, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{q}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
