
import React, { useState, useMemo, useCallback } from 'react';
// Fix: Import SentForm to resolve type error.
import { FormStatus, TherapyStatus, Patient, TherapySession, ProgramTemplate, AssignedProgram, FormTemplate, VIEWS, SentForm } from '../types';
import { Card } from './GlowingCard';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { OverallProgressChart } from './OverallProgressChart';
import { ProgressChart } from './ProgressChart';
import { PlusIcon } from './icons/PlusIcon';
import { EditIcon } from './icons/EditIcon';
import { SessionHistoryModal } from './SessionHistoryModal';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { ProgramAssignmentModal } from './ProgramAssignmentModal';
import { TodaysFocus } from './TodaysFocus';
import { ProgramTimeline } from './ProgramTimeline';
import { SendFormModal } from './SendFormModal';
import { EditPatientModal } from './EditPatientModal';
import { PROGRESS_DATA } from '../constants';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

const getStatusColor = (status: FormStatus | TherapyStatus) => {
    switch (status) {
        case FormStatus.Completed:
        case TherapyStatus.Completed:
            return 'bg-green-100 text-green-800 border-green-300';
        case FormStatus.Sent:
        case TherapyStatus.Upcoming:
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

// --- SUB-COMPONENTS for PatientDetailView ---
const PatientHeader: React.FC<{ patient: Patient; onBack: () => void; onAssign: () => void; onSendForm: () => void; onEdit: () => void; hasAssignedProgram: boolean; t: (key: string, vars?: any) => string; }> = React.memo(({ patient, onBack, onAssign, onSendForm, onEdit, hasAssignedProgram, t }) => (
    <div className="relative bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-earthy-green/70"></div>
        <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <button onClick={onBack} className="flex items-center text-sm text-ivory/80 hover:text-white mb-2 group">
                        <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"/>
                        {t('back_to_patient_list')}
                    </button>
                    <div className="flex items-center gap-4">
                        <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-full border-4 border-saffron"/>
                        <div>
                            <h2 className="text-3xl font-bold text-white font-display" style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>{patient.name}</h2>
                            <p className="text-ivory/90">{t('last_visit', { date: new Date(patient.lastVisit).toLocaleDateString() })}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <button onClick={onSendForm} className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-md text-white font-semibold hover:bg-white/30 transition-colors text-sm"><PlusIcon className="w-4 h-4 mr-2"/>{t('send_form')}</button>
                    <button onClick={onEdit} className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-md text-white font-semibold hover:bg-white/30 transition-colors text-sm"><EditIcon className="w-4 h-4 mr-2"/>{t('edit_profile')}</button>
                    <button onClick={onAssign} className="flex items-center bg-gradient-to-r from-saffron to-yellow-500 px-4 py-2 rounded-md text-text-dark font-semibold hover:scale-105 transition-transform text-sm shadow"><PlusIcon className="w-4 h-4 mr-2"/>{hasAssignedProgram ? t('change_program') : t('assign_program')}</button>
                </div>
            </div>
        </div>
    </div>
));

const StatsOverview: React.FC<{ patient: Patient; programTemplate?: ProgramTemplate; programProgress: number; currentDayOfProgram: number; onAssign: () => void; onSaveNotes: (notes: string) => void; completedSessions: number; upcomingSessions: number; t: (key: string, vars?: any) => string; }> = React.memo(({ patient, programTemplate, programProgress, currentDayOfProgram, onAssign, onSaveNotes, completedSessions, upcomingSessions, t }) => {
    const [notes, setNotes] = useState(patient?.notes || '');
    const notesChanged = notes !== (patient?.notes || '');
    
    const handleSave = () => {
        onSaveNotes(notes);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col justify-center items-center">
                {programTemplate ? (
                    <>
                        <h4 className="text-lg font-semibold text-text-dark font-display mb-2 text-center">{programTemplate.name}</h4>
                        <OverallProgressChart progress={programProgress} />
                        <p className="text-sm text-text-soft -mt-4">Day {currentDayOfProgram > programTemplate.durationDays ? programTemplate.durationDays : currentDayOfProgram} of {programTemplate.durationDays}</p>
                    </>
                ) : (
                    <div className="text-center flex flex-col justify-center items-center h-full">
                        <h4 className="text-lg font-semibold text-text-dark font-display mb-2">{t('no_program_assigned')}</h4>
                        <p className="text-text-soft mb-4">{t('assign_program_cta')}</p>
                        <button onClick={onAssign} className="text-saffron font-semibold hover:underline">{t('assign_now')}</button>
                    </div>
                )}
            </Card>
            <Card className="text-center">
                <h4 className="text-lg font-semibold text-text-dark font-display mb-4">{t('sessions_overview')}</h4>
                <p className="text-4xl font-bold text-earthy-green">{completedSessions}</p>
                <p className="text-sm text-text-soft mb-4">{t('sessions_completed')}</p>
                <p className="text-4xl font-bold text-calm-blue">{upcomingSessions}</p>
                <p className="text-sm text-text-soft">{t('upcoming_sessions')}</p>
            </Card>
            <Card className="flex flex-col">
                <h4 className="text-lg font-semibold text-text-dark font-display mb-4">{t('practitioner_notes')}</h4>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('add_private_notes')} className="w-full flex-1 bg-ivory border border-border-soft rounded-lg p-3 text-sm text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-saffron resize-none"></textarea>
                 {notesChanged && (
                    <button onClick={handleSave} className="mt-2 text-sm bg-saffron text-text-dark font-semibold py-1 px-3 rounded-md hover:bg-yellow-500 transition-colors">
                        {t('save_notes')}
                    </button>
                )}
            </Card>
        </div>
    );
});

// --- MAIN COMPONENT ---
export const PatientDetailView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { selectedPatientId, patients, sessions, programTemplates, assignedPrograms, formTemplates, sentForms, users } = state;
    const { t } = useTranslation();
    
    const patient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isSendFormModalOpen, setIsSendFormModalOpen] = useState(false);
    const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);

    const onBack = useCallback(() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: VIEWS.PATIENTS }), [dispatch]);
    
    // Derived state from context
    const patientSessions = useMemo(() => sessions.filter(s => s.patientId === patient?.id), [sessions, patient?.id]);
    const patientForms = useMemo(() => sentForms.filter(f => f.patientId === patient?.id), [sentForms, patient?.id]);
    const assignedProgram = useMemo(() => assignedPrograms.find(p => p.id === patient?.assignedProgramId), [assignedPrograms, patient?.assignedProgramId]);
    const programTemplate = useMemo(() => programTemplates.find(t => t.id === assignedProgram?.templateId), [programTemplates, assignedProgram]);
    const practitioners = useMemo(() => users.filter(u => u.role === 'practitioner'), [users]);
    
    let programProgress = 0;
    let currentDayOfProgram = 0;
    if (assignedProgram && programTemplate) {
        const startDate = new Date(assignedProgram.startDate);
        const today = new Date();
        startDate.setUTCHours(0, 0, 0, 0);
        today.setUTCHours(0, 0, 0, 0);
        const diffTime = today.getTime() - startDate.getTime();
        currentDayOfProgram = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (currentDayOfProgram > 0 && currentDayOfProgram <= programTemplate.durationDays) {
            programProgress = Math.round((currentDayOfProgram / programTemplate.durationDays) * 100);
        } else if (currentDayOfProgram > programTemplate.durationDays) {
            programProgress = 100;
        }
    }

    const onAssignProgram = useCallback((patientId: string, templateId: string, startDate: string) => {
        const template = programTemplates.find(t => t.id === templateId);
        const practitioner = practitioners.length > 0 ? practitioners[0] : { name: 'Unassigned' };
        if (!template || !patient) return;
        const newAssignment: AssignedProgram = { id: `ap${Date.now()}`, patientId, templateId, startDate };
        const therapyKeywords = ['Snehana', 'Abhyanga', 'Swedana', 'Vamana', 'Virechana', 'Basti', 'Nasya', 'Shirodhara'];
        const baseStartDate = new Date(startDate + 'T00:00:00');
        const newSessions: TherapySession[] = template.schedule.flatMap(dayEntry => {
            const dayRange = dayEntry.day.split('-').map(Number);
            const startDay = dayRange[0];
            const endDay = dayRange[1] || startDay;
            const sessionsForEntry: TherapySession[] = [];
            for (let day = startDay; day <= endDay; day++) {
                const sessionDate = new Date(baseStartDate);
                sessionDate.setDate(sessionDate.getDate() + day - 1);
                const activities = [{ time: 'morning', name: dayEntry.morning, hour: 9 }, { time: 'midday', name: dayEntry.midday, hour: 13 }, { time: 'evening', name: dayEntry.evening, hour: 17 }];
                activities.forEach(activity => {
                    if (activity.name && therapyKeywords.some(keyword => activity.name!.toLowerCase().includes(keyword.toLowerCase()))) {
                        const startTime = new Date(sessionDate); startTime.setHours(activity.hour, 0, 0, 0);
                        const endTime = new Date(startTime); endTime.setHours(startTime.getHours() + 1);
                        sessionsForEntry.push({ id: `ts-${patient.id}-${day}-${activity.time}-${Math.random()}`, patientId: patient.id, patientName: patient.name, therapyName: activity.name, practitioner: practitioner.name, startTime, endTime, status: TherapyStatus.Upcoming });
                    }
                });
            }
            return sessionsForEntry;
        });
        dispatch({ type: 'ASSIGN_PROGRAM', payload: { assignment: newAssignment, newSessions } });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('program_assigned_success', { name: patient.name }), type: 'success' } });
    }, [dispatch, patient, programTemplates, practitioners, t]);
    
    const onUpdateSession = useCallback((session: TherapySession) => dispatch({ type: 'UPDATE_SESSION', payload: session }), [dispatch]);
    const onUpdatePatient = useCallback((patient: Patient) => {
        dispatch({ type: 'UPDATE_PATIENT', payload: patient });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('patient_details_updated'), type: 'success' } });
    }, [dispatch, t]);

    const onSendForm = useCallback((patientId: string, templateId: string) => {
        const patient = patients.find(p => p.id === patientId);
        const template = formTemplates.find(t => t.id === templateId);
        if (patient && template) {
            const newSentForm: SentForm = { id: `sf${sentForms.length + 1}-${Date.now()}`, patientId, patientName: patient.name, templateId, formName: template.name, status: FormStatus.Sent, sentDate: new Date().toISOString().split('T')[0] };
            dispatch({ type: 'SEND_FORM', payload: newSentForm });
            dispatch({ type: 'SHOW_TOAST', payload: { message: t('form_sent_success', { templateName: template.name, patientName: patient.name }), type: 'success' } });
        }
    }, [dispatch, patients, formTemplates, sentForms.length, t]);

    const handleAssign = (templateId: string, startDate: string) => {
        if (!patient) return;
        onAssignProgram(patient.id, templateId, startDate);
        setIsAssignModalOpen(false);
    };
    
    const handleUpdateSessionNotes = (sessionToUpdate: TherapySession, newNotes: string) => {
        onUpdateSession({ ...sessionToUpdate, notes: newNotes });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('session_note_updated'), type: 'success' } });
    };

    const handleSend = (patientId: string, templateId: string) => {
        onSendForm(patientId, templateId);
        setIsSendFormModalOpen(false);
    };

    const handleSavePatient = (updatedPatient: Patient) => {
        onUpdatePatient(updatedPatient);
        setIsEditPatientModalOpen(false);
    };
    
    const handleSaveNotes = (notes: string) => {
        if (patient) {
            onUpdatePatient({ ...patient, notes });
            dispatch({ type: 'SHOW_TOAST', payload: { message: t('patient_notes_saved'), type: 'success' } });
        }
    };

    if (!patient) {
        return <div className="p-8">{t('patient_not_found')}<button onClick={onBack}>{t('go_back')}</button></div>;
    }

    const completedSessions = patientSessions.filter(s => s.status === TherapyStatus.Completed).length;
    const upcomingSessions = patientSessions.filter(s => s.status === TherapyStatus.Upcoming).length;
    
    return (
        <div className="animate-fade-in-up">
            <PatientHeader patient={patient} onBack={onBack} onAssign={() => setIsAssignModalOpen(true)} onSendForm={() => setIsSendFormModalOpen(true)} onEdit={() => setIsEditPatientModalOpen(true)} hasAssignedProgram={!!assignedProgram} t={t} />

            <div className="p-8 space-y-8">
                <StatsOverview patient={patient} programTemplate={programTemplate} programProgress={programProgress} currentDayOfProgram={currentDayOfProgram} onAssign={() => setIsAssignModalOpen(true)} onSaveNotes={handleSaveNotes} completedSessions={completedSessions} upcomingSessions={upcomingSessions} t={t} />
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <Card><h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('wellness_journey_trend')}</h3><ProgressChart data={PROGRESS_DATA} /></Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-text-dark font-display">{t('session_history')}</h3><button onClick={() => setIsHistoryModalOpen(true)} className="flex items-center text-sm font-semibold text-saffron hover:underline group">{t('view_all')} <ExternalLinkIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></button></div>
                                <div className="overflow-y-auto max-h-80 pr-2 hide-scrollbar">
                                    <table className="w-full text-left"><tbody>{patientSessions.sort((a,b) => b.startTime.getTime() - a.startTime.getTime()).map(session => (<tr key={session.id} className="border-b border-border-soft last:border-b-0"><td className="p-3"><p className="font-medium text-text-dark">{session.therapyName}</p></td><td className="p-3 text-right"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(session.status)}`}>{session.status}</span></td></tr>))}</tbody></table>
                                    {patientSessions.length === 0 && <p className="text-center text-text-soft py-4">{t('no_sessions_scheduled')}</p>}
                                </div>
                            </Card>
                            <Card>
                                <h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('forms_surveys')}</h3>
                                <div className="overflow-y-auto max-h-80 pr-2 hide-scrollbar">
                                    <table className="w-full text-left"><tbody>{patientForms.sort((a,b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()).map(form => (<tr key={form.id} className="border-b border-border-soft last:border-b-0"><td className="p-3"><p className="font-medium text-text-dark">{form.formName}</p></td><td className="p-3 text-right"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(form.status)}`}>{form.status}</span></td></tr>))}</tbody></table>
                                    {patientForms.length === 0 && <p className="text-center text-text-soft py-4">{t('no_forms_sent_patient')}</p>}
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        {programTemplate && (<Card><h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('todays_focus', {day: currentDayOfProgram})}</h3><TodaysFocus template={programTemplate} currentDay={currentDayOfProgram} /></Card>)}
                        {programTemplate && (<Card><h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('full_program_journey')}</h3><div className="max-h-96 overflow-y-auto pr-2 hide-scrollbar"><ProgramTimeline schedule={programTemplate.schedule} currentDay={currentDayOfProgram} durationDays={programTemplate.durationDays} /></div></Card>)}
                    </div>
                </div>
            </div>

            {isHistoryModalOpen && <SessionHistoryModal sessions={patientSessions} patientName={patient.name} onClose={() => setIsHistoryModalOpen(false)} onUpdateSessionNotes={handleUpdateSessionNotes}/>}
            {isAssignModalOpen && <ProgramAssignmentModal onClose={() => setIsAssignModalOpen(false)} onAssign={handleAssign} templates={programTemplates}/>}
            {isSendFormModalOpen && <SendFormModal onClose={() => setIsSendFormModalOpen(false)} onSend={handleSend} patients={[patient]} templates={formTemplates}/>}
            {isEditPatientModalOpen && <EditPatientModal patient={patient} onClose={() => setIsEditPatientModalOpen(false)} onSave={handleSavePatient}/>}
        </div>
    );
};
