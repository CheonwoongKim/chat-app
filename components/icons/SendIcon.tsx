interface SendIconProps {
  size?: number;
  color?: string;
}

export const SendIcon = ({ size = 24, color = '#FFBF00' }: SendIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);
