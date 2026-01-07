export default function Spinner({
  size = 48,
  color = "text-[var(--highlight)]",
}) {
  return (
    <div className="flex justify-center items-center">
      <svg
        className={`animate-spin h-${size} w-${size} ${color}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-label="Loading..."
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"
          stroke="currentColor"
          fill="none"
        />
        <path
          d="M4 12a8 8 0 0 1 16 0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
