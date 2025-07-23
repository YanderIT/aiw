interface ActivitiesIconProps {
  className?: string;
}

export default function ActivitiesIcon({ className = "w-6 h-6" }: ActivitiesIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="5.5"
        cy="9.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="18.5"
        cy="9.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M5.5 17V19C5.5 20.1 6.4 21 7.5 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18.5 17V19C18.5 20.1 17.6 21 16.5 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
} 