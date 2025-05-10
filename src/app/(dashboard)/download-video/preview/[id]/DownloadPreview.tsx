'use client';

import React from 'react';
import { useAbility } from '@/context/AbilityContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useParams } from 'next/navigation';

export default function DownloadPreviewPage() {
  const ability = useAbility();
  const param = useParams<{ id: string }>();

  return (
    <>
      <PageBreadcrumb pageTitle="Download Video" />
      <div
        className="space-y-6"
      >
        {ability.can('read', 'Video Enhance') && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Download Video</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This is the download video page where you can download videos. {param.id}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
