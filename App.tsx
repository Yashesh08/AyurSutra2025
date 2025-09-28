import React, { useState, useEffect, createContext, useMemo, useCallback, lazy, Suspense, useContext, useReducer } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
// Fix: Import `Theme` to support theme toggling functionality.
import { User, TherapySession, Patient, ProgramTemplate, AssignedProgram, TherapyStatus, FormTemplate, SentForm, FormStatus, AppState, AppContextState, Action, VIEWS, Toast, Theme } from './types';
import { USERS } from './constants/users';
import { THERAPY_SESSIONS, PATIENTS, PROGRAM_TEMPLATES, ASSIGNED_PROGRAMS, FORM_TEMPLATES, SENT_FORMS } from './constants';
import { Logo } from './components/icons/Logo';
import { LanguageProvider, useTranslation } from './i18n';

// Lazy load view components for code splitting
const AdminDashboardView = lazy(() => import('./components/DashboardView').then(module => ({ default: module.AdminDashboardView })));
const PractitionerDashboardView = lazy(() => import('./components/PractitionerDashboardView').then(module => ({ default: module.PractitionerDashboardView })));
const UserDashboardView = lazy(() => import('./components/UserDashboardView').then(module => ({ default: module.UserDashboardView })));
const ScheduleView = lazy(() => import('./components/ScheduleView').then(module => ({ default: module.ScheduleView })));
const PractitionersView = lazy(() => import('./components/PractitionersView').then(module => ({ default: module.PractitionersView })));
const ProfileView = lazy(() => import('./components/ProfileView').then(module => ({ default: module.ProfileView })));
const ProgressReportView = lazy(() => import('./components/ProgressReportView').then(module => ({ default: module.ProgressReportView })));
const PatientManagementView = lazy(() => import('./components/PatientManagementView').then(module => ({ default: module.PatientManagementView })));
const FormsSurveyView = lazy(() => import('./components/FormsSurveyView').then(module => ({ default: module.FormsSurveyView })));
const PatientDetailView = lazy(() => import('./components/PatientDetailView').then(module => ({ default: module.PatientDetailView })));
const ProgramTemplatesView = lazy(() => import('./components/ProgramTemplatesView').then(module => ({ default: module.ProgramTemplatesView })));
const PatientProgramSelectionView = lazy(() => import('./components/PatientProgramSelectionView').then(module => ({ default: module.PatientProgramSelectionView })));


// Fix: Create and export ThemeContext required by ThemeToggle.tsx to fix compilation errors.
export const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void; }>({
  theme: Theme.Light,
  setTheme: () => console.warn('no theme provider'),
});

