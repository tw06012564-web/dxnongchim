import React from 'react';
import { Printer, X, Stethoscope, AlertTriangle, CheckCircle2, Pill } from 'lucide-react';
import { PatientMetrics, DiagnosisResult } from '../types.ts';

interface PrescriptionPrintModalProps {
  metrics: PatientMetrics;
  diagnosis: DiagnosisResult;
  mode: 'rx_slip' | 'drug_labels';
  onClose: () => void;
}

export const PrescriptionPrintModal: React.FC<PrescriptionPrintModalProps> = ({
  metrics,
  diagnosis,
  mode,
  onClose
}) => {
  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col my-auto">
        {/* Controls bar (Hidden during print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {mode === 'rx_slip' ? 'ใบสั่งยาและคำแนะนำผู้ป่วย รพ.สต.' : 'ฉลากยามาตรฐาน รพ.สต. (Drug Dispensing Labels)'}
            </h3>
            <p className="text-xs text-slate-500">
              สามารถกดพิมพ์ออกเครื่องพิมพ์หรือบันทึกเป็น PDF ได้ทันที
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร (Print / PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {mode === 'rx_slip' ? (
            /* Prescription & Health Advice Slip */
            <div className="border border-slate-300 p-6 rounded-lg text-slate-900 space-y-5 print:border-none print:p-0">
              {/* Header */}
              <div className="text-center border-b pb-4 border-slate-300">
                <div className="text-xs font-semibold text-slate-500">กระทรวงสาธารณสุข • บริการปฐมภูมิ</div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                  โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.)
                </h1>
                <h2 className="text-sm font-bold text-slate-700">
                  ใบสั่งยาและคำแนะนำการดูแลสุขภาพ (Prescription & Patient Advice Slip)
                </h2>
                <div className="text-xs text-slate-500 mt-1">วันที่ออกเอกสาร: {currentDate}</div>
              </div>

              {/* Patient Physical Data (NO PII) */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:bg-white print:border-slate-300">
                <div>
                  <span className="text-slate-500 block">น้ำหนัก (Weight):</span>
                  <strong className="text-slate-900 text-sm">{metrics.weight} กก.</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ส่วนสูง (Height):</span>
                  <strong className="text-slate-900 text-sm">{metrics.height} ซม.</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">ดัชนีมวลกาย (BMI):</span>
                  <strong className="text-slate-900 text-sm">{metrics.bmi} ({metrics.bmiStatus})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">กลุ่มผู้ป่วย:</span>
                  <strong className="text-slate-900 text-sm">{metrics.isPediatric ? 'เด็ก (<35 กก.)' : 'ผู้ใหญ่'}</strong>
                </div>
              </div>

              {/* Vitals & Allergies if recorded */}
              <div className="flex flex-wrap gap-4 text-xs border-b pb-3 border-slate-200">
                <div>
                  <strong>สัญญาณชีพ (V/S):</strong>{' '}
                  {metrics.vitalSigns?.temp ? `T: ${metrics.vitalSigns.temp}°C ` : ''}
                  {metrics.vitalSigns?.sbp ? `BP: ${metrics.vitalSigns.sbp}/${metrics.vitalSigns.dbp} mmHg ` : ''}
                  {metrics.vitalSigns?.pulse ? `PR: ${metrics.vitalSigns.pulse} bpm` : 'ไม่ได้ระบุ'}
                </div>
                {metrics.drugAllergies && (
                  <div className="text-rose-700 font-bold">
                    ประวัติแพ้ยา: {metrics.drugAllergies}
                  </div>
                )}
              </div>

              {/* Diagnosis & ICD-10 HOSxP */}
              <div className="border-l-4 border-emerald-600 pl-3">
                <div className="text-xs text-slate-500 font-semibold">การวินิจฉัยโรค (HOSxP XE Diagnosis / สปสช. e-Claim):</div>
                <div className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>{diagnosis.primaryDiagnosis}</span>
                  <span className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 font-bold">
                    ICD-10: {diagnosis.icd10}
                  </span>
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                    Diag Type: 1
                  </span>
                </div>
              </div>

              {/* Prescription Items */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center">
                  <Pill className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  รายการยาที่จ่าย (Rx Medications):
                </h3>
                <table className="w-full text-xs text-left border border-slate-300">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-800">
                    <tr>
                      <th className="py-2 px-2.5 w-8">#</th>
                      <th className="py-2 px-2.5">ชื่อยา</th>
                      <th className="py-2 px-2.5">ขนาดยาตามน้ำหนัก</th>
                      <th className="py-2 px-2.5">วิธีรับประทาน</th>
                      <th className="py-2 px-2.5 w-16">จำนวน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {diagnosis.prescriptions.map((rx, i) => (
                      <tr key={i}>
                        <td className="py-2 px-2.5 text-slate-500 font-mono">{i + 1}</td>
                        <td className="py-2 px-2.5 font-bold text-slate-900">
                          {rx.medicationName}
                          <div className="text-[10px] text-slate-500 font-normal">{rx.thaiName}</div>
                        </td>
                        <td className="py-2 px-2.5 font-semibold text-emerald-800">{rx.calculatedDose}</td>
                        <td className="py-2 px-2.5 text-slate-700">
                          {rx.frequency} - {rx.instructions}
                          {rx.warning && <div className="text-[10px] text-amber-800">⚠️ {rx.warning}</div>}
                        </td>
                        <td className="py-2 px-2.5 font-medium">{rx.amountToDispense}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Health Guidance */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1 print:bg-white print:border-slate-300">
                <strong className="text-slate-800 block mb-1">คำแนะนำการดูแลสุขภาพและการปฏิบัติตัว:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {diagnosis.nonPharmAdvice.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              {/* Follow-up & Red Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 border border-blue-200 rounded bg-blue-50/50 print:bg-white">
                  <strong className="text-blue-900 block mb-0.5">การนัดตรวจซ้ำ:</strong>
                  <p className="text-slate-700">{diagnosis.followUpAdvice}</p>
                </div>
                <div className="p-2.5 border border-rose-200 rounded bg-rose-50/50 print:bg-white">
                  <strong className="text-rose-900 block mb-0.5">สัญญาณอันตรายที่ต้องรีบพบแพทย์:</strong>
                  <p className="text-slate-700">
                    {diagnosis.redFlags[0] || 'ไข้สูงไม่ลด เหนื่อยหอบ ทานไม่ได้ ชัก หรือซึมลง ให้รีบมาพบแพทย์ทันที'}
                  </p>
                </div>
              </div>

              {/* Signoff footer */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-b border-dotted border-slate-400 w-48 mx-auto mb-1"></div>
                  <div>ลงชื่อผู้ตรวจ / เจ้าหน้าที่สาธารณสุข</div>
                </div>
                <div>
                  <div className="border-b border-dotted border-slate-400 w-48 mx-auto mb-1"></div>
                  <div>ลงชื่อผู้จ่ายยา (รพ.สต.)</div>
                </div>
              </div>
            </div>
          ) : (
            /* Medication Dispensing Labels (Stickers 2-column format) */
            <div className="space-y-4">
              <div className="text-xs text-slate-500 mb-2 no-print">
                ฉลากยามาตรฐานขนาดติดซองยา/ขวดยา (รวม {diagnosis.prescriptions.length} ซอง)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnosis.prescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-slate-400 rounded-lg p-3 bg-white space-y-2 text-xs shadow-xs"
                  >
                    <div className="border-b border-slate-300 pb-1.5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">รพ.สต. (สถานพยาบาลปฐมภูมิ)</div>
                        <div className="text-[10px] text-slate-500">วันที่: {currentDate}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono border">
                          นน. {metrics.weight} กก.
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-black text-slate-900">{rx.medicationName}</div>
                      <div className="text-[11px] text-slate-600 font-semibold">{rx.thaiName}</div>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                      <div className="font-bold text-emerald-900 text-xs">
                        รับประทาน: {rx.calculatedDose}
                      </div>
                      <div className="text-slate-800 font-medium text-[11px] mt-0.5">
                        {rx.frequency}
                      </div>
                      <div className="text-slate-600 text-[10px] mt-0.5">
                        {rx.instructions}
                      </div>
                    </div>

                    {rx.warning && (
                      <div className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200">
                        <strong>คำเตือน:</strong> {rx.warning}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      <span>จำนวน: <strong>{rx.amountToDispense}</strong></span>
                      <span>เก็บให้พ้นมือเด็กและแสงแดด</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            ระบบเวชระเบียนและจ่ายยาปฐมภูมิ รพ.สต.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
