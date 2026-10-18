import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { MEDICATION_LIST } from "./src/data/medications.ts";
import { COMMON_PRIMARY_CARE_PROTOCOLS } from "./src/data/clinicalGuidelines.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper: Calculate BMI
function calculateBmi(weight: number, height: number) {
  if (!weight || !height || height <= 0) return { bmi: 0, status: "ไม่ระบุ" };
  const heightM = height / 100;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));
  let status = "สมส่วน / ปกติ";
  if (bmi < 18.5) status = "น้ำหนักน้อย / ผอม";
  else if (bmi >= 18.5 && bmi <= 22.9) status = "น้ำหนักปกติ / สมส่วน";
  else if (bmi >= 23 && bmi <= 24.9) status = "น้ำหนักเกิน / ท้วม";
  else if (bmi >= 25 && bmi <= 29.9) status = "อ้วนระดับ 1";
  else if (bmi >= 30) status = "อ้วนระดับ 2 (อันตราย)";
  return { bmi, status };
}

// Fallback Rule-Based Diagnosis Engine
function generateRuleBasedDiagnosis(
  weight: number,
  height: number,
  symptoms: string,
  presetId?: string,
  vitalSigns?: { temp?: number; sbp?: number; dbp?: number; pulse?: number },
  drugAllergies?: string
) {
  const isPediatric = weight < 35 || (height > 0 && height < 140);
  const symptomsLower = symptoms.toLowerCase();

  // Match protocol
  let matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === presetId);
  if (!matched) {
    if (symptomsLower.includes("หวัด") || symptomsLower.includes("น้ำมูก") || symptomsLower.includes("จาม") || symptomsLower.includes("คัดจมูก")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "common-cold");
    } else if (symptomsLower.includes("เจ็บคอ") || symptomsLower.includes("ทอนซิล") || symptomsLower.includes("กลืนเจ็บ")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "acute-pharyngitis-tonsillitis");
    } else if (symptomsLower.includes("ถ่าย") || symptomsLower.includes("ท้องเสีย") || symptomsLower.includes("ท้องร่วง") || symptomsLower.includes("ถ่ายเหลว")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "acute-gastroenteritis");
    } else if (symptomsLower.includes("กระเพาะ") || symptomsLower.includes("กรดไหลย้อน") || symptomsLower.includes("แสบท้อง") || symptomsLower.includes("จุกเสียด") || symptomsLower.includes("ลิ้นปี่")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "dyspepsia-gerd");
    } else if (symptomsLower.includes("ปวดเมื่อย") || symptomsLower.includes("ปวดหลัง") || symptomsLower.includes("เคล็ด") || symptomsLower.includes("กล้ามเนื้อ")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "myalgia-muscle-strain");
    } else if (symptomsLower.includes("เกาต์") || (symptomsLower.includes("ปวดข้อ") && symptomsLower.includes("บวมแดง"))) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "acute-gout-flare");
    } else if (symptomsLower.includes("ผื่น") || symptomsLower.includes("ลมพิษ") || symptomsLower.includes("คัน") || symptomsLower.includes("แพ้")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "allergic-rhinitis-urticaria");
    } else if (symptomsLower.includes("แผล") || symptomsLower.includes("ถลอก") || symptomsLower.includes("เลือดออก") || symptomsLower.includes("หกล้ม")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "acute-wound-abrasion");
    } else if (symptomsLower.includes("ความดัน") || (vitalSigns?.sbp && vitalSigns.sbp >= 140)) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "hypertension-routine-followup");
    } else if (symptomsLower.includes("เบาหวาน") || symptomsLower.includes("น้ำตาล")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "diabetes-type-2-followup");
    } else if (symptomsLower.includes("หิด") || symptomsLower.includes("เหา")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "scabies-lice");
    } else if (symptomsLower.includes("บุหรี่")) {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS.find(p => p.id === "smoking-cessation");
    } else {
      matched = COMMON_PRIMARY_CARE_PROTOCOLS[0];
    }
  }

  // Selected drug IDs for this weight category
  const targetDrugIds = isPediatric && matched?.recommendedMedicationIds.pediatric?.length
    ? matched.recommendedMedicationIds.pediatric
    : matched?.recommendedMedicationIds.adult || [];

  // Filter out any drugs user is allergic to
  const allergies = (drugAllergies || "").toLowerCase();

  const prescriptions = targetDrugIds
    .map(drugId => {
      const med = MEDICATION_LIST.find(m => m.id === drugId);
      if (!med) return null;

      // Check allergy warning
      if (allergies && (allergies.includes(med.name.toLowerCase()) || allergies.includes(med.genericName.toLowerCase()))) {
        return null;
      }

      // Compute exact dose based on weight
      let calculatedDose = med.standardAdultDose;
      let amountToDispense = "1 แผง (10 เม็ด)";

      if (isPediatric) {
        if (med.id === "paracetamol-syrup-120mg-5ml") {
          const ml = Math.round((weight * 12.5) / 24); // 10-15 mg/kg -> ~ 0.5 ml/kg
          const spoons = (ml / 5).toFixed(1);
          calculatedDose = `${ml} ml (${spoons} ช้อนชา) ทุก 4-6 ชม. เมื่อมีไข้`;
          amountToDispense = "1 ขวด (60 ml)";
        } else if (med.id === "ibuprofen-suspension-100mg-5ml") {
          const ml = Math.round(weight * 0.5); // 10 mg/kg -> 0.5 ml/kg
          calculatedDose = `${ml} ml ทุก 6-8 ชม. หลังอาหารทันที (เมื่อไข้สูง > 38.5°C)`;
          amountToDispense = "1 ขวด";
        } else if (med.id === "amoxicillin-dry-syrup-125") {
          const ml = Math.round((weight * 40) / (3 * 25)); // 40 mg/kg/day divided tid
          calculatedDose = `${ml} ml วันละ 3 ครั้ง หลังอาหาร เช้า-กลางวัน-เย็น ติดต่อกัน 7 วัน`;
          amountToDispense = "1-2 ขวด";
        } else if (med.standardPediatricDose) {
          calculatedDose = med.standardPediatricDose;
        }
      } else {
        if (med.id === "paracetamol-500") {
          if (weight < 50) {
            calculatedDose = "1 เม็ด (500 mg) ทุก 4-6 ชม. เมื่อมีอาการไข้หรือปวด";
          } else if (weight <= 67) {
            calculatedDose = "1.5 เม็ด (750 mg) ทุก 4-6 ชม. เมื่อมีอาการไข้หรือปวด";
          } else {
            calculatedDose = "2 เม็ด (1,000 mg) ทุก 4-6 ชม. เมื่อมีอาการไข้หรือปวด";
          }
          amountToDispense = "10-20 เม็ด";
        } else if (med.id === "paracetamol-325") {
          calculatedDose = "1-1.5 เม็ด ทุก 4-6 ชม. เมื่อมีอาการ";
          amountToDispense = "10-20 เม็ด";
        }
      }

      return {
        medicationId: med.id,
        medicationName: med.name,
        genericName: med.genericName,
        thaiName: med.thaiName,
        category: med.category,
        categoryLabel: med.categoryLabel,
        calculatedDose,
        frequency: med.frequency,
        instructions: med.instructions,
        amountToDispense,
        warning: med.cautions[0] || "",
        isHerbal: med.category === "thai_herbal"
      };
    })
    .filter(Boolean);

  // Check clinical vital red flags
  const redFlags = [...(matched?.redFlagsForReferral || [])];
  let severityLevel = matched?.severityLevel || "mild";

  if (vitalSigns?.sbp && vitalSigns.sbp >= 180) {
    redFlags.unshift(`[วิกฤตความดันโลหิต] ความดันตัวบนสูงมาก (${vitalSigns.sbp} mmHg) เสี่ยงหลอดเลือดสมองแตก!`);
    severityLevel = "severe_redflag";
  }
  if (vitalSigns?.temp && vitalSigns.temp >= 39.5) {
    redFlags.unshift(`[ไข้สูงอันตราย] อุณหภูมิร่างกายสูงถึง ${vitalSigns.temp}°C เสี่ยงชักจากไข้สูงในเด็ก`);
    if (severityLevel !== "severe_redflag") severityLevel = "moderate";
  }

  return {
    primaryDiagnosis: matched?.name || "อาการไม่สุขสบายทั่วไป",
    icd10: matched?.icd10 || "Z00.0",
    clinicalRationale: `ผู้ป่วยน้ำหนัก ${weight} กก. ส่วนสูง ${height} ซม. (${isPediatric ? "กลุ่มเด็ก/กุมารเวช" : "กลุ่มผู้ใหญ่"}) แสดงอาการ: ${symptoms}`,
    severityLevel,
    redFlags,
    prescriptions,
    nonPharmAdvice: matched?.nonPharmAdvice || [
      "ดื่มน้ำสะอาดมากๆ และพักผ่อนให้เพียงพอ",
      "รับประทานอาหารปรุงสุก สะอาด ถูกสุขอนามัย",
      "สังเกตอาการอย่างใกล้ชิด หากมีอาการทรุดลงให้รีบมา รพ.สต."
    ],
    followUpAdvice: matched?.followUp || "สังเกตอาการ 3-5 วัน หากไม่ดีขึ้นให้กลับมาตรวจซ้ำที่ รพ.สต."
  };
}

