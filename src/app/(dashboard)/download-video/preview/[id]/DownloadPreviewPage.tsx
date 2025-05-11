'use client';

import React from 'react';
import { useAbility } from '@/context/AbilityContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useParams } from 'next/navigation';
import { PreviewVideo } from './_component/PreviewVideo';

export default function DownloadPreviewPage() {
  const ability = useAbility();
  const param = useParams<{ id: string }>();

  return (
    <>
      <PageBreadcrumb pageTitle="Preview Video" />
      <div
        className="space-y-6"
      >
        {ability.can('read', 'Video Enhance') && (
          <PreviewVideo id={param!.id}/>
        )}
      </div>
    </>
  );
}
