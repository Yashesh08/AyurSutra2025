import React, { useState, useMemo, useCallback } from 'react';
import { Patient, User, VIEWS } from '../types';
import { Card } from './GlowingCard';
import { PlusIcon } from './icons/PlusIcon';
import { ProgressBar } from './ProgressBar';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EyeIcon } from './icons/EyeIcon';
import { AddPatientModal } from './AddPatientModal';
import { EditPatientModal } from './EditPatientModal';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

const ITEMS_PER_PAGE = 15;

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <Card>
        <p className="text-3xl font-bold text-earthy-green">{value}</p>
        <p className="text-sm text-text-soft">{label}</p>
    </Card>
);

interface MemoizedPatientRowProps {
    patient: Patient;
    onSelectPatient: (id: string) => void;
    onEditPatient: (patient: Patient) => void;
    onDeletePatient: (id: string) => void;
    t: (key: string) => string;
}

const MemoizedPatientRow: React.FC<MemoizedPatientRowProps> = React.memo(({ patient, onSelectPatient, onEditPatient, onDeletePatient, t }) => (
    <tr className="border-b border-border-soft last:border-b-0 hover:bg-ivory transition-colors">
        <td className="p-4">
            <div className="flex items-center">
                <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-full mr-3" />
                <span className="font-medium text-text-dark">{patient.name}</span>
            </div>
        </td>
        <td className="p-4 text-text-soft">{new Date(patient.lastVisit).toLocaleDateString()}</td>
        <td className="p-4 text-text-soft">{patient.currentTherapy}</td>
        <td className="p-4">
            <ProgressBar progress={patient.progress} />
        </td>
        <td className="p-4 text-center">
            <div className="flex justify-center items-center gap-2">
                <button onClick={() => onSelectPatient(patient.id)} title={t('view_profile')} className="p-2 text-text-soft hover:text-calm-blue transition-colors"><EyeIcon className="w-5 h-5"/></button>
                <button onClick={() => onEditPatient(patient)} title={t('edit_profile')} className="p-2 text-text-soft hover:text-saffron transition-colors"><EditIcon className="w-5 h-5"/></button>
                <button onClick={() => onDeletePatient(patient.id)} title={t('delete')} className="p-2 text-text-soft hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5"/></button>
            </div>
        </td>
    </tr>
));

