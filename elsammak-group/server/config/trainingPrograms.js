/** Training program catalog — keep in sync with client/src/config/trainingPrograms.ts */

const TRAINING_PROGRAMS = [
  { id: 'digital_accounting', allowRemote: true, allowPhysical: true },
  { id: 'corporate_contracts', allowRemote: false, allowPhysical: true },
  { id: 'data_analysis', allowRemote: true, allowPhysical: false },
  { id: 'digital_compliance', allowRemote: true, allowPhysical: true },
  { id: 'human_resources', allowRemote: true, allowPhysical: true },
  { id: 'legal_training', allowRemote: false, allowPhysical: true },
  { id: 'web_development', allowRemote: true, allowPhysical: true },
];

const COURSE_LABELS = {
  digital_accounting: { en: 'Advanced Digital Accounting', ar: 'المحاسبة الرقمية المتقدمة' },
  corporate_contracts: { en: 'Corporate Contract Drafting', ar: 'صياغة عقود الشركات' },
  data_analysis: { en: 'Data Analysis', ar: 'تحليل البيانات' },
  digital_compliance: { en: 'Digital Transformation Compliance', ar: 'امتثال التحول الرقمي' },
  human_resources: { en: 'Human Resources Training', ar: 'تدريب الموارد البشرية' },
  legal_training: { en: 'Legal Training for Lawyers', ar: 'التدريب القانوني للمحامين' },
  web_development: { en: 'Web & Software Development', ar: 'تطوير مواقع وبرمجيات' },
};

const ATTENDANCE_LABELS = {
  remote: { en: 'Remote (Online)', ar: 'عن بُعد (أونلاين)' },
  physical: { en: 'In-person', ar: 'حضوري' },
};

function getProgram(id) {
  return TRAINING_PROGRAMS.find((p) => p.id === id);
}

module.exports = { TRAINING_PROGRAMS, COURSE_LABELS, ATTENDANCE_LABELS, getProgram };
