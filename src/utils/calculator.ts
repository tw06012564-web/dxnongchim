export function computeBmi(weightKg: number, heightCm: number) {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, status: 'ไม่ระบุ', color: 'gray' };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  // Asian BMI Standards
  if (bmi < 18.5) {
    return { bmi, status: 'น้ำหนักน้อย / ผอม', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  } else if (bmi <= 22.9) {
    return { bmi, status: 'น้ำหนักปกติ / สมส่วน', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  } else if (bmi <= 24.9) {
    return { bmi, status: 'น้ำหนักเกิน / ท้วม', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
  } else if (bmi <= 29.9) {
    return { bmi, status: 'โรคอ้วนระดับ 1', color: 'text-orange-700 bg-orange-50 border-orange-200' };
  } else {
    return { bmi, status: 'โรคอ้วนระดับ 2 (อันตราย)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }
}

// Mosteller Formula for BSA: sqrt( (height cm * weight kg) / 3600 )
export function computeBsa(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return 0;
  return Number(Math.sqrt((heightCm * weightKg) / 3600).toFixed(2));
}

// Check pediatric status (< 35 kg or height < 140 cm)
export function isPediatricPatient(weightKg: number, heightCm: number): boolean {
  if (weightKg > 0 && weightKg < 35) return true;
  if (heightCm > 0 && heightCm < 140 && weightKg < 40) return true;
  return false;
}

// Calculate Paracetamol dose based on weight
export function calculateParacetamolDose(weightKg: number): {
  syrupMl?: number;
  syrupSpoons?: string;
  tablets500?: string;
  tablets325?: string;
  instructions: string;
} {
  if (weightKg < 35) {
    // Paracetamol Syrup 120 mg / 5 ml (24 mg/ml) -> 10-15 mg/kg -> ~ 0.5 ml/kg
    const targetMg = weightKg * 12.5;
    const ml = Math.round(targetMg / 24);
    const spoons = (ml / 5).toFixed(1);
    return {
      syrupMl: ml,
      syrupSpoons: spoons,
      instructions: `ยาน้ำเชื่อม 120 มก./5 มล. ครั้งละ ${ml} มล. (ประมาณ ${spoons} ช้อนชา) ทุก 4-6 ชม. เมื่อมีไข้หรือปวด`
    };
  } else if (weightKg < 50) {
    return {
      tablets500: "1 เม็ด (500 mg)",
      tablets325: "1-1.5 เม็ด (325-487.5 mg)",
      instructions: "พาราเซตามอล 500 มก. ครั้งละ 1 เม็ด ทุก 4-6 ชม. เมื่อมีอาการ (หรือ 325 มก. 1.5 เม็ด)"
    };
  } else if (weightKg <= 67) {
    return {
      tablets500: "1.5 เม็ด (750 mg)",
      instructions: "พาราเซตามอล 500 มก. ครั้งละ 1.5 เม็ด ทุก 4-6 ชม. เมื่อมีอาการ (ห้ามเกิน 8 เม็ด/วัน)"
    };
  } else {
    return {
      tablets500: "2 เม็ด (1,000 mg)",
      instructions: "พาราเซตามอล 500 มก. ครั้งละ 2 เม็ด ทุก 4-6 ชม. เมื่อมีอาการ (ห้ามเกิน 8 เม็ด/วัน)"
    };
  }
}
