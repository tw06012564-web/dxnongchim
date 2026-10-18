import React, { useState } from 'react';
import { Activity, Scale, ChevronDown, ChevronUp, AlertCircle, HeartPulse, Thermometer, ShieldAlert } from 'lucide-react';
import { PatientMetrics } from '../types.ts';
import { computeBmi, computeBsa, isPediatricPatient } from '../utils/calculator.ts';

interface PatientMetricsBarProps {
  metrics: PatientMetrics;
  onChange: (updated: Partial<PatientMetrics>) => void;
}

export const PatientMetricsBar: React.FC<PatientMetricsBarProps> = ({ metrics, onChange }) => {
  const [showVitals, setShowVitals] = useState(false);

  const bmiInfo = computeBmi(metrics.weight, metrics.height);
  const bsa = computeBsa(metrics.weight, metrics.height);
  const isPediatric = isPediatricPatient(metrics.weight, metrics.height);

  const handleWeightChange = (val: number) => {
    const w = Math.max(0, val);
    const newBmiInfo = computeBmi(w, metrics.height);
    const newBsa = computeBsa(w, metrics.height);
    const newIsPediatric = isPediatricPatient(w, metrics.height);
    onChange({
      weight: w,
      bmi: newBmiInfo.bmi,
      bmiStatus: newBmiInfo.status,
      bsa: newBsa,
      isPediatric: newIsPediatric
    });
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(0, val);
    const newBmiInfo = computeBmi(metrics.weight, h);
    const newBsa = computeBsa(metrics.weight, h);
    const newIsPediatric = isPediatricPatient(metrics.weight, h);
    onChange({
      height: h,
      bmi: newBmiInfo.bmi,
      bmiStatus: newBmiInfo.status,
      bsa: newBsa,
      isPediatric: newIsPediatric
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6 transition-all">
      {/* Top Banner: No Personal Data Note */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              ข้อมูลสรีรวิทยาเพื่อคำนวณยา (Physical Metrics Only)
            </h2>
            <p className="text-xs text-slate-500">
              ไม่มีการเก็บข้อมูลส่วนบุคคล (ชื่อ/เลขบัตร) ต้องการเพียงน้ำหนักและส่วนสูงเพื่อความปลอดภัยในการคำนวณขนาดยา
            </p>
          </div>
        </div>

        {/* Pediatric vs Adult Classification Badge */}
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border ${
              isPediatric
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-blue-100 text-blue-900 border-blue-300'
            }`}
          >
            {isPediatric ? '👶 กลุ่มเด็ก / กุมารเวช (นน. < 35 กก.)' : '🧑 กลุ่มผู้ใหญ่ (นน. ≥ 35 กก.)'}
          </span>
        </div>
      </div>

      {/* Main Metric Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Weight Input (Primary required) */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              น้ำหนักตัว (Weight)
            </label>
            <span className="text-xs font-bold text-emerald-700">กก. (kg)</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="250"
              step="0.5"
              value={metrics.weight || ''}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
              placeholder="เช่น 55"
              className="w-full text-2xl font-bold text-slate-800 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {/* Quick weight selector chips */}
          <div className="flex items-center space-x-1 mt-2 text-xs">
            <span className="text-slate-400">ด่วน:</span>
            {[10, 15, 25, 45, 55, 65, 75].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => handleWeightChange(w)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  metrics.weight === w
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Height Input (Primary required) */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              ส่วนสูง (Height)
            </label>
            <span className="text-xs font-bold text-emerald-700">ซม. (cm)</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="30"
              max="230"
              step="1"
              value={metrics.height || ''}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
              placeholder="เช่น 165"
              className="w-full text-2xl font-bold text-slate-800 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {/* Quick height selector chips */}
          <div className="flex items-center space-x-1 mt-2 text-xs">
            <span className="text-slate-400">ด่วน:</span>
            {[80, 100, 120, 150, 160, 170].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleHeightChange(h)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  metrics.height === h
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Computed BMI Display */}
        <div className={`p-3 rounded-lg border ${bmiInfo.color}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-700">ดัชนีมวลกาย (BMI)</span>
            <span className="text-[11px] text-slate-500">kg/m²</span>
          </div>
          <div className="text-2xl font-bold">
            {bmiInfo.bmi > 0 ? bmiInfo.bmi : '-'}
          </div>
          <div className="text-xs font-semibold mt-1 truncate">
            {bmiInfo.status}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            พื้นที่ผิวกาย (BSA): {bsa > 0 ? `${bsa} m²` : '-'}
          </div>
        </div>

        {/* Allergy & Chronic Diseases Safety Box */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <label className="text-xs font-semibold text-slate-800">
              ประวัติแพ้ยา / ข้อห้ามใช้
            </label>
          </div>
          <input
            type="text"
            value={metrics.drugAllergies || ''}
            onChange={(e) => onChange({ drugAllergies: e.target.value })}
            placeholder="เช่น แพ้เพนิซิลลิน, แพ้ซัลฟา, G6PD"
            className="w-full text-xs bg-white border border-rose-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-slate-400"
          />
          <div className="mt-1.5">
            <input
              type="text"
              value={metrics.chronicDiseases || ''}
              onChange={(e) => onChange({ chronicDiseases: e.target.value })}
              placeholder="โรคประจำตัว: เช่น ความดัน, เบาหวาน, โรคไต"
              className="w-full text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Expandable Clinical Vital Signs (Optional but recommended for accurate diagnosis) */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowVitals(!showVitals)}
          className="flex items-center text-xs font-medium text-emerald-800 hover:text-emerald-900 transition-colors focus:outline-none"
        >
          <HeartPulse className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          <span>{showVitals ? 'ซ่อนสัญญาณชีพ (Vital Signs)' : 'ระบุสัญญาณชีพเพิ่มเติม (ความดัน, ไข้, ชีพจร)'}</span>
          {showVitals ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
        </button>

        {showVitals && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="text-[11px] font-medium text-slate-600 flex items-center mb-1">
                <Thermometer className="w-3 h-3 mr-1 text-amber-500" />
                อุณหภูมิ (°C)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="เช่น 37.8"
                value={metrics.vitalSigns?.temp || ''}
                onChange={(e) =>
                  onChange({
                    vitalSigns: { ...metrics.vitalSigns, temp: parseFloat(e.target.value) || undefined }
                  })
                }
                className="w-full text-sm bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                ความดันบน SBP (mmHg)
              </label>
              <input
                type="number"
                placeholder="เช่น 120"
                value={metrics.vitalSigns?.sbp || ''}
                onChange={(e) =>
                  onChange({
                    vitalSigns: { ...metrics.vitalSigns, sbp: parseInt(e.target.value, 10) || undefined }
                  })
                }
                className={`w-full text-sm bg-white border rounded px-2 py-1 focus:outline-none ${
                  (metrics.vitalSigns?.sbp || 0) >= 140
                    ? 'border-rose-400 text-rose-700 font-bold'
                    : 'border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                ความดันล่าง DBP (mmHg)
              </label>
              <input
                type="number"
                placeholder="เช่น 80"
                value={metrics.vitalSigns?.dbp || ''}
                onChange={(e) =>
                  onChange({
                    vitalSigns: { ...metrics.vitalSigns, dbp: parseInt(e.target.value, 10) || undefined }
                  })
                }
                className="w-full text-sm bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                ชีพจร Pulse (bpm)
              </label>
              <input
                type="number"
                placeholder="เช่น 82"
                value={metrics.vitalSigns?.pulse || ''}
                onChange={(e) =>
                  onChange({
                    vitalSigns: { ...metrics.vitalSigns, pulse: parseInt(e.target.value, 10) || undefined }
                  })
                }
                className="w-full text-sm bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