export const PatientManagementView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { currentUser, patients, sessions, patientSearchTerm } = state;
    const { t } = useTranslation();

    const [therapyFilter, setTherapyFilter] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_PATIENT_SEARCH_TERM', payload: e.target.value });
    };

    const displayedPatients = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === 'admin') {
            return patients;
        }
        if (currentUser.role === 'practitioner') {
            const practitionerPatientIds = new Set(
                sessions.filter(s => s.practitioner === currentUser.name).map(s => s.patientId)
            );
            return patients.filter(p => practitionerPatientIds.has(p.id));
        }
        return [];
    }, [patients, sessions, currentUser]);


    const therapies = useMemo(() => ['All', ...new Set(displayedPatients.map(p => p.currentTherapy))], [displayedPatients]);

    const filteredPatients = useMemo(() => {
        return displayedPatients.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes((patientSearchTerm || '').toLowerCase());
            const matchesTherapy = therapyFilter === 'All' || p.currentTherapy === therapyFilter;
            return matchesSearch && matchesTherapy;
        });
    }, [displayedPatients, patientSearchTerm, therapyFilter]);

    const stats = useMemo(() => {
        const totalPatients = displayedPatients.length;
        const activeTherapies = new Set(displayedPatients.map(p => p.currentTherapy)).size;
        const averageProgress = totalPatients > 0 ? Math.round(displayedPatients.reduce((acc, p) => acc + p.progress, 0) / totalPatients) : 0;
        return { totalPatients, activeTherapies, averageProgress };
    }, [displayedPatients]);

    const onUpdatePatient = useCallback((patient: Patient) => {
        dispatch({ type: 'UPDATE_PATIENT', payload: patient });
    }, [dispatch]);

    const onSelectPatient = useCallback((patientId: string) => {
        dispatch({ type: 'SET_SELECTED_PATIENT', payload: patientId });
    }, [dispatch]);
    
    const handleSavePatient = (newPatientData: Omit<Patient, 'id' | 'avatar' | 'lastVisit' | 'progress' | 'notes'>) => {
        const patientId = `p${Date.now()}`;
        const newPatient: Patient = {
            ...newPatientData,
            id: patientId,
            avatar: `https://i.pravatar.cc/150?u=${patientId}`,
            lastVisit: new Date().toISOString().split('T')[0],
            progress: 0,
            notes: '',
        };
        const newUser: User = {
            id: patientId,
            name: newPatient.name,
            email: `${newPatient.name.split(' ')[0].toLowerCase()}@email.com`, // mock email
            password: 'password123',
            role: 'user',
            avatar: newPatient.avatar,
            patientData: newPatient,
        };
        dispatch({ type: 'ADD_PATIENT', payload: { patient: newPatient, user: newUser } });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('patient_details_updated'), type: 'success' } });
        setIsAddModalOpen(false);
    };

    const handleUpdatePatient = (updatedPatient: Patient) => {
        onUpdatePatient(updatedPatient);
        setPatientToEdit(null);
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('patient_details_updated'), type: 'success' } });
    }

    const handleDeletePatient = (patientId: string) => {
        if(window.confirm(t('delete_patient_confirm'))) {
            dispatch({ type: 'DELETE_PATIENT', payload: patientId });
            dispatch({ type: 'SHOW_TOAST', payload: { message: t('session_deleted'), type: 'success' } });
        }
    }

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
    };
    
    const getTitle = () => {
        if (currentUser?.role === 'admin') return t('patient_management');
        if (currentUser?.role === 'practitioner') return t('my_patients');
        return t('patients');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-dark font-display">{getTitle()}</h2>
                    <p className="text-text-soft">{t('view_add_manage_patients')}</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    {t('add_new_patient')}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label={t('total_sessions')} value={stats.totalPatients} />
                <StatCard label={t('therapy_distribution')} value={stats.activeTherapies} />
                <StatCard label={t('average_wellbeing')} value={`${stats.averageProgress}%`} />
            </div>

            {/* Filters & Table */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder={t('search_by_name')}
                        value={patientSearchTerm || ''}
                        onChange={handleSearchChange}
                        className="w-full py-2 pl-4 pr-4 bg-sand border border-border-soft rounded-full text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-saffron"
                    />
                    <select
                        value={therapyFilter}
                        onChange={(e) => setTherapyFilter(e.target.value)}
                        className="w-full md:w-64 py-2 px-4 bg-sand border border-border-soft rounded-full text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron"
                    >
                        {therapies.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-border-soft">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-text-soft tracking-wider">{t('patient')}</th>
                                <th className="p-4 text-sm font-semibold text-text-soft tracking-wider">{t('last_visit', {date: ''}).replace(':', '')}</th>
                                <th className="p-4 text-sm font-semibold text-text-soft tracking-wider">{t('therapy')}</th>
                                <th className="p-4 text-sm font-semibold text-text-soft tracking-wider">{t('progress')}</th>
                                <th className="p-4 text-sm font-semibold text-text-soft tracking-wider text-center">{t('action_required')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.slice(0, visibleCount).map(patient => (
                               <MemoizedPatientRow
                                    key={patient.id}
                                    patient={patient}
                                    onSelectPatient={onSelectPatient}
                                    onEditPatient={setPatientToEdit}
                                    onDeletePatient={handleDeletePatient}
                                    t={t}
                               />
                            ))}
                        </tbody>
                    </table>
                </div>

                {visibleCount < filteredPatients.length && (
                    <div className="pt-6 text-center border-t border-border-soft mt-4">
                        <button onClick={handleLoadMore} className="bg-sand px-6 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('load_more')}
                        </button>
                    </div>
                )}

                 {filteredPatients.length === 0 && (
                    <div className="text-center py-16 text-text-soft">
                        <p className="text-lg">{t('no_patients_found')}</p>
                        <p>{t('try_adjusting_filters')}</p>
                    </div>
                )}
            </Card>

            {isAddModalOpen && <AddPatientModal onClose={() => setIsAddModalOpen(false)} onSave={handleSavePatient} />}
            {patientToEdit && (
                <EditPatientModal 
                    patient={patientToEdit}
                    onClose={() => setPatientToEdit(null)}
                    onSave={handleUpdatePatient}
                />
            )}
        </div>
    );
};
