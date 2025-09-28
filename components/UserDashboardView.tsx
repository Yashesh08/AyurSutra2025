import React, { useState, useMemo } from 'react';
import { TherapyStatus, FormStatus, TherapySession, VIEWS } from '../types';
import { Card } from './GlowingCard';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { SessionDetailsModal } from './SessionDetailsModal';
import { OverallProgressChart } from './OverallProgressChart';
import { ProgramTimeline } from './ProgramTimeline';
import { TodaysFocus } from './TodaysFocus';
import { useAppContext } from '../App';
import { EditIcon } from './icons/EditIcon';
import { ChangeSessionTimeModal } from './ChangeSessionTimeModal';
import { useTranslation } from '../i18n';

export const UserDashboardView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { currentUser, sessions, programTemplates, assignedPrograms, sentForms } = state;
    const { t } = useTranslation();
    
    const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
    const [sessionToEditTime, setSessionToEditTime] = useState<TherapySession | null>(null);

    if (!currentUser) return null;

    const { name } = currentUser;
    const userSessions = sessions.filter(
        session => session.patientId === currentUser.id && session.status === TherapyStatus.Upcoming
    );
    const pendingForms = sentForms.filter(
        form => form.patientId === currentUser.id && form.status === FormStatus.Sent
    );

    const assignedProgram = useMemo(() =>
        assignedPrograms.find(p => p.patientId === currentUser.id),
        [assignedPrograms, currentUser.id]
    );

    const programTemplate = useMemo(() =>
        programTemplates.find(t => t.id === assignedProgram?.templateId),
        [programTemplates, assignedProgram]
    );
    
    let programProgress = 0;
    let currentDayOfProgram = 0;
    if (assignedProgram && programTemplate) {
        const startDate = new Date(assignedProgram.startDate);
        const today = new Date();
        startDate.setUTCHours(0, 0, 0, 0);
        today.setUTCHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - startDate.getTime();
        currentDayOfProgram = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
        
        if (currentDayOfProgram > 0 && currentDayOfProgram <= programTemplate.durationDays) {
            programProgress = Math.round((currentDayOfProgram / programTemplate.durationDays) * 100);
        } else if (currentDayOfProgram > programTemplate.durationDays) {
            programProgress = 100;
        }
    }

    const handleTakeForm = () => {
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('feature_coming_soon'), type: 'error' } });
    };

    const handleSessionTimeChange = (sessionId: string, newTimeSlot: 'morning' | 'noon' | 'evening') => {
        const session = userSessions.find(s => s.id === sessionId);
        if (!session) return;

        const timeSlotToHour = { morning: 9, noon: 13, evening: 17 };
        const newHour = timeSlotToHour[newTimeSlot];

        const currentDuration = session.endTime.getTime() - session.startTime.getTime();
        const newStartTime = new Date(session.startTime);
        newStartTime.setHours(newHour, 0, 0, 0);
        const newEndTime = new Date(newStartTime.getTime() + currentDuration);

        const updatedSession = { ...session, startTime: newStartTime, endTime: newEndTime };

        dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('session_time_updated'), type: 'success' } });
        setSessionToEditTime(null);
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in-up">
            <h2 className="text-xl md:text-2xl font-bold text-text-dark font-display">{t('welcome_back_user', { name })}</h2>
            
            {pendingForms.length > 0 && (
                <Card className="bg-saffron/20 border-saffron animate-subtle-pulse">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-text-dark font-display">{t('action_required')}</h3>
                            <p className="text-text-dark mt-1 text-sm">{t('forms_to_complete', { count: pendingForms.length })}</p>
                        </div>
                        <button 
                            onClick={handleTakeForm}
                            className="w-full md:w-auto flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform shadow-sm text-sm"
                        >
                            {t('fill_out_now')} <ChevronRightIcon className="w-4 h-4 ml-1"/>
                        </button>
                    </div>
                </Card>
            )}

            {programTemplate && assignedProgram ? (
                 <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        <Card className="lg:col-span-2 flex flex-col justify-center items-center">
                            <h3 className="text-base md:text-lg font-bold text-text-dark font-display text-center mb-1">{programTemplate.name}</h3>
                            <OverallProgressChart progress={programProgress} />
                            <p className="text-sm text-text-soft -mt-4">
                                Day {currentDayOfProgram > programTemplate.durationDays ? programTemplate.durationDays : currentDayOfProgram} of {programTemplate.durationDays}
                            </p>
                        </Card>
                        
                        <Card>
                            <h3 className="text-base md:text-lg font-bold text-text-dark mb-3 font-display">{t('todays_focus', {day: ''}).replace('(Day )', '').trim()}</h3>
                             <TodaysFocus template={programTemplate} currentDay={currentDayOfProgram} />
                        </Card>
                    </div>

                    <Card>
                        <h3 className="text-base md:text-lg font-bold text-text-dark mb-3 font-display">{t('full_program_journey')}</h3>
                        <div className="max-h-80 overflow-y-auto pr-2 hide-scrollbar">
                            <ProgramTimeline schedule={programTemplate.schedule} currentDay={currentDayOfProgram} durationDays={programTemplate.durationDays} />
                        </div>
                    </Card>
                </>
            ) : (
                <Card className="text-center py-8 sm:py-12">
                    <h3 className="text-lg md:text-xl font-bold text-text-dark font-display">{t('your_wellness_journey_awaits')}</h3>
                    <p className="text-text-soft mt-2 max-w-lg mx-auto text-sm">
                        {t('explore_our_programs_cta')}
                        <button onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: VIEWS.PROGRAMS })} className="font-bold text-earthy-green hover:underline ml-1">{t('browse_programs')}</button>
                    </p>
                </Card>
            )}

            <Card>
                <h3 className="text-base md:text-lg font-bold text-text-dark mb-3 font-display">{t('my_upcoming_sessions_user')}</h3>
                <div className="space-y-2">
                    {userSessions.length > 0 ? userSessions.slice(0, 3).map(session => {
                        const isFuture = session.startTime > new Date();
                        return (
                            <div 
                                key={session.id} 
                                className="w-full text-left p-2 bg-ivory rounded-lg border-l-4 border-calm-blue hover:bg-sand transition-colors flex justify-between items-center"
                            >
                                <button onClick={() => setSelectedSession(session)} className="flex-grow text-left">
                                    <p className="font-semibold text-text-dark text-sm">{session.therapyName}</p>
                                    <p className="text-sm text-text-soft">{t('with_practitioner', { practitioner: session.practitioner })}</p>
                                    <p className="text-xs text-calm-blue mt-1 font-semibold">
                                        {session.startTime.toLocaleDateString()} at {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </button>
                                {isFuture && (
                                    <button 
                                        onClick={() => setSessionToEditTime(session)}
                                        className="ml-2 flex-shrink-0 bg-sand px-2 py-1 rounded-md text-xs text-text-dark font-semibold hover:bg-border-soft transition-colors"
                                        title={t('change_time')}
                                    >
                                        {t('change_time')}
                                    </button>
                                )}
                            </div>
                        );
                    }) : <p className="text-text-soft text-center py-2">{t('no_upcoming_sessions_scheduled')}</p>}
                </div>
            </Card>

            {selectedSession && (
                <SessionDetailsModal 
                    session={selectedSession} 
                    onClose={() => setSelectedSession(null)} 
                />
            )}
             {sessionToEditTime && (
                <ChangeSessionTimeModal 
                    session={sessionToEditTime} 
                    onClose={() => setSessionToEditTime(null)} 
                    onSave={handleSessionTimeChange}
                />
            )}
        </div>
    );
};
