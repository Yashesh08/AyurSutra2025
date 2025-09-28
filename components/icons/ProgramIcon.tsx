import React from 'react';

export const ProgramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="3" x2="9" y2="9"></line>
    <line x1="15" y1="14" x2="9" y2="14"></line>
    <line x1="15" y1="18" x2="9" y2="18"></line>
  </svg>
);
