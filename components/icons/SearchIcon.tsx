interface SearchIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const SearchIcon = ({ size = 24, color = '#CCCCCC', strokeWidth = 1.5 }: SearchIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
