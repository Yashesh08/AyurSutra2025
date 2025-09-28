import React, { useState } from 'react';
import { ProgramTemplate } from '../types';
import { ProgramTimeline } from './ProgramTimeline';
import { useTranslation } from '../i18n';

type TimePreference = 'morning' | 'noon' | 'evening';

interface ProgramSelectionModalProps {
    template: ProgramTemplate;
    onClose: () => void;
    onConfirm: (templateId: string, startDate: string, timePreference: TimePreference) => void;
}

const getAvailableStartDates = (): { value: string; label: string }[] => {
    const availableDates: { value: string; label: string }[] = [];
    const today = new Date();
    let currentDate = new Date(today);
    const maxDates = 8; // Find the next 8 available dates (e.g., next 4 weeks of Mon/Thurs)

    while (availableDates.length < maxDates) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();

        // 1 for Monday, 4 for Thursday - simulating clinic availability
        if (dayOfWeek === 1 || dayOfWeek === 4) {
            const value = currentDate.toISOString().split('T')[0];
            const label = currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            availableDates.push({ value, label });
        }
    }
    return availableDates;
};

const TimePreferenceButton: React.FC<{ preference: TimePreference; selected: TimePreference; onClick: (pref: TimePreference) => void; children: React.ReactNode; }> = ({ preference, selected, onClick, children }) => {
    const isSelected = preference === selected;
    return (
        <button
            type="button"
            onClick={() => onClick(preference)}
            className={`flex-1 text-center py-2 px-2 text-sm font-semibold rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                ? 'bg-saffron text-text-dark border-saffron shadow-sm' 
                : 'bg-ivory text-text-soft border-border-soft hover:border-saffron/50'
            }`}
        >
            {children}
        </button>
    );
};

export const ProgramSelectionModal: React.FC<ProgramSelectionModalProps> = ({ template, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const [availableDates] = useState(getAvailableStartDates());
    const [startDate, setStartDate] = useState<string>(availableDates[0]?.value || '');
    const [timePreference, setTimePreference] = useState<TimePreference>('morning');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(template.id, startDate, timePreference);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{template.name}</h2>
                    <p className="text-sm text-text-soft">{template.description}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
                     <h3 className="text-lg font-semibold text-text-dark font-display">{t('program_journey_overview')}</h3>
                     <div className="max-h-96 pr-2">
                        {/* Assuming currentDay=0 makes the whole timeline 'future' styled */}
                        <ProgramTimeline schedule={template.schedule} currentDay={0} durationDays={template.durationDays} />
                     </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border-soft">
                        <div className="w-full space-y-4">
                             <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-text-dark mb-1">{t('select_start_date')}</label>
                                <select
                                    id="start-date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    required
                                    className="w-full py-2.5 px-4 bg-ivory border border-border-soft rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron"
                                >
                                    {availableDates.map(date => (
                                        <option key={date.value} value={date.value}>{date.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-2">{t('select_therapy_time')}</label>
                                <div className="flex gap-2">
                                    <TimePreferenceButton preference="morning" selected={timePreference} onClick={setTimePreference}>{t('morning')}</TimePreferenceButton>
                                    <TimePreferenceButton preference="noon" selected={timePreference} onClick={setTimePreference}>{t('afternoon')}</TimePreferenceButton>
                                    <TimePreferenceButton preference="evening" selected={timePreference} onClick={setTimePreference}>{t('evening')}</TimePreferenceButton>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-4">
                            <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                                {t('cancel')}
                            </button>
                            <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                                {t('confirm_and_begin')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
