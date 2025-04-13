import GridShape from '@/components/common/GridShape';
import Image from 'next/image';
import React from 'react';

export default function ErrorPage() {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 overflow-hidden z-1 h-[480px]">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          ERROR
        </h1>
        <Image
          src="/images/error/503.svg"
          alt="404"
          className="dark:hidden"
          width={472}
          height={152}
        />
        <Image
          src="/images/error/503-dark.svg"
          alt="404"
          className="hidden dark:block"
          width={472}
          height={152}
        />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          An error occurred while loading data, please try again later!
        </p>
      </div>
    </div>
  );
}
