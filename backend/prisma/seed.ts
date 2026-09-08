import bcrypt from "bcryptjs";
import {
  AppointmentStatus,
  PaymentMethod,
  PrescriptionStatus,
  Role,
  VisitStatus
} from "@prisma/client";
import { prisma } from "../src/lib/prisma";

export async function seed() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: "default-clinic-1" },
    update: {
      name: "عيادة الأمل التخصصية - Al-Amal Clinic",
      phone: "01012345678",
      address: "15 شارع النصر، المعادي، القاهرة",
      isActive: true
    },
    create: {
      id: "default-clinic-1",
      name: "عيادة الأمل التخصصية - Al-Amal Clinic",
      phone: "01012345678",
      address: "15 شارع النصر، المعادي، القاهرة",
      isActive: true
    }
  });
  console.log(`✓ Clinic ready: ${clinic.name}`);

  // 2. Seed Users (Doctor & Secretary)
  const defaultPasswordHash = await bcrypt.hash("ChangeMe123!", 12);

  const doctorEmail = (process.env.SEED_DOCTOR_EMAIL || "doctor@example.com").trim().toLowerCase();
  const doctor = await prisma.user.upsert({
    where: { email: doctorEmail },
    update: {
      name: process.env.SEED_DOCTOR_NAME || "د. أحمد خليل - Dr. Ahmed Khalil",
      role: Role.DOCTOR,
      isActive: true
    },
    create: {
      email: doctorEmail,
      name: process.env.SEED_DOCTOR_NAME || "د. أحمد خليل - Dr. Ahmed Khalil",
      passwordHash: defaultPasswordHash,
      role: Role.DOCTOR,
      isActive: true
    }
  });

  const secretaryEmail = (process.env.SEED_SECRETARY_EMAIL || "secretary@example.com").trim().toLowerCase();
  const secretary = await prisma.user.upsert({
    where: { email: secretaryEmail },
    update: {
      name: process.env.SEED_SECRETARY_NAME || "سارة محمود - Sara Mahmoud",
      role: Role.SECRETARY,
      isActive: true
    },
    create: {
      email: secretaryEmail,
      name: process.env.SEED_SECRETARY_NAME || "سارة محمود - Sara Mahmoud",
      passwordHash: defaultPasswordHash,
      role: Role.SECRETARY,
      isActive: true
    }
  });
  console.log(`✓ Doctor ready: ${doctor.name} (${doctor.email})`);
  console.log(`✓ Secretary ready: ${secretary.name} (${secretary.email})`);

  // Clean existing non-user data to ensure idempotent rich fake dataset
  await prisma.paymentRevision.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.prescriptionRevision.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.visitRevision.deleteMany({});
  await prisma.visit.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});

  // 3. Seed Patients
  const patientData = [
    {
      id: "pat-1",
      name: "محمد إبراهيم علي (Mohamed Ibrahim)",
      phone: "01098765432",
      notes: "مريض ضغط وسكر مزمن، يعاني من حساسية تجاه البنسلين"
    },
    {
      id: "pat-2",
      name: "فاطمة حسن السيد (Fatma Hassan)",
      phone: "01122334455",
      notes: "متابعة حمل - الشهر السادس، لا توجد أي حساسية دوائية سابقة"
    },
    {
      id: "pat-3",
      name: "علي محمود الشافعي (Ali Mahmoud)",
      phone: "01233445566",
      notes: "يعاني من ربو شعبي متقطع، يستخدم بخاخ فنتولين عند اللزوم"
    },
    {
      id: "pat-4",
      name: "مريم عبد الله القاضي (Mariam Abdallah)",
      phone: "01055667788",
      notes: "صداع نصفي متكرر مع اضطرابات في النوم، حساسية من الأسبرين"
    },
    {
      id: "pat-5",
      name: "خالد سعيد منصور (Khaled Saeed)",
      phone: "01511223344",
      notes: "التهاب بالمفاصل والفقرات القطنية، يخضع لعلاج طبيعي"
    },
    {
      id: "pat-6",
      name: "ياسمين كمال الدين (Yasmine Kamal)",
      phone: "01199887766",
      notes: "فحص دوري وقصور بسيط في نشاط الغدة الدرقية"
    },
    {
      id: "pat-7",
      name: "عمر شريف الدسوقي (Omar Sherif)",
      phone: "01288776655",
      notes: "نزلات برد متكررة والتهاب باللوزتين"
    },
    {
      id: "pat-8",
      name: "هدى مصطفى زهران (Hoda Mostafa)",
      phone: "01033445522",
      notes: "ارتجاع مريئي والتهاب بالمعدة، تتناول مضادات الحموضة"
    },
    {
      id: "pat-9",
      name: "طارق زياد النجار (Tarek Ziad)",
      phone: "01599884433",
      notes: "فحص وظائف كلى وتحاليل دهون ثلاثية روتينية"
    },
    {
      id: "pat-10",
      name: "نادية رشاد الصاوي (Nadia Rashad)",
      phone: "01255443322",
      notes: "أنيميا نقص حديد ومتابعة قياس ضغط الدم المنتظم"
    },
    {
      id: "pat-11",
      name: "حسين فؤاد الباز (Hussein Fouad)",
      phone: "01144332211",
      notes: "كشف استشاري وفحص وقائي سنوي شامل"
    },
    {
      id: "pat-12",
      name: "سلمى عمرو البنا (Salma Amr)",
      phone: "01066778899",
      notes: "التهاب جيوب أنفية تحسسي موسمي"
    }
  ];

  const createdPatients: Array<{ id: string; name: string; phone: string }> = [];
  for (const p of patientData) {
    const record = await prisma.patient.create({
      data: {
        id: p.id,
        name: p.name,
        phone: p.phone,
        notes: p.notes,
        clinicId: clinic.id,
        isActive: true
      }
    });
    createdPatients.push(record);
  }
  console.log(`✓ Seeded ${createdPatients.length} realistic clinic patients`);

  // Helper date generators
  const now = new Date();
  const makeDate = (offsetDays: number, hour: number, minute: number = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  // 4. Seed Appointments (Across multiple days and statuses)
  const appointmentPlans = [
    // Today's appointments
    { patientId: "pat-1", date: makeDate(0, 10, 0), status: AppointmentStatus.COMPLETED, notes: "كشف متابعة ضغط وسكر" },
    { patientId: "pat-2", date: makeDate(0, 11, 30), status: AppointmentStatus.COMPLETED, notes: "سونار ومتابعة شهرية" },
    { patientId: "pat-3", date: makeDate(0, 14, 0), status: AppointmentStatus.SCHEDULED, notes: "استشارة حساسية صدرية" },
    { patientId: "pat-4", date: makeDate(0, 16, 30), status: AppointmentStatus.SCHEDULED, notes: "شكوى من نوبات صداع حادة" },
    { patientId: "pat-5", date: makeDate(0, 18, 0), status: AppointmentStatus.NO_SHOW, notes: "تغيب المريض دون إشعار مسبق" },
    
    // Past appointments
    { patientId: "pat-6", date: makeDate(-1, 11, 0), status: AppointmentStatus.COMPLETED, notes: "مراجعة تحاليل الغدة الدرقية" },
    { patientId: "pat-7", date: makeDate(-2, 12, 0), status: AppointmentStatus.COMPLETED, notes: "التهاب حاد في الحلق وارتفاع حرارة" },
    { patientId: "pat-8", date: makeDate(-3, 15, 0), status: AppointmentStatus.COMPLETED, notes: "ألم أعلى البطن مع غثيان" },
    { patientId: "pat-9", date: makeDate(-4, 16, 0), status: AppointmentStatus.COMPLETED, notes: "فحص تحاليل دم ووظائف كلى" },
    { patientId: "pat-10", date: makeDate(-5, 17, 0), status: AppointmentStatus.COMPLETED, notes: "متابعة علاج فقر الدم" },
    { patientId: "pat-11", date: makeDate(-2, 18, 30), status: AppointmentStatus.CANCELLED, notes: "تم الإلغاء هاتفياً لظروف طارئة" },
    
    // Future appointments
    { patientId: "pat-12", date: makeDate(1, 10, 30), status: AppointmentStatus.SCHEDULED, notes: "فحص جيوب أنفية وحساسية" },
    { patientId: "pat-1", date: makeDate(1, 12, 0), status: AppointmentStatus.SCHEDULED, notes: "إعادة قياس الضغط بعد تعديل الجرعة" },
    { patientId: "pat-2", date: makeDate(2, 14, 0), status: AppointmentStatus.SCHEDULED, notes: "متابعة نتيجة فحص الدم" },
    { patientId: "pat-6", date: makeDate(3, 11, 0), status: AppointmentStatus.SCHEDULED, notes: "استلام تقرير الغدة الدوري" },
    { patientId: "pat-7", date: makeDate(4, 16, 0), status: AppointmentStatus.SCHEDULED, notes: "فحص تأكيدي بعد إنهاء المضاد الحيوي" }
  ];

  for (const app of appointmentPlans) {
    await prisma.appointment.create({
      data: {
        patientId: app.patientId,
        clinicId: clinic.id,
        scheduledAt: app.date,
        status: app.status,
        notes: app.notes
      }
    });
  }
  console.log(`✓ Seeded ${appointmentPlans.length} clinic appointments`);

  // 5. Seed Visits with Clinical Diagnoses & Revisions
  const visitSpecs = [
    {
      id: "visit-1",
      patientId: "pat-1",
      date: makeDate(0, 10, 15),
      diagnosis: "ارتفاع ضغط الدم الأساسي (Essential Hypertension) مع داء السكري غير المستقر",
      treatment: "تعديل جرعة أملوديبين إلى 10 مجم صباحاً، وإضافة أقراص ميتفورمين 850 مجم بعد الغداء",
      notes: "تم قياس الضغط: 155/95. نسبة السكر التراكمي السابقة 7.8%. توصية بممارسة المشي 30 دقيقة يومياً.",
      status: VisitStatus.COMPLETED,
      revision: {
        diagnosis: "ارتفاع ضغط الدم الأساسي مع السكري - الدرجة الثانية",
        treatment: "أملوديبين 10 مجم + ميتفورمين 850 مجم مرتين يومياً",
        notes: "تمت مراجعة القياسات المنزلية للمريض والتأكد من استقرار النبض",
        reason: "تحديث الجرعة بعد فحص قراءات السكر الصباحية"
      }
    },
    {
      id: "visit-2",
      patientId: "pat-2",
      date: makeDate(0, 11, 45),
      diagnosis: "متابعة حمل طبيعي - الأسبوع 24 (Routine Antenatal Follow-up)",
      treatment: "الاستمرار على مكملات الحديد والكالسيوم، ومغنيسيوم بلس للتقلصات العضلية",
      notes: "السونار سليم ونمو الجنين مناسب جداً لعمر الحمل. ضغط الدم 115/75.",
      status: VisitStatus.COMPLETED
    },
    {
      id: "visit-3",
      patientId: "pat-6",
      date: makeDate(-1, 11, 15),
      diagnosis: "قصور درقي تحت سريري (Subclinical Hypothyroidism)",
      treatment: "إلتروكسين 50 ميكروجرام حبة يومياً على الريق قبل الإفطار بساعة",
      notes: "تحليل TSH كان 6.2. إعادة التحليل بعد 6 أسابيع لتقييم الاستجابة.",
      status: VisitStatus.COMPLETED
    },
    {
      id: "visit-4",
      patientId: "pat-7",
      date: makeDate(-2, 12, 15),
      diagnosis: "التهاب بلعوم وبكتيريا عقدية حادة (Acute Streptococcal Pharyngitis)",
      treatment: "أوجمنتين 1 جم مرتين يومياً لمدة 7 أيام مع خافض حرارة باراسيتامول ومضمضة مطهرة",
      notes: "احتقان شديد في اللوزتين مع ارتفاع حرارة 38.8C. المريض لا يعاني من حساسية بنسلين.",
      status: VisitStatus.COMPLETED,
      revision: {
        diagnosis: "التهاب بلعوم حاد مع حساسية صدرية طفيفة",
        treatment: "أوجمنتين 1 جم + أقراص مضادة للهيستامين مساءً",
        notes: "تمت إضافة دواء للحساسية بعد ظهور كحة جافة ليلية",
        reason: "تخفيف الكحة المصاحبة للاحتقان"
      }
    },
    {
      id: "visit-5",
      patientId: "pat-8",
      date: makeDate(-3, 15, 20),
      diagnosis: "التهاب معدي مريئي ارتجاعي حاد (GERD) مع عسر هضم وظيفي",
      treatment: "أوميبرازول 40 مجم قبل الإفطار لمدة شهر، وأقراص موتيليوم قبل الوجبات الرئيسية",
      notes: "حموضة شديدة تتفاقم ليلاً. تم تقديم نصائح غذائية بخصوص تقليل القهوة والدهون والتدخين.",
      status: VisitStatus.COMPLETED
    },
    {
      id: "visit-6",
      patientId: "pat-9",
      date: makeDate(-4, 16, 20),
      diagnosis: "فرط دهون الدم المعتدل (Moderate Hyperlipidemia)",
      treatment: "أتورفاستاتين 20 مجم قرص واحد ليلاً مع حمية غذائية منخفضة الكوليسترول",
      notes: "الدهون الثلاثية 240 و الكوليسترول الكلي 230. وظائف الكبد والكلى طبيعية.",
      status: VisitStatus.COMPLETED
    },
    {
      id: "visit-7",
      patientId: "pat-10",
      date: makeDate(-5, 17, 15),
      diagnosis: "فقر دم بسبب نقص الحديد (Iron Deficiency Anemia)",
      treatment: "فيروجلوبين كبسولة مرتين يومياً بعد الأكل مع فيتامين سي لتعزيز الامتصاص",
      notes: "الهيموجلوبين 9.8 g/dL. التوصية بتناول الخضروات الورقية واللحوم الحمراء وفحص بعد شهرين.",
      status: VisitStatus.COMPLETED
    },
    {
      id: "visit-8",
      patientId: "pat-3",
      date: makeDate(-7, 13, 0),
      diagnosis: "نوبة ربو شعبي حادة مع التهاب شعبي خفيف",
      treatment: "جلسات استنشاق فنتولين في العيادة، وبخاخ سيريتيد 250 بختين مرتين يومياً لمدة أسبوعين",
      notes: "تم عمل جلسة نيبولايزر وتحسن التنفس فوراً. تشبع الأكسجين ارتفع من 92% إلى 98%.",
      status: VisitStatus.COMPLETED
    }
  ];

  for (const v of visitSpecs) {
    const visit = await prisma.visit.create({
      data: {
        id: v.id,
        patientId: v.patientId,
        clinicId: clinic.id,
        doctorId: doctor.id,
        visitDate: v.date,
        diagnosis: v.diagnosis,
        treatment: v.treatment,
        notes: v.notes,
        status: v.status
      }
    });

    if (v.revision) {
      await prisma.visitRevision.create({
        data: {
          visitId: visit.id,
          changedByUserId: doctor.id,
          diagnosis: v.revision.diagnosis,
          treatment: v.revision.treatment,
          notes: v.revision.notes,
          reason: v.revision.reason
        }
      });
    }
  }
  console.log(`✓ Seeded ${visitSpecs.length} clinical visits with audit revisions`);

  // 6. Seed Prescriptions (Structured JSON Medications)
  const prescriptionSpecs = [
    {
      visitId: "visit-1",
      medications: [
        { name: "Amlodipine 10mg", dosage: "1 tablet", frequency: "Once daily in the morning", duration: "30 days" },
        { name: "Metformin 850mg", dosage: "1 tablet", frequency: "Twice daily after meals", duration: "30 days" },
        { name: "Aspirin Protect 100mg", dosage: "1 tablet", frequency: "Once daily after lunch", duration: "30 days" }
      ],
      instructions: "قياس الضغط والسكر يومياً وتسجيلهما في دفتر المتابعة، والالتزام بحمية قليلة الملح والسكريات."
    },
    {
      visitId: "visit-2",
      medications: [
        { name: "Feroglobin B12", dosage: "1 capsule", frequency: "Once daily after lunch", duration: "30 days" },
        { name: "Caltrate Plus 600mg", dosage: "1 tablet", frequency: "Once daily after breakfast", duration: "30 days" },
        { name: "Magnesium Plus", dosage: "1 effervescent tablet", frequency: "Once daily in water at bedtime", duration: "15 days" }
      ],
      instructions: "شرب كميات كافية من الماء لا تقل عن 2.5 لتر يومياً وتجنب المجهود البدني الزائد."
    },
    {
      visitId: "visit-3",
      medications: [
        { name: "Eltroxin 50mcg", dosage: "1 tablet", frequency: "Daily on empty stomach 1 hour before breakfast", duration: "45 days" }
      ],
      instructions: "يمنع تناول الحليب أو الكالسيوم أو القهوة خلال ساعتين من أخذ الدواء. فحص TSH بعد شهر ونصف."
    },
    {
      visitId: "visit-4",
      medications: [
        { name: "Augmentin 1g", dosage: "1 tablet", frequency: "Every 12 hours after eating", duration: "7 days" },
        { name: "Panadol Extra 500mg", dosage: "2 tablets", frequency: "Every 8 hours as needed for fever/pain", duration: "5 days" },
        { name: "BetoSeptic Throat Spray", dosage: "3 puffs", frequency: "4 times daily", duration: "7 days" }
      ],
      instructions: "إكمال كورس المضاد الحيوي بالكامل حتى مع اختفاء الأعراض. الإكثار من السوائل الدافئة."
    },
    {
      visitId: "visit-5",
      medications: [
        { name: "Omeprazole 40mg", dosage: "1 capsule", frequency: "Once daily 30 minutes before breakfast", duration: "30 days" },
        { name: "Motilium 10mg", dosage: "1 tablet", frequency: "3 times daily 15 minutes before meals", duration: "14 days" },
        { name: "Gaviscon Liquid", dosage: "10 ml", frequency: "After meals and at bedtime as needed", duration: "14 days" }
      ],
      instructions: "تجنب الأكل الحار والمقليات والنوم بعد الأكل مباشرة بساعتين على الأقل."
    },
    {
      visitId: "visit-8",
      medications: [
        { name: "Seretide Diskus 250/50", dosage: "1 inhalation", frequency: "Twice daily morning and evening", duration: "30 days" },
        { name: "Ventolin Inhaler 100mcg", dosage: "2 puffs", frequency: "When needed during shortness of breath", duration: "As needed" }
      ],
      instructions: "المضمضة بالماء وبصقه جيداً بعد كل استخدام لبخاخ السيريتيد لتجنب فطريات الفم."
    }
  ];

  for (const rx of prescriptionSpecs) {
    await prisma.prescription.create({
      data: {
        visitId: rx.visitId,
        doctorId: doctor.id,
        medications: rx.medications,
        instructions: rx.instructions,
        status: PrescriptionStatus.ACTIVE
      }
    });
  }
  console.log(`✓ Seeded ${prescriptionSpecs.length} medical prescriptions`);

  // 7. Seed Payments (Invoices with Paid, Partial, and Outstanding balances)
  const paymentRecords = [
    {
      patientId: "pat-1",
      visitId: "visit-1",
      total: "350.00",
      paid: "350.00",
      remaining: "0.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(0, 10, 30),
      notes: "رسوم كشف تخصصي مع قياس ضغط وسكر - مدفوع بالكامل نقداً"
    },
    {
      patientId: "pat-2",
      visitId: "visit-2",
      total: "500.00",
      paid: "500.00",
      remaining: "0.00",
      method: PaymentMethod.CARD,
      paidAt: makeDate(0, 12, 0),
      notes: "كشف نساء ومتابعة حمل وسونار تفصيلي - دفع إلكتروني بالفيزا"
    },
    {
      patientId: "pat-3",
      visitId: "visit-8",
      total: "400.00",
      paid: "250.00",
      remaining: "150.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(0, 14, 30),
      notes: "كشف طوارئ مع جلسة نيبولايزر - متبقي 150 ج.م للاستشارة القادمة"
    },
    {
      patientId: "pat-4",
      visitId: null,
      total: "250.00",
      paid: "0.00",
      remaining: "250.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(0, 16, 45),
      notes: "حجز موعد كشف مسائي مؤكد - دفع عند الحضور"
    },
    {
      patientId: "pat-6",
      visitId: "visit-3",
      total: "300.00",
      paid: "300.00",
      remaining: "0.00",
      method: PaymentMethod.BANK_TRANSFER,
      paidAt: makeDate(-1, 11, 45),
      notes: "متابعة غدد صماء وتحاليل - تحويل فوري عبر إنستاباي"
    },
    {
      patientId: "pat-7",
      visitId: "visit-4",
      total: "350.00",
      paid: "350.00",
      remaining: "0.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(-2, 12, 45),
      notes: "كشف أنف وأذن وحنجرة وفحص لوزتين - مدفوع نقداً"
    },
    {
      patientId: "pat-8",
      visitId: "visit-5",
      total: "450.00",
      paid: "300.00",
      remaining: "150.00",
      method: PaymentMethod.CARD,
      paidAt: makeDate(-3, 15, 45),
      notes: "كشف باطنة وجهاز هضمي - متبقي 150 ج.م"
    },
    {
      patientId: "pat-9",
      visitId: "visit-6",
      total: "250.00",
      paid: "250.00",
      remaining: "0.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(-4, 16, 45),
      notes: "استشارة ومراجعة تحاليل معملية - مدفوع نقداً"
    },
    {
      patientId: "pat-10",
      visitId: "visit-7",
      total: "300.00",
      paid: "300.00",
      remaining: "0.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(-5, 17, 30),
      notes: "كشف ومتابعة علاج أنيميا - مدفوع نقداً"
    },
    {
      patientId: "pat-11",
      visitId: null,
      total: "250.00",
      paid: "250.00",
      remaining: "0.00",
      method: PaymentMethod.CASH,
      paidAt: makeDate(-2, 18, 0),
      notes: "كشف استشاري عام"
    }
  ];

  for (const pay of paymentRecords) {
    const payment = await prisma.payment.create({
      data: {
        patientId: pay.patientId,
        visitId: pay.visitId,
        clinicId: clinic.id,
        receivedByUserId: secretary.id,
        totalAmount: pay.total,
        paidAmount: pay.paid,
        remainingAmount: pay.remaining,
        method: pay.method,
        paidAt: pay.paidAt,
        notes: pay.notes
      }
    });

    if (parseFloat(pay.remaining) > 0) {
      await prisma.paymentRevision.create({
        data: {
          paymentId: payment.id,
          changedByUserId: secretary.id,
          totalAmount: pay.total,
          paidAmount: pay.paid,
          remainingAmount: pay.remaining,
          method: pay.method,
          reason: "تم تسجيل الدفعة الجزئية وجدولة باقي المبلغ على الزيارة القادمة"
        }
      });
    }
  }
  console.log(`✓ Seeded ${paymentRecords.length} financial transactions with audit records`);

  console.log("🎉 Database seeding completed successfully!");
}

if (require.main === module) {
  seed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error("❌ Seeding failed:", error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
