import React, { useState, useMemo } from 'react';
import { FormStatus, SentForm, FormTemplate, Patient, FormQuestion } from '../types';
import { Card } from './GlowingCard';
import { PlusIcon } from './icons/PlusIcon';
import { SendFormModal } from './SendFormModal';
import { CreateFormModal } from './CreateFormModal';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

const ITEMS_PER_PAGE = 15;

const getStatusColor = (status: FormStatus) => {
    switch (status) {
        case FormStatus.Completed: return 'bg-green-100 text-green-800 border-green-300';
        case FormStatus.Sent: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

interface MemoizedFormRowProps {
    form: SentForm;
}
const MemoizedFormRow: React.FC<MemoizedFormRowProps> = React.memo(({ form }) => (
    <tr className="border-b border-border-soft last:border-b-0">
        <td className="p-3 font-medium text-text-dark">{form.patientName}</td>
        <td className="p-3 text-text-soft">{form.formName}</td>
        <td className="p-3 text-text-soft">{new Date(form.sentDate).toLocaleDateString()}</td>
        <td className="p-3 text-center">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(form.status)}`}>
                {form.status}
            </span>
        </td>
    </tr>
));

export const FormsSurveyView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { sentForms, formTemplates, patients } = state;
    const { t } = useTranslation();

    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    
    const sortedForms = useMemo(() => 
        [...sentForms].sort((a,b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()),
        [sentForms]
    );

    const onSendForm = (patientId: string, templateId: string) => {
        const patient = patients.find(p => p.id === patientId);
        const template = formTemplates.find(t => t.id === templateId);
        if (patient && template) {
            const newSentForm: SentForm = {
                id: `sf${sentForms.length + 1}-${Date.now()}`,
                patientId, patientName: patient.name, templateId,
                formName: template.name, status: FormStatus.Sent,
                sentDate: new Date().toISOString().split('T')[0],
            };
            dispatch({ type: 'SEND_FORM', payload: newSentForm });
        }
    };
    
    const onCreateTemplate = (templateData: Omit<FormTemplate, 'id'>) => {
        const newTemplate: FormTemplate = { ...templateData, id: `ft${Date.now()}` };
        dispatch({ type: 'CREATE_FORM_TEMPLATE', payload: newTemplate });
    };

    const handleSendForm = (patientId: string, templateId: string) => {
        onSendForm(patientId, templateId);
        setIsSendModalOpen(false);
        const patientName = patients.find(p => p.id === patientId)?.name;
        const templateName = formTemplates.find(t => t.id === templateId)?.name;
        if(patientName && templateName) {
            dispatch({ type: 'SHOW_TOAST', payload: { message: t('form_sent_success', { templateName, patientName }), type: 'success' } });
        }
    };
    
    const handleCreateTemplate = (templateData: Omit<FormTemplate, 'id'>) => {
        onCreateTemplate(templateData);
        setIsCreateModalOpen(false);
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('form_template_created_success'), type: 'success' } });
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-dark font-display">{t('forms_surveys')}</h2>
                    <p className="text-text-soft">{t('manage_forms_and_surveys')}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                     <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('create_new_template')}
                    </button>
                    <button onClick={() => setIsSendModalOpen(true)} className="flex items-center bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('send_new_form')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Templates */}
                <Card className="lg:col-span-1">
                    <h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('form_templates')}</h3>
                    <div className="space-y-4">
                        {formTemplates.map(template => (
                            <div key={template.id} className="p-4 bg-ivory rounded-lg border border-border-soft">
                                <h4 className="font-semibold text-text-dark">{template.name}</h4>
                                <p className="text-sm text-text-soft mt-1">{template.description}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sent Forms Status */}
                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('sent_forms_status')}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-border-soft">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-text-soft tracking-wider">{t('patient')}</th>
                                    <th className="p-3 text-sm font-semibold text-text-soft tracking-wider">{t('form_name')}</th>
                                    <th className="p-3 text-sm font-semibold text-text-soft tracking-wider">{t('date_sent')}</th>
                                    <th className="p-3 text-sm font-semibold text-text-soft tracking-wider text-center">{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedForms.slice(0, visibleCount).map(form => (
                                    <MemoizedFormRow key={form.id} form={form} />
                                ))}
                            </tbody>
                        </table>

                        {visibleCount < sortedForms.length && (
                            <div className="pt-4 text-center border-t border-border-soft mt-2">
                                <button onClick={handleLoadMore} className="bg-sand px-6 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                                    {t('load_more')}
                                </button>
                            </div>
                        )}

                        {sentForms.length === 0 && (
                            <p className="text-center text-text-soft py-8">{t('no_forms_sent')}</p>
                        )}
                    </div>
                </Card>
            </div>

            {isSendModalOpen && (
                <SendFormModal 
                    onClose={() => setIsSendModalOpen(false)}
                    onSend={handleSendForm}
                    patients={patients}
                    templates={formTemplates}
                />
            )}

            {isCreateModalOpen && (
                <CreateFormModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreateTemplate}
                />
            )}
        </div>
    );
};
