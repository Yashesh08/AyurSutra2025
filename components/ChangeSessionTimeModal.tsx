import React, { useState } from 'react';
import { TherapySession } from '../types';
import { useTranslation } from '../i18n';

interface ChangeSessionTimeModalProps {
    session: TherapySession;
    onClose: () => void;
    onSave: (sessionId: string, newTimeSlot: 'morning' | 'noon' | 'evening') => void;
}

type TimePreference = 'morning' | 'noon' | 'evening';

const getCurrentTimeSlot = (date: Date): TimePreference => {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'noon';
    return 'evening';
};

const TimePreferenceButton: React.FC<{ preference: TimePreference; selected: TimePreference; onClick: (pref: TimePreference) => void; children: React.ReactNode; }> = ({ preference, selected, onClick, children }) => {
    const isSelected = preference === selected;
    return (
        <button
            type="button"
            onClick={() => onClick(preference)}
            className={`flex-1 text-center py-3 px-3 text-sm font-semibold rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                ? 'bg-saffron text-text-dark border-saffron shadow-sm' 
                : 'bg-ivory text-text-soft border-border-soft hover:border-saffron/50'
            }`}
        >
            {children}
        </button>
    );
};

export const ChangeSessionTimeModal: React.FC<ChangeSessionTimeModalProps> = ({ session, onClose, onSave }) => {
    const { t } = useTranslation();
    const [selectedTime, setSelectedTime] = useState<TimePreference>(() => getCurrentTimeSlot(session.startTime));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(session.id, selectedTime);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('change_session_time')}</h2>
                    <p className="text-sm text-text-soft">{t('for_colon')} <span className="font-semibold">{session.therapyName}</span></p>
                    <p className="text-sm text-text-soft">{t('date_colon_label')} <span className="font-semibold">{session.startTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label className="block text-sm font-medium text-text-dark mb-2">{t('select_new_time_slot')}</label>
                        <div className="flex gap-2 mt-2">
                            <TimePreferenceButton preference="morning" selected={selectedTime} onClick={setSelectedTime}>{t('morning_time')}</TimePreferenceButton>
                            <TimePreferenceButton preference="noon" selected={selectedTime} onClick={setSelectedTime}>{t('afternoon_time')}</TimePreferenceButton>
                            <TimePreferenceButton preference="evening" selected={selectedTime} onClick={setSelectedTime}>{t('evening_time')}</TimePreferenceButton>
                        </div>
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
