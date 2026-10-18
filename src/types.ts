import { MedicationItem, MedicationCategory } from './data/medications.ts';

export interface VitalSigns {
  temp?: number;
  sbp?: number;
  dbp?: number;
  pulse?: number;
  rr?: number;
}

export interface PatientMetrics {
  weight: number; // kg
  height: number; // cm
  bmi: number;
  bmiStatus: string;
  bsa: number; // m²
  isPediatric: boolean;
  vitalSigns: VitalSigns;
  drugAllergies: string;
  chronicDiseases: string;
}

export interface PrescriptionItem {
  medicationId: string;
  medicationName: string;
  genericName: string;
  thaiName: string;
  category: MedicationCategory;
  categoryLabel: string;
  calculatedDose: string;
  frequency: string;
  instructions: string;
  amountToDispense: string;
  warning: string;
  isHerbal: boolean;
}

export interface DiagnosisResult {
  primaryDiagnosis: string;
  icd10: string;
  clinicalRationale: string;
  severityLevel: 'mild' | 'moderate' | 'severe_redflag';
  redFlags: string[];
  prescriptions: PrescriptionItem[];
  nonPharmAdvice: string[];
  followUpAdvice: string;
  source?: string;
  bmiData?: {
    bmi: number;
    status: string;
    isPediatric: boolean;
  };
}
