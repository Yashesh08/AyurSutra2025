import React from 'react';
import { PanchakarmaProgramDay } from '../types';

interface ProgramTimelineProps {
    schedule: PanchakarmaProgramDay[];
    currentDay: number;
    durationDays: number;
}

const getDayStatus = (dayString: string, currentDay: number, durationDays: number): 'past' | 'present' | 'future' => {
    // If program is over, all days are 'past'
    if (currentDay > durationDays && currentDay > 0) return 'past';

    const parts = dayString.split('-');
    const start = parseInt(parts[0], 10);
    const end = parseInt(parts[1] || parts[0], 10);

    if (currentDay > end) return 'past';
    if (currentDay >= start && currentDay <= end) return 'present';
    return 'future';
};

export const ProgramTimeline: React.FC<ProgramTimelineProps> = ({ schedule, currentDay, durationDays }) => {
    
    return (
        <div className="space-y-3">
            {schedule.map((dayEntry, index) => {
                const status = getDayStatus(dayEntry.day, currentDay, durationDays);
                let statusClasses = '';
                switch(status) {
                    case 'past':
                        statusClasses = 'opacity-60 bg-ivory/80';
                        break;
                    case 'present':
                        statusClasses = 'border-saffron border-2 shadow-lg bg-sand';
                        break;
                    case 'future':
                        statusClasses = 'bg-sand';
                        break;
                }
                return (
                    <div key={index} className={`p-4 rounded-lg border border-border-soft transition-all duration-300 ${statusClasses}`}>
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-text-dark font-display">Day(s) {dayEntry.day}</h4>
                            {status === 'present' && <span className="text-xs font-bold text-saffron bg-saffron/20 px-2 py-1 rounded-full">TODAY</span>}
                            {status === 'past' && <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">Completed</span>}
                        </div>
                        <div className="mt-2 text-sm text-text-soft space-y-1 pl-2 border-l-2 border-border-soft ml-1">
                            {dayEntry.morning && dayEntry.morning !== '—' && <p><strong>Morning:</strong> {dayEntry.morning}</p>}
                            {dayEntry.midday && dayEntry.midday !== '—' && <p><strong>Midday:</strong> {dayEntry.midday}</p>}
                            {dayEntry.evening && dayEntry.evening !== '—' && <p><strong>Evening:</strong> {dayEntry.evening}</p>}
                            {dayEntry.notes && <p className="text-xs italic mt-2 text-earthy-green"><strong>Guidance:</strong> {dayEntry.notes}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};