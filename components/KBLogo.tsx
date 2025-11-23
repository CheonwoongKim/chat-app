import Image from 'next/image';

interface KBLogoProps {
  size?: number;
  priority?: boolean;
}

export const KBLogo = ({ size = 28, priority = false }: KBLogoProps) => {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
      <Image
        src="/kb-logo.webp"
        alt="KB"
        width={size}
        height={size}
        priority={priority}
      />
    </div>
  );
};
