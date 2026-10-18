export interface ClinicalProtocol {
  id: string;
  name: string;
  nameEn: string;
  icd10: string;
  category: 'respiratory' | 'gi' | 'musculoskeletal' | 'skin' | 'ncd' | 'eye_ear' | 'emergency_wound' | 'other';
  commonSymptoms: string[];
  keySigns: string[];
  severityLevel: 'mild' | 'moderate' | 'severe_redflag';
  redFlagsForReferral: string[];
  recommendedMedicationIds: {
    adult: string[];
    pediatric?: string[];
  };
  nonPharmAdvice: string[];
  followUp: string;
}

export const COMMON_PRIMARY_CARE_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: "common-cold",
    name: "โรคหวัดธรรมดา / ไข้หวัด (Common Cold / URI)",
    nameEn: "Upper Respiratory Infection",
    icd10: "J00",
    category: "respiratory",
    commonSymptoms: ["คัดจมูก", "น้ำมูกไหลใส", "จาม", "เจ็บคอเล็กน้อย", "มีไข้ต่ำๆ", "ไอเล็กน้อย", "ปวดเมื่อยตัว"],
    keySigns: ["เยื่อบุจมูกบวมแดงเล็กน้อย", "คอแดงเล็กน้อย ไม่มีหนองที่ทอนซิล", "ปอดเสียงใสปกติ"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "ไข้สูงเกิน 39°C นานเกิน 3 วัน หรือไข้ไม่ลดหลังทานยาลดไข้",
      "หายใจหอบเหนื่อย ปีกจมูกบาน หน้าอกบุ๋ม หายใจมีเสียงวี้ด",
      "เจ็บแน่นหน้าอก หรือไอเป็นเลือด",
      "เด็กซึมลง ไม่ยอมดูดนม หรือมีอาการชักจากไข้สูง"
    ],
    recommendedMedicationIds: {
      adult: ["paracetamol-500", "cpm-4", "bromhexine-8", "solanum-trilobatum-lozenge", "andrographis-paniculata-500"],
      pediatric: ["paracetamol-syrup-120mg-5ml", "cpm-syrup-2mg-5ml", "ammon-card-pediatric", "phyllanthus-emblica-cough"]
    },
    nonPharmAdvice: [
      "ดื่มน้ำอุ่นมากๆ อย่างน้อยวันละ 2-3 ลิตร ช่วยให้ชุ่มคอและเสมหะละลาย",
      "พักผ่อนให้เพียงพอ นอนหลับอย่างน้อย 7-8 ชั่วโมง",
      "เช็ดตัวลดไข้ด้วยน้ำอุ่นหรือน้ำอุณหภูมิห้องเมื่อมีไข้",
      "สวมหน้ากากอนามัย ล้างมือบ่อยๆ แยกภาชนะของใช้เพื่อป้องกันการแพร่เชื้อ",
      "งดดื่มน้ำเย็น น้ำแข็ง ของทอด และของมัน"
    ],
    followUp: "หากอาการไม่ดีขึ้นใน 3-5 วัน หรือเริ่มมีไข้สูง หายใจหอบ เสมหะเปลี่ยนเป็นสีเขียวข้น ให้กลับมาตรวจซ้ำที่ รพ.สต."
  },
  {
    id: "acute-pharyngitis-tonsillitis",
    name: "คออักเสบ / ทอนซิลอักเสบจากแบคทีเรีย (Bacterial Pharyngitis / Tonsillitis)",
    nameEn: "Acute Pharyngitis / Tonsillitis",
    icd10: "J02.9 / J03.9",
    category: "respiratory",
    commonSymptoms: ["เจ็บคอมาก กลืนน้ำลายเจ็บ", "มีไข้สูง หนาวสั่น", "ปวดศีรษะ", "ไม่มีอาการไอเด่นชัด"],
    keySigns: ["ต่อมทอนซิลบวมแดงโต มีจุดหนองสีขาว (Exudate)", "ต่อมน้ำเหลืองใต้ขากรรไกรโตและกดเจ็บ"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "อ้าปากไม่ขึ้น กลืนน้ำลายไม่ได้ หายใจลำบาก (เสี่ยงฝีรอบทอนซิล Peritonsillar abscess)",
      "คอบวมโตมาก หายใจมีเสียงฮืด (Stridor)",
      "เสียงเปลี่ยนเป็นเสียงอู้อี้เหมือนอมของร้อน (Hot potato voice)"
    ],
    recommendedMedicationIds: {
      adult: ["amoxicillin-500", "paracetamol-500", "ibuprofen-400", "solanum-trilobatum-lozenge"],
      pediatric: ["amoxicillin-dry-syrup-125", "paracetamol-syrup-120mg-5ml", "ibuprofen-suspension-100mg-5ml"]
    },
    nonPharmAdvice: [
      "รับประทานยาปฏิชีวนะติดต่อกันจนครบ 7-10 วันอย่างเคร่งครัด ห้ามหยุดยาเอง",
      "บ้วนปากและกลั้วคอด้วยน้ำเกลืออุ่นๆ วันละ 3-4 ครั้ง",
      "รับประทานอาหารอ่อน ย่อยง่าย รสไม่จัด",
      "ดื่มน้ำสะอาดอุณหภูมิห้องหรือน้ำอุ่นมากๆ"
    ],
    followUp: "ทานยาต่อเนื่องจนครบกำหนด หากทานยา 48 ชั่วโมงแล้วไข้ไม่ลด หรือกลืนลำบากมาก ให้รีบกลับมาพบเจ้าหน้าที่"
  },
  {
    id: "acute-gastroenteritis",
    name: "อุจจาระร่วงเฉียบพลัน / ลำไส้อักเสบ (Acute Diarrhea / Gastroenteritis)",
    nameEn: "Acute Gastroenteritis",
    icd10: "K52.9 / A09",
    category: "gi",
    commonSymptoms: ["ถ่ายเหลวเป็นน้ำ มากกว่า 3 ครั้งใน 24 ชม.", "ปวดมวนท้อง ปวดบิดเกร็ง", "คลื่นไส้ อาเจียน", "อ่อนเพลีย กระหายน้ำ"],
    keySigns: ["ชีพจรเร็ว ความดันโลหิตปกติหรือลดลง", "ริมฝีปากแห้ง ผิวหนังคืนตัวช้า (Skin turgor decreased)", "ท้องนิ่ม ไม่มี Rebound tenderness"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "ถ่ายเป็นมูกเลือดปน หรือถ่ายเป็นน้ำซาวข้าวปริมาณมหาศาล",
      "มีภาวะช็อก: ความดันต่ำ < 90/60 mmHg ชีพจรเบาเร็ว ปัสสาวะไม่ออก ซึม สับสน",
      "อาเจียนตลอดเวลาจนไม่สามารถดื่มน้ำเกลือแร่ทางปากได้",
      "ปวดท้องรุนแรง ท้องเกร็งแข็ง กดเจ็บปล่อยเจ็บ (Signs of acute abdomen)"
    ],
    recommendedMedicationIds: {
      adult: ["ors-pediatric-3-3g", "hyoscine-10", "domperidone-10", "pid-samut-500", "norfloxacin-400"],
      pediatric: ["ors-pediatric-3-3g", "domperidone-suspension-5mg-5ml", "hyoscine-syrup-5mg-5ml"]
    },
    nonPharmAdvice: [
      "ชงผงเกลือแร่ ORS จิบบ่อยๆ ทีละน้อย ชดเชยน้ำทุกครั้งที่ถ่ายเหลว",
      "รับประทานอาหารอ่อนย่อยง่าย เช่น โจ๊ก ข้าวต้ม น้ำซุป งดอาหารรสจัด ของหมักดอง",
      "งดนมสด นมเปรี้ยว น้ำส้ม ผลไม้รสเปรี้ยว และอาหารมัน",
      "ล้างมือด้วยสบู่ทุกครั้งก่อนรับประทานอาหารและหลังเข้าห้องน้ำ"
    ],
    followUp: "หากถ่ายเหลวเกิน 48 ชม. มีไข้สูง อาเจียนไม่หยุด หรือปัสสาวะไม่ออกนานเกิน 6 ชม. ให้รีบนำส่งโรงพยาบาล"
  },
  {
    id: "dyspepsia-gerd",
    name: "โรคกระเพาะอาหาร / กรดไหลย้อน (Dyspepsia / GERD)",
    nameEn: "Dyspepsia / Gastroesophageal Reflux",
    icd10: "K30 / K21.9",
    category: "gi",
    commonSymptoms: ["จุกแน่นลิ้นปี่ แสบร้อนกลางอก", "เรอเปรี้ยว แน่นท้อง ท้องอืด", "ปวดแสบท้องก่อนหรือหลังอาหาร", "คลื่นไส้"],
    keySigns: ["กดเจ็บบริเวณลิ้นปี่ (Epigastric tenderness) เล็กน้อย", "ท้องไม่อืดตึง ไม่มีก้อน"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "อาเจียนเป็นเลือดสด หรือสีกาแฟ (Coffee ground)",
      "ถ่ายอุจจาระเป็นสีดำเหนียวคล้ายยางมะตอย (Melena)",
      "กลืนอาหารติด กลืนเจ็บ น้ำหนักลดรวดเร็วโดยไม่ทราบสาเหตุ",
      "ปวดจุกแน่นลิ้นปี่ร้าวไปกรามหรือแขนซ้าย ร่วมกับเหงื่อแตก (สงสัยกล้ามเนื้อหัวใจขาดเลือด MI!)"
    ],
    recommendedMedicationIds: {
      adult: ["omeprazole-20", "alumina-magnesia-simethicone", "simethicone-80", "domperidone-10", "curcuma-longa-capsule"],
      pediatric: ["alumina-magnesia-simethicone", "m-carminative"]
    },
    nonPharmAdvice: [
      "รับประทานอาหารให้ตรงเวลา เคี้ยวอาหารให้ละเอียด ไม่ทานจนอิ่มแน่นเกินไป",
      "หลีกเลี่ยงอาหารรสจัด เผ็ดจัด เปรี้ยวจัด ของทอด ชา กาแฟ น้ำอัดลม และแอลกอฮอล์",
      "งดสูบบุหรี่ หลีกเลี่ยงความเครียด",
      "หลังรับประทานอาหารห้ามนอนราบทันที ควรเว้นอย่างน้อย 2-3 ชั่วโมง",
      "หนุนหัวเตียงให้สูงขึ้น 10-15 ซม. หากมีอาการกรดไหลย้อนตอนกลางคืน"
    ],
    followUp: "ทานยาก่อนอาหาร 30 นาที สังเกตอาการ 1-2 สัปดาห์ หากมีอาการถ่ายดำหรืออาเจียนเป็นเลือดต้องมาพบแพทย์ทันที"
  },
  {
    id: "myalgia-muscle-strain",
    name: "ปวดกล้ามเนื้อ / เคล็ดขัดยอก (Myalgia / Muscle Strain)",
    nameEn: "Myalgia & Muscle Strain",
    icd10: "M79.1",
    category: "musculoskeletal",
    commonSymptoms: ["ปวดเมื่อยกล้ามเนื้อ หลัง บ่า ไหล่ แขน ขา", "กล้ามเนื้อตึง เคล็ด ตึง จากการทำงานหนักหรือยกของ"],
    keySigns: ["กดเจ็บบริเวณกล้ามเนื้อที่มีอาการตึงเกร็ง (Trigger point / tender spot)", "การเคลื่อนไหวข้อต่อทำได้ตามปกติ"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "ปวดหลังร้าวลงขา ร่วมกับอาการชา อ่อนแรง หรือกลั้นอุจจาระปัสสาวะไม่อยู่ (Cauda equina syndrome)",
      "ปวดรุนแรงหลังได้รับอุบัติเหตุกระแทก (สงสัยกระดูกหัก)",
      "ข้อบวม แดง ร้อน มีไข้สูง (สงสัยข้อติดเชื้อ Septic arthritis)"
    ],
    recommendedMedicationIds: {
      adult: ["paracetamol-500", "ibuprofen-400", "diclofenac-25", "derris-scandens-500", "analgesic-balm"],
      pediatric: ["paracetamol-syrup-120mg-5ml", "analgesic-balm"]
    },
    nonPharmAdvice: [
      "ใน 24-48 ชั่วโมงแรกที่มีการบาดเจ็บเฉียบพลัน ให้ประคบเย็น 15-20 นาที ลดการบวมอักเสบ",
      "หลังจาก 48 ชั่วโมง สามารถประคบอุ่นเพื่อคลายกล้ามเนื้อที่ตึงเกร็ง",
      "พักการใช้งานกล้ามเนื้อมัดที่บาดเจ็บ หลีกเลี่ยงการยกของหนักและการก้มๆ เงยๆ",
      "ยืดเหยียดกล้ามเนื้อเบาๆ ปรับท่าทางการทำงาน (Ergonomics)",
      "ยาแก้ปวด NSAIDs ต้องทานหลังอาหารทันทีเพื่อป้องกันการระคายเคืองกระเพาะ"
    ],
    followUp: "รับประทานยาเมื่อมีอาการปวด หากอาการไม่ดีขึ้นใน 1 สัปดาห์ หรือมีอาการชา อ่อนแรง ให้กลับมาตรวจซ้ำ"
  },
  {
    id: "acute-gout-flare",
    name: "ข้ออักเสบเกาต์เฉียบพลัน (Acute Gouty Arthritis)",
    nameEn: "Acute Gout Attack",
    icd10: "M10.0",
    category: "musculoskeletal",
    commonSymptoms: ["ปวด บวม แดง ร้อน ข้อกระทันหัน (พบบ่อยที่ข้อนิ้วหัวแม่เท้า ข้อเท้า หรือข้อเข่า)", "ปวดมากจนสัมผัสไม่ได้ มักเริ่มเป็นตอนกลางดึก"],
    keySigns: ["ข้ออักเสบ บวม แดง ร้อน ชัดเจน มักเป็นข้อเดี่ยว", "อาจพบปุ่มโทฟัส (Tophi) ในผู้ป่วยเกาต์เรื้อรัง"],
    severityLevel: "moderate",
    redFlagsForReferral: [
      "มีไข้สูง หนาวสั่น ร่วมกับข้อบวมแดงร้อนรุนแรง (ต้องแยกโรคข้อติดเชื้อ Septic arthritis)",
      "มีแผลแตกที่ปุ่มโทฟัสและมีหนองไหล",
      "มีภาวะไตวายรุนแรง ปัสสาวะไม่ออก"
    ],
    recommendedMedicationIds: {
      adult: ["colchicine-0-6", "naproxen-250", "diclofenac-25", "omeprazole-20"],
      pediatric: []
    },
    nonPharmAdvice: [
      "พักการใช้ข้อ ยกข้อให้สูง ประคบเย็นบรรเทาอาการปวดบวม (ห้ามประคบร้อนขณะอักเสบเฉียบพลัน)",
      "ดื่มน้ำมากๆ วันละ 2-3 ลิตร ช่วยขับกรดยูริกออกทางปัสสาวะ",
      "งดเครื่องดื่มแอลกอฮอล์ทุกชนิดโดยเฉพาะเบียร์และเหล้าขาวเด็ดขาด",
      "งดอาหารที่มีพิวรีนสูง: เครื่องในสัตว์ เป็ด ไก่ สัตว์ปีก ยอดผัก ชะอม น้ำต้มกระดูก",
      "ห้ามเริ่มยา Allopurinol ขณะที่ข้อกำลังอักเสบเฉียบพลัน (ให้ทานเฉพาะยาแก้ปวด/โคลชิซิน)"
    ],
    followUp: "ทานยาตามแพทย์สั่ง เมื่ออาการปวดบวมสงบลงอย่างน้อย 2-4 สัปดาห์ จึงนัดมาตรวจกรดยูริกและพิจารณายา Allopurinol ป้องกันระยะยาว"
  },
  {
    id: "allergic-rhinitis-urticaria",
    name: "ลมพิษ / ผื่นภูมิแพ้ผิวหนัง / ภูมิแพ้อากาศ (Urticaria / Allergy)",
    nameEn: "Urticaria / Allergic Dermatitis",
    icd10: "L50.9 / L20.9",
    category: "skin",
    commonSymptoms: ["ผื่นนูนแดง คันยุบยิบ มีขอบเขตชัดเจน ยุบแล้วย้ายที่", "คัดจมูก จาม น้ำมูกใส คันตา คันจมูก"],
    keySigns: ["Wheal and flare lesions ตามผิวหนัง", "เยื่อบุจมูกบวมซีด"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "มีอาการบวมที่ริมฝีปาก เปลือกตา ลิ้น หรือในลำคอ (Angioedema)",
      "หายใจติดขัด หายใจมีเสียงหวีด แน่นหน้าอก กลืนลำบาก (Anaphylaxis อันตรายถึงชีวิต ต้องรีบส่งต่อด่วน!)",
      "ความดันตก หน้ามืด เป็นลม ตัวเขียว"
    ],
    recommendedMedicationIds: {
      adult: ["cpm-4", "hydroxyzine-10", "calamine-lotion-15", "triamcinolone-cream-0-1", "prab-chomphu-thawip-400"],
      pediatric: ["cpm-syrup-2mg-5ml", "calamine-lotion-15", "prednisolone-cream-0-5"]
    },
    nonPharmAdvice: [
      "ทาคาลาไมน์โลชั่นช่วยให้เย็นสบายลดอาการคัน",
      "ตัดเล็บให้สั้น ห้ามแกะเกาผิวหนังเพื่อป้องกันการติดเชื้อแบคทีเรียแทรกซ้อน",
      "อาบน้ำอุณหภูมิห้อง ใช้สบู่สูตรอ่อนโยน หลีกเลี่ยงการอาบน้ำอุ่นจัด",
      "สังเกตและหลีกเลี่ยงสิ่งกระตุ้น เช่น อาหารทะเล ยา ฝุ่น ขนสัตว์ เกสรดอกไม้ อากาศเปลี่ยน",
      "สวมเสื้อผ้าโปร่งสบาย ไม่รัดแน่น"
    ],
    followUp: "หากทานยาแก้แพ้แล้วผื่นยุบลงสามารถหยุดยาได้ หากมีอาการปากบวม หายใจไม่ออก ให้รีบมาพบแพทย์ทันที"
  },
  {
    id: "acute-wound-abrasion",
    name: "แผลสด แผลถลอก แผลฉีกขาด (Acute Wound / Abrasion / Laceration)",
    nameEn: "Acute Wound / Minor Trauma",
    icd10: "T14.0 / T14.1",
    category: "emergency_wound",
    commonSymptoms: ["มีบาดแผลสด แผลถลอก เลือดออก ปวดแสบบริเวณแผล"],
    keySigns: ["แผลเปิด มีเลือดซึม ขอบแผลสะอาดหรือปนเปื้อนดินทราย"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "แผลฉีกขาดลึกถึงชั้นกล้ามเนื้อ เอ็น หลอดเลือด หรือกระดูก",
      "เลือดออกพุ่งไม่หยุดแม้กดปากแผลแน่นเกิน 10-15 นาที",
      "บาดแผลจากสัตว์กัด (หมา แมว งู) โดยเฉพาะบริเวณใบหน้าหรือมือ",
      "มีสิ่งแปลกปลอมฝังลึก เช่น เศษกระจก โลหะ หรือแผลถูกยิง แทง"
    ],
    recommendedMedicationIds: {
      adult: ["nss-irrigation-needle", "povidone-iodine-10-solution-30ml", "paracetamol-500", "dicloxacillin-250", "td-vaccine-single-dose"],
      pediatric: ["nss-irrigation-needle", "povidone-iodine-10-solution-30ml", "paracetamol-syrup-120mg-5ml", "dicloxacillin-dry-syrup-62-5"]
    },
    nonPharmAdvice: [
      "ล้างแผลด้วยน้ำเกลือ NSS ชะล้างสิ่งสกปรกและเศษดินทรายออกให้หมด",
      "ทาโพวิโดนไอโอดีนฆ่าเชื้อและปิดด้วยผ้าก๊อซสะอาด",
      "ห้ามให้แผลโดนน้ำอย่างน้อย 3-5 วัน หรือจนกว่าแผลจะแห้งสนิท",
      "หากแผลเปื้อนสิ่งสกปรกหรือสนิมและไม่เคยฉีดวัคซีนบาดทะยักเกิน 5-10 ปี ต้องฉีดวัคซีน Td กระตุ้น",
      "ไม่ควรโรยผงยาใดๆ ลงบนแผลสดโดยตรง"
    ],
    followUp: "มาทำแผลที่ รพ.สต. ทุกวันหรือวันเว้นวัน หากมีอาการปวด บวม แดง ร้อน มีหนอง หรือมีไข้ ให้รีบมาตรวจซ้ำ"
  },
  {
    id: "hypertension-routine-followup",
    name: "ติดตามโรคความดันโลหิตสูง (Essential Hypertension Follow-up)",
    nameEn: "Hypertension Routine Care",
    icd10: "I10",
    category: "ncd",
    commonSymptoms: ["มักไม่มีอาการ หรืออาจมีมึนท้ายทอย ปวดตึงคอตอนเช้า"],
    keySigns: ["BP ≥ 140/90 mmHg (เป้าหมาย < 140/90 หรือ < 130/80 ในกลุ่มเสี่ยงสูง)"],
    severityLevel: "moderate",
    redFlagsForReferral: [
      "ความดันโลหิตสูงวิกฤต (Hypertensive Crisis): SBP ≥ 180 หรือ DBP ≥ 120 mmHg",
      "ปวดศีรษะรุนแรง ตาพร่ามัว สับสน ชัก หมดสติ",
      "เจ็บแน่นหน้าอกรุนแรง หรือหายใจเหนื่อยหอบเฉียบพลัน",
      "แขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว พูดไม่ชัด (สงสัย Stroke ด่วน!)"
    ],
    recommendedMedicationIds: {
      adult: ["amlodipine-5", "losartan-50", "enalapril-5", "hctz-25"],
      pediatric: []
    },
    nonPharmAdvice: [
      "ลดอาหารเค็ม อาหารรสจัด ผงชูรส น้ำปลา ซีอิ๊ว บะหมี่กึ่งสำเร็จรูป อาหารแปรรูป",
      "ออกกำลังกายแบบแอโรบิก เช่น เดินเร็ว ปั่นจักรยาน อย่างน้อยวันละ 30 นาที 5 วันต่อสัปดาห์",
      "ควบคุมน้ำหนักตัวให้อยู่ในเกณฑ์มาตรฐาน (BMI 18.5 - 22.9 kg/m²)",
      "งดสูบบุหรี่และจำกัดการดื่มเครื่องดื่มแอลกอฮอล์",
      "วัดความดันโลหิตสม่ำเสมอ จดบันทึกค่าความดันไว้ และรับประทานยาตรงเวลาทุกวันห้ามหยุดยาเอง"
    ],
    followUp: "นัดติดตามวัดความดันโลหิต ตรวจเลือดการทำงานของไตและเกลือแร่ทุก 3-6 เดือน"
  },
  {
    id: "diabetes-type-2-followup",
    name: "ติดตามโรคเบาหวานชนิดที่ 2 (Type 2 Diabetes Mellitus Follow-up)",
    nameEn: "Type 2 Diabetes Mellitus",
    icd10: "E11.9",
    category: "ncd",
    commonSymptoms: ["ปัสสาวะบ่อย กระหายน้ำ ดื่มน้ำบ่อย", "หิวบ่อยแต่น้ำหนักลด", "ชาตามปลายมือปลายเท้า"],
    keySigns: ["Fasting Blood Sugar (FBS) ≥ 126 mg/dL หรือ HbA1c ≥ 6.5%"],
    severityLevel: "moderate",
    redFlagsForReferral: [
      "น้ำตาลในเลือดต่ำรุนแรง (Hypoglycemia < 70 mg/dL): เหงื่อแตก ใจสั่น สับสน ชัก หมดสติ",
      "น้ำตาลในเลือดสูงวิกฤต (FBS > 300-400 mg/dL ร่วมกับหายใจหอบลึก ซึมลง อาเจียน DKA/HHS)",
      "มีแผลที่เท้าเรื้อรัง บวม แดง เป็นหนอง หรือเนื้อตายสีดำ (Diabetic foot ulcer)",
      "ตาพร่ามัวลงอย่างรวดเร็ว หรือตรวจพบโปรตีนรั่วในปัสสาวะสูง"
    ],
    recommendedMedicationIds: {
      adult: ["metformin-500", "glipizide-5", "vitamin-b-complex", "momordica-charantia"],
      pediatric: []
    },
    nonPharmAdvice: [
      "ควบคุมอาหารหวาน ของหวาน ผลไม้หวานจัด น้ำอัดลม ชานมไข่มุก และขนมขบเคี้ยว",
      "ลดปริมาณข้าว แป้ง ข้าวเหนียว เน้นข้าวกล้อง ผักใบเขียว และเนื้อปลา",
      "รับประทานยาตามเวลาอย่างเคร่งครัด ทานยา Glipizide ก่อนอาหาร 30 นาที และห้ามงดมื้ออาหาร",
      "พกลูกอมหรือน้ำหวานติดตัวเสมอ หากมีอาการใจสั่น มือสั่น ตัวเย็น ให้รีบทานทันที",
      "ตรวจดูสุขภาพเท้าทุกวัน ทาโลชั่นป้องกันผิวแห้ง สวมรองเท้าที่พอดี ไม่เดินเท้าเปล่า"
    ],
    followUp: "ตรวจระดับน้ำตาลปลายนิ้วทุกเดือน นัดเจาะเลือดตรวจ HbA1c การทำงานของไต ตรวจตา และตรวจเท้าปีละ 1 ครั้ง"
  },
  {
    id: "scabies-lice",
    name: "โรคหิด / เหา (Scabies / Pediculosis)",
    nameEn: "Scabies & Pediculosis",
    icd10: "B86 / B85",
    category: "skin",
    commonSymptoms: ["คันมากตอนกลางคืน", "มีตุ่มน้ำใส ตุ่มแดงตามง่ามนิ้วมือ ข้อมือ ซอกพับ อวัยวะเพศ", "คันศีรษะ พบตัวเหาหรือไข่เหาสีขาวติดที่เส้นผม"],
    keySigns: ["Burrow รอยนูนเป็นเส้นตามง่ามนิ้วมือ", "ไข่เหาติดแน่นกับโคนเส้นผม"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "มีการติดเชื้อแบคทีเรียแทรกซ้อนจนผิวหนังพุพองเป็นหนองทั่วตัว มีไข้สูง",
      "Crusted scabies (หิดนอร์เวย์) ในผู้ป่วยภูมิคุ้มกันบกพร่อง"
    ],
    recommendedMedicationIds: {
      adult: ["benzyl-benzoate-25", "cpm-4", "calamine-lotion-15"],
      pediatric: ["benzyl-benzoate-25", "cpm-syrup-2mg-5ml", "calamine-lotion-15"]
    },
    nonPharmAdvice: [
      "อาบน้ำให้สะอาด ทา Benzyl benzoate 25% ทั่วตัวตั้งแต่คอจรดปลายเท้า ทิ้งไว้ 24 ชม. แล้วล้างออก",
      "ต้องทายารักษาทุกคนในครอบครัวพร้อมกัน แม้คนที่ยังไม่มีอาการคัน เพื่อป้องกันการติดไปมา",
      "นำเสื้อผ้า ผ้าปูที่นอน ปลอกหมอน ผ้าเช็ดตัว ไปต้มในน้ำร้อนหรือซักแล้วตากแดดจัด",
      "ของใช้ที่ไม่สามารถซักได้ให้ใส่ถุงพลาสติกปิดปากถุงแน่นไว้อย่างน้อย 7 วัน เพื่อให้ตัวหิดเหาตาย"
    ],
    followUp: "สังเกตอาการ 1 สัปดาห์ หากยังพบตัวเหาหรือยังมีอาการคันหิด ให้ทายาซ้ำได้อีก 1 ครั้งในวันที่ 7"
  },
  {
    id: "smoking-cessation",
    name: "คลินิกช่วยเลิกบุหรี่ (Smoking Cessation Clinic)",
    nameEn: "Tobacco Use Disorder / Cessation",
    icd10: "F17.2",
    category: "other",
    commonSymptoms: ["ต้องการเลิกสูบบุหรี่", "มีอาการไอเรื้อรัง เสมหะ", "อยากลดสารนิโคตินในร่างกาย"],
    keySigns: ["กลิ่นบุหรี่ ฟันมีคราบ หายใจเหนื่อยง่าย"],
    severityLevel: "mild",
    redFlagsForReferral: [
      "ไอเรื้อรังเกิน 3 สัปดาห์ ไอเป็นเลือด น้ำหนักลดรวดเร็ว (ต้องเอกซเรย์ปอดคัดกรองวัณโรคและมะเร็งปอด)",
      "เหนื่อยหอบรุนแรง แน่นหน้าอก"
    ],
    recommendedMedicationIds: {
      adult: ["vernonia-cinerea-tea-2g", "vitamin-b-complex", "solanum-trilobatum-lozenge"],
      pediatric: []
    },
    nonPharmAdvice: [
      "ชาชงหญ้าดอกขาว: แช่ 1 ซองในน้ำร้อน จิบทุกครั้งที่รู้สึกอยากบุหรี่ จะทำให้ประสาทรับรสชา และรู้สึกเหม็นบุหรี่",
      "ใช้หลัก 5 D: Delay (ผัดผ่อนความอยาก 3-5 นาที), Deep breath (หายใจเข้าลึกๆ), Drink water (จิบน้ำสะอาด), Do something else (หากิจกรรมอื่นทำ), Distract (เบี่ยงเบนความสนใจ)",
      "ทิ้งอุปกรณ์สูบบุหรี่ ที่เขี่ยบุหรี่ ไฟแช็ก ทั้งหมด",
      "หลีกเลี่ยงสถานที่และกลุ่มเพื่อนที่สูบบุหรี่ ดื่มกาแฟ หรือดื่มสุราที่กระตุ้นให้อยากสูบ"
    ],
    followUp: "นัดติดตามความก้าวหน้าการเลิกบุหรี่ทุก 2 สัปดาห์ และให้กำลังใจสม่ำเสมอ"
  }
];
