
import React from 'react';
import { TherapySession } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { useTranslation } from '../i18n';

interface SessionDetailsModalProps {
    session: TherapySession;
    onClose: () => void;
}

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ session, onClose }) => {
    const { t } = useTranslation();
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{session.therapyName}</h2>
                    <p className="text-sm text-text-soft">{t('upcoming_session_details')}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                    {/* Session Info */}
                    <div className="p-4 bg-ivory rounded-lg border border-border-soft break-words">
                        <h3 className="font-semibold text-lg text-text-dark mb-2">{t('session_information')}</h3>
                        <div className="text-sm text-text-soft space-y-2">
                           <p><strong>{t('practitioner_colon')}</strong> {session.practitioner}</p>
                           <p><strong>{t('date_and_time')}</strong> {session.startTime.toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                           <p><strong>{t('status')}:</strong> <span className="font-medium text-yellow-600">{session.status}</span></p>
                        </div>
                    </div>

                    {/* Preparation Instructions */}
                    {(session.preparation && session.preparation.length > 0) && (
                         <div className="p-4 bg-ivory rounded-lg border border-border-soft break-words">
                            <h3 className="font-semibold text-lg text-text-dark mb-3">{t('how_to_prepare')}</h3>
                            <ul className="space-y-2">
                                {session.preparation.map((step, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="w-5 h-5 text-earthy-green mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-text-soft text-sm">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Practitioner Notes */}
                    {session.notes && (
                        <div className="p-4 bg-ivory rounded-lg border border-border-soft break-words">
                            <h3 className="font-semibold text-lg text-text-dark mb-2">{t('practitioner_note')}</h3>
                            <p className="text-sm text-text-soft italic">"{session.notes}"</p>
                        </div>
                    )}
                </div>

                 <div className="p-4 bg-ivory/80 rounded-b-2xl flex justify-end items-center border-t border-border-soft">
                    <button onClick={onClose} className="bg-sand px-6 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
