// Fix: Add the Theme enum required by ThemeToggle.tsx.
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum VIEWS {
  DASHBOARD = 'dashboard',
  SCHEDULE = 'schedule',
  PATIENTS = 'patients',
  PATIENT_DETAIL = 'patient_detail',
  PROGRAMS = 'programs',
  FORMS = 'forms',
  PRACTITIONERS = 'practitioners',
  PROFILE = 'profile',
  PROGRESS = 'progress',
}

export enum TherapyStatus {
  Completed = 'Completed',
  Upcoming = 'Upcoming',
  InProgress = 'In Progress',
  Cancelled = 'Cancelled',
}

export enum FormStatus {
  Sent = 'Sent',
  Completed = 'Completed',
}

export interface DoctorReview {
  patientName: string;
  rating: number; // out of 5
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not ideal for frontend, but for mock purposes
  role: 'admin' | 'practitioner' | 'user';
  avatar: string;
  preferredTimeSlot?: 'morning' | 'noon' | 'evening';
  patientData?: Patient; // Link to patient-specific data
  specialty?: string;
  bio?: string;
  reviews?: DoctorReview[];
  yearsOfExperience?: number;
}

export interface Patient {
  id:string;
  name: string;
  avatar: string;
  lastVisit: string;
  currentTherapy: string;
  progress: number; // percentage
  notes?: string;
  preferredTimeSlot?: 'morning' | 'noon' | 'evening';
  assignedProgramId?: string;
}

export interface TherapySession {
  id: string;
  patientName: string;
  patientId: string;
  therapyName: string;
  practitioner: string;
  startTime: Date;
  endTime: Date;
  status: TherapyStatus;
  notes?: string;
  preparation?: string[];
}

export interface ProgressData {
  month: string;
  symptomScore: number;
  wellbeingScore: number;
}

export interface FeedbackData {
  name: string;
  count: number;
}

export interface FormQuestion {
  id: string;
  questionText: string;
  type: 'text' | 'scale' | 'multiple-choice';
  options?: string[]; // For multiple-choice
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  questions: FormQuestion[];
}

export interface SentForm {
  id: string;
  patientId: string;
  patientName: string;
  templateId: string;
  formName: string;
  status: FormStatus;
  sentDate: string;
  completedDate?: string;
}

export interface PanchakarmaProgramDay {
  day: string; // e.g., "1-3", "7"
  morning?: string;
  midday?: string;
  evening?: string;
  notes?: string;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  schedule: PanchakarmaProgramDay[];
}

export interface AssignedProgram {
  id: string;
  patientId: string;
  templateId: string;
  startDate: string; // YYYY-MM-DD
}


// New Types for Global Context
export type AppState = 'landing' | 'auth' | 'app';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface AppContextState {
  appState: AppState;
  currentUser: User | null;
  activeView: VIEWS;
  selectedPatientId: string | null;
  authError: string | null;
  isSidebarOpen: boolean;
  sessions: TherapySession[];
  patients: Patient[];
  programTemplates: ProgramTemplate[];
  assignedPrograms: AssignedProgram[];
  users: User[];
  formTemplates: FormTemplate[];
  sentForms: SentForm[];
  toast: Toast | null;
  patientSearchTerm: string | null;
}

export type Action =
  | { type: 'SET_APP_STATE'; payload: AppState }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'SET_ACTIVE_VIEW'; payload: VIEWS }
  | { type: 'SET_SELECTED_PATIENT'; payload: string | null }
  | { type: 'SET_SESSIONS'; payload: TherapySession[] }
  | { type: 'ADD_SESSION'; payload: TherapySession }
  | { type: 'UPDATE_SESSION'; payload: TherapySession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'ADD_PATIENT'; payload: { patient: Patient; user: User } }
  | { type: 'DELETE_PATIENT'; payload: string }
  | { type: 'ADD_PRACTITIONER'; payload: User }
  | { type: 'SEND_FORM'; payload: SentForm }
  | { type: 'CREATE_FORM_TEMPLATE'; payload: FormTemplate }
  | { type: 'CREATE_PROGRAM_TEMPLATE'; payload: ProgramTemplate }
  | { type: 'ASSIGN_PROGRAM'; payload: { assignment: AssignedProgram; newSessions: TherapySession[] } }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_PATIENT_SEARCH_TERM'; payload: string | null }
  | { type: 'SHOW_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'HIDE_TOAST' };