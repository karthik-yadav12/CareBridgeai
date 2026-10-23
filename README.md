# 🏥 Discharge Care — AI-Powered Post-Hospital Recovery Platform

> *"Your Recovery Journey, Simplified. Care shouldn't end when a patient leaves the hospital."*

---

## 📌 1. Project Overview

**Discharge Care** is a clinical-grade, accessible post-discharge healthcare web platform built for patients, family caregivers, and clinical teams. 

Leaving the hospital is often confusing and stressful: patients struggle with illegible doctor handwriting, missed medication schedules, dietary uncertainty, and forgotten follow-up checkups. Family members face significant challenges trying to coordinate care without shared tools.

Discharge Care provides a unified platform where patients and authorized family caregivers can:
1. **Translate Messy Prescriptions & Discharge Summaries:** Vision AI & OCR transcribe doctor handwriting into clear instructions while highlighting ambiguous fields.
2. **Safeguard Patient Safety (Confusion Guard):** Detects dangerous Look-Alike / Sound-Alike (LASA) drug confusions (e.g. *Metoprolol Tartrate vs Succinate ER*, *Hydralazine vs Hydroxyzine*).
3. **Automate Medication Reminders & Audio Alarms:** Daily schedules with Web Audio medical chimes, browser notifications, and Taken / Skipped / Uncertain status logging.
4. **Schedule & Sync Doctor Checkups:** Follow-up appointment tracker with advance reminders and one-click `.ics` calendar export for Google Calendar, Apple Calendar, and Outlook.
5. **Receive Clinician Dietary Guidance:** Tailored clinical nutrition plans with clear **Recommended**, **Limit or Avoid**, and **Ask Your Doctor** sections, Indian food examples (*idli, moong dal khichdi, tender coconut water*), and **Telugu & English** language toggles.
6. **Track Daily Recovery Progress & Vitals:** 14-day recovery roadmap, pain scale (0–10), body temperature and blood pressure tracking, with **automated clinical red-flag emergency detection**.
7. **Coordinate with Family Caregivers:** Multi-profile switching between Patient and authorized family members (*e.g., Daughter Pooja, Spouse David*) with caregiver activity logging.

---

## 🛠️ 2. Technology Stack

- **Frontend:** React 19, Vite 8, Lucide Icons, Modern Clinical CSS Design System (Teal / Mint Green palette)
- **Backend:** Node.js, Express.js REST API (`/api/v1/...`)
- **Database Architecture:** PostgreSQL with Prisma ORM (`prisma/schema.prisma`)
- **Clinical AI Engine:** Google Gemini REST API (`gemini-2.5-flash`, `gemini-1.5-flash`) with reliable local fallback parsers
- **Audio & Accessibility:** Synthesized Web Audio API medical chime alerts and browser Notification API
- **Calendar Interoperability:** RFC 5545 `.ics` iCalendar export

---

## 🎨 3. Design System & Accessibility

- **Primary Colors:** Clinical Teal (`#0d9488`, `#0f766e`), Light Mint (`#f0fdfa`), Crisp White (`#ffffff`)
- **Text:** Dark Charcoal / Navy (`#0f172a`, `#1e293b`) for maximum contrast and readability for elderly patients
- **Design Tokens:** Rounded cards (`var(--radius-lg)`), soft clinical drop-shadows, zero cluttered animations
- **Accessibility:** Large readable typography, color-coded status badges, and prominent emergency red-flag triage buttons

---

## 📂 4. Project Directory Structure

```text
CareBridgeAI/
│
├── prisma/
│   ├── schema.prisma              # Complete PostgreSQL relational schema (12 entities)
│   └── seed.js                    # Database seed script with clinical demo data
│
├── server/
│   ├── index.js                   # Express server entry point (Port 5000)
│   ├── api_v1.js                  # Modular /api/v1 REST API (Patients, Meds, Appointments, Vitals)
│   ├── auth.js                    # JWT token creation, password hashing (scrypt) & Google OAuth
│   └── data/                      # Local persistent JSON data storage
│
├── client/
│   ├── index.html                 # HTML entry point with metadata & Google Fonts
│   ├── vite.config.js             # Vite build configuration
│   └── src/
│       ├── App.jsx                # Main application component & tab coordinator
│       ├── index.css              # Modern hospital & clinical care design tokens
│       ├── components/
│       │   ├── Navbar.jsx         # Navigation bar with brand logo & caregiver indicator
│       │   ├── Hero.jsx           # Public landing hero ("Your Recovery Journey, Simplified.")
│       │   ├── PatientDashboardView.jsx # Executive recovery dashboard & metric cards
│       │   ├── DocumentAnalysisView.jsx # Full discharge summary reader & AI explainer
│       │   ├── HandwrittenOCRView.jsx   # Physician cursive handwriting OCR & transcription
│       │   ├── ConfusionGuardView.jsx   # Look-Alike / Sound-Alike (LASA) safety guard
│       │   ├── TimelineView.jsx         # 14-day timetable, alarms, checkups & symptom tracker
│       │   ├── DietPlannerView.jsx      # Dietary assistant with Indian food examples & Telugu support
│       │   ├── ProfileModal.jsx         # Multi-family member profile switcher & auth
│       │   └── EmergencyModal.jsx       # Emergency ER warning signs & dispatch contacts
│       └── utils/
│           ├── apiConfig.js       # Dynamic API endpoints & auth header helpers
│           └── audioChime.js      # Synthesized Web Audio API medical alarm chimes
│
├── .env.example                   # Environment configuration template
└── README.md                      # Comprehensive project documentation
```

