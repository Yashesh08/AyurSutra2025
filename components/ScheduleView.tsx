import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from './GlowingCard';
import { TherapyStatus, TherapySession, User } from '../types';
import { SessionDetailsModal } from './SessionDetailsModal';
import { SessionModal } from './SessionModal';
import { PlusIcon } from './icons/PlusIcon';
import { useAppContext } from '../App';
import { DailyTimelineView } from './DailyTimelineView';
import { ListIcon } from './icons/ListIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CalendarPicker } from './CalendarPicker';
import { EditIcon } from './icons/EditIcon';
import { ChangeSessionTimeModal } from './ChangeSessionTimeModal';
import { useTranslation } from '../i18n';


export const ScheduleView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { currentUser, sessions, patients, users } = state;
  const { t } = useTranslation();

  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isPractitionerModalOpen, setIsPractitionerModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<TherapySession | null>(null);
  const [sessionToEditTime, setSessionToEditTime] = useState<TherapySession | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setIsCalendarOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allPractitioners = useMemo(() => users.filter(u => u.role === 'practitioner'), [users]);

  const onAddSession = (sessionData: Omit<TherapySession, 'id'>) => {
    const newSession: TherapySession = { ...sessionData, id: `t${Date.now()}` };
    dispatch({ type: 'ADD_SESSION', payload: newSession });
  };

  const onUpdateSession = (session: TherapySession) => {
    dispatch({ type: 'UPDATE_SESSION', payload: session });
  };

  const onDeleteSession = (sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: sessionId });
  };

  const getStatusColor = (status: TherapyStatus) => {
    switch (status) {
      case TherapyStatus.Completed: return 'bg-green-100 text-green-800 border-green-300';
      case TherapyStatus.Upcoming: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case TherapyStatus.Cancelled: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };
  
  if (!currentUser) return null;
  
  const isPractitionerOrAdmin = currentUser.role === 'practitioner' || currentUser.role === 'admin';

  const userSessions = useMemo(() => {
    if (currentUser.role === 'admin') {
      return sessions;
    }
    if (currentUser.role === 'practitioner') {
      return sessions.filter(s => s.practitioner === currentUser.name);
    }
    // Patient role
    return sessions.filter(s => s.patientId === currentUser.id);
  }, [sessions, currentUser]);

  const practitionersForTimeline = useMemo(() => {
    if (currentUser.role === 'practitioner') {
      return allPractitioners.filter(p => p.id === currentUser.id);
    }
    return allPractitioners;
  }, [allPractitioners, currentUser]);
  
  const practitionersForModal = useMemo(() => {
    if (currentUser.role === 'practitioner') {
      return allPractitioners.filter(p => p.id === currentUser.id);
    }
    return allPractitioners;
  }, [allPractitioners, currentUser]);

  const changeDate = (days: number) => {
      setSelectedDate(current => {
          const newDate = new Date(current);
          newDate.setDate(newDate.getDate() + days);
          return newDate;
      });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const dailySessions = useMemo(() => {
      return userSessions.filter(s => {
          const sessionDate = s.startTime;
          return sessionDate.getDate() === selectedDate.getDate() &&
                 sessionDate.getMonth() === selectedDate.getMonth() &&
                 sessionDate.getFullYear() === selectedDate.getFullYear();
      });
  }, [userSessions, selectedDate]);

  const handleSessionClick = (session: TherapySession) => {
    if (isPractitionerOrAdmin) {
      setSessionToEdit(session);
      setIsPractitionerModalOpen(true);
    } else {
      setSelectedSession(session);
      setIsPatientModalOpen(true);
    }
  };
  
  const handleCreateClick = () => {
    setSessionToEdit(null);
    setIsPractitionerModalOpen(true);
  };
  
  const handleSaveSession = (sessionData: TherapySession | Omit<TherapySession, 'id'>) => {
    if ('id' in sessionData && sessionData.id) {
        onUpdateSession(sessionData as TherapySession);
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Session updated successfully!', type: 'success' } });
    } else {
        onAddSession(sessionData);
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Session created successfully!', type: 'success' } });
    }
    setIsPractitionerModalOpen(false);
  };
  
  const handleDeleteSession = (sessionId: string) => {
    onDeleteSession(sessionId);
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Session deleted.', type: 'success' } });
    setIsPractitionerModalOpen(false);
  };

  const handleSessionTimeChange = (sessionId: string, newTimeSlot: 'morning' | 'noon' | 'evening') => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const timeSlotToHour = { morning: 9, noon: 13, evening: 17 };
    const newHour = timeSlotToHour[newTimeSlot];

    const currentDuration = session.endTime.getTime() - session.startTime.getTime();
    const newStartTime = new Date(session.startTime);
    newStartTime.setHours(newHour, 0, 0, 0);
    const newEndTime = new Date(newStartTime.getTime() + currentDuration);

    const updatedSession = { ...session, startTime: newStartTime, endTime: newEndTime };

    dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Session time updated successfully!', type: 'success' } });
    setSessionToEditTime(null);
  };
  
  const sessionsForList = isPractitionerOrAdmin ? dailySessions : userSessions;

  const getTitle = () => {
    if (currentUser.role === 'admin') return t('clinic_schedule');
    if (currentUser.role === 'practitioner') return t('my_schedule');
    return t('my_schedule');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in-up">
       <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-dark font-display">{getTitle()}</h2>
          </div>
          {isPractitionerOrAdmin && (
               <button onClick={handleCreateClick} className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    {t('create_new_session')}
                </button>
          )}
      </div>

      {isPractitionerOrAdmin && (
         <Card className="mb-6 p-2 sm:p-4 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4">
            <div className="relative flex items-center gap-1 sm:gap-2" ref={calendarRef}>
                <button onClick={() => changeDate(-1)} className="p-2 rounded-md hover:bg-ivory" aria-label="Previous day"><ArrowLeftIcon className="w-5 h-5"/></button>
                <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="font-semibold text-text-dark font-display text-base sm:text-lg text-center px-2 sm:px-3 py-1.5 rounded-md hover:bg-ivory transition-colors">
                    <span className="sm:hidden">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="hidden sm:inline">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </button>
                <button onClick={() => changeDate(1)} className="p-2 rounded-md hover:bg-ivory" aria-label="Next day"><ArrowRightIcon className="w-5 h-5"/></button>
                {isCalendarOpen && <CalendarPicker selectedDate={selectedDate} onDateSelect={handleDateSelect} />}
            </div>
            <div className="flex items-center gap-2 bg-sand p-1 rounded-lg">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-ivory shadow-sm' : ''}`} aria-label="List view"><ListIcon className="w-5 h-5"/></button>
                <button onClick={() => setViewMode('timeline')} className={`p-2 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-ivory shadow-sm' : ''}`} aria-label="Timeline view"><DashboardIcon className="w-5 h-5"/></button>
            </div>
        </Card>
      )}

      {viewMode === 'list' || !isPractitionerOrAdmin ? (
          <Card>
            <div className="space-y-4">
              {sessionsForList.length > 0 ? sessionsForList.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()).map(session => {
                const isUser = currentUser.role === 'user';
                const isUpcoming = session.status === TherapyStatus.Upcoming;
                const isFuture = session.startTime > new Date();
                
                return (
                   <div 
                    key={session.id} 
                    className={`w-full text-left flex items-center justify-between p-3 bg-ivory rounded-lg transition-transform hover:scale-[1.02] border border-border-soft`}
                  >
                    <button 
                      onClick={() => handleSessionClick(session)} 
                      className="flex-grow text-left flex justify-between items-center"
                      aria-label={`View details for ${session.therapyName} session`}
                    >
                        <div>
                          <p className="text-base sm:text-lg font-semibold text-text-dark">
                            {session.therapyName} 
                            {isPractitionerOrAdmin && <span className="text-calm-blue font-normal"> - {session.patientName}</span>}
                          </p>
                          <p className="text-sm text-text-soft">{session.practitioner}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-text-dark font-medium text-sm sm:text-base">{session.startTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(session.status)}`}>
                              {session.status}
                          </span>
                        </div>
                    </button>
                    
                    {isUser && isUpcoming && isFuture && (
                       <button 
                          onClick={() => setSessionToEditTime(session)}
                          className="ml-4 flex-shrink-0 bg-sand px-3 py-1.5 rounded-md text-sm text-text-dark font-semibold hover:bg-border-soft transition-colors"
                          title="Change session time"
                      >
                          Change Time
                      </button>
                    )}
                  </div>
                )
              }) : <p className="text-text-soft text-center py-4">No sessions to display for this day.</p>}
            </div>
          </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <DailyTimelineView 
            sessions={dailySessions} 
            practitioners={practitionersForTimeline}
            onSessionClick={handleSessionClick}
          />
        </div>
      )}

      {isPatientModalOpen && selectedSession && (
        <SessionDetailsModal 
          session={selectedSession} 
          onClose={() => setIsPatientModalOpen(false)} 
        />
      )}
      
      {isPractitionerModalOpen && (
        <SessionModal 
            sessionToEdit={sessionToEdit}
            onClose={() => setIsPractitionerModalOpen(false)}
            onSave={handleSaveSession}
            onDelete={handleDeleteSession}
            patients={patients}
            practitioners={practitionersForModal}
        />
      )}

      {sessionToEditTime && (
          <ChangeSessionTimeModal 
              session={sessionToEditTime} 
              onClose={() => setSessionToEditTime(null)} 
              onSave={handleSessionTimeChange}
          />
      )}
    </div>
  );
};
