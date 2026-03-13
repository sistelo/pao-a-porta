import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  style?: React.CSSProperties;
}

export const Card = ({ children, className = '', onClick, selected = false, style }: CardProps) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        border: selected ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        ...style
      }}
    >
      {children}
    </div>
  );
};
