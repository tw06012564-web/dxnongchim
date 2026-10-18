import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { PatientMetricsBar } from './components/PatientMetricsBar.tsx';
import { DiagnosticWorkspace } from './components/DiagnosticWorkspace.tsx';
import { Icd10HosxpBrowser } from './components/Icd10HosxpBrowser.tsx';
import { WeightDosingCalculator } from './components/WeightDosingCalculator.tsx';
import { ReferralGuide } from './components/ReferralGuide.tsx';
import { PrescriptionPrintModal } from './components/PrescriptionPrintModal.tsx';
import { PatientMetrics, DiagnosisResult, PrescriptionItem } from './types.ts';
import { computeBmi, computeBsa, isPediatricPatient } from './utils/calculator.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnose' | 'icd10' | 'dosing_calc' | 'guidelines'>('diagnose');
  const [loading, setLoading] = useState(false);

  // Patient Metrics State: strictly Weight and Height with no personal identifiers!
  const initialWeight = 52;
  const initialHeight = 160;
  const initialBmiInfo = computeBmi(initialWeight, initialHeight);

  const [metrics, setMetrics] = useState<PatientMetrics>({
    weight: initialWeight,
    height: initialHeight,
    bmi: initialBmiInfo.bmi,
    bmiStatus: initialBmiInfo.status,
    bsa: computeBsa(initialWeight, initialHeight),
    isPediatric: isPediatricPatient(initialWeight, initialHeight),
    vitalSigns: {
      temp: 36.8,
      sbp: 120,
      dbp: 80,
      pulse: 78
    },
    drugAllergies: '',
    chronicDiseases: ''
  });

  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  // Print modal state
  const [printModal, setPrintModal] = useState<{
    isOpen: boolean;
    mode: 'rx_slip' | 'drug_labels';
  }>({
    isOpen: false,
    mode: 'rx_slip'
  });

  const handleUpdateMetrics = (updated: Partial<PatientMetrics>) => {
    setMetrics((prev) => {
      const next = { ...prev, ...updated };
      const bmiInfo = computeBmi(next.weight, next.height);
      next.bmi = bmiInfo.bmi;
      next.bmiStatus = bmiInfo.status;
      next.bsa = computeBsa(next.weight, next.height);
      next.isPediatric = isPediatricPatient(next.weight, next.height);
      return next;
    });
  };

  const handleDiagnose = async (symptoms: string, presetId?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weight: metrics.weight,
          height: metrics.height,
          symptoms,
          vitalSigns: metrics.vitalSigns,
          presetProtocolId: presetId,
          drugAllergies: metrics.drugAllergies,
          chronicDiseases: metrics.chronicDiseases
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setDiagnosis(data);
    } catch (err) {
      console.error('Diagnosis request error:', err);
      // Even if network fails, provide offline guideline result
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrescriptions = (prescriptions: PrescriptionItem[]) => {
    if (!diagnosis) return;
    setDiagnosis({
      ...diagnosis,
      prescriptions
    });
  };

  const handleReset = () => {
    const defaultW = 50;
    const defaultH = 160;
    const bmiInfo = computeBmi(defaultW, defaultH);
    setMetrics({
      weight: defaultW,
      height: defaultH,
      bmi: bmiInfo.bmi,
      bmiStatus: bmiInfo.status,
      bsa: computeBsa(defaultW, defaultH),
      isPediatric: isPediatricPatient(defaultW, defaultH),
      vitalSigns: {
        temp: 36.8,
        sbp: 120,
        dbp: 80,
        pulse: 78
      },
      drugAllergies: '',
      chronicDiseases: ''
    });
    setDiagnosis(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Left Sidebar (Abbreviated labels) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        metrics={metrics}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
          {/* Physical Metrics Bar (Weight & Height only, no personal identifiers) */}
          <PatientMetricsBar
            metrics={metrics}
            onChange={handleUpdateMetrics}
          />

          {/* Tab 1: Diagnostic & Prescribing Workspace */}
          {activeTab === 'diagnose' && (
            <DiagnosticWorkspace
              metrics={metrics}
              diagnosis={diagnosis}
              onDiagnose={handleDiagnose}
              loading={loading}
              onUpdatePrescriptions={handleUpdatePrescriptions}
              onOpenPrint={() => setPrintModal({ isOpen: true, mode: 'rx_slip' })}
              onOpenLabels={() => setPrintModal({ isOpen: true, mode: 'drug_labels' })}
            />
          )}

          {/* Tab 2: ICD-10 HOSxP XE & NHSO Claiming Browser */}
          {activeTab === 'icd10' && (
            <Icd10HosxpBrowser />
          )}

          {/* Tab 3: Weight Dosing Calculator */}
          {activeTab === 'dosing_calc' && (
            <WeightDosingCalculator
              metrics={metrics}
              onUpdateMetrics={handleUpdateMetrics}
            />
          )}

          {/* Tab 4: Referral Guide & Protocols */}
          {activeTab === 'guidelines' && (
            <ReferralGuide />
          )}
        </main>

        {/* Clinical Footer */}
        <footer className="bg-white border-t border-slate-200 py-3 mt-6 no-print text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4">
            <p className="font-semibold text-slate-700">
              ระบบสนับสนุนการวินิจฉัยและสั่งจ่ายยาตามกรอบบัญชียา รพ.สต. 106 รายการ
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              คำนวณขนาดยาตามน้ำหนักตัวจริง • ไม่เก็บข้อมูลระบุตัวตน • เครื่องมือช่วยตัดสินใจทางคลินิก (CDSS)
            </p>
          </div>
        </footer>
      </div>

      {/* Print Prescription / Labels Modal */}
      {printModal.isOpen && diagnosis && (
        <PrescriptionPrintModal
          metrics={metrics}
          diagnosis={diagnosis}
          mode={printModal.mode}
          onClose={() => setPrintModal({ isOpen: false, mode: 'rx_slip' })}
        />
      )}
    </div>
  );
}
