import React from 'react';
import { User, VIEWS } from '../types';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

export const Header: React.FC = React.memo(() => {
  const { state, dispatch } = useAppContext();
  const { currentUser } = state;
  const [searchTerm, setSearchTerm] = React.useState('');
  const { t, language, setLanguage } = useTranslation();

  if (!currentUser) return null;
  
  const onLogout = () => dispatch({ type: 'LOGOUT' });
  const setIsSidebarOpen = (isOpen: boolean) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: isOpen });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        dispatch({ type: 'SET_PATIENT_SEARCH_TERM', payload: searchTerm });
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: VIEWS.PATIENTS });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'hi');
  };

  const isPractitioner = currentUser.role === 'practitioner';
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-ivory/80 backdrop-blur-sm border-b border-border-soft flex-shrink-0">
      <div className="flex items-center gap-4">
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-text-dark"
            aria-label="Open sidebar"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-text-dark font-display">
                {isAdmin ? t('admin_dashboard') : isPractitioner ? t('practitioner_dashboard') : t('patient_dashboard')}
            </h2>
            <p className="text-sm text-text-soft hidden md:block">
                {t('welcome_back', { name: currentUser.name })}
            </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="py-2 pl-3 pr-8 bg-sand border border-border-soft rounded-full text-text-dark focus:outline-none focus:ring-2 focus:ring-saffron appearance-none"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-soft pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {(isPractitioner || isAdmin) && (
             <form onSubmit={handleSearch} className="relative hidden lg:block">
                <input
                    type="text"
                    placeholder={t('search_patients')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 py-2 pl-10 pr-4 bg-sand border border-border-soft rounded-full text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-saffron transition-all duration-300"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </form>
        )}

        <div className="flex items-center gap-3">
            <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full border-2 border-calm-blue"
            />
            <div className="hidden sm:block">
                <p className="text-text-dark font-semibold text-sm">
                    {currentUser.name}
                </p>
                <p className="text-text-soft text-xs capitalize">
                    {currentUser.role}
                </p>
            </div>
        </div>
         <button 
            onClick={onLogout}
            className="text-sm bg-sand px-4 py-2 rounded-md text-text-dark hover:bg-red-500/80 hover:text-white transition-colors"
            title={t('logout')}
        >
           <span className="hidden sm:inline">{t('logout')}</span>
            <svg className="w-5 h-5 sm:hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
        </button>
      </div>
    </header>
  );
});
