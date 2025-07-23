import React from 'react';

interface ExperienceHistoryIconProps {
  className?: string;
}

const ExperienceHistoryIcon: React.FC<ExperienceHistoryIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M8 2V5M16 2V5M7 10H17M7 14H17M7 18H12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <rect 
        x="3" 
        y="4" 
        width="18" 
        height="18" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      <path 
        d="M3 8H21" 
        stroke="currentColor" 
        strokeWidth="2"
      />
    </svg>
  );
};

export default ExperienceHistoryIcon; 