---

## 🚀 5. Quick Start Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Step 1: Install Dependencies
```powershell
# Install root, backend, and frontend dependencies
npm run build
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```
*(Optional: Add your Google Gemini API key to `.env` for live AI vision models; if omitted, the application runs seamlessly using built-in clinical fallback responses).*

### Step 3: Run the Full-Stack Application
Open two terminal windows:

```powershell
# Terminal 1: Start Node.js Express API Server (Port 5000)
node server/index.js

# Terminal 2: Start Vite React Frontend (Port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ 6. Database Schema & Prisma Setup

The relational schema is configured in [`prisma/schema.prisma`](file:///c:/Users/vyshn/Downloads/CareBridgeAI/prisma/schema.prisma):

- `User`: Patient and caregiver accounts with scrypt password hashing
- `PatientProfile`: Clinical diagnosis, discharge date, allergies, and blood group
- `CaregiverAccess`: Authorized family members and access level permissions
- `PrescriptionDocument`: Uploaded image and PDF files
- `ExtractedPrescription`: OCR and AI-structured clinical medication fields
- `Medication` & `MedicationSchedule`: Verified schedules and timing slots
- `MedicationLog`: Recorded adherence (`TAKEN`, `SKIPPED`, `UNCERTAIN`) with caregiver attribution
- `Appointment`: Upcoming doctor visits, clinics, preparation notes, and status
- `DietaryInstruction`: Condition-specific food recommendations and restrictions
- `RecoveryEntry`: Daily pain score, temperature, blood pressure, and red-flag alerts
- `Notification`: Medication and follow-up advance reminders
- `AuditLog`: Security audit log for sensitive profile and prescription changes

To migrate and seed a PostgreSQL database:
```powershell
npx prisma migrate dev --name init
node prisma/seed.js
```

---

## 🔌 7. REST API Documentation (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/patients` | List all patient profiles |
| `GET` | `/api/v1/patients/:id` | Fetch specific patient profile and caregiver list |
| `PATCH`| `/api/v1/patients/:id` | Update diagnosis, allergies, or emergency contact |
| `POST`| `/api/v1/patients/:id/caregivers` | Authorize a new family caregiver |
| `GET` | `/api/v1/patients/:id/medications` | Fetch verified and active medications |
| `POST`| `/api/v1/medications/:id/logs` | Log dose status (`TAKEN`, `SKIPPED`, `UNCERTAIN`) |
| `GET` | `/api/v1/patients/:id/appointments`| Fetch upcoming and completed doctor appointments |
| `POST`| `/api/v1/patients/:id/appointments`| Schedule a new appointment with preparation notes |
| `GET` | `/api/v1/patients/:id/recovery` | Fetch daily recovery entries and vitals logs |
| `POST`| `/api/v1/patients/:id/recovery` | Record daily pain, temperature, blood pressure, and symptoms |
| `GET` | `/api/v1/patients/:id/recovery/summary` | Get 14-day progress %, adherence rate, and red-flag count |
| `POST`| `/api/v1/ai/explain-instructions` | AI plain-language translation with Telugu/English support |
| `POST`| `/api/v1/ai/dietary-guidance` | Clinician nutrition rules with Indian food alternatives |
| `GET` | `/api/v1/notifications` | Fetch unread notifications and reminders |

---

## 🛡️ 8. Clinical Safety Guardrails

- **Zero Guesswork / Hallucination Policy:** If a prescription has missing medicine names or unreadable dosage handwriting, the system flags it as **"Needs Confirmation"** instead of guessing.
- **Verification Gate:** AI-extracted prescriptions remain in draft status until verified by the patient or authorized caregiver before medication alarms are activated.
- **Automated Red-Flag Escalation:** If logged body temperature &ge; 100.4°F or pain score &ge; 8/10, an immediate clinical alert is displayed instructing the user to contact their hospital or emergency services.
- **Educational Disclaimer:** Discharge Care supports patient care adherence; it does not replace a licensed physician or provide independent diagnoses.
