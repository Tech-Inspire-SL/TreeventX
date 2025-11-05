import Image from 'next/image';

export function AppLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/TreeventX_Logo.png"
      alt="TreeventX Logo"
      width={50}
      height={50}
      className={className}
      priority
    />
  );
}