import React, { useState, useEffect } from 'react';
import { TherapySession, TherapyStatus, Patient, User } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { SearchablePatientDropdown } from './SearchablePatientDropdown';
import { useTranslation } from '../i18n';

interface SessionModalProps {
    sessionToEdit: TherapySession | null;
    onClose: () => void;
    onSave: (session: TherapySession | Omit<TherapySession, 'id'>) => void;
    onDelete: (sessionId: string) => void;
    patients: Patient[];
    practitioners: User[];
}

// Utility to format Date to 'YYYY-MM-DDTHH:mm'
const toDateTimeLocal = (date: Date): string => {
    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    const YYYY = date.getFullYear();
    const MM = ten(date.getMonth() + 1);
    const DD = ten(date.getDate());
    const HH = ten(date.getHours());
    const mm = ten(date.getMinutes());
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};

export const SessionModal: React.FC<SessionModalProps> = ({ sessionToEdit, onClose, onSave, onDelete, patients, practitioners }) => {
    const { t } = useTranslation();
    const isEditMode = Boolean(sessionToEdit);
    
    const [formData, setFormData] = useState({
        patientId: sessionToEdit?.patientId || patients[0]?.id || '',
        therapyName: sessionToEdit?.therapyName || '',
        practitioner: sessionToEdit?.practitioner || practitioners[0]?.name || '',
        startTime: sessionToEdit ? toDateTimeLocal(sessionToEdit.startTime) : '',
        endTime: sessionToEdit ? toDateTimeLocal(sessionToEdit.endTime) : '',
        status: sessionToEdit?.status || TherapyStatus.Upcoming,
        notes: sessionToEdit?.notes || '',
        preparation: sessionToEdit?.preparation?.join('\n') || '',
    });

    useEffect(() => {
        if (sessionToEdit) {
            setFormData({
                patientId: sessionToEdit.patientId,
                therapyName: sessionToEdit.therapyName,
                practitioner: sessionToEdit.practitioner,
                startTime: toDateTimeLocal(sessionToEdit.startTime),
                endTime: toDateTimeLocal(sessionToEdit.endTime),
                status: sessionToEdit.status,
                notes: sessionToEdit.notes || '',
                preparation: sessionToEdit.preparation?.join('\n') || '',
            });
        } else {
             // Reset form for creation
             setFormData({
                patientId: patients[0]?.id || '',
                therapyName: '',
                practitioner: practitioners[0]?.name || '',
                startTime: '',
                endTime: '',
                status: TherapyStatus.Upcoming,
                notes: '',
                preparation: '',
            });
        }
    }, [sessionToEdit, patients, practitioners]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patient = patients.find(p => p.id === formData.patientId);
        if (!patient) return; // Or show an error

        const sessionData = {
            patientId: formData.patientId,
            patientName: patient.name,
            therapyName: formData.therapyName,
            practitioner: formData.practitioner,
            startTime: new Date(formData.startTime),
            endTime: new Date(formData.endTime),
            status: formData.status as TherapyStatus,
            notes: formData.notes,
            preparation: formData.preparation.split('\n').filter(line => line.trim() !== ''),
        };

        if (isEditMode && sessionToEdit) {
            onSave({ ...sessionData, id: sessionToEdit.id });
        } else {
            onSave(sessionData);
        }
    };
    
    const handleDelete = () => {
        if(isEditMode && sessionToEdit && window.confirm(t('delete_session_confirm'))) {
            onDelete(sessionToEdit.id);
        }
    }

    return (
         <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-center border-b border-border-soft">
                    <div>
                        <h2 className="text-2xl font-bold text-text-dark font-display">{isEditMode ? t('edit_session') : t('create_session')}</h2>
                        <p className="text-sm text-text-soft">{t('fill_session_details')}</p>
                    </div>
                     {isEditMode && (
                        <button onClick={handleDelete} className="p-2 text-text-soft hover:bg-red-100 hover:text-red-600 rounded-full transition-colors" title={t('delete')}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} id="session-form" className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 hide-scrollbar">
                    {/* Column 1 */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="patientId" className="block text-sm font-medium text-text-dark mb-1">{t('patient')}</label>
                            <SearchablePatientDropdown
                                patients={patients}
                                selectedPatientId={formData.patientId}
                                onSelect={(patientId) => setFormData(prev => ({ ...prev, patientId }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="therapyName" className="block text-sm font-medium text-text-dark mb-1">{t('therapy_name')}</label>
                            <input type="text" id="therapyName" name="therapyName" value={formData.therapyName} onChange={handleChange} required className="w-full p-2 bg-ivory border border-border-soft rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="practitioner" className="block text-sm font-medium text-text-dark mb-1">{t('practitioner')}</label>
                            <select id="practitioner" name="practitioner" value={formData.practitioner} onChange={handleChange} required className="w-full p-2 bg-ivory border border-border-soft rounded-md">
                                {practitioners.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="status" className="block text-sm font-medium text-text-dark mb-1">{t('status')}</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} required className="w-full p-2 bg-ivory border border-border-soft rounded-md">
                                {Object.values(TherapyStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-text-dark mb-1">{t('start_time')}</label>
                            <input type="datetime-local" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full p-2 bg-ivory border border-border-soft rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-text-dark mb-1">{t('end_time')}</label>
                            <input type="datetime-local" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full p-2 bg-ivory border border-border-soft rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="preparation" className="block text-sm font-medium text-text-dark mb-1">{t('preparation_instructions')}</label>
                            <textarea id="preparation" name="preparation" value={formData.preparation} onChange={handleChange} rows={5} placeholder={t('one_instruction_per_line')} className="w-full p-2 bg-ivory border border-border-soft rounded-md resize-y"></textarea>
                        </div>
                    </div>
                    
                    {/* Full Width Notes */}
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-text-dark mb-1">{t('private_practitioner_notes')}</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder={t('add_private_notes_placeholder')} className="w-full p-2 bg-ivory border border-border-soft rounded-md resize-y"></textarea>
                    </div>
                </form>

                 <div className="p-4 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                    <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                        {t('cancel')}
                    </button>
                    <button type="submit" form="session-form" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                        {isEditMode ? t('save_changes') : t('create_session')}
                    </button>
                </div>
            </div>
        </div>
    );
};
