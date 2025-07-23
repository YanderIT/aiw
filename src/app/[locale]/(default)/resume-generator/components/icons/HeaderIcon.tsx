interface HeaderIconProps {
  className?: string;
}

export default function HeaderIcon({ className = "w-6 h-6" }: HeaderIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 8C9.79086 8 8 9.79086 8 12V14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14V12C16 9.79086 14.2091 8 12 8Z"
        fill="currentColor"
      />
      <path
        d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V22H6V20Z"
        fill="currentColor"
      />
    </svg>
  );
} 