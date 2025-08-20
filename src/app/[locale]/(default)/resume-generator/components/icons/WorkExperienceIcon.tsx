interface WorkExperienceIconProps {
  className?: string;
}

export default function WorkExperienceIcon({ className = "w-6 h-6" }: WorkExperienceIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 7V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V7H8Z"
        fill="currentColor"
      />
      <path
        d="M4 7C3.44772 7 3 7.44772 3 8V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V8C21 7.44772 20.5523 7 20 7H4Z"
        fill="currentColor"
      />
      <path
        d="M8 11H16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 15H12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
} 