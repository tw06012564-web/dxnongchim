import React, { useState } from 'react';
import { AlertTriangle, Ambulance, ShieldAlert, HeartPulse, Baby, PhoneCall, CheckCircle2, ChevronRight, FileCheck } from 'lucide-react';
import { COMMON_PRIMARY_CARE_PROTOCOLS } from '../data/clinicalGuidelines.ts';

export const ReferralGuide: React.FC = () => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('common-cold');

  const selected = COMMON_PRIMARY_CARE_PROTOCOLS.find((p) => p.id === selectedProtocolId) || COMMON_PRIMARY_CARE_PROTOCOLS[0];

  const emergencyCategories = [
    {
      title: '🚨 หัวใจและหลอดเลือด (Cardiovascular Emergency)',
      color: 'border-rose-300 bg-rose-50/70 text-rose-950',
      items: [
        'เจ็บแน่นหน้าอกรุนแรงเหมือนมีอะไรมาทับ ร้าวไปกรามหรือแขนซ้าย ร่วมกับเหงื่อแตกตัวเย็น (สงสัยกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน STEMI/NSTEMI)',
        'ความดันโลหิตสูงวิกฤต: SBP ≥ 180 mmHg หรือ DBP ≥ 120 mmHg ร่วมกับปวดศีรษะรุนแรง ตามัว อาเจียนพุ่ง (Hypertensive Crisis / Encephalopathy)',
        'แขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว พูดไม่ชัด หรือสับสนเฉียบพลัน (Fast Track Stroke ส่งต่อภายใน 4.5 ชั่วโมง!)',
        'ชีพจรช้าผิดปกติ < 40 bpm หรือเร็ว > 150 bpm ร่วมกับหน้ามืด เป็นลม หมดสติ'
      ]
    },
    {
      title: '🫁 ทางเดินหายใจวิกฤต (Respiratory Distress)',
      color: 'border-blue-300 bg-blue-50/70 text-blue-950',
      items: [
        'หายใจหอบเหนื่อย อัตราการหายใจ > 30 ครั้ง/นาที ปีกจมูกบาน หน้าอกบุ๋ม ชายโครงบุ๋ม',
        'เสียงหายใจดังฮืด (Stridor) หรือวี้ด (Wheezing) รุนแรง พ่นยาขยายหลอดลมแล้วไม่ดีขึ้น',
        'ริมฝีปาก เล็บ หรือใบหน้าเขียวคล้ำ (Cyanosis)',
        'ไอเป็นเลือดสดปริมาณมาก'
      ]
    },
    {
      title: '🤢 ทางเดินอาหารและช่องท้องเฉียบพลัน (Acute Abdomen & Dehydration)',
      color: 'border-amber-300 bg-amber-50/70 text-amber-950',
      items: [
        'ปวดท้องรุนแรง ท้องเกร็งแข็งเหมือนแผ่นกระดาน กดเจ็บปล่อยเจ็บ (Rebound tenderness) สงสัยไส้ติ่งแตก กระเพาะทะลุ',
        'อาเจียนเป็นเลือดสด หรือสีกาแฟ (Coffee-ground) หรือถ่ายอุจจาระดำเหนียวคล้ายยางมะตอย',
        'ภาวะขาดน้ำรุนแรงจากอุจจาระร่วง: ความดันตก ชีพจรเบาเร็ว ปัสสาวะไม่ออกนานเกิน 6 ชม. ซึม หมดสติ',
        'อาเจียนพุ่งเขียว เป็นน้ำดี หรือไม่ผายลม ไม่ถ่ายอุจจาระ ท้องอืดตึงมาก (สงสัยลำไส้อุดตัน)'
      ]
    },
    {
      title: '👶 กุมารเวชฉุกเฉินในเด็ก (Pediatric Emergencies)',
      color: 'border-purple-300 bg-purple-50/70 text-purple-950',
      items: [
        'เด็กมีไข้สูงร่วมกับอาการชักเกร็ง หรือชักซ้ำหลายครั้ง',
        'เด็กซึมลงมาก ไม่ยอมดูดนม ร้องกวนตลอดเวลาโดยไม่ทราบสาเหตุ หรือกระหม่อมหน้าโป่งตึง',
        'มีจุดเลือดออกสีแดงคล้ำตามตัว (Petechiae / Purpura) สงสัยไข้เลือดออกหรือไข้กาฬหลังแอ่น',
        'สงสัยสิ่งแปลกปลอมอุดกั้นทางเดินหายใจ ไอสำลัก หายใจมีเสียงแปลก'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Ambulance className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                เกณฑ์สัญญาณอันตรายและการส่งต่อผู้ป่วย รพ.สต. (Red Flags & Referral Protocol)
              </h2>
              <p className="text-xs text-slate-500">
                แนวทางความปลอดภัยทางคลินิกเมื่อผู้ป่วยมีอาการเกินศักยภาพของสถานพยาบาลปฐมภูมิ เพื่อส่งต่อไปยัง รพช./รพท.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-rose-50 text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-bold">
            <PhoneCall className="w-4 h-4 text-rose-600 mr-1" />
            <span>สายด่วนการแพทย์ฉุกเฉิน: 1669</span>
          </div>
        </div>
      </div>

      {/* Emergency Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyCategories.map((cat, idx) => (
          <div key={idx} className={`p-5 rounded-xl border ${cat.color} space-y-3 shadow-xs`}>
            <h3 className="text-sm font-bold flex items-center">
              {cat.title}
            </h3>
            <ul className="space-y-2 text-xs">
              {cat.items.map((item, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Preparation for Referral (IV Fluids & First Aid from 106 list) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
          <FileCheck className="w-4 h-4 mr-2 text-emerald-700" />
          การเตรียมตัวและการปฐมพยาบาลเบื้องต้นที่ รพ.สต. ก่อนส่งต่อ (ด้วยเวชภัณฑ์ 106 รายการ)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">1. สารน้ำกู้ชีพ (IV Fluid):</strong>
            <p className="text-slate-600">
              กรณีช็อกหรือขาดน้ำรุนแรง เปิดเส้นด้วย <strong>#52 NSS 0.9% (IV)</strong> หรือ <strong>#55 Ringer's Acetate</strong> รายงาน รพ.แม่ข่าย
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">2. แผลสด/อุบัติเหตุ:</strong>
            <p className="text-slate-600">
              ห้ามเลือด ล้างแผลด้วย <strong>#53 NSS Irrigation</strong> ปิดผ้าก๊อซสะอาด และพิจารณา <strong>#78 Td vaccine</strong>
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">3. บันทึกและส่งต่อ:</strong>
            <p className="text-slate-600">
              วัดสัญญาณชีพ V/S ทุก 15 นาที เขียนใบส่งต่อ (Referral slip) สรุปประวัติและยาที่ให้ก่อนส่งตัว
            </p>
          </div>
        </div>
      </div>

      {/* Disease Protocols Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">
          แนวทางการดูแลรักษาและเกณฑ์ส่งต่อเฉพาะรายโรค (Disease-Specific Guidelines)
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {COMMON_PRIMARY_CARE_PROTOCOLS.map((proto) => (
            <button
              key={proto.id}
              onClick={() => setSelectedProtocolId(proto.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedProtocolId === proto.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {proto.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Selected Protocol Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">{selected.name}</h4>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
              ICD-10: {selected.icd10}
            </span>
          </div>

          <div>
            <strong className="text-slate-700 block mb-1">อาการสำคัญและลักษณะทางคลินิก:</strong>
            <div className="text-slate-600">{selected.commonSymptoms.join(', ')}</div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-950">
            <strong className="text-rose-900 block mb-1 font-bold">
              🚨 สัญญาณอันตรายที่ต้องส่งต่อ รพ.แม่ข่าย (Red Flags for Referral):
            </strong>
            <ul className="list-disc list-inside space-y-1">
              {selected.redFlagsForReferral.map((rf, i) => (
                <li key={i}>{rf}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950">
            <strong className="text-emerald-900 block mb-1 font-bold">
              🌿 คำแนะนำการดูแลสุขภาพและปฏิบัติตัว (Patient Advice):
            </strong>
            <ul className="list-disc list-inside space-y-1">
              {selected.nonPharmAdvice.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
