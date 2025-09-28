import React, { useState } from 'react';
import { ProgramTemplate } from '../types';
import { useTranslation } from '../i18n';

interface ProgramAssignmentModalProps {
    onClose: () => void;
    onAssign: (templateId: string, startDate: string) => void;
    templates: ProgramTemplate[];
}

export const ProgramAssignmentModal: React.FC<ProgramAssignmentModalProps> = ({ onClose, onAssign, templates }) => {
    const { t } = useTranslation();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTemplateId && startDate) {
            onAssign(selectedTemplateId, startDate);
        }
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
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('assign_wellness_program')}</h2>
                    <p className="text-sm text-text-soft">{t('assign_program_description')}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="template-select" className="block text-sm font-medium text-text-dark mb-2">{t('select_program_template')}</label>
                            <select
                                id="template-select"
                                value={selectedTemplateId}
                                onChange={e => setSelectedTemplateId(e.target.value)}
                                className="w-full py-3 px-4 bg-ivory border border-border-soft rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron"
                            >
                                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-text-dark mb-2">{t('program_start_date')}</label>
                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                                className="w-full py-2.5 px-4 bg-ivory border border-border-soft rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron"
                            />
                        </div>
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('assign_program')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
