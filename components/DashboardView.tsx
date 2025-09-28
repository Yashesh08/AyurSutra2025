import React from 'react';
import { PATIENT_FEEDBACK_DATA } from '../constants';
import { TherapyStatus } from '../types';
import { Card } from './GlowingCard';
import { ProgressBar } from './ProgressBar';
import { TherapyDistributionChart } from './TherapyDistributionChart';
import { PatientSatisfactionChart } from './PatientSatisfactionChart';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

export const AdminDashboardView: React.FC = () => {
    const { state } = useAppContext();
    const { sessions, patients } = state;
    const { t } = useTranslation();

    const upcomingSessions = sessions.filter(s => s.status === TherapyStatus.Upcoming).slice(0, 2);

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Patient List */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-text-dark mb-3 font-display">{t('active_patients')}</h3>
                    <div className="space-y-2">
                        {patients.map(patient => (
                            <div key={patient.id} className="flex items-center justify-between p-2 bg-ivory rounded-lg border border-border-soft">
                                <div className="flex items-center">
                                    <img src={patient.avatar} alt={patient.name} className="w-9 h-9 rounded-full mr-2" />
                                    <div>
                                        <p className="font-semibold text-text-dark text-sm">{patient.name}</p>
                                        <p className="text-xs text-text-soft">{patient.currentTherapy}</p>
                                    </div>
                                </div>
                                <div className="w-2/5 sm:w-1/3">
                                    <ProgressBar progress={patient.progress} />
                                    <p className="text-xs text-right mt-1 text-text-soft">{patient.progress}% Complete</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Upcoming Sessions */}
                <Card>
                    <h3 className="text-lg font-bold text-text-dark mb-3 font-display">{t('upcoming_sessions')}</h3>
                    <div className="space-y-2">
                        {upcomingSessions.map(session => (
                            <div key={session.id} className="p-2 bg-ivory rounded-lg border-l-4 border-saffron">
                                <p className="font-semibold text-text-dark text-sm">{session.therapyName}</p>
                                <p className="text-sm text-text-soft">{session.patientName}</p>
                                <p className="text-xs text-saffron mt-1 font-semibold">
                                    {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))}
                        {upcomingSessions.length === 0 && <p className="text-text-soft text-center">No upcoming sessions.</p>}
                    </div>
                </Card>
            </div>

            {/* Clinic Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                 <Card>
                    <h3 className="text-lg font-bold text-text-dark mb-2 font-display">{t('therapy_distribution')}</h3>
                    <TherapyDistributionChart sessions={sessions} />
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-text-dark mb-2 font-display">{t('patient_satisfaction')}</h3>
                    <PatientSatisfactionChart data={PATIENT_FEEDBACK_DATA} />
                </Card>
            </div>
        </div>
    );
};
