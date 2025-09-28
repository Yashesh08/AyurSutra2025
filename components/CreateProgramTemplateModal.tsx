import React, { useState } from 'react';
import { ProgramTemplate, PanchakarmaProgramDay } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useTranslation } from '../i18n';

interface CreateProgramTemplateModalProps {
    onClose: () => void;
    onSave: (templateData: Omit<ProgramTemplate, 'id'>) => void;
}

export const CreateProgramTemplateModal: React.FC<CreateProgramTemplateModalProps> = ({ onClose, onSave }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [durationDays, setDurationDays] = useState(7);
    const [schedule, setSchedule] = useState<PanchakarmaProgramDay[]>([
        { day: '1', morning: '', midday: '', evening: '', notes: '' }
    ]);

    const handleScheduleChange = (index: number, field: keyof PanchakarmaProgramDay, value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    const addScheduleDay = () => {
        setSchedule([...schedule, { day: `${schedule.length + 1}`, morning: '', midday: '', evening: '', notes: '' }]);
    };
    
    const removeScheduleDay = (index: number) => {
        setSchedule(schedule.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, durationDays, schedule });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('create_new_program_template')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder={t('template_name')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-ivory border border-border-soft rounded-md" />
                            <input type="number" placeholder={t('duration_days')} value={durationDays} onChange={e => setDurationDays(parseInt(e.target.value) || 0)} required className="w-full p-2 bg-ivory border border-border-soft rounded-md" />
                        </div>
                        <textarea placeholder={t('description')} value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full p-2 bg-ivory border border-border-soft rounded-md resize-y"></textarea>
                        
                        <div className="border-t border-border-soft pt-4">
                            <h3 className="text-lg font-semibold text-text-dark mb-2">{t('schedule_builder')}</h3>
                            <div className="space-y-4">
                                {schedule.map((day, index) => (
                                    <div key={index} className="p-4 bg-ivory border border-border-soft rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <input type="text" placeholder={t('days_placeholder')} value={day.day} onChange={e => handleScheduleChange(index, 'day', e.target.value)} className="font-semibold text-text-dark bg-sand p-1 rounded-md border border-border-soft" />
                                            <button type="button" onClick={() => removeScheduleDay(index)} className="p-1 text-text-soft hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                        <input type="text" placeholder={t('morning_activity')} value={day.morning} onChange={e => handleScheduleChange(index, 'morning', e.target.value)} className="w-full text-sm p-2 bg-sand border border-border-soft rounded-md"/>
                                        <input type="text" placeholder={t('midday_activity')} value={day.midday} onChange={e => handleScheduleChange(index, 'midday', e.target.value)} className="w-full text-sm p-2 bg-sand border border-border-soft rounded-md"/>
                                        <input type="text" placeholder={t('evening_activity')} value={day.evening} onChange={e => handleScheduleChange(index, 'evening', e.target.value)} className="w-full text-sm p-2 bg-sand border border-border-soft rounded-md"/>
                                        <input type="text" placeholder={t('notes')} value={day.notes} onChange={e => handleScheduleChange(index, 'notes', e.target.value)} className="w-full text-sm p-2 bg-sand border border-border-soft rounded-md"/>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addScheduleDay} className="mt-4 flex items-center text-sm font-semibold text-saffron hover:underline">
                                <PlusIcon className="w-4 h-4 mr-1"/> {t('add_schedule_entry')}
                            </button>
                        </div>
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('save_template')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
