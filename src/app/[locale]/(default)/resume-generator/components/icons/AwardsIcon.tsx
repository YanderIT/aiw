interface AwardsIconProps {
  className?: string;
}

export default function AwardsIcon({ className = "w-6 h-6" }: AwardsIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 6L13.5 10.5L18 11L15 14L15.75 18.5L12 16.5L8.25 18.5L9 14L6 11L10.5 10.5L12 6Z"
        fill="white"
      />
    </svg>
  );
} 