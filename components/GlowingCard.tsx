import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Wrap with React.forwardRef to allow passing a ref to the underlying div element.
// This is necessary for components like AnimatedComponent to observe when the Card enters the viewport.
export const Card = React.memo(React.forwardRef<HTMLDivElement, CardProps>(({ children, className = '' }, ref) => {
  return (
    <div ref={ref} className={`bg-sand border border-border-soft rounded-xl p-3 sm:p-4 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-saffron/50 ${className}`}>
        {children}
    </div>
  );
}));

// Add a displayName for better debugging.
Card.displayName = 'Card';