


import React from 'react';
import { TherapySession, User } from '../types';
import { Card } from './GlowingCard';
import { useTranslation } from '../i18n';

interface DailyTimelineViewProps {
    sessions: TherapySession[];
    practitioners: User[];
    onSessionClick: (session: TherapySession) => void;
}

const START_HOUR = 8;
const END_HOUR = 18;
const HOUR_HEIGHT = 48; // pixels per hour, reduced for better mobile view
const PRACTITIONER_COLUMN_WIDTH = 100; // pixels per practitioner column, reduced for better mobile view

const calculatePosition = (startTime: Date, endTime: Date) => {
    const startMinutes = (startTime.getHours() - START_HOUR) * 60 + startTime.getMinutes();
    
    if (startTime.getHours() < START_HOUR || startTime.getHours() >= END_HOUR) {
        return { top: -1, height: -1 };
    }
    
    const durationMinutes = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60));

    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = (durationMinutes / 60) * HOUR_HEIGHT;

    return { top, height };
};

export const DailyTimelineView: React.FC<DailyTimelineViewProps> = ({ sessions, practitioners, onSessionClick }) => {
    const { t } = useTranslation();
    const timeSlots = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

    const practitionerColors = [
        'bg-calm-blue/70 border-calm-blue',
        'bg-earthy-green/70 border-earthy-green',
        'bg-saffron/70 border-saffron',
        'bg-red-300/70 border-red-500',
    ];

    const TOP_SPACER_HEIGHT_PX = 16; // Corresponds to h-4

    return (
        <Card className="p-0 sm:p-2 overflow-hidden">
            {sessions.length === 0 ? (
                 <div className="text-center py-16 text-text-soft">
                    <p className="text-lg">{t('no_sessions_for_day')}</p>
                </div>
            ) : (
                <div className="flex" style={{ minWidth: (practitioners.length * PRACTITIONER_COLUMN_WIDTH) + 64 }}> {/* +64 for time gutter */}
                    {/* Time Gutter */}
                    <div className="w-16 flex-shrink-0 text-right pr-2">
                        <div style={{ height: TOP_SPACER_HEIGHT_PX }} className="border-b border-border-soft"></div>
                        {timeSlots.map(hour => (
                            <div key={hour} style={{ height: HOUR_HEIGHT }} className="relative">
                                <span className="absolute top-0 right-2 text-xs text-text-soft font-medium -translate-y-1/2">{hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'am' : 'pm'}</span>
                            </div>
                        ))}
                    </div>

                    {/* Practitioners Grid */}
                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${practitioners.length}, minmax(0, 1fr))` }}>
                        {practitioners.map((practitioner, pIndex) => (
                            <div key={practitioner.id} className="relative border-l border-border-soft">
                                {/* Empty spacer for alignment */}
                                <div style={{ height: TOP_SPACER_HEIGHT_PX }} className="border-b border-border-soft"></div>
                                
                                {/* Hour lines */}
                                {timeSlots.map(hour => (
                                    <div key={`${practitioner.id}-${hour}`} style={{ height: HOUR_HEIGHT }} className="border-t border-border-soft/50"></div>
                                ))}

                                {/* Sessions */}
                                {sessions
                                    .filter(s => s.practitioner === practitioner.name)
                                    .map(session => {
                                        const { top, height } = calculatePosition(session.startTime, session.endTime);
                                        if (top === -1) return null;

                                        return (
                                            <button
                                                key={session.id}
                                                onClick={() => onSessionClick(session)}
                                                className={`absolute left-1 right-1 px-1 py-0.5 rounded text-left overflow-hidden transition-shadow hover:shadow-lg hover:z-20 border-l-4 ${practitionerColors[pIndex % practitionerColors.length]}`}
                                                style={{ top: top + TOP_SPACER_HEIGHT_PX, height: Math.max(height - 2, 20), minHeight: '20px' }}
                                                aria-label={t('session_aria_label', { therapyName: session.therapyName, patientName: session.patientName })}
                                            >
                                                <p className="font-semibold text-[10px] text-text-dark leading-tight truncate">{session.therapyName}</p>
                                                <p className="text-[10px] text-text-dark/80 leading-tight truncate">{session.patientName}</p>
                                                 {height > 35 && <p className="text-[9px] text-text-soft mt-0.5">
                                                    {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>}
                                            </button>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};
