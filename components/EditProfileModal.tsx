import React, { useState } from 'react';
import { User } from '../types';
import { useTranslation } from '../i18n';

interface EditProfileModalProps {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

// Fix: Add name property to FormInput props to support generic handleChange
const FormInput: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; readOnly?: boolean; }> = 
({ id, name, label, value, onChange, type = 'text', readOnly = false }) => (
     <div className="relative">
        <input
            id={id}
            name={name}
            type={type}
            placeholder={label}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            required
            className={`w-full bg-ivory border border-border-soft rounded-lg py-3 px-4 text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300 peer ${readOnly ? 'text-text-soft cursor-not-allowed' : ''}`}
        />
        <label htmlFor={id} className="absolute left-4 -top-2.5 text-xs text-saffron bg-sand px-1 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-soft peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-saffron">
            {label}
        </label>
    </div>
);

// Fix: Add name property to FormTextarea props to support generic handleChange
const FormTextarea: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ id, name, label, value, onChange, rows=4 }) => (
     <div className="relative">
        <textarea
            id={id}
            name={name}
            placeholder={label}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full bg-ivory border border-border-soft rounded-lg py-3 px-4 text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300 peer resize-y"
        />
        <label htmlFor={id} className="absolute left-4 -top-2.5 text-xs text-saffron bg-sand px-1 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-text-soft peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-saffron">
            {label}
        </label>
    </div>
);

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: user.name,
        avatar: user.avatar,
        email: user.email, // for display
        bio: user.bio || '',
        specialty: user.specialty || '',
        yearsOfExperience: user.yearsOfExperience || 0,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser: User = {
            ...user,
            name: formData.name,
            avatar: formData.avatar,
            bio: user.role === 'practitioner' ? formData.bio : user.bio,
            specialty: user.role === 'practitioner' ? formData.specialty : user.specialty,
            yearsOfExperience: user.role === 'practitioner' ? formData.yearsOfExperience : user.yearsOfExperience,
        };
        onSave(updatedUser);
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
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('edit_profile')}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        <FormInput id="name" name="name" label={t('full_name')} value={formData.name} onChange={handleChange} />
                        <FormInput id="avatar" name="avatar" label={t('avatar_url')} value={formData.avatar} onChange={handleChange} />
                        <FormInput id="email" name="email" label={t('email_cannot_be_changed')} value={formData.email} onChange={() => {}} readOnly />

                        {user.role === 'practitioner' && (
                            <>
                                <FormInput id="specialty" name="specialty" label={t('specialty')} value={formData.specialty} onChange={handleChange} />
                                <FormInput id="yearsOfExperience" name="yearsOfExperience" type="number" label={t('years_of_experience')} value={String(formData.yearsOfExperience)} onChange={handleChange} />
                                <FormTextarea id="bio" name="bio" label={t('biography')} value={formData.bio} onChange={handleChange} />
                            </>
                        )}
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('save_changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
