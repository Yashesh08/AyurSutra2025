import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number }> = ({ className, size = 48 }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 50 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5E8B7E" />
                <stop offset="100%" stopColor="#A9DEF9" />
            </linearGradient>
        </defs>
        <g transform="translate(25, 25)">
            {[0, 1, 2, 3, 4].map(i => (
                <path 
                    key={i}
                    transform={`rotate(${i * 72})`}
                    d="M0,-22 C 10, -15 10, 0 0, 8 C -10, 0 -10, -15 0, -22 Z" 
                    fill="url(#logoGradient)"
                    opacity="0.9"
                />
            ))}
        </g>
        <circle cx="25" cy="25" r="5" fill="#FEFDFB"/>
        <circle cx="25" cy="25" r="2.5" fill="#F7C873"/>
    </svg>
);
