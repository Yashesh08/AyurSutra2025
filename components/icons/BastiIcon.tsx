import React from 'react';

export const BastiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-3.87-7-13-7-13s-7 9.13-7 13a7 7 0 0 0 7 7z"/>
    <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>
  </svg>
);
