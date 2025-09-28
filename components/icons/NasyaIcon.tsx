import React from 'react';

export const NasyaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 10.5c.83-1.5 2.5-2.5 4.5-2.5s3.67 1 4.5 2.5"/>
        <path d="M12 14v-4"/>
        <path d="M12 14L10 12"/>
        <circle cx="12" cy="12" r="10"/>
        <path d="M15.5 13c-1-2-2.5-3-3.5-3s-2.5 1-3.5 3"/>
    </svg>
);
