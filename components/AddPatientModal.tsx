import React, { useState } from 'react';
import { Patient } from '../types';
import { useTranslation } from '../i18n';

interface AddPatientModalProps {
    onClose: () => void;
    onSave: (newPatient: Omit<Patient, 'id' | 'avatar' | 'lastVisit' | 'progress'>) => void;
}

const FormInput: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; }> = 
({ id, label, value, onChange, type = 'text', required = false }) => (
     <div className="relative">
        <input
            id={id}
            type={type}
            placeholder={label}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-ivory border border-border-soft rounded-lg py-3 px-4 text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300 peer"
        />
        <label htmlFor={id} className="absolute left-4 -top-2.5 text-xs text-saffron bg-sand px-1 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-soft peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-saffron">
            {label}
        </label>
    </div>
);


export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [currentTherapy, setCurrentTherapy] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, currentTherapy });
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
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('add_new_patient')}</h2>
                    <p className="text-sm text-text-soft">{t('enter_patient_details')}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <FormInput id="name" label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                        <FormInput id="therapy" label="Initial Therapy" value={currentTherapy} onChange={e => setCurrentTherapy(e.target.value)} required />
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('save')} Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
