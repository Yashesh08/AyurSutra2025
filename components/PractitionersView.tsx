import React, { useState, useMemo } from 'react';
import { User, TherapySession } from '../types';
import { Card } from './GlowingCard';
import { DoctorDetailsModal } from './DoctorDetailsModal';
import { PlusIcon } from './icons/PlusIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { useAppContext } from '../App';
import { AddPractitionerModal } from './AddPractitionerModal';
import { useTranslation } from '../i18n';

const StarRating: React.FC<{ rating: number; t: (key: string) => string; }> = ({ rating, t }) => (
    <div className="flex items-center">
        <svg className="w-4 h-4 text-saffron" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-text-dark font-bold ml-1">{rating.toFixed(1)}</span>
    </div>
);

interface PractitionerCardProps {
    doctor: User;
    stats: { sessionCount: number; averageRating: number; };
    onSelect: (doctor: User) => void;
    t: (key: string) => string;
}

const PractitionerCard: React.FC<PractitionerCardProps> = React.memo(({ doctor, stats, onSelect, t }) => (
    <Card className="flex flex-col text-center items-center p-6 hover:-translate-y-1 transition-transform">
        <img 
            src={doctor.avatar} 
            alt={doctor.name} 
            className="w-24 h-24 rounded-full border-4 border-calm-blue mb-4"
        />
        <h3 className="text-xl font-bold text-text-dark font-display">{doctor.name}</h3>
        <p className="text-earthy-green font-medium mb-4">{doctor.specialty}</p>

        <div className="flex justify-around w-full my-4 border-t border-b border-border-soft py-3">
            <div className="text-center">
                <p className="font-bold text-lg text-text-dark">{stats.sessionCount}</p>
                <p className="text-xs text-text-soft">{t('sessions_completed')}</p>
            </div>
            <div className="border-l border-border-soft"></div>
            <div className="text-center">
                <StarRating rating={stats.averageRating} t={t} />
                <p className="text-xs text-text-soft mt-1">{t('avg_rating')}</p>
            </div>
        </div>

        <button 
            onClick={() => onSelect(doctor)}
            className="mt-auto flex items-center justify-center w-full bg-sand border border-border-soft rounded-lg py-2 px-4 text-text-dark font-semibold hover:bg-saffron hover:text-white transition-colors duration-300 group"
            title={t('view_profile')}
        >
            {t('view_profile')}
            <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
    </Card>
));

const ITEMS_PER_PAGE = 9;

export const PractitionersView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { sessions, users } = state;
    const { t } = useTranslation();

    const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('All');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const practitioners = useMemo(() => users.filter(user => user.role === 'practitioner'), [users]);

    const specialties = useMemo(() => ['All', ...new Set(practitioners.map(p => p.specialty).filter(Boolean))], [practitioners]);
    
    const practitionerStats = useMemo(() => {
        const statsMap = new Map<string, { sessionCount: number; averageRating: number }>();
        practitioners.forEach(p => {
            const practitionerSessions = sessions.filter(s => s.practitioner === p.name);
            const reviews = p.reviews || [];
            const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
            statsMap.set(p.name, {
                sessionCount: practitionerSessions.length,
                averageRating
            });
        });
        return statsMap;
    }, [sessions, practitioners]);

    const filteredPractitioners = useMemo(() => {
        return practitioners.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = specialtyFilter === 'All' || p.specialty === specialtyFilter;
            return matchesSearch && matchesSpecialty;
        });
    }, [practitioners, searchTerm, specialtyFilter]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const handleSavePractitioner = (practitionerData: Omit<User, 'id' | 'role' | 'avatar'>) => {
        const newPractitioner: User = {
            ...practitionerData,
            id: `doc${Date.now()}`,
            role: 'practitioner',
            avatar: `https://i.pravatar.cc/150?u=doc${Date.now()}`,
            reviews: [],
        };
        dispatch({ type: 'ADD_PRACTITIONER', payload: newPractitioner });
        dispatch({ type: 'SHOW_TOAST', payload: { message: t('practitioner_added_success'), type: 'success' } });
        setIsAddModalOpen(false);
    }

    return (
        <div className="p-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-text-dark font-display">{t('our_practitioners')}</h2>
                    <p className="text-text-soft">{t('manage_practitioners')}</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    {t('add_new_practitioner')}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder={t('search_by_name')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 bg-sand border border-border-soft rounded-full text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300"
                    />
                     <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                 <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="w-full md:w-64 py-2 px-4 bg-sand border border-border-soft rounded-full text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300"
                >
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPractitioners.slice(0, visibleCount).map(doctor => (
                    <PractitionerCard 
                        key={doctor.id}
                        doctor={doctor}
                        stats={practitionerStats.get(doctor.name) || { sessionCount: 0, averageRating: 0 }}
                        onSelect={setSelectedDoctor}
                        t={t}
                    />
                ))}
            </div>

            {visibleCount < filteredPractitioners.length && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleLoadMore}
                        className="bg-sand px-6 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors"
                    >
                        {t('load_more')}
                    </button>
                </div>
            )}

            {filteredPractitioners.length === 0 && (
                <div className="text-center py-16 text-text-soft">
                    <p className="text-lg">{t('no_practitioners_found')}</p>
                    <p>{t('try_adjusting_filters')}</p>
                </div>
            )}

            {selectedDoctor && (
                <DoctorDetailsModal 
                    doctor={selectedDoctor} 
                    onClose={() => setSelectedDoctor(null)} 
                    sessions={sessions}
                />
            )}
            {isAddModalOpen && <AddPractitionerModal onClose={() => setIsAddModalOpen(false)} onSave={handleSavePractitioner} />}
        </div>
    );
};
