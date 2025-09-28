import React, { useState } from 'react';
import { ProgramTemplate } from '../types';
import { Card } from './GlowingCard';
import { PlusIcon } from './icons/PlusIcon';
import { useAppContext } from '../App';
import { CreateProgramTemplateModal } from './CreateProgramTemplateModal';
import { useTranslation } from '../i18n';

export const ProgramTemplatesView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { programTemplates: templates } = state;
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleSaveTemplate = (templateData: Omit<ProgramTemplate, 'id'>) => {
        const newTemplate: ProgramTemplate = {
            ...templateData,
            id: `pt${Date.now()}`,
        };
        dispatch({ type: 'CREATE_PROGRAM_TEMPLATE', payload: newTemplate });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('program_template_created_success'), type: 'success' } });
        setIsCreateModalOpen(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-dark font-display">{t('program_templates')}</h2>
                    <p className="text-text-soft">{t('manage_program_templates')}</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('create_new_template')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {templates.map(template => (
                    <Card key={template.id}>
                        <h3 className="text-xl font-bold text-text-dark mb-2 font-display">{template.name}</h3>
                        <p className="text-sm text-text-soft mb-4">{template.description}</p>
                        <p className="text-sm font-semibold text-earthy-green mb-4">{t('day_program_duration', { durationDays: template.durationDays })}</p>
                        
                        <div className="overflow-x-auto max-h-80 border-t border-border-soft pt-4">
                            <h4 className="font-semibold text-text-dark mb-2">{t('schedule_overview')}</h4>
                            <table className="w-full text-left text-sm">
                                <thead className="border-b-2 border-border-soft">
                                    <tr>
                                        <th className="p-2 text-xs font-semibold text-text-soft tracking-wider">{t('day_s')}</th>
                                        <th className="p-2 text-xs font-semibold text-text-soft tracking-wider">{t('activity')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {template.schedule.map((day, index) => (
                                        <tr key={index} className="border-b border-border-soft last:border-b-0">
                                            <td className="p-2 font-medium text-text-dark whitespace-nowrap align-top">{day.day}</td>
                                            <td className="p-2 text-text-soft">
                                                {day.morning && <p><strong>M:</strong> {day.morning}</p>}
                                                {day.midday && <p><strong>Mid:</strong> {day.midday}</p>}
                                                {day.evening && <p><strong>E:</strong> {day.evening}</p>}
                                                {day.notes && <p className="text-xs italic mt-1 text-saffron">{t('note_colon')} {day.notes}</p>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ))}
            </div>
             {templates.length === 0 && (
                <div className="text-center py-16 text-text-soft">
                    <p className="text-lg">{t('no_program_templates_found')}</p>
                    <p>{t('create_template_cta')}</p>
                </div>
            )}
            {isCreateModalOpen && <CreateProgramTemplateModal onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveTemplate} />}
        </div>
    );
};
