'use client';

import React from 'react';
import { useAbility } from '@/context/AbilityContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import VideoList from './_components/VideoList';

export default function WorksheetVideoPage() {
  const ability = useAbility();

  return (
    <>
      <PageBreadcrumb pageTitle="Worksheet Video" />
      <div className="space-y-6">
        {ability.can('read', 'Worksheet') && <VideoList />}
      </div>
    </>
  );
}
