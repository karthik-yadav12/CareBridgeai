// Prisma Seed Script for Discharge Care App
// Populates initial clinical demonstration data

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Discharge Care database with realistic clinical demo data...');

  // 1. Create Patient User
  const patientUser = await prisma.user.upsert({
    where: { email: 'sarah@carebridge.ai' },
    update: {},
    create: {
      email: 'sarah@carebridge.ai',
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 019-3388',
      passwordHash: 'scrypt_hashed_clinical_safe_password_token_2026',
      role: 'PATIENT',
      patientProfiles: {
        create: {
          dateOfBirth: new Date('1992-04-15'),
          diagnosis: 'Acute Coronary Syndrome (NSTEMI) s/p LAD Drug-Eluting Stent',
          hospitalName: 'St. Elizabeth Heart & Vascular Institute',
          dischargeDate: new Date('2026-10-19'),
          allergies: ['Penicillin', 'Sulfa drugs'],
          bloodGroup: 'O+',
          emergencyContact: 'David Jenkins (Spouse) - +1 (555) 019-9944',
          preferredLang: 'en'
        }
      }
    },
    include: {
      patientProfiles: true
    }
  });

  const patientProfile = patientUser.patientProfiles[0];

  // 2. Create Caregiver User
  const caregiverUser = await prisma.user.upsert({
    where: { email: 'pooja.caregiver@carebridge.ai' },
    update: {},
    create: {
      email: 'pooja.caregiver@carebridge.ai',
      fullName: 'Pooja Jenkins',
      phone: '+1 (555) 019-4455',
      passwordHash: 'scrypt_hashed_clinical_safe_password_token_2026',
      role: 'CAREGIVER'
    }
  });

  // 3. Link Caregiver Access
  await prisma.caregiverAccess.upsert({
    where: {
      patientId_caregiverId: {
        patientId: patientProfile.id,
        caregiverId: caregiverUser.id
      }
    },
    update: {},
    create: {
      patientId: patientProfile.id,
      caregiverId: caregiverUser.id,
      relationship: 'Daughter / Primary Caregiver',
      accessLevel: 'FULL_ACCESS',
      isApproved: true
    }
  });

  // 4. Seed Verified Medications
  const meds = [
    {
      name: 'Aspirin (Cardio)',
      dosage: '81 mg',
      frequency: 'Once daily with breakfast',
      instructions: 'Take with full glass of water. Stent protection protocol.',
      criticalWarning: 'Essential antiplatelet. Do not stop without cardiologist authorization.',
      schedules: {
        create: [
          { timeOfDay: '08:00 AM', slotName: 'Morning', reminderEnabled: true }
        ]
      }
    },
    {
      name: 'Ticagrelor (Brilinta)',
      dosage: '90 mg',
      frequency: 'Twice daily (every 12 hours)',
      instructions: 'Take morning and evening. Do not double dose if missed.',
      criticalWarning: 'HIGH STENT THROMBOSIS RISK IF MISSED.',
      schedules: {
        create: [
          { timeOfDay: '08:00 AM', slotName: 'Morning', reminderEnabled: true },
          { timeOfDay: '08:00 PM', slotName: 'Evening', reminderEnabled: true }
        ]
      }
    },
    {
      name: 'Metoprolol Tartrate',
      dosage: '25 mg',
      frequency: 'Twice daily with meals',
      instructions: 'Check pulse before taking. Hold if pulse is under 55 bpm.',
      criticalWarning: 'Do NOT confuse with Metoprolol Succinate ER.',
      schedules: {
        create: [
          { timeOfDay: '08:00 AM', slotName: 'Morning', reminderEnabled: true },
          { timeOfDay: '08:00 PM', slotName: 'Evening', reminderEnabled: true }
        ]
      }
    }
  ];

  for (const m of meds) {
    await prisma.medication.create({
      data: {
        patientId: patientProfile.id,
        isVerified: true,
        isActive: true,
        ...m
      }
    });
  }

  // 5. Seed Follow-up Appointments
  await prisma.appointment.create({
    data: {
      patientId: patientProfile.id,
      doctorName: 'Dr. Eleanor Vance, MD (Cardiologist)',
      clinicName: 'St. Elizabeth Heart Center • Suite 402',
      specialty: 'Post-Stent & Echo Review',
      appointmentDate: new Date('2026-11-02T10:30:00Z'),
      preparationNote: 'Bring current medicine list and blood pressure log.',
      status: 'UPCOMING'
    }
  });

  console.log('✅ Seed completed successfully with verified clinical protocols.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
