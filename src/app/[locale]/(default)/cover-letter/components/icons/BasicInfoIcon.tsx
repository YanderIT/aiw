import React from 'react';

interface BasicInfoIconProps {
  className?: string;
}

const BasicInfoIcon: React.FC<BasicInfoIconProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" 
        fill="currentColor"
      />
      <path 
        d="M21 12C21 11.4477 20.5523 11 20 11H19C18.4477 11 18 11.4477 18 12V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V12C6 11.4477 5.55228 11 5 11H4C3.44772 11 3 11.4477 3 12V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V12Z" 
        fill="currentColor"
      />
      <path 
        d="M16 8H8C7.44772 8 7 8.44772 7 9V11H17V9C17 8.44772 16.5523 8 16 8Z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default BasicInfoIcon; 