import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Info,
  ExternalLink,
  Tag,
  Stethoscope,
  Scissors
} from 'lucide-react';
import { HOSXP_ICD10_LIST, Icd10Item } from '../data/hosxpIcd10.ts';

export const Icd10HosxpBrowser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'respiratory', label: 'ทางเดินหายใจ (หวัด/คอ/ไอ)' },
    { key: 'gi', label: 'ทางเดินอาหาร (ท้องเสีย/กระเพาะ)' },
    { key: 'musculoskeletal', label: 'กล้ามเนื้อ/ข้อ (ปวดหลัง/เกาต์)' },
    { key: 'skin', label: 'ผิวหนัง (ผื่น/เชื้อรา/หิด)' },
    { key: 'ncd', label: 'โรคเรื้อรัง (ความดัน/เบาหวาน)' },
    { key: 'injury_wound', label: 'อุบัติเหตุ/บาดแผล' },
    { key: 'family_planning', label: 'วางแผนครอบครัว/ยาคุม' },
    { key: 'health_check', label: 'ส่งเสริมสุขภาพ/เลิกบุหรี่' }
  ];

  const filteredList = useMemo(() => {
    return HOSXP_ICD10_LIST.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      if (!q) return matchCat;

      const matchSearch =
        item.code.toLowerCase().includes(q) ||
        item.nameTh.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.nhsoClaimTips.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopy = (item: Icd10Item) => {
    // Copy format optimized for HOSxP XE entry
    const copyString = `${item.code} : ${item.nameTh} (Diag Type: ${item.diagType})`;
    navigator.clipboard.writeText(copyString);
    setCopiedCode(item.code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleCopyCodeOnly = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-800">
                  คู่มือรหัส ICD-10 TM สำหรับ HOSxP XE (เคลม สปสช. ระดับปฐมภูมิ)
                </h2>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                  สปสช. e-Claim Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                รหัสโรคมาตรฐานพร้อมประเภทการวินิจฉัย (Diag Type 1-5) และรหัสหัตถการ ICD-9 สำหรับบันทึกลงโปรแกรม HOSxP / HOSxP XE เพื่อไม่ให้ติด C (Error)
              </p>
            </div>
          </div>
        </div>

        {/* NHSO Claiming Warning Alert Box */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1.5 text-amber-900">
          <div className="font-bold flex items-center text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5 flex-shrink-0" />
            <span>หลักเกณฑ์สำคัญในการบันทึก HOSxP XE เพื่อส่งเคลมกองทุน สปสช. (OPD / e-Claim):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-white/80 p-2 rounded border border-amber-200">
              <strong className="text-amber-950 block">1. เคสแผล/อุบัติเหตุ:</strong>
              ต้องระบุรหัส <strong>External Cause (V01-Y98)</strong> เป็น <strong>Diag Type: 5</strong> คู่กับรหัสแผล (T14.0/T14.1) เสมอ มิฉะนั้น e-Claim จะปฏิเสธการจ่าย
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-200">
              <strong className="text-amber-950 block">2. Principal Diagnosis:</strong>
              ต้องมี <strong>Diag Type: 1</strong> เพียง 1 รายการต่อ 1 Visit ซึ่งเป็นเหตุผลหลักที่ผู้ป่วยมารับบริการ
            </div>
            <div className="bg-white/80 p-2 rounded border border-amber-200">
              <strong className="text-amber-950 block">3. หัตถการ ICD-9-CM:</strong>
              หากมีการทำแผล ล้างแผล (96.59), เย็บแผล (86.59), ฉีดยา (99.18), หรือฉีดยาคุม (99.23) ต้องลงรหัสให้ตรงกับเวชภัณฑ์
            </div>
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหารหัส หรือชื่อโรค เช่น J00, หวัด, ท้องเสีย, T14.0, แผล, ความดัน, หกล้ม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Quick Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                selectedCategory === c.key
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {c.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ICD-10 List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 flex items-center space-x-2">
            <span>รายการรหัสที่ค้นพบ:</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              {filteredList.length} รหัส
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            คลิกปุ่ม <Copy className="w-3 h-3 inline text-slate-600 mx-0.5" /> เพื่อคัดลอกรหัสไปวางใน HOSxP XE ทันที
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-24">รหัส ICD-10</th>
                <th className="py-2.5 px-3 font-semibold">ชื่อโรคภาษาไทย (Thai Name)</th>
                <th className="py-2.5 px-3 font-semibold">ประเภทการวินิจฉัย (Diag Type)</th>
                <th className="py-2.5 px-3 font-semibold">หัตถการคู่กัน (ICD-9)</th>
                <th className="py-2.5 px-3 font-semibold">คำแนะนำการเคลม สปสช.</th>
                <th className="py-2.5 px-3 text-center font-semibold w-28">คัดลอกลง HOSxP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => {
                const isCopied = copiedCode === item.code;
                return (
                  <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleCopyCodeOnly(item.code)}
                        title="คลิกเพื่อคัดลอกเฉพาะรหัส"
                        className="font-mono text-sm font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 transition-colors block text-center"
                      >
                        {item.code}
                      </button>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.nameTh}</div>
                      <div className="text-[11px] text-slate-500">{item.nameEn}</div>
                      <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        {item.categoryLabel}
                      </span>
                    </td>

                    {/* Diag Type */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-[11px] font-bold border ${
                          item.diagType === 1
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : item.diagType === 5
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.diagTypeLabel}
                      </span>
                    </td>

                    {/* ICD-9 Procedures */}
                    <td className="py-3 px-3">
                      {item.icd9Procedures && item.icd9Procedures.length > 0 ? (
                        <div className="space-y-1">
                          {item.icd9Procedures.map((proc, idx) => (
                            <div key={idx} className="flex items-center space-x-1 text-[11px]">
                              <Scissors className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              <span className="font-mono font-bold text-slate-800">{proc.code}</span>
                              <span className="text-slate-500 truncate max-w-[140px]" title={proc.name}>
                                {proc.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    {/* NHSO Claim Tips */}
                    <td className="py-3 px-3 text-slate-700 max-w-[280px]">
                      <div className="text-[11px] leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
                        {item.nhsoClaimTips}
                      </div>
                    </td>

                    {/* Copy action */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleCopy(item)}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isCopied
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>คัดลอกแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>คัดลอก</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
