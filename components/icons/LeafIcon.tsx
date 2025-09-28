import React from 'react';

export const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 2a4 4 0 0 0-2.8 7.2A4 4 0 0 0 17 16a4 4 0 0 0-4-4" />
    <path d="M2 20h1a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1" />
    <path d="M17 16v4a2 2 0 0 0 2 2h1" />
    <path d="M7 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2" />
  </svg>
);
