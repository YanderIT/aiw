interface EducationIconProps {
  className?: string;
}

export default function EducationIcon({ className = "w-6 h-6" }: EducationIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L2 8L12 13L22 8L12 3Z"
        fill="currentColor"
      />
      <path
        d="M6 10.5V15.5C6 16.3284 6.67157 17 7.5 17H16.5C17.3284 17 18 16.3284 18 15.5V10.5L12 13.5L6 10.5Z"
        fill="currentColor"
      />
      <path
        d="M2 8V16C2 17.1046 2.89543 18 4 18H20C21.1046 18 22 17.1046 22 16V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 10V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
} 