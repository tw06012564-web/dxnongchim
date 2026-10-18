import React, { useState } from 'react';
import { Calculator, Scale, AlertCircle, Baby, User, Info, CheckCircle2 } from 'lucide-react';
import { PatientMetrics } from '../types.ts';
import { computeBmi, computeBsa, calculateParacetamolDose } from '../utils/calculator.ts';

interface WeightDosingCalculatorProps {
  metrics: PatientMetrics;
  onUpdateMetrics: (updated: Partial<PatientMetrics>) => void;
}

export const WeightDosingCalculator: React.FC<WeightDosingCalculatorProps> = ({ metrics, onUpdateMetrics }) => {
  const [calcWeight, setCalcWeight] = useState<number>(metrics.weight || 20);
  const [calcHeight, setCalcHeight] = useState<number>(metrics.height || 120);

  const handleSyncWithCurrent = () => {
    onUpdateMetrics({ weight: calcWeight, height: calcHeight });
  };

  const bmiInfo = computeBmi(calcWeight, calcHeight);
  const bsa = computeBsa(calcWeight, calcHeight);
  const isPediatric = calcWeight < 35;

  // Calculators:
  // 1. Paracetamol Syrup (120mg/5ml = 24mg/ml): 10-15 mg/kg -> ml = (weight * 10 to 15) / 24
  const paraSyrupMinMl = Number(((calcWeight * 10) / 24).toFixed(1));
  const paraSyrupMaxMl = Number(((calcWeight * 15) / 24).toFixed(1));
  const paraSyrupAvgMl = Math.round((calcWeight * 12.5) / 24);
  const paraSpoons = (paraSyrupAvgMl / 5).toFixed(1);

  // 2. Ibuprofen Suspension (100mg/5ml = 20mg/ml): 10 mg/kg -> ml = weight * 0.5
  const ibuSyrupMl = Number((calcWeight * 0.5).toFixed(1));
  const ibuSpoons = (ibuSyrupMl / 5).toFixed(1);

  // 3. Amoxicillin Dry Syrup (125mg/5ml = 25mg/ml): 25-50 mg/kg/day divided 3 doses -> ml per dose
  const amoxDailyMinMg = calcWeight * 25;
  const amoxDailyMaxMg = calcWeight * 50;
  const amoxMlPerDoseMin = Number(((amoxDailyMinMg / 3) / 25).toFixed(1));
  const amoxMlPerDoseMax = Number(((amoxDailyMaxMg / 3) / 25).toFixed(1));

  // 4. Dicloxacillin Dry Syrup (62.5mg/5ml = 12.5mg/ml): 25-50 mg/kg/day divided 4 doses -> ml per dose
  const dicloxDailyMinMg = calcWeight * 25;
  const dicloxDailyMaxMg = calcWeight * 50;
  const dicloxMlPerDoseMin = Number(((dicloxDailyMinMg / 4) / 12.5).toFixed(1));
  const dicloxMlPerDoseMax = Number(((dicloxDailyMaxMg / 4) / 12.5).toFixed(1));

  // 5. Domperidone suspension (5mg/5ml = 1mg/ml): 0.25 mg/kg/dose -> ml = weight * 0.25
  const domperMl = Number((calcWeight * 0.25).toFixed(1));

  // 6. ORS fluid deficit replacement for pediatric diarrhea: 50-100 ml/kg over 4 hours
  const ors4hMinMl = Math.round(calcWeight * 50);
  const ors4hMaxMl = Math.round(calcWeight * 100);

  // 7. Adult Paracetamol 500mg by weight
  let adultParaDose = '1 เม็ด (500 มก.) ทุก 4-6 ชม. เมื่อมีอาการ';
  let adultParaMaxPerDay = 'ไม่เกิน 4-5 เม็ด (2,000 - 2,500 มก./วัน)';
  if (calcWeight < 34) {
    adultParaDose = 'แนะนำใช้ยาพาราเซตามอลชนิดน้ำเชื่อม หรือเม็ด 325 มก. ตามน้ำหนักตัว';
  } else if (calcWeight <= 50) {
    adultParaDose = '1 เม็ด (500 มก.) ทุก 4-6 ชม. เมื่อมีอาการ';
    adultParaMaxPerDay = 'ไม่เกิน 5 เม็ด (2,500 มก./วัน)';
  } else if (calcWeight <= 67) {
    adultParaDose = '1.5 เม็ด (750 มก.) ทุก 4-6 ชม. เมื่อมีอาการ';
    adultParaMaxPerDay = 'ไม่เกิน 6 เม็ด (3,000 มก./วัน)';
  } else {
    adultParaDose = '2 เม็ด (1,000 มก.) ทุก 4-6 ชม. เมื่อมีอาการ';
    adultParaMaxPerDay = 'ไม่เกิน 8 เม็ด (4,000 มก./วัน)';
  }

  return (
    <div className="space-y-6">
      {/* Header and Live Weight Adjuster */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                เครื่องคำนวณขนาดยาตามน้ำหนักตัว รพ.สต. (Weight-based Dosing Calculator)
              </h2>
              <p className="text-xs text-slate-500">
                คำนวณขนาดยาน้ำเด็ก (Syrup/Suspension) และยาเม็ดผู้ใหญ่ตามมาตรฐานกระทรวงสาธารณสุขไทย
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncWithCurrent}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <span>ใช้น้ำหนักนี้ในหน้าตรวจวินิจฉัย</span>
          </button>
        </div>

        {/* Weight & Height Slider / Steppers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <Scale className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                น้ำหนักตัวที่ต้องการคำนวณ:
              </label>
              <span className="text-lg font-black text-emerald-800">{calcWeight} กก. (kg)</span>
            </div>
            <input
              type="range"
              min="2"
              max="120"
              step="0.5"
              value={calcWeight}
              onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>ทารก 2 กก.</span>
              <span>เด็กเล็ก 10-15 กก.</span>
              <span>เด็กโต 30 กก.</span>
              <span>ผู้ใหญ่ 60 กก.</span>
              <span>120 กก.</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                ส่วนสูง:
              </label>
              <span className="text-lg font-black text-emerald-800">{calcHeight} ซม. (cm)</span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              step="1"
              value={calcHeight}
              onChange={(e) => setCalcHeight(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>BMI: <strong>{bmiInfo.bmi}</strong> ({bmiInfo.status})</span>
              <span>BSA: <strong>{bsa} m²</strong></span>
              <span>กลุ่ม: <strong>{isPediatric ? 'เด็ก (<35 กก.)' : 'ผู้ใหญ่'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Pediatric Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200">
          <Baby className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-800">
            สูตรคำนวณยาน้ำสำหรับเด็ก (Pediatric Syrups & Suspensions) สำหรับน้ำหนัก {calcWeight} กก.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Paracetamol Syrup */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900">#71 พาราเซตามอลยาน้ำเด็ก</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">120 mg/5 ml</span>
            </div>
            <div className="text-xl font-black text-emerald-800 my-1">
              {paraSyrupAvgMl} มล. (ml)
            </div>
            <div className="text-xs font-medium text-emerald-700">
              ≈ {paraSpoons} ช้อนชา (ช่วงปลอดภัย: {paraSyrupMinMl} - {paraSyrupMaxMl} ml)
            </div>
            <p className="text-[11px] text-slate-600 mt-2 border-t border-emerald-200/60 pt-2">
              ทุก 4-6 ชม. เมื่อมีไข้หรือปวด (ไม่เกินวันละ 5 ครั้ง) ควรเช็ดตัวลดไข้ร่วมด้วย
            </p>
          </div>

          {/* Ibuprofen Suspension */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900">#67 ไอบูโพรเฟนยาน้ำเด็ก</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">100 mg/5 ml</span>
            </div>
            <div className="text-xl font-black text-amber-800 my-1">
              {ibuSyrupMl} มล. (ml)
            </div>
            <div className="text-xs font-medium text-amber-700">
              ≈ {ibuSpoons} ช้อนชา (สูตร: น้ำหนัก ÷ 2)
            </div>
            <p className="text-[11px] text-slate-600 mt-2 border-t border-amber-200/60 pt-2 text-rose-800">
              ⚠️ ทานหลังอาหารทันที ใช้เมื่อไข้สูง &gt; 38.5°C ห้ามใช้เด็ดขาดหากสงสัยไข้เลือดออก!
            </p>
          </div>

          {/* Amoxicillin Dry Syrup */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900">#59 อะม็อกซีซิลลินผงแห้งเด็ก</span>
              <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-mono">125 mg/5 ml</span>
            </div>
            <div className="text-xl font-black text-blue-800 my-1">
              {amoxMlPerDoseMin} - {amoxMlPerDoseMax} มล.
            </div>
            <div className="text-xs font-medium text-blue-700">
              วันละ 3 ครั้ง หลังอาหาร (เช้า-กลางวัน-เย็น)
            </div>
            <p className="text-[11px] text-slate-600 mt-2 border-t border-blue-200/60 pt-2">
              ผสมน้ำต้มสุกถึงขีด เขย่าก่อนรินยา ต้องทานติดต่อกันจนหมด 7-10 วัน ห้ามหยุดยาเอง
            </p>
          </div>

          {/* Dicloxacillin Dry Syrup */}
          <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900">#62 ไดคลอกซาซิลลินเด็ก (แผลหนอง)</span>
              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-mono">62.5 mg/5 ml</span>
            </div>
            <div className="text-xl font-black text-purple-800 my-1">
              {dicloxMlPerDoseMin} - {dicloxMlPerDoseMax} มล.
            </div>
            <div className="text-xs font-medium text-purple-700">
              วันละ 4 ครั้ง ก่อนอาหาร 1 ชม. (ตอนท้องว่าง)
            </div>
            <p className="text-[11px] text-slate-600 mt-2 border-t border-purple-200/60 pt-2">
              สำหรับแผลติดเชื้อพุพองที่ผิวหนัง ตุ่มหนอง ต้องทานตอนท้องว่างเท่านั้น
            </p>
          </div>

          {/* Domperidone Suspension */}
          <div className="bg-teal-50/50 border border-teal-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-900">#63 ดอมเพอริโดนยาน้ำเด็ก (แก้อาเจียน)</span>
              <span className="text-[10px] bg-teal-200 text-teal-900 px-2 py-0.5 rounded font-mono">5 mg/5 ml (1 mg/ml)</span>
            </div>
            <div className="text-xl font-black text-teal-800 my-1">
              {domperMl} มล. (ml)
            </div>
            <div className="text-xs font-medium text-teal-700">
              วันละ 3 ครั้ง ก่อนอาหาร 15-30 นาที
            </div>
            <p className="text-[11px] text-slate-600 mt-2 border-t border-teal-200/60 pt-2">
              เขย่าขวดก่อนรินยา รับประทานก่อนอาหาร หายอาเจียนแล้วหยุดยาได้
            </p>
          </div>

          {/* ORS for Pediatric Diarrhea */}
          <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-900">#70 ผงเกลือแร่ ORS เด็ก (ซอง 3.3g)</span>
              <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded font-mono">ชดเชยน้ำใน 4 ชม.</span>
            </div>
            <div className="text-xl font-black text-sky-800 my-1">
              {ors4hMinMl} - {ors4hMaxMl} มล.
            </div>
            <div className="text-xs font-medium text-sky-700">
              จิบช้าๆ ทีละน้อยตลอด 4 ชั่วโมงแรกหลังเริ่มท้องเสีย
            </div>
            <p className="text-[11px] text-slate-600 mt-2 border-t border-sky-200/60 pt-2">
              ชงกับน้ำต้มสุกที่เย็นแล้ว ป้อนทีละช้อน อย่าให้ดื่มรวดเดียวหมดแก้วเพื่อป้องกันการอาเจียน
            </p>
          </div>
        </div>
      </div>

      {/* Adult Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">
            เกณฑ์การคำนวณยาพาราเซตามอลผู้ใหญ่ตามน้ำหนักตัวจริง (สธ. ประเทศไทย)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`p-4 rounded-xl border ${calcWeight >= 34 && calcWeight <= 50 ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-700 mb-1">น้ำหนัก 34 - 50 กิโลกรัม</div>
            <div className="text-lg font-black text-slate-900">ครั้งละ 1 เม็ด (500 มก.)</div>
            <div className="text-xs text-slate-600 mt-1">ทุก 4-6 ชั่วโมง เวลามีไข้/ปวด</div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-2">
              สูงสุดไม่เกิน 5 เม็ด (2,500 มก./วัน)
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${calcWeight > 50 && calcWeight <= 67 ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-700 mb-1">น้ำหนัก 50 - 67 กิโลกรัม</div>
            <div className="text-lg font-black text-slate-900">ครั้งละ 1.5 เม็ด (750 มก.)</div>
            <div className="text-xs text-slate-600 mt-1">ทุก 4-6 ชั่วโมง เวลามีไข้/ปวด</div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-2">
              สูงสุดไม่เกิน 6 เม็ด (3,000 มก./วัน)
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${calcWeight > 67 ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-bold text-slate-700 mb-1">น้ำหนัก มากกว่า 67 กิโลกรัม</div>
            <div className="text-lg font-black text-slate-900">ครั้งละ 2 เม็ด (1,000 มก.)</div>
            <div className="text-xs text-slate-600 mt-1">ทุก 4-6 ชั่วโมง เวลามีไข้/ปวด</div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-2">
              สูงสุดไม่เกิน 8 เม็ด (4,000 มก./วัน)
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">ข้อควรระวังสำคัญสำหรับ รพ.สต.:</strong>{' '}
            ไม่ควรให้พาราเซตามอล 2 เม็ด (1,000 มก.) กับผู้ป่วยที่มีน้ำหนักน้อยกว่า 67 กิโลกรัม เพราะจะทำให้เกิดการสะสมพิษต่อตับ และห้ามทานติดต่อกันเกิน 5 วันโดยไม่จำเป็น
          </div>
        </div>
      </div>
    </div>
  );
};
