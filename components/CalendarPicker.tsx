
import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface CalendarPickerProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onDateSelect }) => {
    const [displayDate, setDisplayDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const changeMonth = (amount: number) => {
        setDisplayDate(current => {
            const newDate = new Date(current);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const isSelected = selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
        const isToday = currentDate.getTime() === today.getTime();

        let buttonClasses = 'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200';
        if (isSelected) {
            buttonClasses += ' bg-saffron text-white font-bold';
        } else if (isToday) {
            buttonClasses += ' border-2 border-saffron text-saffron';
        } else {
            buttonClasses += ' text-text-dark hover:bg-sand';
        }

        calendarDays.push(
            <button key={day} onClick={() => onDateSelect(currentDate)} className={buttonClasses}>
                {day}
            </button>
        );
    }
    
    return (
        <div className="absolute top-full mt-2 z-30 bg-ivory border border-border-soft rounded-lg shadow-xl p-4 w-80 animate-fade-in-up" style={{ animationDuration: '200ms' }}>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-sand"><ArrowLeftIcon className="w-5 h-5 text-text-soft" /></button>
                <span className="font-bold text-text-dark font-display">
                    {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-sand"><ArrowRightIcon className="w-5 h-5 text-text-soft" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-soft mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarDays}
            </div>
        </div>
    );
};
