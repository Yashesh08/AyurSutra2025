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
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('send_new_form')}</h2>
                    <p className="text-sm text-text-soft">{t('assign_program_description')