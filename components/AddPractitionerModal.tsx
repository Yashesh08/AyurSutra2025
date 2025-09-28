import React, { useState } from 'react';
import { User } from '../types';
import { useTranslation } from '../i18n';

interface AddPractitionerModalProps {
    onClose: () => void;
    onSave: (practitionerData: Omit<User, 'id' | 'role' | 'avatar' | 'reviews'>) => void;
}

const FormInput: React.FC<{ id: string; name: string; label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; }> = 
({ id, name, label, value, onChange, type = 'text', required = false }) => (
     <div className="relative">
        <input
            id={id}
            name={name}
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


export const AddPractitionerModal: React.FC<AddPractitionerModalProps> = ({ onClose, onSave }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123', // Default password
        specialty: '',
        bio: '',
        yearsOfExperience: 0,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
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
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('add_new_practitioner')}</h2>
                    <p className="text-sm text-text-soft">{t('enter_practitioner_details')}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        <FormInput id="name" name="name" label={t('full_name')} value={formData.name} onChange={handleChange} required />
                        <FormInput id="email" name="email" label={t('email_address')} value={formData.email} onChange={handleChange} type="email" required />
                        <FormInput id="specialty" name="specialty" label={t('specialty')} value={formData.specialty} onChange={handleChange} required />
                        <FormInput id="yearsOfExperience" name="yearsOfExperience" label={t('years_of_experience')} value={formData.yearsOfExperience} onChange={handleChange} type="number" required />
                        <FormInput id="bio" name="bio" label={t('biography')} value={formData.bio} onChange={handleChange} />
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('save_practitioner')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
