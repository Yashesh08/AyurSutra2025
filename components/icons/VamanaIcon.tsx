import React from 'react';

export const VamanaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20v-8"/>
    <path d="M9 15h6"/>
    <path d="M12 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" transform="matrix(1 0 0 -1 0 8)"/>
    <path d="M12 12c-2.76 0-5 2.24-5 5"/>
    <path d="M12 12c2.76 0 5 2.24 5 5"/>
    <path d="M10 4.5c.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5"/>
  </svg>
);
