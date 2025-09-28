import React from 'react';
import { useTranslation } from '../i18n';

type TimePreference = 'morning' | 'noon' | 'evening';

interface ConfirmTimeChangeModalProps {
    preference: TimePreference;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmTimeChangeModal: React.FC<ConfirmTimeChangeModalProps> = ({ preference, onClose, onConfirm }) => {
    const { t } = useTranslation();
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-text-dark font-display text-center">{t('confirm_change')}</h2>
                    <p className="text-text-soft mt-4 text-center">
                        {t('confirm_time_change_prompt', { preference })}
                    </p>
                    <p className="text-sm text-text-soft mt-2 text-center">
                        {t('confirm_time_change_detail')}
                    </p>
                </div>
                <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-center items-center gap-4 border-t border-border-soft">
                    <button type="button" onClick={onClose} className="bg-sand px-6 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                        {t('cancel')}
                    </button>
                    <button type="button" onClick={onConfirm} className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-8 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};
