import React from 'react';

export const DigestionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.2 3.2c-2.4-1.5-5.2-.8-7.2.9s-2.5 4.8-.9 7.2 5.2.8 7.2-.9c2.3-1.8 2.5-4.8 1-7.2z"></path>
        <path d="M3.2 11.2c-1.5 2.4-.8 5.2.9 7.2s4.8 2.5 7.2.9c1.8-1.4 2.5-4.8 1-7.2-2.3-1.8-5.2-.8-7.2.9z"></path>
    </svg>
);
