import React, { useState } from 'react';
import {
  Stethoscope,
  Pill,
  Calculator,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Scale,
  FileText
} from 'lucide-react';
import { PatientMetrics } from '../types.ts';

interface SidebarProps {
  activeTab: 'diagnose' | 'icd10' | 'dosing_calc' | 'guidelines';
  setActiveTab: (tab: 'diagnose' | 'icd10' | 'dosing_calc' | 'guidelines') => void;
  onReset: () => void;
  metrics: PatientMetrics;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  metrics
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const navItems = [
    {
      id: 'diagnose' as const,
      shortLabel: 'วินิจฉัย/สั่งยา',
      subText: 'Dx & Rx',
      icon: Stethoscope,
      badge: null
    },
    {
      id: 'icd10' as const,
      shortLabel: 'ICD-10',
      subText: 'HOSxP / สปสช.',
      icon: FileText,
      badge: 'e-Claim'
    },
    {
      id: 'dosing_calc' as const,
      shortLabel: 'คำนวณยา',
      subText: 'ตาม นน.',
      icon: Calculator,
      badge: null
    },
    {
      id: 'guidelines' as const,
      shortLabel: 'เกณฑ์ส่งต่อ',
      subText: 'Red Flags',
      icon: AlertTriangle,
      badge: null
    }
  ];

  const handleSelectTab = (id: 'diagnose' | 'icd10' | 'dosing_calc' | 'guidelines') => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Top Header (with Drawer Toggle) */}
      <div className="md:hidden bg-emerald-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md no-print">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="font-bold text-sm tracking-tight">รพ.สต. Dx & Rx</span>
            <span className="text-[10px] text-emerald-200 block">กรอบยา 106 รายการ</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-[11px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 border border-emerald-700">
            {metrics.weight ? `${metrics.weight} กก.` : '-'}
          </div>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white"
            title="เริ่มเคสใหม่"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden no-print"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Slide-out */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-emerald-900 text-white flex flex-col justify-between transition-all duration-200 ease-in-out no-print w-60 border-r border-emerald-800/80 shadow-lg md:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Branding */}
        <div>
          <div className="p-4 border-b border-emerald-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-inner border border-emerald-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
                  รพ.สต. Dx & Rx
                </h1>
                <p className="text-[11px] text-emerald-300 font-medium">
                  ยา 106 รายการ
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpenMobile(false)}
              className="md:hidden text-emerald-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Patient Physical Summary in Sidebar */}
          <div className="mx-3 my-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/70 text-xs">
            <div className="flex items-center justify-between text-[11px] text-emerald-300 mb-1">
              <span className="flex items-center">
                <Scale className="w-3 h-3 mr-1 text-emerald-400" />
                นน./สส. ปัจจุบัน:
              </span>
              <span className="font-semibold text-emerald-200">
                {metrics.isPediatric ? '👶 เด็ก' : '🧑 ผู้ใหญ่'}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono font-bold text-white">
              <span>{metrics.weight || 0} กก.</span>
              <span className="text-emerald-500">•</span>
              <span>{metrics.height || 0} ซม.</span>
              <span className="text-emerald-500">•</span>
              <span className="text-emerald-300 text-[11px]">BMI {metrics.bmi || '-'}</span>
            </div>
          </div>

          {/* Navigation Items (Short Abbreviations) */}
          <nav className="px-2 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/60'
                      : 'text-emerald-100 hover:bg-emerald-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-emerald-300'
                      }`}
                    />
                    <div className="text-left">
                      <div className="leading-tight">{item.shortLabel}</div>
                      <div className="text-[10px] text-emerald-400 font-normal">
                        {item.subText}
                      </div>
                    </div>
                  </div>

                  {item.badge ? (
                    <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-mono border border-emerald-700">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Privacy */}
        <div className="p-3 border-t border-emerald-800/80 space-y-2">
          {/* New Case Button */}
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-700 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
            <span>เคสใหม่ (รีเซ็ต)</span>
          </button>

          {/* Privacy Note */}
          <div className="flex items-center justify-center space-x-1 text-[11px] text-emerald-300/80 pt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>ไม่มีข้อมูลส่วนตัว (No PII)</span>
          </div>
        </div>
      </aside>
    </>
  );
};
