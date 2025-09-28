import { Patient, TherapySession, TherapyStatus, ProgressData, FeedbackData, FormTemplate, SentForm, FormStatus as FormStatusEnum, ProgramTemplate, AssignedProgram, PanchakarmaProgramDay } from './types';

export const PROGRAM_SCHEDULE_21_DAYS: PanchakarmaProgramDay[] = [
  { day: '1-3', morning: 'Snehana (internal ghee)', midday: 'Light diet', evening: 'Abhyanga (oil massage) + Swedana (steam)', notes: 'Preparation (Poorva Karma)' },
  { day: '4-6', morning: 'Abhyanga + Swedana', midday: '—', evening: '—', notes: 'Continue preparation' },
  { day: '7', morning: 'Vamana (therapeutic emesis)', midday: 'Rest', evening: 'Light diet', notes: '*Main therapy day – only Vamana*' },
  { day: '8-10', morning: 'Rest & light diet', midday: 'Abhyanga + Swedana', evening: '—', notes: 'Recovery' },
  { day: '11', morning: 'Virechana (purgation)', midday: 'Rest', evening: 'Light diet', notes: '*Main therapy day – only Virechana*' },
  { day: '12-14', morning: 'Rest & light diet', midday: 'Abhyanga + Swedana', evening: '—', notes: 'Recovery' },
  { day: '15-21', morning: 'Basti (1 session daily)', midday: 'Light meals', evening: 'Nasya (1 session daily)', notes: 'Can combine Basti + Nasya under supervision' },
];

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: 'pt1',
    name: '21-Day Classic Detox Program',
    description: 'A comprehensive 21-day detoxification and rejuvenation program following the classic Panchakarma sequence.',
    durationDays: 21,
    schedule: PROGRAM_SCHEDULE_21_DAYS,
  },
  {
    id: 'pt2',
    name: '7-Day Rejuvenation Retreat',
    description: 'A shorter, focused program designed for rejuvenation, stress-relief, and boosting vitality.',
    durationDays: 7,
    schedule: [
       { day: '1-2', morning: 'Snehana (internal ghee)', midday: 'Light diet', evening: 'Abhyanga + Swedana', notes: 'Preparation' },
       { day: '3', morning: 'Abhyanga + Swedana', midday: 'Light diet', evening: '—', notes: 'Deep relaxation' },
       { day: '4', morning: 'Virechana (purgation)', midday: 'Rest', evening: 'Light diet', notes: 'Gentle cleanse' },
       { day: '5-7', morning: 'Rest & light diet', midday: 'Shirodhara', evening: 'Light diet', notes: 'Nourishment and recovery' },
    ],
  }
];

export const ASSIGNED_PROGRAMS: AssignedProgram[] = [
    // Initially empty. Programs are assigned by user or practitioner action.
];


export const PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Raj Patel',
    avatar: 'https://i.pravatar.cc/150?u=p1',
    lastVisit: '2024-07-28',
    currentTherapy: 'Initial Consultation',
    progress: 0,
    notes: 'New patient, pending program selection.',
    preferredTimeSlot: 'morning',
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?u=p2',
    lastVisit: '2024-07-27',
    currentTherapy: 'Virechana',
    progress: 40,
    notes: 'Initial stages of Virechana. Patient experiencing mild fatigue, which is expected. Monitor progress closely and provide supportive care.'
  },
  {
    id: 'p3',
    name: 'Amit Singh',
    avatar: 'https://i.pravatar.cc/150?u=p3',
    lastVisit: '2024-07-29',
    currentTherapy: 'Basti',
    progress: 90,
    notes: 'Completed Basti series with excellent results. Patient reports significant reduction in chronic pain and improved mobility.'
  },
   {
    id: 'p4',
    name: 'Sunita Joshi',
    avatar: 'https://i.pravatar.cc/150?u=p4',
    lastVisit: '2024-07-26',
    currentTherapy: 'Nasya',
    progress: 60,
    notes: 'Ongoing Nasya treatment for sinus issues. Patient shows moderate improvement. Advised to continue with steam inhalation at home.'
  },
];

const now = new Date();

// Helper to set times for today for predictable demo data
const todayAt = (hour: number, minute: number = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
}


