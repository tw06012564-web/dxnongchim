export interface Icd10Item {
  code: string; // e.g., J00, J02.9, E11.9
  nameTh: string;
  nameEn: string;
  diagType: 1 | 2 | 3 | 4 | 5; // 1 = Principal Dx, 2 = Comorbidity, 3 = Complication, 4 = Other, 5 = External Cause
  diagTypeLabel: string;
  category: 'respiratory' | 'gi' | 'musculoskeletal' | 'skin' | 'ncd' | 'eye_ear' | 'injury_wound' | 'family_planning' | 'health_check';
  categoryLabel: string;
  icd9Procedures?: { code: string; name: string }[];
  nhsoClaimTips: string; // คำแนะนำการคีย์ส่งเคลม สปสช. ใน HOSxP XE
  commonInPcu: boolean;
}

export const HOSXP_ICD10_LIST: Icd10Item[] = [
  // 1. ระบบทางเดินหายใจ (Respiratory)
  {
    code: "J00",
    nameTh: "โรคหวัดธรรมดา / ช่องจมูกและคออักเสบเฉียบพลัน",
    nameEn: "Acute nasopharyngitis [common cold]",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "respiratory",
    categoryLabel: "ระบบทางเดินหายใจ",
    icd9Procedures: [{ code: "89.07", name: "การตรวจรักษาเวชปฏิบัติทั่วไป" }],
    nhsoClaimTips: "เคลมกองทุน OP ทั่วไปได้ ใช้เมื่อมีอาการหวัด น้ำมูก คัดจมูก โดยไม่มีภาวะแทรกซ้อน",
    commonInPcu: true
  },
  {
    code: "J02.9",
    nameTh: "คอหอยอักเสบเฉียบพลัน ไม่ระบุเชื้อ",
    nameEn: "Acute pharyngitis, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "respiratory",
    categoryLabel: "ระบบทางเดินหายใจ",
    icd9Procedures: [{ code: "89.07", name: "ตรวจและจ่ายยาปฏิชีวนะ" }],
    nhsoClaimTips: "พบบ่อยใน รพ.สต. หากตรวจพบ exudate ที่คอ แนะนำคีย์ระบุประวัติหรือสุ่มตรวจ RDT สปสช. ไม่ติด C",
    commonInPcu: true
  },
  {
    code: "J03.9",
    nameTh: "ต่อมทอนซิลอักเสบเฉียบพลัน ไม่ระบุเชื้อ",
    nameEn: "Acute tonsillitis, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "respiratory",
    categoryLabel: "ระบบทางเดินหายใจ",
    nhsoClaimTips: "คีย์เป็น Principal Dx เมื่อต่อมทอนซิลบวมแดงโต มีหนอง",
    commonInPcu: true
  },
  {
    code: "J06.9",
    nameTh: "การติดเชื้อเฉียบพลันของทางเดินหายใจส่วนบน หลายตำแหน่งหรือไม่ระบุ",
    nameEn: "Acute upper respiratory infection, unspecified (URI)",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "respiratory",
    categoryLabel: "ระบบทางเดินหายใจ",
    nhsoClaimTips: "รหัสครอบคลุมกรณีมีทั้งหวัด คออักเสบ ไอ ในคราวเดียวกัน",
    commonInPcu: true
  },
  {
    code: "J20.9",
    nameTh: "หลอดลมอักเสบเฉียบพลัน ไม่ระบุรายละเอียด",
    nameEn: "Acute bronchitis, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "respiratory",
    categoryLabel: "ระบบทางเดินหายใจ",
    nhsoClaimTips: "ใช้เมื่อมีอาการไอเด่นชัด ไอมีเสมหะ เสียงปอดพบ rhonchi",
    commonInPcu: true
  },
  {
    code: "J30.4",
    nameTh: "เยื่อจมูกอักเสบจากภูมิแพ้ ไม่ระบุรายละเอียด",
    nameEn: "Allergic rhinitis, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "respiratory",
    categoryLabel: "ระบบทางเดินหายใจ",
    nhsoClaimTips: "สำหรับผู้ป่วยแพ้อากาศ คันจมูก จาม น้ำมูกใสเรื้อรัง",
    commonInPcu: true
  },

  // 2. ระบบทางเดินอาหาร (Gastrointestinal)
  {
    code: "A09.0",
    nameTh: "กระเพาะและลำไส้อักเสบจากการติดเชื้ออื่นๆ และไม่ระบุ",
    nameEn: "Other and unspecified gastroenteritis of infectious origin",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    icd9Procedures: [{ code: "99.18", name: "การให้สารน้ำทางหลอดเลือดดำ (ถ้ามี)" }],
    nhsoClaimTips: "สปสช. แนะนำใช้ A09.0 หรือ A09.9 สำหรับอุจจาระร่วงเฉียบพลัน / ท้องเสีย ถ่ายเหลว",
    commonInPcu: true
  },
  {
    code: "A09.9",
    nameTh: "อุจจาระร่วงและลำไส้อักเสบ ไม่ระบุสาเหตุ",
    nameEn: "Gastroenteritis and colitis of unspecified origin",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    nhsoClaimTips: "รหัสยอดนิยมสำหรับคีย์ HOSxP PCU / XE ในเคสท้องร่วงทั่วไป",
    commonInPcu: true
  },
  {
    code: "K30",
    nameTh: "อาหารไม่ย่อย / ท้องอืด ท้องเฟ้อ",
    nameEn: "Dyspepsia",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    nhsoClaimTips: "ใช้กับอาการจุกแน่นลิ้นปี่ ท้องอืด อาหารไม่ย่อย เบิกยาลดกรดและยาขับลมได้สมบูรณ์",
    commonInPcu: true
  },
  {
    code: "K29.7",
    nameTh: "กระเพาะอาหารอักเสบ ไม่ระบุรายละเอียด",
    nameEn: "Gastritis, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    nhsoClaimTips: "ใช้เมื่อมีอาการแสบท้อง ปวดท้องก่อนหรือหลังอาหารสัมพันธ์กับโรคกระเพาะ",
    commonInPcu: true
  },
  {
    code: "K21.9",
    nameTh: "โรคกรดไหลย้อน ไม่มีหลอดอาหารอักเสบ",
    nameEn: "Gastro-oesophageal reflux disease without oesophagitis (GERD)",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    nhsoClaimTips: "ใช้สำหรับอาการแสบร้อนกลางอก เรอเปรี้ยว จุกที่คอ",
    commonInPcu: true
  },
  {
    code: "K59.0",
    nameTh: "ท้องผูก",
    nameEn: "Constipation",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    nhsoClaimTips: "สำหรับเคสถ่ายยาก ถ่ายแข็ง เบิกยาระบายมะขามแขก หรือ MOM",
    commonInPcu: true
  },
  {
    code: "I84.9",
    nameTh: "ริดสีดวงทวารหนัก ไม่ระบุรายละเอียด",
    nameEn: "Haemorrhoids without complication, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "gi",
    categoryLabel: "ระบบทางเดินอาหาร",
    nhsoClaimTips: "ใช้เบิกจ่ายสมุนไพรเพชรสังฆาตและยาระบายใน HOSxP XE",
    commonInPcu: true
  },

  // 3. ระบบกล้ามเนื้อและกระดูก (Musculoskeletal)
  {
    code: "M79.1",
    nameTh: "ปวดกล้ามเนื้อ (Myalgia)",
    nameEn: "Myalgia",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "musculoskeletal",
    categoryLabel: "กล้ามเนื้อและข้อ",
    nhsoClaimTips: "ใช้กับอาการปวดเมื่อยตัว กล้ามเนื้อตึง ปวดหลัง คอบ่าไหล่ เบิกยา NSAIDs หรือเถาวัลย์เปรียงได้",
    commonInPcu: true
  },
  {
    code: "M54.5",
    nameTh: "ปวดหลังส่วนล่าง (Low back pain)",
    nameEn: "Low back pain",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "musculoskeletal",
    categoryLabel: "กล้ามเนื้อและข้อ",
    nhsoClaimTips: "รหัสเฉพาะสำหรับปวดเอว ปวดหลังส่วนล่างในเกษตรกร/ผู้ใช้แรงงาน พบบ่อยมากใน รพ.สต.",
    commonInPcu: true
  },
  {
    code: "M10.0",
    nameTh: "โรคเกาต์ที่ไม่ทราบสาเหตุ (ข้ออักเสบเกาต์)",
    nameEn: "Idiopathic gout",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "musculoskeletal",
    categoryLabel: "กล้ามเนื้อและข้อ",
    nhsoClaimTips: "ใช้สำหรับข้ออักเสบเกาต์กำเริบ จ่าย Colchicine และ Naproxen/Diclofenac",
    commonInPcu: true
  },
  {
    code: "M17.9",
    nameTh: "ข้อเข่าเสื่อม ไม่ระบุรายละเอียด",
    nameEn: "Gonarthrosis [osteoarthritis of knee], unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "musculoskeletal",
    categoryLabel: "กล้ามเนื้อและข้อ",
    nhsoClaimTips: "ผู้สูงอายุมีอาการปวดเข่า เข่าดังกรอบแกรบ เดินลำบาก",
    commonInPcu: true
  },

  // 4. ผิวหนัง (Dermatology)
  {
    code: "L50.9",
    nameTh: "ลมพิษ ไม่ระบุรายละเอียด",
    nameEn: "Urticaria, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "ผื่นคัน นูนแดง ย้ายที่ เบิกยา CPM, Hydroxyzine, Calamine",
    commonInPcu: true
  },
  {
    code: "L23.9",
    nameTh: "ผิวหนังอักเสบจากการแพ้สัมผัส ไม่ระบุสาเหตุ",
    nameEn: "Allergic contact dermatitis, unspecified cause",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "ผื่นแพ้สารเคมี น้ำยาล้างจาน หญ้า พืช สารระคายเคือง",
    commonInPcu: true
  },
  {
    code: "B35.9",
    nameTh: "โรคเชื้อราที่ผิวหนัง (กลาก)",
    nameEn: "Dermatophytosis, unspecified",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "เชื้อรา กลาก ผื่นขอบนูนคัน เบิก Clotrimazole cream หรือ Whitfield's ointment",
    commonInPcu: true
  },
  {
    code: "B36.0",
    nameTh: "เกลื้อน (Pityriasis versicolor)",
    nameEn: "Pityriasis versicolor",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "ด่างขาวหรือน้ำตาล ขุยบางๆ ตามหน้าอกหลัง",
    commonInPcu: true
  },
  {
    code: "B86",
    nameTh: "โรคหิด (Scabies)",
    nameEn: "Scabies",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "ตุ่มคันง่ามนิ้ว คันกลางคืน เบิก Benzyl benzoate 25%",
    commonInPcu: true
  },
  {
    code: "B85.0",
    nameTh: "เหาที่ศีรษะ (Pediculosis capitis)",
    nameEn: "Pediculosis due to Pediculus humanus capitis",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "พบบ่อยในเด็กนักเรียน เบิก Benzyl benzoate 25%",
    commonInPcu: true
  },
  {
    code: "L01.0",
    nameTh: "โรคตุ่มพุพอง / แผลติดเชื้อหนองที่ผิวหนัง",
    nameEn: "Impetigo [any organism] [any site]",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "skin",
    categoryLabel: "โรคผิวหนัง",
    nhsoClaimTips: "แผลตุ่มหนองพุพอง คราบน้ำเหลือง เบิก Dicloxacillin",
    commonInPcu: true
  },

  // 5. โรคเรื้อรัง (NCDs)
  {
    code: "I10",
    nameTh: "ความดันโลหิตสูงชนิดไม่ทราบสาเหตุ",
    nameEn: "Essential (primary) hypertension",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "ncd",
    categoryLabel: "โรคเรื้อรัง (NCDs)",
    nhsoClaimTips: "รหัสสำคัญในคลินิก NCD รพ.สต. เพื่อเคลมงบเบาหวานความดัน สปสช. (กองทุน NCD)",
    commonInPcu: true
  },
  {
    code: "E11.9",
    nameTh: "เบาหวานชนิดที่ 2 ไม่มีภาวะแทรกซ้อน",
    nameEn: "Non-insulin-dependent diabetes mellitus without complications",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "ncd",
    categoryLabel: "โรคเรื้อรัง (NCDs)",
    nhsoClaimTips: "สำหรับเคสเบาหวานทั่วไปที่ไม่มีภาวะแทรกซ้อนที่ไต ตา เท้า หรือหัวใจ",
    commonInPcu: true
  },
  {
    code: "E11.2",
    nameTh: "เบาหวานชนิดที่ 2 ร่วมกับไตเสื่อม (Diabetic nephropathy)",
    nameEn: "Non-insulin-dependent diabetes mellitus with renal complications",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "ncd",
    categoryLabel: "โรคเรื้อรัง (NCDs)",
    nhsoClaimTips: "เมื่อผู้ป่วยเบาหวานมี Microalbuminuria หรือ Cr/eGFR ผิดปกติ สปสช. ให้คีย์รหัสนี้",
    commonInPcu: true
  },
  {
    code: "E78.0",
    nameTh: "ภาวะคอเลสเตอรอลในเลือดสูง",
    nameEn: "Pure hypercholesterolaemia",
    diagType: 2,
    diagTypeLabel: "2: Comorbidity (โรคร่วม)",
    category: "ncd",
    categoryLabel: "โรคเรื้อรัง (NCDs)",
    nhsoClaimTips: "มักใช้เป็นโรคร่วม (Diag type 2) คู่กับ I10 หรือ E11.9 ในคลินิก NCD",
    commonInPcu: true
  },
  {
    code: "E78.1",
    nameTh: "ภาวะไตรกลีเซอไรด์ในเลือดสูง",
    nameEn: "Pure hyperglyceridaemia",
    diagType: 2,
    diagTypeLabel: "2: Comorbidity (โรคร่วม)",
    category: "ncd",
    categoryLabel: "โรคเรื้อรัง (NCDs)",
    nhsoClaimTips: "ใช้เมื่อจ่ายยา Gemfibrozil 300 mg",
    commonInPcu: true
  },

  // 6. อุบัติเหตุและแผลสด (Injury & Wounds) **สำคัญมากสำหรับเคลม สปสช.**
  {
    code: "T14.0",
    nameTh: "แผลถลอก / บาดเจ็บที่ผิวหนังตื้นๆ",
    nameEn: "Superficial injury of unspecified body region",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "injury_wound",
    categoryLabel: "อุบัติเหตุ/บาดแผล",
    icd9Procedures: [
      { code: "96.59", name: "การทำแผล / ล้างแผล (Wound dressing)" },
      { code: "99.21", name: "การฉีดวัคซีนบาดทะยัก (Td vaccine)" }
    ],
    nhsoClaimTips: "⚠️ สปสช. บังคับ: ต้องคีย์รหัสสาเหตุภายนอก (External Cause V01-Y98) เช่น W01.9 (หกล้ม) เป็น Diag Type 5 คู่กันเสมอ ไม่งั้นจะติด Error C!",
    commonInPcu: true
  },
  {
    code: "T14.1",
    nameTh: "แผลเปิด / แผลฉีกขาด (Laceration)",
    nameEn: "Open wound of unspecified body region",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "injury_wound",
    categoryLabel: "อุบัติเหตุ/บาดแผล",
    icd9Procedures: [
      { code: "86.59", name: "การเย็บแผล (Suture of skin and subcutaneous tissue)" },
      { code: "96.59", name: "การทำแผล / ล้างแผล" }
    ],
    nhsoClaimTips: "⚠️ ต้องคีย์ ICD-9: 86.59 ถ้ามีการเย็บแผล และต้องใส่รหัส External Cause Type 5",
    commonInPcu: true
  },
  {
    code: "W01.9",
    nameTh: "หกล้มบนพื้นระดับเดียวกันจากสะดุดหรือลื่น",
    nameEn: "Fall on same level from slipping, tripping and stumbling",
    diagType: 5,
    diagTypeLabel: "5: External Cause (สาเหตุภายนอก)",
    category: "injury_wound",
    categoryLabel: "อุบัติเหตุ/บาดแผล",
    nhsoClaimTips: "รหัสสาเหตุภายนอกยอดนิยมสำหรับหกล้ม ใส่เป็น Diag Type 5 ใน HOSxP XE",
    commonInPcu: true
  },
  {
    code: "V29.9",
    nameTh: "อุบัติเหตุรถจักรยานยนต์ล้มเองหรือไม่ระบุคู่กรณี",
    nameEn: "Motorcycle rider injured in unspecified traffic accident",
    diagType: 5,
    diagTypeLabel: "5: External Cause (สาเหตุภายนอก)",
    category: "injury_wound",
    categoryLabel: "อุบัติเหตุ/บาดแผล",
    nhsoClaimTips: "⚠️ หากเป็นอุบัติเหตุรถ ให้ระบุสิทธิ พ.ร.บ. คุ้มครองผู้ประสบภัยจากรถ ก่อนใช้สิทธิบัตรทอง สปสช.",
    commonInPcu: true
  },

  // 7. วางแผนครอบครัวและอนามัยแม่และเด็ก
  {
    code: "Z30.0",
    nameTh: "การให้คำปรึกษาและคำแนะนำทั่วไปเกี่ยวกับการคุมกำเนิด",
    nameEn: "General counselling and advice on contraception",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "family_planning",
    categoryLabel: "วางแผนครอบครัว",
    icd9Procedures: [{ code: "99.23", name: "การฉีดยาคุมกำเนิด (DMPA)" }],
    nhsoClaimTips: "เบิกงบส่งเสริมสุขภาพป้องกันโรค (P&P) ยาคุมกำเนิดชนิดเม็ดและชนิดฉีด DMPA",
    commonInPcu: true
  },
  {
    code: "Z30.4",
    nameTh: "การตรวจติดตามการใช้ยาคุมกำเนิด",
    nameEn: "Surveillance of contraceptive drugs",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "family_planning",
    categoryLabel: "วางแผนครอบครัว",
    nhsoClaimTips: "ใช้เมื่อมารับยาเม็ดคุมกำเนิดต่อเนื่อง หรือมารับการฉีดยาคุม DMPA ทุก 3 เดือน",
    commonInPcu: true
  },

  // 8. การเลิกบุหรี่ / ส่งเสริมสุขภาพ
  {
    code: "F17.2",
    nameTh: "ภาวะติดยาสูบ / นิโคติน (คลินิกเลิกบุหรี่)",
    nameEn: "Mental and behavioural disorders due to use of tobacco, dependence syndrome",
    diagType: 1,
    diagTypeLabel: "1: Principle Dx (โรคหลัก)",
    category: "health_check",
    categoryLabel: "ส่งเสริมสุขภาพ",
    icd9Procedures: [{ code: "94.49", name: "การให้คำปรึกษาเลิกบุหรี่" }],
    nhsoClaimTips: "ใช้เบิกจ่ายสมุนไพรชาชงหญ้าดอกขาว และเคลมผลงานคลินิกบำบัดยาเสพติด/เลิกบุหรี่ สปสช.",
    commonInPcu: true
  }
];
