import React, { useState } from 'react';
import {
  Sparkles,
  Stethoscope,
  AlertTriangle,
  FileText,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Pill,
  Leaf,
  Activity,
  ArrowRight,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { PatientMetrics, DiagnosisResult, PrescriptionItem } from '../types.ts';
import { COMMON_PRIMARY_CARE_PROTOCOLS } from '../data/clinicalGuidelines.ts';
import { MEDICATION_LIST, MedicationItem } from '../data/medications.ts';

interface DiagnosticWorkspaceProps {
  metrics: PatientMetrics;
  diagnosis: DiagnosisResult | null;
  onDiagnose: (symptoms: string, presetId?: string) => Promise<void>;
  loading: boolean;
  onUpdatePrescriptions: (prescriptions: PrescriptionItem[]) => void;
  onOpenPrint: () => void;
  onOpenLabels: () => void;
}

export const DiagnosticWorkspace: React.FC<DiagnosticWorkspaceProps> = ({
  metrics,
  diagnosis,
  onDiagnose,
  loading,
  onUpdatePrescriptions,
  onOpenPrint,
  onOpenLabels
}) => {
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHosxp, setCopiedHosxp] = useState(false);

  const handleCopyHosxpInfo = () => {
    if (!diagnosis) return;
    const isInjury = diagnosis.icd10.startsWith('T') || diagnosis.icd10.startsWith('S') || diagnosis.icd10.startsWith('W');
    const externalCause = isInjury ? '\n- Diag Type 5 (External Cause): W01.9 (หกล้ม/สะดุดลื่นบนพื้น)' : '';
    const icd9 = isInjury ? '\n- ICD-9-CM หัตถการ: 96.59 (การทำแผล/ล้างแผล)' : '\n- ICD-9-CM หัตถการ: 89.07 (ตรวจรักษาเวชปฏิบัติทั่วไป)';

    const text = `=== บันทึก HOSxP XE (ส่งเคลม สปสช.) ===
รหัส ICD-10: ${diagnosis.icd10}
ชื่อโรค: ${diagnosis.primaryDiagnosis}
Diag Type: 1 (Principal Diagnosis)${externalCause}${icd9}
น้ำหนัก: ${metrics.weight} กก. | ส่วนสูง: ${metrics.height} ซม. | BMI: ${metrics.bmi}
รายการยา: ${diagnosis.prescriptions.map((p) => `${p.medicationName} (${p.amountToDispense})`).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopiedHosxp(true);
    setTimeout(() => setCopiedHosxp(false), 2500);
  };

  const quickPresets = [
    { id: 'common-cold', label: 'ไข้หวัด / น้ำมูก / ไอ', icon: '🤧' },
    { id: 'acute-pharyngitis-tonsillitis', label: 'เจ็บคอ / ทอนซิลอักเสบ', icon: '🔴' },
    { id: 'acute-gastroenteritis', label: 'ท้องเสีย / ถ่ายเหลว / อาเจียน', icon: '🚾' },
    { id: 'dyspepsia-gerd', label: 'ปวดกระเพาะ / กรดไหลย้อน', icon: '🔥' },
    { id: 'myalgia-muscle-strain', label: 'ปวดเมื่อยกล้ามเนื้อ / เคล็ด', icon: '💪' },
    { id: 'acute-gout-flare', label: 'ข้ออักเสบเกาต์กำเริบ', icon: '🦶' },
    { id: 'allergic-rhinitis-urticaria', label: 'ผื่นลมพิษ / คัน / ภูมิแพ้', icon: '🌿' },
    { id: 'acute-wound-abrasion', label: 'แผลสด / ถลอก / หกล้ม', icon: '🩹' },
    { id: 'hypertension-routine-followup', label: 'ติดตามความดันโลหิตสูง', icon: '💓' },
    { id: 'diabetes-type-2-followup', label: 'ติดตามโรคเบาหวาน', icon: '🩸' },
    { id: 'scabies-lice', label: 'คันหิด / เหา', icon: '🔍' },
    { id: 'smoking-cessation', label: 'ช่วยเลิกบุหรี่ / หญ้าดอกขาว', icon: '🚭' }
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const protocol = COMMON_PRIMARY_CARE_PROTOCOLS.find((p) => p.id === presetId);
    if (protocol) {
      setSymptomInput(protocol.commonSymptoms.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim() && !selectedPresetId) return;
    onDiagnose(symptomInput, selectedPresetId || undefined);
  };

  const handleRemovePrescription = (index: number) => {
    if (!diagnosis) return;
    const updated = diagnosis.prescriptions.filter((_, i) => i !== index);
    onUpdatePrescriptions(updated);
  };

  const handleAddMedication = (med: MedicationItem) => {
    if (!diagnosis) return;
    const isPediatric = metrics.isPediatric;
    const calculatedDose = isPediatric && med.standardPediatricDose ? med.standardPediatricDose : med.standardAdultDose;

    const newItem: PrescriptionItem = {
      medicationId: med.id,
      medicationName: med.name,
      genericName: med.genericName,
      thaiName: med.thaiName,
      category: med.category,
      categoryLabel: med.categoryLabel,
      calculatedDose,
      frequency: med.frequency,
      instructions: med.instructions,
      amountToDispense: '1 หน่วย',
      warning: med.cautions[0] || '',
      isHerbal: med.category === 'thai_herbal'
    };

    onUpdatePrescriptions([...diagnosis.prescriptions, newItem]);
    setShowAddMedModal(false);
  };

  // Filter available medications for the add modal
  const filteredMeds = MEDICATION_LIST.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.thaiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.indications.some((ind) => ind.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Symptom Input & Case Selector Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                ตรวจวินิจฉัยและสั่งยา (Clinical Assessment & Dispensation)
              </h3>
              <p className="text-xs text-slate-500">
                เลือกอาการที่พบบ่อยใน รพ.สต. หรือพิมพ์อาการสำคัญ เพื่อให้ระบบช่วยจับคู่การวินิจฉัยและคำนวณขนาดยาตามน้ำหนัก
              </p>
            </div>
          </div>
        </div>

        {/* Quick Common Case Chips */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            กลุ่มอาการ/โรคที่พบบ่อยใน รพ.สต. (Quick Protocols):
          </label>
          <div className="flex flex-wrap gap-2">
            {quickPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Symptom text input and analyze button */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center mb-1">
              <span>อาการสำคัญและรายละเอียดเพิ่มเติม (Symptoms & Clinical Signs)</span>
              <span className="text-[11px] text-slate-400">ระบุอาการ เช่น มีไข้ ไอ เจ็บคอ 2 วัน</span>
            </label>
            <textarea
              rows={2}
              value={symptomInput}
              onChange={(e) => {
                setSymptomInput(e.target.value);
                setSelectedPresetId(null);
              }}
              placeholder="เช่น มีไข้สูง หนาวสั่น เจ็บคอมาก กลืนน้ำลายเจ็บ ไม่มีน้ำมูก..."
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                กำลังคำนวณสำหรับน้ำหนัก: <strong className="text-slate-800 font-bold">{metrics.weight || 0} กก.</strong>
                {metrics.isPediatric ? ' (สูตรยาเด็ก)' : ' (สูตรยาผู้ใหญ่)'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || (!symptomInput.trim() && !selectedPresetId)}
              className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังวิเคราะห์และคำนวณยา...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>วินิจฉัยและคำนวณสั่งยา (Dx & Rx)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Diagnosis Results Card */}
      {diagnosis && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all animate-fadeIn">
          {/* Header Bar */}
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {diagnosis.primaryDiagnosis}
                  </h3>
                  <span className="bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded font-mono font-semibold">
                    ICD-10: {diagnosis.icd10}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {diagnosis.clinicalRationale}
                </p>
              </div>
            </div>

            {/* Severity Level & Actions */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                  diagnosis.severityLevel === 'severe_redflag'
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : diagnosis.severityLevel === 'moderate'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {diagnosis.severityLevel === 'severe_redflag'
                  ? '🚨 สัญญาณอันตราย (พิจารณาส่งต่อ รพช./รพท.)'
                  : diagnosis.severityLevel === 'moderate'
                  ? '⚠️ ระดับปานกลาง (ติดตามอาการใกล้ชิด)'
                  : '✅ ระดับปฐมภูมิ (ดูแลรักษาที่ รพ.สต. ได้)'}
              </span>

              {/* Print buttons */}
              <button
                type="button"
                onClick={onOpenPrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>พิมพ์ใบสั่งยา</span>
              </button>
              <button
                type="button"
                onClick={onOpenLabels}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>พิมพ์ฉลากยา</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* HOSxP XE & สปสช. e-Claim Helper Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                    HOSxP XE
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    รหัส ICD-10 ส่งเคลม สปสช.: <span className="text-emerald-800 font-mono text-base font-black">{diagnosis.icd10}</span>
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
                    Diag Type: 1 (Principal Dx)
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {diagnosis.icd10.startsWith('T') || diagnosis.icd10.startsWith('S') ? (
                    <span className="text-amber-800 font-medium">
                      ⚠️ เคสอุบัติเหตุ/แผล: ใน HOSxP XE ต้องคีย์คู่กับ <strong>Diag Type: 5 (External Cause: W01.9)</strong> และ <strong>ICD-9: 96.59</strong> เพื่อให้ สปสช. อนุมัติเบิกจ่าย
                    </span>
                  ) : (
                    <span>
                      โรคหลักผ่านเกณฑ์ตรวจสอบ e-Claim สปสช. ปฐมภูมิ • รหัสหัตถการคู่กัน: <strong>ICD-9: 89.07</strong>
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyHosxpInfo}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  copiedHosxp
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-500'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
                }`}
              >
                {copiedHosxp ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>คัดลอกลง HOSxP XE แล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-600" />
                    <span>คัดลอกข้อมูลลง HOSxP XE</span>
                  </>
                )}
              </button>
            </div>

            {/* Red Flags Alert Box (If present) */}
            {diagnosis.redFlags && diagnosis.redFlags.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>สัญญาณอันตรายและเกณฑ์ส่งต่อ รพ.แม่ข่าย (Red Flags & Referral Criteria)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-rose-900">
                  {diagnosis.redFlags.map((flag, idx) => (
                    <li key={idx} className="font-medium">
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prescribed Medications Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Pill className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-800">
                    รายการยาที่สั่งจ่าย (คำนวณตามน้ำหนัก {metrics.weight} กก. จากกรอบยา รพ.สต.)
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {diagnosis.prescriptions.length} รายการ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMedModal(true)}
                  className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มยาจากคลัง 106 รายการ</span>
                </button>
              </div>

              {diagnosis.prescriptions.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  ไม่มีรายการยาที่แนะนำสำหรับเคสนี้ (เน้นการดูแลแบบไม่ใช้ยา)
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">#</th>
                        <th className="py-2.5 px-3 font-semibold">ชื่อยา (รพ.สต.)</th>
                        <th className="py-2.5 px-3 font-semibold">ขนาดยาที่คำนวณตามน้ำหนัก</th>
                        <th className="py-2.5 px-3 font-semibold">วิธีรับประทาน</th>
                        <th className="py-2.5 px-3 font-semibold">จำนวน</th>
                        <th className="py-2.5 px-3 font-semibold">คำเตือนเฉพาะ</th>
                        <th className="py-2.5 px-2 text-center font-semibold">ลบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {diagnosis.prescriptions.map((rx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-900">{rx.medicationName}</span>
                              {rx.isHerbal && (
                                <span className="inline-flex items-center text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold border border-teal-200">
                                  <Leaf className="w-2.5 h-2.5 mr-0.5" />
                                  สมุนไพร
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{rx.thaiName}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-emerald-800">
                            {rx.calculatedDose}
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <div>{rx.frequency}</div>
                            <div className="text-[11px] text-slate-500">{rx.instructions}</div>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">
                            {rx.amountToDispense}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-amber-700 max-w-[180px]">
                            {rx.warning || '-'}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePrescription(idx)}
                              title="ลบรายการยานี้"
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Non-Pharmacological Advice & Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-4">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                  คำแนะนำการปฏิบัติตัวสำหรับผู้ป่วย (Health Advice)
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                  {diagnosis.nonPharmAdvice.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-4">
                <h4 className="text-xs font-bold text-blue-900 flex items-center mb-2">
                  <Info className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                  การสังเกตอาการและการมาตรวจซ้ำ (Follow-up Plan)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {diagnosis.followUpAdvice}
                </p>
                <div className="p-2 bg-white rounded border border-blue-200 text-[11px] text-blue-800 flex items-center">
                  <span className="font-semibold mr-1">เบอร์ฉุกเฉิน:</span> หากมีอาการวิกฤตเฉียบพลันให้โทร 1669 ทันที
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication from 106 List Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  เลือกยาเพิ่มเติมจากคลังยา รพ.สต. (106 รายการ)
                </h3>
                <p className="text-xs text-slate-500">
                  ค้นหาและเลือกยาเพื่อเพิ่มลงในใบสั่งยาปัจจุบัน
                </p>
              </div>
              <button
                onClick={() => setShowAddMedModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <input
                type="text"
                placeholder="ค้นหาชื่อยา, ชื่อสามัญ, สรรพคุณ เช่น พารา, amoxi, ท้องอืด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
              {filteredMeds.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  ไม่พบรายการยาที่ตรงกับคำค้นหา
                </div>
              ) : (
                filteredMeds.map((med) => (
                  <div
                    key={med.id}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-slate-400">#{med.itemNumber}</span>
                        <span className="text-sm font-bold text-slate-800">{med.name}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {med.categoryLabel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{med.thaiName}</div>
                      <div className="text-[11px] text-slate-400">
                        {med.indications.slice(0, 2).join(', ')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddMedication(med)}
                      className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เลือกยานี้</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddMedModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
