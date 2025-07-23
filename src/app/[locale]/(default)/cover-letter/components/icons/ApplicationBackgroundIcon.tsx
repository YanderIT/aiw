import React from 'react';

interface ApplicationBackgroundIconProps {
  className?: string;
}

const ApplicationBackgroundIcon: React.FC<ApplicationBackgroundIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      <path 
        d="M8 7H16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M8 11H16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M8 15H12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <circle 
        cx="17" 
        cy="17" 
        r="2" 
        fill="currentColor"
      />
    </svg>
  );
};

export default ApplicationBackgroundIcon; 