export const THERAPY_SESSIONS: TherapySession[] = [
  {
    id: 't1',
    patientId: 'p1',
    patientName: 'Raj Patel',
    therapyName: 'Abhyanga Massage',
    practitioner: 'Dr. Anya Sharma',
    startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: TherapyStatus.Upcoming,
    notes: 'Patient is looking forward to this massage to relieve shoulder tension.',
    preparation: [
        'Avoid heavy meals at least 2 hours before the session.',
        'Wear comfortable, loose-fitting clothing.',
        'Drink plenty of warm water throughout the day.',
        'Inform the practitioner of any specific areas of pain or discomfort.'
    ]
  },
  {
    id: 't2',
    patientId: 'p2',
    patientName: 'Priya Sharma',
    therapyName: 'Shirodhara',
    practitioner: 'Dr. Vivek Verma',
    startTime: todayAt(11, 30),
    endTime: todayAt(12, 30),
    status: TherapyStatus.Upcoming,
    preparation: [
        'Wash your hair on the morning of the session, but do not use any conditioner or styling products.',
        'Bring a cap, scarf, or towel to wrap your hair in afterwards, as it will be oily.',
        'Plan for a quiet, restful evening after your treatment to maximize the benefits.',
        'Avoid caffeinated beverages on the day of your session.'
    ]
  },
  {
    id: 't8',
    patientId: 'p4',
    patientName: 'Sunita Joshi',
    therapyName: 'Nasya Follow-up',
    practitioner: 'Dr. Anya Sharma',
    startTime: todayAt(14, 0),
    endTime: todayAt(14, 30),
    status: TherapyStatus.Upcoming,
    notes: 'Follow-up consultation regarding ongoing Nasya treatment.',
    preparation: []
  },
   {
    id: 't3',
    patientId: 'p3',
    patientName: 'Amit Singh',
    therapyName: 'Swedana',
    practitioner: 'Dr. Anya Sharma',
    startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 23 * 60 * 60 * 1000),
    status: TherapyStatus.Completed,
    notes: 'Session went well. Patient reported immediate feeling of lightness and clarity. Advised to drink warm water.',
  },
    {
    id: 't4',
    patientId: 'p1',
    patientName: 'Raj Patel',
    therapyName: 'Nasya',
    practitioner: 'Dr. Vivek Verma',
    startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 47 * 60 * 60 * 1000),
    status: TherapyStatus.Completed,
    notes: 'Initial resistance to nasal oil, but patient adapted well. Mild headache reported post-session, which subsided.',
  },
  {
    id: 't5',
    patientId: 'p4',
    patientName: 'Sunita Joshi',
    therapyName: 'Abhyanga Massage',
    practitioner: 'Dr. Anya Sharma',
    startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: TherapyStatus.Completed,
    notes: 'Focused on lower back and joints. Patient felt significant relief from stiffness.',
  },
  {
    id: 't6',
    patientId: 'p2',
    patientName: 'Priya Sharma',
    therapyName: 'Nasya',
    practitioner: 'Dr. Anya Sharma',
    startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: TherapyStatus.Upcoming,
    preparation: [
        'Avoid eating or drinking for at least 1 hour before the treatment.',
        'Gently blow your nose before the session begins.',
        'Relax and breathe deeply during the administration of the oil.'
    ]
  },
  {
    id: 't7',
    patientId: 'p3',
    patientName: 'Amit Singh',
    therapyName: 'Shirodhara',
    practitioner: 'Dr. Vivek Verma',
    startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    status: TherapyStatus.Completed,
    notes: 'Deeply relaxing session for the patient. He fell into a meditative state. A key part of his stress management protocol.',
  },
];

export const PROGRESS_DATA: ProgressData[] = [
    { month: 'Jan', symptomScore: 80, wellbeingScore: 40 },
    { month: 'Feb', symptomScore: 70, wellbeingScore: 50 },
    { month: 'Mar', symptomScore: 65, wellbeingScore: 55 },
    { month: 'Apr', symptomScore: 50, wellbeingScore: 65 },
    { month: 'May', symptomScore: 40, wellbeingScore: 75 },
    { month: 'Jun', symptomScore: 30, wellbeingScore: 85 },
];

export const PATIENT_FEEDBACK_DATA: FeedbackData[] = [
  { name: 'Excellent', count: 18 },
  { name: 'Good', count: 12 },
  { name: 'Satisfactory', count: 5 },
  { name: 'Needs Improvement', count: 2 },
];

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'ft1',
    name: 'Initial Ayurvedic Intake',
    description: 'A comprehensive form for new patients to detail their health history, lifestyle, and primary concerns.',
    questions: [
      { id: 'q1', questionText: 'What are your primary health concerns?', type: 'text' },
      { id: 'q2', questionText: 'Describe your typical daily diet.', type: 'text' },
      { id: 'q3', questionText: 'On a scale of 1-10, how would you rate your current stress level?', type: 'scale' },
    ],
  },
  {
    id: 'ft2',
    name: 'Weekly Wellness Check-in',
    description: 'A brief weekly survey to track patient progress and wellbeing.',
    questions: [
      { id: 'q4', questionText: 'How would you rate your sleep quality this week (1-10)?', type: 'scale' },
      { id: 'q5', questionText: 'How would you rate your energy levels this week (1-10)?', type: 'scale' },
      { id: 'q6', questionText: 'Have you experienced any new symptoms this week?', type: 'text' },
    ],
  },
];

export const SENT_FORMS: SentForm[] = [
  {
    id: 'sf1',
    patientId: 'p1',
    patientName: 'Raj Patel',
    templateId: 'ft2',
    formName: 'Weekly Wellness Check-in',
    status: FormStatusEnum.Completed,
    sentDate: '2024-07-25',
    completedDate: '2024-07-26',
  },
  {
    id: 'sf2',
    patientId: 'p2',
    patientName: 'Priya Sharma',
    templateId: 'ft1',
    formName: 'Initial Ayurvedic Intake',
    status: FormStatusEnum.Sent,
    sentDate: '2024-07-28',
  },
  {
    id: 'sf3',
    patientId: 'p1',
    patientName: 'Raj Patel',
    templateId: 'ft2',
    formName: 'Weekly Wellness Check-in',
    status: FormStatusEnum.Sent,
    sentDate: '2024-08-01',
  },
];