// Diagnosis API Route with Gemini 3.8 Flash & Fallback
app.post("/api/diagnose", async (req, res) => {
  try {
    const {
      weight,
      height,
      symptoms,
      vitalSigns,
      presetProtocolId,
      drugAllergies,
      chronicDiseases,
    } = req.body;

    const numWeight = parseFloat(weight) || 50;
    const numHeight = parseFloat(height) || 160;
    const { bmi, status: bmiStatus } = calculateBmi(numWeight, numHeight);
    const isPediatric = numWeight < 35 || (numHeight > 0 && numHeight < 140);

    // If Gemini client is not configured, directly use clinical guideline rule engine
    if (!geminiClient) {
      const fallbackResult = generateRuleBasedDiagnosis(
        numWeight,
        numHeight,
        symptoms || "",
        presetProtocolId,
        vitalSigns,
        drugAllergies
      );
      return res.json({
        success: true,
        source: "clinical_rules_engine",
        bmiData: { bmi, status: bmiStatus, isPediatric },
        ...fallbackResult,
      });
    }

    // Call Gemini 3.8 Flash
    const formularyContext = MEDICATION_LIST.map(
      (m) =>
        `ID: "${m.id}" | ชื่อ: "${m.name}" (${m.thaiName}) | รูปแบบ: ${m.dosageForm} | กลุ่ม: ${m.categoryLabel} | สูตร: ${m.standardAdultDose} ${m.standardPediatricDose ? `[เด็ก: ${m.standardPediatricDose}]` : ""}`
    ).join("\n");

    const promptText = `
คุณคือแพทย์เวชศาสตร์ครอบครัวและเภสัชกรคลินิกประจำ "โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.)"
วิเคราะห์อาการผู้ป่วยและจ่ายยาตามกรอบรายการยาของ รพ.สต. 106 รายการที่กำหนดนี้อย่างเคร่งครัด!

ข้อมูลผู้ป่วย (ไม่เอาข้อมูลระบุตัวตน มีแค่น้ำหนักส่วนสูงและอาการ):
- น้ำหนัก: ${numWeight} กิโลกรัม
- ส่วนสูง: ${numHeight} เซนติเมตร
- ค่า BMI: ${bmi} (${bmiStatus})
- กลุ่มผู้ป่วย: ${isPediatric ? "เด็ก / กุมารเวช (น้ำหนัก < 35 กก.)" : "ผู้ใหญ่"}
- สัญญาณชีพ (Vital Signs): อุณหภูมิ: ${vitalSigns?.temp ? `${vitalSigns.temp} °C` : "ไม่ระบุ"}, ความดันโลหิต: ${vitalSigns?.sbp ? `${vitalSigns.sbp}/${vitalSigns.dbp} mmHg` : "ไม่ระบุ"}, ชีพจร: ${vitalSigns?.pulse ? `${vitalSigns.pulse} bpm` : "ไม่ระบุ"}
- อาการสำคัญ (Chief Complaint & Symptoms): "${symptoms || "ตรวจสุขภาพทั่วไป"}"
- ประวัติแพ้ยา (Drug Allergies): "${drugAllergies || "ไม่มี"}"
- โรคประจำตัว (Chronic Diseases): "${chronicDiseases || "ไม่มี"}"

ข้อกำหนดสำคัญมาก:
1. การจ่ายยา: คุณต้องเลือกยาจากรายการยา รพ.สต. 106 รายการนี้เท่านั้น ห้ามสร้างชื่อยาที่ไม่มีในรายการ!
2. ขนาดยา: ต้องคำนวณตามน้ำหนักตัวจริง (${numWeight} กก.) เช่น
   - เด็ก: ใช้ยาน้ำ/ยาน้ำเชื่อม เช่น พาราเด็ก 120mg/5ml (10-15 mg/kg = ~0.5 ml/kg/dose), ไอบูโพรเฟนเด็ก 100mg/5ml (10 mg/kg = 0.5 ml/kg/dose), อะม็อกซี่เด็ก 125mg/5ml
   - ผู้ใหญ่: พาราเซตามอล 500mg ตามเกณฑ์ สธ. (นน. 34-50 กก. ให้ 1 เม็ด, 50-67 กก. ให้ 1.5 เม็ด, >67 กก. ให้ 2 เม็ด ทุก 4-6 ชม.)
3. ยาสมุนไพรในบัญชียาหลักแห่งชาติ: สามารถร่วมจ่ายยาสมุนไพรตามความเหมาะสม (เช่น ฟ้าทะลายโจร สำหรับหวัดเจ็บคอ, ขมิ้นชัน สำหรับท้องอืด, เถาวัลย์เปรียง สำหรับปวดเมื่อย, เพชรสังฆาต สำหรับริดสีดวง)
4. เกณฑ์ส่งต่อ รพช./รพท. (Red flags): ระบุสัญญาณอันตรายที่ รพ.สต. ต้องส่งต่อไป รพ.แม่ข่ายทันที

คลังยา 106 รายการของ รพ.สต.:
${formularyContext}
`;

    // Call Gemini 3.8 Flash with 8s timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API call timed out")), 8000)
    );

    const geminiCall = geminiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction:
          "คุณคือระบบ AI ผู้ช่วยแพทย์ รพ.สต. ที่มีความเชี่ยวชาญด้านเวชปฏิบัติปฐมภูมิของกระทรวงสาธารณสุขไทย ตอบกลับเป็น JSON ภาษาไทยที่ถูกต้องและสมบูรณ์เท่านั้น",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryDiagnosis: { type: Type.STRING, description: "ชื่อโรคหลักภาษาไทย พร้อมชื่อภาษาอังกฤษ" },
            icd10: { type: Type.STRING, description: "รหัสโรค ICD-10" },
            clinicalRationale: { type: Type.STRING, description: "คำอธิบายเหตุผลทางคลินิกที่วินิจฉัยโรคนี้และแผนการรักษา" },
            severityLevel: {
              type: Type.STRING,
              description: "ระดับความรุนแรง: mild (ปฐมภูมิรักษาได้), moderate (ติดตามใกล้ชิด), severe_redflag (อันตรายต้องส่งต่อ รพช./รพท.)",
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "สัญญาณอันตรายหรือเกณฑ์ส่งต่อโรงพยาบาลแม่ข่าย",
            },
            prescriptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medicationId: { type: Type.STRING, description: "id ของยาจาก 106 รายการ" },
                  medicationName: { type: Type.STRING, description: "ชื่อยาตามรายการเป๊ะๆ" },
                  calculatedDose: { type: Type.STRING, description: "ขนาดยาที่คำนวณตามน้ำหนักตัวจริง เช่น 1 เม็ด หรือ 6 ml (1.2 ช้อนชา)" },
                  frequency: { type: Type.STRING, description: "ความถี่ เช่น วันละ 3 ครั้ง หลังอาหาร เช้า-กลางวัน-เย็น" },
                  instructions: { type: Type.STRING, description: "วิธีใช้และข้อควรระวัง" },
                  amountToDispense: { type: Type.STRING, description: "จำนวนที่จ่าย เช่น 10 เม็ด หรือ 1 ขวด" },
                  warning: { type: Type.STRING, description: "คำเตือนสำคัญ เช่น ทานหลังอาหารทันที ห้ามขับรถ" },
                  isHerbal: { type: Type.BOOLEAN, description: "เป็นยาสมุนไพรหรือไม่" },
                },
                required: ["medicationId", "medicationName", "calculatedDose", "frequency", "instructions", "amountToDispense"],
              },
            },
            nonPharmAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "คำแนะนำการปฏิบัติตัว การดูแลสุขภาพ อาหาร การพักผ่อน",
            },
            followUpAdvice: { type: Type.STRING, description: "คำแนะนำการสังเกตอาการและการมาตรวจซ้ำ" },
          },
          required: ["primaryDiagnosis", "icd10", "clinicalRationale", "severityLevel", "redFlags", "prescriptions", "nonPharmAdvice", "followUpAdvice"],
        },
      },
    });

    const response = (await Promise.race([geminiCall, timeoutPromise])) as any;

    const parsed = JSON.parse(response.text || "{}");

    // Augment prescriptions with generic and Thai labels from inventory
    const augmentedPrescriptions = (parsed.prescriptions || []).map((rx: any) => {
      const match = MEDICATION_LIST.find((m) => m.id === rx.medicationId || m.name.toLowerCase() === rx.medicationName?.toLowerCase());
      return {
        ...rx,
        medicationId: match?.id || rx.medicationId,
        medicationName: match?.name || rx.medicationName,
        genericName: match?.genericName || "",
        thaiName: match?.thaiName || "",
        category: match?.category || "oral_general",
        categoryLabel: match?.categoryLabel || "ยาทั่วไป",
        isHerbal: match?.category === "thai_herbal" || rx.isHerbal,
      };
    });

    return res.json({
      success: true,
      source: "gemini_3.8_flash",
      bmiData: { bmi, status: bmiStatus, isPediatric },
      ...parsed,
      prescriptions: augmentedPrescriptions,
    });
  } catch (error) {
    console.error("Diagnosis error, falling back to rule engine:", error);
    const { weight, height, symptoms, vitalSigns, presetProtocolId, drugAllergies } = req.body;
    const numWeight = parseFloat(weight) || 50;
    const numHeight = parseFloat(height) || 160;
    const { bmi, status: bmiStatus } = calculateBmi(numWeight, numHeight);
    const isPediatric = numWeight < 35 || (numHeight > 0 && numHeight < 140);

    const fallbackResult = generateRuleBasedDiagnosis(
      numWeight,
      numHeight,
      symptoms || "",
      presetProtocolId,
      vitalSigns,
      drugAllergies
    );

    return res.json({
      success: true,
      source: "clinical_rules_engine_fallback",
      bmiData: { bmi, status: bmiStatus, isPediatric },
      ...fallbackResult,
    });
  }
});

// Medications List API
app.get("/api/medications", (_req, res) => {
  res.json({
    total: MEDICATION_LIST.length,
    medications: MEDICATION_LIST,
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
