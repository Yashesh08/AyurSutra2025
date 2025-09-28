import React from 'react';
import { User, TherapySession, TherapyStatus } from '../types';
import { Card } from './GlowingCard';
import { TherapyDistributionChart } from './TherapyDistributionChart';
import { useTranslation } from '../i18n';

interface DoctorDetailsModalProps {
    doctor: User;
    onClose: () => void;
    sessions: TherapySession[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-saffron' : 'text-border-soft'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);


const SessionList: React.FC<{ title: string; sessions: TherapySession[]; emptyMessage: string }> = ({ title, sessions, emptyMessage }) => (
    <div>
        <h4 className="text-lg font-semibold text-text-dark font-display mb-2">{title}</h4>
        {sessions.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {sessions.map(session => (
                    <div key={session.id} className="p-3 bg-ivory rounded-lg border border-border-soft text-sm">
                        <p className="font-semibold text-text-dark">{session.therapyName} - <span className="font-normal text-text-soft">{session.patientName}</span></p>
                        <p className="text-xs text-earthy-green">{session.startTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-sm text-text-soft p-3 bg-ivory rounded-lg border border-border-soft">{emptyMessage}</p>
        )}
    </div>
);

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-sand rounded-full text-saffron">
            {icon}
        </div>
        <div>
            <p className="text-lg font-bold text-text-dark">{value}</p>
            <p className="text-xs text-text-soft">{label}</p>
        </div>
    </div>
);


export const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({ doctor, onClose, sessions }) => {
    const { t } = useTranslation();
    const doctorSessions = sessions.filter(s => s.practitioner === doctor.name);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const ongoingSessions = doctorSessions.filter(s => s.startTime <= oneHourFromNow && s.endTime > now && s.status === TherapyStatus.Upcoming);
    const upcomingSessions = doctorSessions.filter(s => s.startTime > oneHourFromNow && s.status === TherapyStatus.Upcoming);
    const pastSessions = doctorSessions.filter(s => s.status === TherapyStatus.Completed);
    
    const averageRating = doctor.reviews && doctor.reviews.length > 0
        ? (doctor.reviews.reduce((acc, review) => acc + review.rating, 0) / doctor.reviews.length).toFixed(1)
        : 'N/A';

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-center border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('practitioner_details')}</h2>
                    <button onClick={onClose} className="text-text-soft hover:text-text-dark">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 hide-scrollbar">
                    {/* Left Column: Profile & Reviews */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <div className="flex flex-col items-center text-center">
                                <img src={doctor.avatar} alt={doctor.name} className="w-24 h-24 rounded-full border-4 border-saffron mb-4"/>
                                <h3 className="text-xl font-bold text-text-dark">{doctor.name}</h3>
                                <p className="text-earthy-green font-medium">{doctor.specialty}</p>
                                <p className="text-sm text-text-soft mt-2">{doctor.bio}</p>
                            </div>
                        </Card>
                         <Card>
                            <h4 className="text-lg font-semibold text-text-dark font-display mb-4">{t('key_stats')}</h4>
                            <div className="space-y-4">
                               <StatCard label={t('years_of_experience')} value={doctor.yearsOfExperience || 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                               <StatCard label={t('average_rating')} value={averageRating} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.524 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.524 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.524-4.674a1 1 0 00-.363-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.524-4.674z" /></svg>} />
                               <StatCard label={t('total_sessions')} value={doctorSessions.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-6-6h6m6 0a6 6 0 00-6-6m6 6a6 6 0 00-6 6" /></svg>} />
                            </div>
                        </Card>
                        <Card>
                            <h4 className="text-lg font-semibold text-text-dark font-display mb-3">{t('patient_reviews')}</h4>
                            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                {doctor.reviews && doctor.reviews.length > 0 ? doctor.reviews.map((review, index) => (
                                    <div key={index} className="border-b border-border-soft pb-3 last:border-b-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-text-dark text-sm">{review.patientName}</p>
                                            <StarRating rating={review.rating}/>
                                        </div>
                                        <p className="text-xs text-text-soft italic">"{review.comment}"</p>
                                    </div>
                                )) : <p className="text-sm text-text-soft text-center">{t('no_reviews_yet')}</p>}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Sessions */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card>
                            <h4 className="text-lg font-semibold text-text-dark font-display mb-2">{t('performance_overview')}</h4>
                            <TherapyDistributionChart sessions={doctorSessions} />
                        </Card>
                        <Card>
                             <SessionList title={t('ongoing_sessions')} sessions={ongoingSessions} emptyMessage={t('no_ongoing_sessions')} />
                        </Card>
                        <Card>
                             <SessionList title={t('upcoming_sessions')} sessions={upcomingSessions} emptyMessage={t('no_upcoming_sessions')} />
                        </Card>
                        <Card>
                             <SessionList title={t('past_sessions')} sessions={pastSessions} emptyMessage={t('no_past_sessions')} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
