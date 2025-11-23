interface MenuIconProps {
  isOpen: boolean;
  size?: number;
  color?: string;
  openColor?: string;
}

export const MenuIcon = ({ isOpen, size = 20, color = 'var(--color-text-primary)', openColor = 'var(--color-text-primary)' }: MenuIconProps) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);
