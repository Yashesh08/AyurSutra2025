import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const width = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full bg-ivory rounded-full h-2.5 border border-border-soft">
      <div
        className="bg-gradient-to-r from-earthy-green to-saffron h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};