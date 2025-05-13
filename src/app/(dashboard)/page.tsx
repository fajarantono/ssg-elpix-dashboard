import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Elpix-AI Dashboard',
  description: 'This is Home for Elpix-AI Dashboard',
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">asas</div>

      <div className="col-span-12 xl:col-span-5"></div>

      <div className="col-span-12"></div>

      <div className="col-span-12 xl:col-span-5"></div>

      <div className="col-span-12 xl:col-span-7"></div>
    </div>
  );
}
