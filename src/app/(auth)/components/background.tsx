'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Background() {
  return (
    <div className="flex flex-col items-center max-w-xs">
      <Link href="/" className="block mb-4">
        <Image
          width={231}
          height={48}
          src="/images/logo/auth-logo.png"
          alt="Logo"
          className="w-[231px] h-[48px]"
        />
      </Link>
      <p className="text-center text-gray-400 dark:text-white/60">
        {process.env.NEXT_PUBLIC_PROJECT_NAME ?? 'Elpix Dashboard'}
      </p>
    </div>
  );
}
