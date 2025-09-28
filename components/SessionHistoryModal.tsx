import React, { useState } from 'react';
import { TherapySession, TherapyStatus } from '../types';
import { Card } from './GlowingCard';
import { EditIcon } from './icons/EditIcon';
import { useTranslation } from '../i18n';

interface SessionHistoryModalProps {
    sessions: TherapySession[];
    patientName: string;
    onClose: () => void;
    onUpdateSessionNotes: (session: TherapySession, notes: string) => void;
}

const getStatusPill = (status: TherapyStatus) => {
    let colors = '';
    switch (status) {
        case TherapyStatus.Completed:
            colors = 'bg-green-100 text-green-800 border-green-300';
            break;
        case TherapyStatus.Upcoming:
            colors = 'bg-yellow-100 text-yellow-800 border-yellow-300';
            break;
        case TherapyStatus.Cancelled:
            colors = 'bg-red-100 text-red-800 border-red-300';
            break;
        default:
            colors = 'bg-blue-100 text-blue-800 border-blue-300';
    }
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors}`}>{status}</span>;
};

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({ sessions, patientName, onClose, onUpdateSessionNotes }) => {
    const { t } = useTranslation();
    const sortedSessions = [...sessions].sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');

    const handleEditClick = (session: TherapySession) => {
        setEditingSessionId(session.id);
        setNoteText(session.notes || '');
    };

    const handleCancel = () => {
        setEditingSessionId(null);
        setNoteText('');
    };

    const handleSave = () => {
        if (editingSessionId) {
            const session = sessions.find(s => s.id === editingSessionId);
            if (session) {
                onUpdateSessionNotes(session, noteText);
            }
            handleCancel();
        }
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
                <div className="p-6 flex justify-between items-center border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('session_history_for', { patientName })}</h2>
                    <button onClick={onClose} className="text-text-soft hover:text-text-dark">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
                    {sortedSessions.length > 0 ? sortedSessions.map(session => (
                        <Card key={session.id} className="p-4 transition-transform hover:scale-[1.02]">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                <h3 className="text-lg font-semibold text-text-dark">{session.therapyName}</h3>
                                {getStatusPill(session.status)}
                            </div>
                            <div className="text-sm text-text-soft space-y-1 mb-3">
                                <p><strong>{t('date_colon')}</strong> {session.startTime.toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                                <p><strong>{t('practitioner_colon')}</strong> {session.practitioner}</p>
                            </div>
                            
                            {editingSessionId === session.id ? (
                                <div className="mt-3 pt-3 border-t border-border-soft">
                                    <h4 className="font-semibold text-text-dark text-sm mb-2">{t('edit_session_notes')}</h4>
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        className="w-full h-24 bg-ivory border border-border-soft rounded-lg p-2 text-sm text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-saffron resize-y"
                                        placeholder={t('add_session_notes_placeholder')}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={handleCancel} className="bg-sand px-3 py-1 rounded-md text-text-dark text-sm font-semibold hover:bg-border-soft transition-colors">
                                            {t('cancel')}
                                        </button>
                                        <button onClick={handleSave} className="bg-saffron px-3 py-1 rounded-md text-text-dark text-sm font-semibold hover:bg-yellow-500 transition-colors">
                                            {t('save_note')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 pt-3 border-t border-border-soft">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-text-dark text-sm mb-1">{t('session_notes')}</h4>
                                            {session.notes ? (
                                                <p className="text-sm text-text-soft italic">"{session.notes}"</p>
                                            ) : (
                                                <p className="text-sm text-text-soft">{t('no_notes_for_session')}</p>
                                            )}
                                        </div>
                                        <button onClick={() => handleEditClick(session)} className="flex-shrink-0 flex items-center text-sm text-text-soft hover:text-saffron transition-colors ml-4 p-1 rounded-md">
                                            <EditIcon className="w-4 h-4 mr-1" />
                                            {session.notes ? t('edit') : t('add')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )) : (
                        <div className="text-center py-16 text-text-soft">
                            <p className="text-lg">{t('no_session_history_found')}</p>
                        </div>
                    )}
                </div>

                 <div className="p-4 bg-ivory/80 rounded-b-2xl flex justify-end items-center border-t border-border-soft">
                    <button onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
