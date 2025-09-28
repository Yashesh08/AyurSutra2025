import React, { useState, useCallback } from 'react';
import { ProgramTemplate, TherapySession, AssignedProgram, TherapyStatus, VIEWS } from '../types';
import { Card } from './GlowingCard';
import { ProgramSelectionModal } from './ProgramSelectionModal';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

export const PatientProgramSelectionView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { programTemplates, currentUser, users } = state;
    const { t } = useTranslation();

    const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);

    const practitioners = React.useMemo(() => users.filter(u => u.role === 'practitioner'), [users]);

    const handleSelectProgram = useCallback((templateId: string, startDate: string, timePreference: 'morning' | 'noon' | 'evening') => {
        if (!currentUser || currentUser.role !== 'user') return;
        
        const template = programTemplates.find(t => t.id === templateId);
        const practitioner = practitioners.length > 0 ? practitioners[0] : { name: 'Unassigned' };
        if (!template) return;
        
        const timeSlotToHour: Record<'morning' | 'noon' | 'evening', number> = {
            morning: 9,
            noon: 13,
            evening: 17,
        };
        const preferredHour = timeSlotToHour[currentUser.preferredTimeSlot || timePreference];

        const newAssignment: AssignedProgram = { id: `ap${Date.now()}`, patientId: currentUser.id, templateId, startDate };
        const therapyKeywords = ['Snehana', 'Abhyanga', 'Swedana', 'Vamana', 'Virechana', 'Basti', 'Nasya', 'Shirodhara'];
        const baseStartDate = new Date(startDate + 'T00:00:00');
        const newSessions: TherapySession[] = template.schedule.flatMap(dayEntry => {
            const dayRange = dayEntry.day.split('-').map(Number);
            const sessionsForEntry: TherapySession[] = [];
            for (let day = dayRange[0]; day <= (dayRange[1] || dayRange[0]); day++) {
                let therapyScheduledForDay = false;
                const sessionDate = new Date(baseStartDate);
                sessionDate.setDate(sessionDate.getDate() + day - 1);
                
                const activities = [
                    { name: dayEntry.morning, defaultHour: 9 }, 
                    { name: dayEntry.midday, defaultHour: 13 }, 
                    { name: dayEntry.evening, defaultHour: 17 }
                ];

                activities.forEach(activity => {
                    if (activity.name && therapyKeywords.some(keyword => activity.name!.toLowerCase().includes(keyword.toLowerCase()))) {
                        let hourToUse = activity.defaultHour;
                        if (!therapyScheduledForDay) {
                            hourToUse = preferredHour;
                            therapyScheduledForDay = true;
                        }

                        const startTime = new Date(sessionDate); startTime.setHours(hourToUse, 0, 0, 0);
                        const endTime = new Date(startTime); endTime.setHours(startTime.getHours() + 1);
                        sessionsForEntry.push({ id: `ts-${currentUser.id}-${day}-${activity.name}-${Math.random()}`, patientId: currentUser.id, patientName: currentUser.name, therapyName: activity.name, practitioner: practitioner.name, startTime, endTime, status: TherapyStatus.Upcoming });
                    }
                });
            }
            return sessionsForEntry;
        });

        dispatch({ type: 'ASSIGN_PROGRAM', payload: { assignment: newAssignment, newSessions } });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('program_started_success', { name: template.name }), type: 'success' } });
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: VIEWS.DASHBOARD });
    }, [currentUser, programTemplates, practitioners, dispatch, t]);

    return (
        <div className="p-8 space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-3xl font-bold text-text-dark font-display">{t('browse_wellness_programs')}</h2>
                <p className="text-text-soft">{t('browse_programs_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {programTemplates.map(template => (
                    <Card key={template.id} className="flex flex-col">
                        <h3 className="text-xl font-bold text-text-dark mb-2 font-display">{template.name}</h3>
                        <p className="text-sm text-text-soft mb-4 flex-grow">{template.description}</p>
                        <p className="text-sm font-semibold text-earthy-green mb-4">{t('day_program_duration', { durationDays: template.durationDays })}</p>
                        
                        <div className="border-t border-border-soft pt-4 mt-auto">
                           <button 
                                onClick={() => setSelectedTemplate(template)}
                                className="w-full flex items-center justify-center bg-sand border border-border-soft rounded-lg py-2 px-4 text-text-dark font-semibold hover:bg-saffron hover:text-white transition-colors duration-300 group"
                            >
                                {t('view_and_select_program')}
                                <ChevronRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
            
            {selectedTemplate && (
                <ProgramSelectionModal 
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                    onConfirm={handleSelectProgram}
                />
            )}
        </div>
    );
};
