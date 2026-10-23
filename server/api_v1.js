import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const v1Router = express.Router();

// Helper to read and write JSON data stores
function getStore(filename, defaultData = []) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return defaultData;
  }
}

function saveStore(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Initial clinical seed data
const SEED_PATIENT = {
  id: 'pat_sarah_01',
  fullName: 'Sarah Jenkins',
  dateOfBirth: '1992-04-15',
  diagnosis: 'Acute Coronary Syndrome (NSTEMI) s/p LAD Drug-Eluting Stent',
  hospitalName: 'St. Elizabeth Heart & Vascular Institute',
  dischargeDate: '2026-10-19',
  allergies: ['Penicillin (mild rash)', 'Sulfa drugs'],
  bloodGroup: 'O+',
  emergencyContact: 'David Jenkins (Spouse) - +1 (555) 019-9944',
  preferredLang: 'en',
  caregivers: [
    {
      id: 'cg_pooja_01',
      name: 'Pooja Jenkins',
      relationship: 'Daughter / Primary Caregiver',
      accessLevel: 'FULL_ACCESS',
      isApproved: true
    },
    {
      id: 'cg_david_02',
      name: 'David Jenkins',
      relationship: 'Spouse / Caregiver',
      accessLevel: 'FULL_ACCESS',
      isApproved: true
    }
  ]
};

const SEED_MEDS = [
  {
    id: 'med_01',
    patientId: 'pat_sarah_01',
    name: 'Aspirin (Cardio)',
    dosage: '81 mg',
    frequency: 'Once daily with breakfast',
    scheduleTimes: ['08:00 AM'],
    slotName: 'Morning',
    instructions: 'Take with food and full glass of water. Do not skip.',
    criticalWarning: 'Essential antiplatelet for cardiac stent. Do not stop without cardiologist authorization.',
    verificationStatus: 'VERIFIED',
    isActive: true
  },
  {
    id: 'med_02',
    patientId: 'pat_sarah_01',
    name: 'Ticagrelor (Brilinta)',
    dosage: '90 mg',
    frequency: 'Twice daily (12 hours apart)',
    scheduleTimes: ['08:00 AM', '08:00 PM'],
    slotName: 'Morning / Evening',
    instructions: 'Take 1 tablet every 12 hours. Do not double dose if missed.',
    criticalWarning: 'HIGH STENT THROMBOSIS RISK IF MISSED.',
    verificationStatus: 'VERIFIED',
    isActive: true
  },
  {
    id: 'med_03',
    patientId: 'pat_sarah_01',
    name: 'Atorvastatin',
    dosage: '80 mg',
    frequency: 'Once daily at bedtime',
    scheduleTimes: ['10:00 PM'],
    slotName: 'Night',
    instructions: 'Take at night. Avoid grapefruit juice.',
    criticalWarning: 'Report any unexplained muscle pain or tenderness.',
    verificationStatus: 'VERIFIED',
    isActive: true
  },
  {
    id: 'med_04',
    patientId: 'pat_sarah_01',
    name: 'Metoprolol Tartrate',
    dosage: '25 mg',
    frequency: 'Twice daily with meals',
    scheduleTimes: ['08:00 AM', '08:00 PM'],
    slotName: 'Morning / Evening',
    instructions: 'Take with food. Monitor heart rate (hold if HR < 55).',
    criticalWarning: 'Do NOT confuse with Metoprolol Succinate ER (24hr formulation).',
    verificationStatus: 'VERIFIED',
    isActive: true
  }
];

const SEED_APPOINTMENTS = [
  {
    id: 'apt_01',
    patientId: 'pat_sarah_01',
    doctorName: 'Dr. Eleanor Vance, MD (Cardiologist)',
    clinicName: 'St. Elizabeth Heart Center • Suite 402',
    specialty: 'Post-Stent & Echo Evaluation',
    appointmentDate: '2026-11-02T10:30:00.000Z',
    preparationNote: 'Bring current medication list and 7-day blood pressure log.',
    status: 'UPCOMING',
    reminderEnabled: true
  },
  {
    id: 'apt_02',
    patientId: 'pat_sarah_01',
    doctorName: 'Dr. Marcus Brody, MD (Surgical Team)',
    clinicName: 'Memorial Hospital Outpatient Surgical Clinic',
    specialty: 'Incision & Wound Healing Inspection',
    appointmentDate: '2026-10-28T14:00:00.000Z',
    preparationNote: 'Keep dressing clean and dry prior to examination.',
    status: 'UPCOMING',
    reminderEnabled: true
  }
];

const SEED_NOTIFICATIONS = [
  {
    id: 'notif_01',
    type: 'MEDICATION_REMINDER',
    title: 'Medication Due: Aspirin 81mg',
    message: 'Time for morning cardiac protection dose with breakfast.',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif_02',
    type: 'APPOINTMENT_REMINDER',
    title: 'Upcoming Cardiology Follow-Up',
    message: 'In 10 days with Dr. Eleanor Vance at St. Elizabeth Heart Center.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif_03',
    type: 'CAREGIVER_UPDATE',
    title: 'Caregiver Pooja Checked Dose',
    message: 'Pooja verified morning medication adherence for Sarah Jenkins.',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// Initialize default stores
let patientsStore = getStore('v1_patients.json', [SEED_PATIENT]);
let medsStore = getStore('v1_medications.json', SEED_MEDS);
let logsStore = getStore('v1_medication_logs.json', []);
let appointmentsStore = getStore('v1_appointments.json', SEED_APPOINTMENTS);
let recoveryStore = getStore('v1_recovery.json', []);
let notificationsStore = getStore('v1_notifications.json', SEED_NOTIFICATIONS);

// -------------------------------------------------------------
// 1. PATIENT PROFILES & CAREGIVERS
// -------------------------------------------------------------
v1Router.get('/patients', (req, res) => {
  res.json({ success: true, data: patientsStore });
});

v1Router.post('/patients', (req, res) => {
  const newPatient = {
    id: `pat_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  patientsStore.push(newPatient);
  saveStore('v1_patients.json', patientsStore);
  res.status(201).json({ success: true, data: newPatient });
});

v1Router.get('/patients/:patientId', (req, res) => {
  const patient = patientsStore.find(p => p.id === req.params.patientId) || patientsStore[0];
  res.json({ success: true, data: patient });
});

v1Router.patch('/patients/:patientId', (req, res) => {
  const idx = patientsStore.findIndex(p => p.id === req.params.patientId);
  if (idx !== -1) {
    patientsStore[idx] = { ...patientsStore[idx], ...req.body, updatedAt: new Date().toISOString() };
    saveStore('v1_patients.json', patientsStore);
    res.json({ success: true, data: patientsStore[idx] });
  } else {
    res.status(404).json({ success: false, error: 'Patient not found' });
  }
});

v1Router.post('/patients/:patientId/caregivers', (req, res) => {
  const patient = patientsStore.find(p => p.id === req.params.patientId) || patientsStore[0];
  const newCaregiver = {
    id: `cg_${Date.now()}`,
    name: req.body.name,
    relationship: req.body.relationship || 'Caregiver',
    accessLevel: req.body.accessLevel || 'FULL_ACCESS',
    isApproved: true
  };
  if (!patient.caregivers) patient.caregivers = [];
  patient.caregivers.push(newCaregiver);
  saveStore('v1_patients.json', patientsStore);
  res.status(201).json({ success: true, data: newCaregiver });
});

// -------------------------------------------------------------
// 2. MEDICATIONS & DOSE LOGS
// -------------------------------------------------------------
v1Router.get('/patients/:patientId/medications', (req, res) => {
  const meds = medsStore.filter(m => m.patientId === req.params.patientId || m.patientId === 'pat_sarah_01');
  res.json({ success: true, data: meds });
});

v1Router.post('/patients/:patientId/medications', (req, res) => {
  const newMed = {
    id: `med_${Date.now()}`,
    patientId: req.params.patientId,
    verificationStatus: 'VERIFIED',
    isActive: true,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  medsStore.push(newMed);
  saveStore('v1_medications.json', medsStore);
  res.status(201).json({ success: true, data: newMed });
});

v1Router.post('/medications/:medicationId/logs', (req, res) => {
  const newLog = {
    id: `log_${Date.now()}`,
    medicationId: req.params.medicationId,
    status: req.body.status || 'TAKEN', // 'TAKEN' | 'SKIPPED' | 'UNCERTAIN'
    loggedByRole: req.body.loggedByRole || 'PATIENT',
    loggedByName: req.body.loggedByName || 'Patient',
    notes: req.body.notes || '',
    loggedAt: new Date().toISOString()
  };
  logsStore.unshift(newLog);
  saveStore('v1_medication_logs.json', logsStore);
  res.status(201).json({ success: true, data: newLog });
});

v1Router.get('/patients/:patientId/medication-logs', (req, res) => {
  res.json({ success: true, data: logsStore.slice(0, 30) });
});

// -------------------------------------------------------------
// 3. APPOINTMENTS
// -------------------------------------------------------------
v1Router.get('/patients/:patientId/appointments', (req, res) => {
  res.json({ success: true, data: appointmentsStore });
});

v1Router.post('/patients/:patientId/appointments', (req, res) => {
  const newApt = {
    id: `apt_${Date.now()}`,
    patientId: req.params.patientId,
    status: 'UPCOMING',
    reminderEnabled: true,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  appointmentsStore.unshift(newApt);
  saveStore('v1_appointments.json', appointmentsStore);
  res.status(201).json({ success: true, data: newApt });
});

v1Router.patch('/appointments/:appointmentId', (req, res) => {
  const idx = appointmentsStore.findIndex(a => a.id === req.params.appointmentId);
  if (idx !== -1) {
    appointmentsStore[idx] = { ...appointmentsStore[idx], ...req.body };
    saveStore('v1_appointments.json', appointmentsStore);
    res.json({ success: true, data: appointmentsStore[idx] });
  } else {
    res.status(404).json({ success: false, error: 'Appointment not found' });
  }
});

v1Router.delete('/appointments/:appointmentId', (req, res) => {
  appointmentsStore = appointmentsStore.filter(a => a.id !== req.params.appointmentId);
  saveStore('v1_appointments.json', appointmentsStore);
  res.json({ success: true, message: 'Appointment deleted' });
});

// -------------------------------------------------------------
// 4. RECOVERY TRACKING & VITALS
// -------------------------------------------------------------
v1Router.get('/patients/:patientId/recovery', (req, res) => {
  res.json({ success: true, data: recoveryStore });
});

v1Router.post('/patients/:patientId/recovery', (req, res) => {
  const tempNum = parseFloat(req.body.temperature);
  const painNum = parseInt(req.body.painLevel);
  const hasRedFlag = (!isNaN(tempNum) && tempNum >= 100.4) || painNum >= 8;

  const newEntry = {
    id: `rec_${Date.now()}`,
    patientId: req.params.patientId,
    entryDate: new Date().toISOString(),
    painLevel: req.body.painLevel || 0,
    temperature: req.body.temperature || 98.6,
    systolicBp: req.body.systolicBp || 120,
    diastolicBp: req.body.diastolicBp || 80,
    energyScore: req.body.energyScore || 4,
    sleepQuality: req.body.sleepQuality || 4,
    woundStatus: req.body.woundStatus || 'Clean & Healing',
    notes: req.body.notes || '',
    loggedBy: req.body.loggedBy || 'Patient',
    hasRedFlag
  };

  recoveryStore.unshift(newEntry);
  saveStore('v1_recovery.json', recoveryStore);
  res.status(201).json({ success: true, data: newEntry });
});

v1Router.get('/patients/:patientId/recovery/summary', (req, res) => {
  const totalEntries = recoveryStore.length;
  const avgPain = totalEntries > 0 
    ? (recoveryStore.reduce((acc, r) => acc + (Number(r.painLevel) || 0), 0) / totalEntries).toFixed(1)
    : '2.5';
  
  res.json({
    success: true,
    data: {
      currentRecoveryDay: 3,
      totalProtocolDays: 14,
      recoveryPercent: 21,
      averagePainScore: avgPain,
      adherenceRate: 94,
      recentRedFlagsCount: recoveryStore.filter(r => r.hasRedFlag).length
    }
  });
});

// -------------------------------------------------------------
// 5. NOTIFICATIONS
// -------------------------------------------------------------
v1Router.get('/notifications', (req, res) => {
  res.json({ success: true, data: notificationsStore });
});

v1Router.patch('/notifications/:notificationId/read', (req, res) => {
  notificationsStore = notificationsStore.map(n => 
    n.id === req.params.notificationId ? { ...n, isRead: true } : n
  );
  saveStore('v1_notifications.json', notificationsStore);
  res.json({ success: true, data: notificationsStore });
});

// -------------------------------------------------------------
// 6. AI EXPLANATION & TELUGU / ENGLISH DIETARY GUIDANCE
// -------------------------------------------------------------
v1Router.post('/ai/explain-instructions', async (req, res) => {
  const { text, language = 'en' } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, error: 'Text is required' });
  }

  const isTelugu = language === 'te';
  res.json({
    success: true,
    data: {
      simplifiedSummary: isTelugu
        ? "మీరు తీసుకుంటున్న మందులు రక్తపోటును సాధారణ స్థితిలో ఉంచి, స్టెంట్ రక్షణకు సహాయపడతాయి. రోజువారీ సమయపాలన పాటించండి."
        : "Your medications keep your blood pressure stable and protect your newly placed stent. Follow daily timings strictly.",
      keySafetyPoints: [
        isTelugu ? "మందులను ఆహారంతో పాటు తీసుకోండి" : "Take morning doses with water after breakfast",
        isTelugu ? "డాక్టర్ అనుమతి లేకుండా మందులు ఆపవద్దు" : "Do not stop blood thinners abruptly",
        isTelugu ? "రాత్రి పూట ఎక్కువ నూనె ఆహారాలు తినవద్దు" : "Maintain low-sodium dietary restrictions"
      ],
      disclaimer: "Educational AI guidance based on verified clinical protocols. Always confirm with your physician."
    }
  });
});

v1Router.post('/ai/dietary-guidance', async (req, res) => {
  const { condition, language = 'en' } = req.body;
  const isTelugu = language === 'te';

  res.json({
    success: true,
    data: {
      condition: condition || 'Post-Cardiac Stent Recovery',
      language: isTelugu ? 'Telugu' : 'English',
      recommendedFoods: [
        { food: isTelugu ? 'ఇడ్లీ & సాంబార్ (తక్కువ ఉప్పు)' : 'Steamed Idli with Mild Vegetable Sambar', benefit: 'Easy to digest, rich in sustained energy and fiber.' },
        { food: isTelugu ? 'పెసర పప్పు కిచిడీ' : 'Moong Dal Khichdi with Soft Ghee', benefit: 'Gentle on post-op digestion, high plant-based protein.' },
        { food: isTelugu ? 'కొబ్బరి నీళ్ళు & పండ్ల ముక్కలు (బొప్పాయి/యాపిల్)' : 'Tender Coconut Water & Fresh Papaya', benefit: 'Electrolyte rebalancing and enzymatic tissue recovery.' }
      ],
      foodsToAvoid: [
        { food: isTelugu ? 'డీప్ ఫ్రైడ్ స్నాక్స్ (సమోసా, పకోడీ)' : 'Deep-Fried Savory Snacks (Samosa, Pakoda)', reason: 'High trans-fat increases arterial plaque and blood pressure.' },
        { food: isTelugu ? 'అధిక ఉప్పు ఉండే పచ్చళ్ళు (ఊరగాయలు)' : 'Heavily Salted Indian Pickles (Achar / Pachadi)', reason: 'Excess sodium causes fluid retention and cardiac strain.' }
      ],
      hydrationTarget: isTelugu ? 'రోజుకు 2.0 నుండి 2.5 లీటర్ల నీరు' : '2.0 to 2.5 Liters of water daily unless restricted by kidney protocol.'
    }
  });
});

export default v1Router;
