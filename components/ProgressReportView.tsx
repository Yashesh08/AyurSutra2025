import React from 'react';
import { Card } from './GlowingCard';
import { ProgressChart } from './ProgressChart';
import { User, TherapyStatus, TherapySession } from '../types';
import { PROGRESS_DATA } from '../constants';
import { OverallProgressChart } from './OverallProgressChart';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

export const ProgressReportView: React.FC = () => {
    const { state } = useAppContext();
    const { currentUser, sessions } = state;
    const { t } = useTranslation();

    if (!currentUser || !currentUser.patientData) {
        return (
            <div className="p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl text-text-dark">{t('no_patient_data')}</h2>
            </div>
        )
    }

    const { patientData } = currentUser;
    const completedSessions = sessions.filter(
        session => session.patientId === currentUser.id && session.status === TherapyStatus.Completed
    );

    const wellbeingScores = PROGRESS_DATA.map(d => d.wellbeingScore);
    const averageWellbeing = wellbeingScores.length > 0 ? wellbeingScores.reduce((a, b) => a + b, 0) / wellbeingScores.length : 0;

    return (
        <div className="p-8 space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-text-dark font-display">{t('my_wellness_journey')}</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col justify-center items-center">
                    <h4 className="text-lg font-semibold text-text-dark font-display mb-2 text-center">{patientData.currentTherapy} {t('progress')}</h4>
                    <OverallProgressChart progress={patientData.progress} />
                </Card>
                <Card>
                    <h4 className="text-lg font-semibold text-text-dark font-display mb-2">{t('sessions_completed')}</h4>
                     <p className="text-4xl font-bold text-earthy-green">{completedSessions.length}</p>
                     <p className="text-sm text-text-soft">{t('total_therapies_received')}</p>
                </Card>
                <Card>
                    <h4 className="text-lg font-semibold text-text-dark font-display mb-2">{t('average_wellbeing')}</h4>
                    <p className="text-4xl font-bold text-calm-blue">{averageWellbeing.toFixed(0)}<span className="text-2xl text-text-soft">/100</span></p>
                    <p className="text-sm text-text-soft">{t('based_on_monthly_scores')}</p>
                </Card>
            </div>
            
            {/* Progress Chart */}
            <Card>
                <h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('symptom_wellbeing_trend')}</h3>
                <ProgressChart data={PROGRESS_DATA} />
            </Card>

            {/* Session History */}
            <Card>
                 <h3 className="text-xl font-bold text-text-dark mb-4 font-display">{t('session_history')}</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-border-soft">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-text-soft tracking-wider">{t('therapy')}</th>
                                <th className="p-3 text-sm font-semibold text-text-soft tracking-wider">{t('practitioner')}</th>
                                <th className="p-3 text-sm font-semibold text-text-soft tracking-wider">{t('date')}</th>
                                <th className="p-3 text-sm font-semibold text-text-soft tracking-wider text-right">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedSessions.sort((a,b) => b.startTime.getTime() - a.startTime.getTime()).map(session => (
                                <tr key={session.id} className="border-b border-border-soft last:border-b-0">
                                    <td className="p-3 font-medium text-text-dark">{session.therapyName}</td>
                                    <td className="p-3 text-text-soft">{session.practitioner}</td>
                                    <td className="p-3 text-text-soft">{session.startTime.toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                                            {session.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                 {completedSessions.length === 0 && (
                     <p className="text-center text-text-soft py-8">{t('no_completed_sessions_yet')}</p>
                 )}
            </Card>

        </div>
    );
};
