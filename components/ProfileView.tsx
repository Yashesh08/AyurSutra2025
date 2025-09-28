import React, { useState } from 'react';
import { Card } from './GlowingCard';
import { User } from '../types';
import { EditProfileModal } from './EditProfileModal';
import { useAppContext } from '../App';
import { ConfirmTimeChangeModal } from './ConfirmTimeChangeModal';
import { useTranslation } from '../i18n';

type TimePreference = 'morning' | 'noon' | 'evening';

const TimePreferenceButton: React.FC<{ preference: TimePreference; selected: TimePreference | undefined; onClick: (pref: TimePreference) => void; children: React.ReactNode; }> = ({ preference, selected, onClick, children }) => {
    const isSelected = preference === selected;
    return (
        <button
            type="button"
            onClick={() => onClick(preference)}
            className={`flex-1 text-center py-3 px-3 text-sm font-semibold rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                ? 'bg-saffron text-text-dark border-saffron shadow-sm' 
                : 'bg-ivory text-text-soft border-border-soft hover:border-saffron/50'
            }`}
        >
            {children}
        </button>
    );
};


export const ProfileView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { currentUser } = state;
    const { t } = useTranslation();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pendingPreference, setPendingPreference] = useState<TimePreference | null>(null);

    const onUpdateUser = (user: User) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    const handleSaveProfile = (updatedUser: User) => {
        onUpdateUser(updatedUser);
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('profile_updated_success'), type: 'success' } });
        setIsEditModalOpen(false);
    };

    const handlePreferenceChange = (preference: TimePreference) => {
        if (!currentUser || preference === currentUser.preferredTimeSlot) return;
        setPendingPreference(preference);
    };

    const handleConfirmPreferenceChange = () => {
        if (!currentUser || !pendingPreference) return;
        
        const updatedUser: User = {
            ...currentUser,
            preferredTimeSlot: pendingPreference,
            patientData: currentUser.patientData ? {
                ...currentUser.patientData,
                preferredTimeSlot: pendingPreference,
            } : undefined,
        };
        
        onUpdateUser(updatedUser);
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('preference_updated', { preference: pendingPreference }), type: 'success' } });
        setPendingPreference(null); // Close modal
    };
    
    if (!currentUser) return null;
    
    const isPractitioner = currentUser.role === 'practitioner';
    
    const profileData = {
        name: currentUser.name,
        avatar: currentUser.avatar,
        title: isPractitioner 
            ? currentUser.specialty || 'Ayurvedic Practitioner' 
            : `Patient since ${new Date(currentUser.patientData?.lastVisit || Date.now()).getFullYear()}`,
        bio: isPractitioner
            ? currentUser.bio || 'Dedicated to blending ancient Ayurvedic wisdom with modern wellness practices.'
            : 'On a journey to holistic wellness and balance through the wisdom of Ayurveda.',
    };

    return (
        <div className="p-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-text-dark mb-8 font-display">{t('profile_settings')}</h2>
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={profileData.avatar}
                            alt={profileData.name}
                            className="w-32 h-32 rounded-full border-4 border-saffron mb-4"
                        />
                        <h3 className="text-2xl font-bold text-text-dark font-display">{profileData.name}</h3>
                        <p className="text-earthy-green font-medium">{profileData.title}</p>
                        <p className="text-text-soft mt-4 max-w-md">{profileData.bio}</p>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="mt-6 bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform shadow-sm hover:shadow-md"
                        >
                            {t('edit_profile')}
                        </button>
                    </div>
                </Card>

                {currentUser.role === 'user' && (
                    <Card>
                        <h3 className="text-xl font-bold text-text-dark font-display mb-4">{t('my_preferences')}</h3>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">{t('default_session_time')}</label>
                            <p className="text-sm text-text-soft mb-3">
                                {t('default_session_time_desc')}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <TimePreferenceButton preference="morning" selected={currentUser.preferredTimeSlot} onClick={handlePreferenceChange}>{t('morning_time')}</TimePreferenceButton>
                                <TimePreferenceButton preference="noon" selected={currentUser.preferredTimeSlot} onClick={handlePreferenceChange}>{t('afternoon_time')}</TimePreferenceButton>
                                <TimePreferenceButton preference="evening" selected={currentUser.preferredTimeSlot} onClick={handlePreferenceChange}>{t('evening_time')}</TimePreferenceButton>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    user={currentUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveProfile}
                />
            )}

            {pendingPreference && (
                <ConfirmTimeChangeModal
                    preference={pendingPreference}
                    onClose={() => setPendingPreference(null)}
                    onConfirm={handleConfirmPreferenceChange}
                />
            )}
        </div>
    );
};