// --- GLOBAL APP CONTEXT & STATE MANAGEMENT ---
const AppContext = createContext<{ state: AppContextState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const initialState: AppContextState = {
  appState: 'landing',
  currentUser: null,
  activeView: VIEWS.DASHBOARD,
  selectedPatientId: null,
  authError: null,
  isSidebarOpen: false,
  sessions: THERAPY_SESSIONS,
  patients: PATIENTS,
  programTemplates: PROGRAM_TEMPLATES,
  assignedPrograms: ASSIGNED_PROGRAMS,
  users: USERS,
  formTemplates: FORM_TEMPLATES,
  sentForms: SENT_FORMS,
  toast: null,
  patientSearchTerm: null,
};

function appReducer(state: AppContextState, action: Action): AppContextState {
  switch (action.type) {
    case 'SET_APP_STATE':
      return { ...state, appState: action.payload, authError: null };
    case 'LOGIN_SUCCESS':
      return { ...state, currentUser: action.payload, appState: 'app', authError: null, activeView: VIEWS.DASHBOARD };
    case 'LOGIN_FAIL':
      return { ...state, authError: action.payload };
    case 'LOGOUT':
      return { ...initialState, appState: 'landing', users: state.users }; // Keep users list
    case 'REGISTER_SUCCESS':
        return { ...state, currentUser: action.payload, appState: 'app', authError: null, users: [...state.users, action.payload] };
    case 'SET_ACTIVE_VIEW':
        const isPatientContext = action.payload === VIEWS.PATIENTS || action.payload === VIEWS.PATIENT_DETAIL;
        return { 
            ...state, 
            activeView: action.payload, 
            selectedPatientId: null,
            patientSearchTerm: isPatientContext ? state.patientSearchTerm : null
        };
    case 'SET_SELECTED_PATIENT':
      return { ...state, selectedPatientId: action.payload, activeView: VIEWS.PATIENT_DETAIL };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'ADD_SESSION':
        return { ...state, sessions: [...state.sessions, action.payload] };
    case 'UPDATE_SESSION':
        return { ...state, sessions: state.sessions.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SESSION':
        return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };
    case 'UPDATE_USER': {
        const updatedUser = action.payload;
        const oldUser = state.users.find(u => u.id === updatedUser.id);
    
        // 1. Update users array
        const newUsers = state.users.map(u => (u.id === updatedUser.id ? updatedUser : u));
        
        // 2. Update patients array if the user has patientData
        const newPatients = updatedUser.patientData
            ? state.patients.map(p => (p.id === updatedUser.patientData!.id ? updatedUser.patientData! : p))
            : state.patients;
    
        let newSessions = state.sessions;
        // 3. If preferredTimeSlot changed for a user, update all their future sessions
        if (updatedUser.role === 'user' && updatedUser.preferredTimeSlot && oldUser?.preferredTimeSlot !== updatedUser.preferredTimeSlot) {
            const timeSlotToHour = { morning: 9, noon: 13, evening: 17 };
            const newHour = timeSlotToHour[updatedUser.preferredTimeSlot];
    
            newSessions = state.sessions.map(session => {
                if (session.patientId === updatedUser.id && session.startTime > new Date() && session.status === TherapyStatus.Upcoming) {
                    const currentDuration = session.endTime.getTime() - session.startTime.getTime();
                    const newStartTime = new Date(session.startTime);
                    newStartTime.setHours(newHour, 0, 0, 0);
                    const newEndTime = new Date(newStartTime.getTime() + currentDuration);
                    return { ...session, startTime: newStartTime, endTime: newEndTime };
                }
                return session;
            });
        }
    
        return {
            ...state,
            users: newUsers,
            patients: newPatients,
            sessions: newSessions,
            currentUser: state.currentUser?.id === updatedUser.id ? updatedUser : state.currentUser,
        };
    }
    case 'UPDATE_PATIENT':
        const newPatients = state.patients.map(p => p.id === action.payload.id ? action.payload : p);
        const usersWithUpdatedPatient = state.users.map(u => u.id === action.payload.id ? { ...u, name: action.payload.name, avatar: action.payload.avatar, patientData: action.payload } : u);
        return { ...state, patients: newPatients, users: usersWithUpdatedPatient, currentUser: state.currentUser?.id === action.payload.id ? { ...state.currentUser, name: action.payload.name, avatar: action.payload.avatar, patientData: action.payload } : state.currentUser };
    case 'ADD_PATIENT':
        return { ...state, patients: [...state.patients, action.payload.patient], users: [...state.users, action.payload.user] };
    case 'DELETE_PATIENT':
        return { ...state, patients: state.patients.filter(p => p.id !== action.payload), users: state.users.filter(u => u.id !== action.payload) };
    case 'ADD_PRACTITIONER':
        return { ...state, users: [...state.users, action.payload] };
    case 'SEND_FORM':
        return { ...state, sentForms: [action.payload, ...state.sentForms].sort((a,b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()) };
    case 'CREATE_FORM_TEMPLATE':
        return { ...state, formTemplates: [action.payload, ...state.formTemplates] };
    case 'CREATE_PROGRAM_TEMPLATE':
        return { ...state, programTemplates: [...state.programTemplates, action.payload] };
    case 'ASSIGN_PROGRAM':
        const otherAssignments = state.assignedPrograms.filter(p => p.patientId !== action.payload.assignment.patientId);
        return {
            ...state,
            assignedPrograms: [...otherAssignments, action.payload.assignment],
            patients: state.patients.map(p => p.id === action.payload.assignment.patientId ? { ...p, assignedProgramId: action.payload.assignment.id } : p),
            sessions: [...state.sessions, ...action.payload.newSessions]
        };
    case 'SET_SIDEBAR_OPEN':
        return { ...state, isSidebarOpen: action.payload };
    case 'SET_PATIENT_SEARCH_TERM':
        return { ...state, patientSearchTerm: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: { ...action.payload, id: Date.now() } };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

// --- UI COMPONENTS ---
const FullScreenLoader: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex-1 flex items-center justify-center bg-ivory">
            <div className="text-center">
            <Logo size={60} className="animate-spin mx-auto" />
            <p className="text-text-soft mt-4 font-semibold">{t('loading_experience')}</p>
            </div>
        </div>
    );
};

const ToastComponent: React.FC<{ toast: Toast, onDismiss: () => void }> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    const bgColor = toast.type === 'success' ? 'bg-earthy-green' : 'bg-red-500';

    return (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-lg text-white shadow-lg animate-fade-in-up ${bgColor}`}>
            {toast.message}
        </div>
    );
};

// --- MAIN APP VIEW ---
const MainAppView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { appState, currentUser, activeView, selectedPatientId, authError, isSidebarOpen, toast } = state;

    const renderActiveView = () => {
        if (!currentUser) return null;
        
        if (activeView === VIEWS.PATIENT_DETAIL && selectedPatientId) {
            return <PatientDetailView />;
        }

        switch (activeView) {
            case VIEWS.DASHBOARD:
                if (currentUser.role === 'admin') return <AdminDashboardView />;
                if (currentUser.role === 'practitioner') return <PractitionerDashboardView />;
                return <UserDashboardView />;
            case VIEWS.SCHEDULE:
                return <ScheduleView />;
            case VIEWS.PATIENTS:
                return (currentUser.role === 'admin' || currentUser.role === 'practitioner') ? <PatientManagementView /> : null;
            case VIEWS.PROGRAMS:
                return (currentUser.role === 'admin' || currentUser.role === 'practitioner') ? <ProgramTemplatesView /> : <PatientProgramSelectionView />;
            case VIEWS.FORMS:
                return (currentUser.role === 'admin' || currentUser.role === 'practitioner') ? <FormsSurveyView /> : null;
            case VIEWS.PRACTITIONERS:
                return currentUser.role === 'admin' ? <PractitionersView /> : null;
            case VIEWS.PROFILE:
                return <ProfileView />;
            case VIEWS.PROGRESS:
                return currentUser.role === 'user' ? <ProgressReportView /> : null;
            default:
                if (currentUser.role === 'admin') return <AdminDashboardView />;
                if (currentUser.role === 'practitioner') return <PractitionerDashboardView />;
                return <UserDashboardView />;
        }
    };

    if (appState === 'landing') {
        return <LandingPage onLoginClick={() => dispatch({ type: 'SET_APP_STATE', payload: 'auth' })} />;
    }

    if (appState === 'auth') {
        return <LoginPage error={authError} />;
    }

    if (appState === 'app' && currentUser) {
        return (
            <div className={`relative flex h-screen font-sans bg-ivory text-text-dark overflow-hidden`}>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false })}
                    ></div>
                )}
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <div className="flex-1 overflow-y-auto">
                        <Suspense fallback={<FullScreenLoader />}>
                            {renderActiveView()}
                        </Suspense>
                    </div>
                </main>
                {toast && <ToastComponent toast={toast} onDismiss={() => dispatch({ type: 'HIDE_TOAST' })} />}
            </div>
        );
    }

    return <LandingPage onLoginClick={() => dispatch({ type: 'SET_APP_STATE', payload: 'auth' })} />;
};

// --- ROOT COMPONENT ---
// Fix: Add theme state management and provider for ThemeContext to make the theme toggle functional.
const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  useEffect(() => {
    // This is a common pattern for TailwindCSS dark mode
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <AppProvider>
      <LanguageProvider>
        <ThemeContext.Provider value={themeValue}>
          <MainAppView />
        </ThemeContext.Provider>
      </LanguageProvider>
    </AppProvider>
  );
};

export default App;
