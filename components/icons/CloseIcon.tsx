interface CloseIconProps {
  size?: number;
  color?: string;
}

export const CloseIcon = ({ size = 20, color = 'var(--color-text-primary)' }: CloseIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
