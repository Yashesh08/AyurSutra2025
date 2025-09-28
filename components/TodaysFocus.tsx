import React from 'react';
import { ProgramTemplate } from '../types';
import { useTranslation } from '../i18n';

interface TodaysFocusProps {
    template: ProgramTemplate;
    currentDay: number;
}

export const TodaysFocus: React.FC<TodaysFocusProps> = ({template, currentDay}) => {
    const { t } = useTranslation();
    const scheduleForToday = template.schedule.find(dayEntry => {
        const parts = dayEntry.day.split('-');
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1] || parts[0], 10);
        return currentDay >= start && currentDay <= end;
    });

    if (!scheduleForToday || currentDay <= 0 || currentDay > template.durationDays) {
        return <p className="text-text-soft text-center py-4">{t('no_activities_today')}</p>;
    }
    
    return (
        <div className="space-y-4">
            {scheduleForToday.morning && scheduleForToday.morning !== '—' && (
                <div className="p-3 bg-ivory rounded-lg border-l-4 border-calm-blue">
                    <p className="font-semibold text-text-dark">{t('morning')}</p>
                    <p className="text-sm text-text-soft">{scheduleForToday.morning}</p>
                </div>
            )}
            {scheduleForToday.midday && scheduleForToday.midday !== '—' && (
                 <div className="p-3 bg-ivory rounded-lg border-l-4 border-saffron">
                    <p className="font-semibold text-text-dark">{t('afternoon')}</p>
                    <p className="text-sm text-text-soft">{scheduleForToday.midday}</p>
                </div>
            )}
            {scheduleForToday.evening && scheduleForToday.evening !== '—' && (
                 <div className="p-3 bg-ivory rounded-lg border-l-4 border-earthy-green">
                    <p className="font-semibold text-text-dark">{t('evening')}</p>
                    <p className="text-sm text-text-soft">{scheduleForToday.evening}</p>
                </div>
            )}
            {scheduleForToday.notes && (
                 <div className="p-3 bg-ivory rounded-lg mt-4 border border-border-soft">
                    <p className="font-semibold text-text-dark text-sm">{t('daily_guidance')}</p>
                    <p className="text-sm text-text-soft italic">"{scheduleForToday.notes}"</p>
                </div>
            )}
        </div>
    );
};
