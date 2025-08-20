export default function SOPIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 11H3V20C3 20.5523 3.44772 21 4 21H9V11Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M9 21H20C20.5523 21 21 20.5523 21 20V11H9V21Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M3 11H21V5C21 4.44772 20.5523 4 20 4H4C3.44772 4 3 4.44772 3 5V11Z"
        fill="currentColor"
      />
      <path
        d="M12 2L12 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7L15 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}