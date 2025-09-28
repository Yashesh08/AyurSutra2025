import React, { useState } from 'react';
import { Patient, FormTemplate } from '../types';
import { SearchablePatientDropdown } from './SearchablePatientDropdown';
import { useTranslation } from '../i18n';

interface SendFormModalProps {
    onClose: () => void;
    onSend: (patientId: string, templateId: string) => void;
    patients: Patient[];
    templates: FormTemplate[];
}

export const SendFormModal: React.FC<SendFormModalProps> = ({ onClose, onSend, patients, templates }) => {
    const { t } = useTranslation();
    const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPatientId && selectedTemplateId) {
            onSend(selectedPatientId, selectedTemplateId);
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
                {/* Header */}
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">
                        {t('send_new_form')}
                    </h2>
                    <p className="text-sm text-text-soft">
                        {t('assign_program_description')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <SearchablePatientDropdown
                        patients={patients}
                        value={selectedPatientId}
                        onChange={setSelectedPatientId}
                    />

                    <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-saffron text-white hover:bg-saffron-dark"
                        >
                            {t('send')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
