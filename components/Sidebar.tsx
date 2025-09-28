import React, { useMemo } from 'react';
import { DashboardIcon } from './icons/DashboardIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';
import { ChartIcon } from './icons/ChartIcon';
import { DoctorsIcon } from './icons/DoctorsIcon';
import { Logo } from './icons/Logo';
import { PatientsIcon } from './icons/PatientsIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ProgramIcon } from './icons/ProgramIcon';
import { VIEWS } from '../types';
import { useAppContext } from '../App';
import { useTranslation } from '../i18n';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`relative flex items-center p-4 my-2 rounded-lg cursor-pointer transition-all duration-300 group ${
        isActive
          ? 'bg-saffron/20 text-text-dark font-semibold'
          : 'text-text-soft hover:bg-sand hover:text-text-dark'
      }`}
    >
      {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-saffron rounded-r-full" />}
      <span className="mr-4">{icon}</span>
      <span className="font-medium">{label}</span>
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-saffron/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </li>
  );
};


export const Sidebar: React.FC = React.memo(() => {
  const { state, dispatch } = useAppContext();
  const { currentUser, activeView, isSidebarOpen } = state;
  const { t } = useTranslation();

  if (!currentUser) return null;

  const setActiveView = (view: VIEWS) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  const setIsSidebarOpen = (isOpen: boolean) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: isOpen });

  const adminNavItems = useMemo(() => [
    { id: VIEWS.DASHBOARD, label: t('dashboard'), icon: <DashboardIcon className="w-6 h-6" /> },
    { id: VIEWS.SCHEDULE, label: t('schedule'), icon: <CalendarIcon className="w-6 h-6" /> },
    { id: VIEWS.PATIENTS, label: t('patients'), icon: <PatientsIcon className="w-6 h-6" /> },
    { id: VIEWS.PROGRAMS, label: t('program_templates'), icon: <ProgramIcon className="w-6 h-6" /> },
    { id: VIEWS.FORMS, label: t('forms_surveys'), icon: <ClipboardIcon className="w-6 h-6" /> },
    { id: VIEWS.PRACTITIONERS, label: t('practitioners'), icon: <DoctorsIcon className="w-6 h-6" /> },
    { id: VIEWS.PROFILE, label: t('profile'), icon: <UserIcon className="w-6 h-6" /> },
  ], [t]);

  const practitionerNavItems = useMemo(() => [
    { id: VIEWS.DASHBOARD, label: t('dashboard'), icon: <DashboardIcon className="w-6 h-6" /> },
    { id: VIEWS.SCHEDULE, label: t('my_schedule'), icon: <CalendarIcon className="w-6 h-6" /> },
    { id: VIEWS.PATIENTS, label: t('my_patients'), icon: <PatientsIcon className="w-6 h-6" /> },
    { id: VIEWS.PROGRAMS, label: t('program_templates'), icon: <ProgramIcon className="w-6 h-6" /> },
    { id: VIEWS.FORMS, label: t('forms_surveys'), icon: <ClipboardIcon className="w-6 h-6" /> },
    { id: VIEWS.PROFILE, label: t('profile'), icon: <UserIcon className="w-6 h-6" /> },
  ], [t]);

  const userNavItems = useMemo(() => [
    { id: VIEWS.DASHBOARD, label: t('my_dashboard'), icon: <DashboardIcon className="w-6 h-6" /> },
    { id: VIEWS.SCHEDULE, label: t('my_schedule'), icon: <CalendarIcon className="w-6 h-6" /> },
    { id: VIEWS.PROGRAMS, label: t('browse_programs'), icon: <ProgramIcon className="w-6 h-6" /> },
    { id: VIEWS.PROGRESS, label: t('progress_report'), icon: <ChartIcon className="w-6 h-6" /> },
    { id: VIEWS.PROFILE, label: t('my_profile'), icon: <UserIcon className="w-6 h-6" /> },
  ], [t]);
  
  let navItems;
  if (currentUser.role === 'admin') {
    navItems = adminNavItems;
  } else if (currentUser.role === 'practitioner') {
    navItems = practitionerNavItems;
  } else {
    navItems = userNavItems;
  }


  const handleNavClick = (view: VIEWS) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sand text-text-dark flex flex-col p-4 border-r border-border-soft transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex-shrink-0 flex items-center justify-center mb-10 p-4">
         <div className="animate-subtle-pulse">
            <Logo size={48} />
        </div>
        <h1 className="text-xl font-bold ml-2 font-display">AyurSetu</h1>
      </div>
      <nav className="flex-1 overflow-y-auto hide-scrollbar mb-4">
        <ul>
          {navItems.map(item => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeView === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </ul>
      </nav>
      <div className="flex-shrink-0 p-4 bg-ivory rounded-lg text-center border border-border-soft">
        <p className="text-sm text-text-soft">{t('holistic_wellness')}</p>
        <button className="mt-2 text-saffron text-xs font-semibold hover:underline">{t('request_support')}</button>
      </div>
    </aside>
  );
});
