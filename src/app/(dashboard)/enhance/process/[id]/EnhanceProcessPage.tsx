'use client';

import React from 'react';
import { useAbility } from '@/context/AbilityContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useParams } from 'next/navigation';
import { EnhanceProcess } from './_components/EnhanceProcess';

export default function EnhancePage() {
  const ability = useAbility();
  const param = useParams<{ id: string }>();

  return (
    <>
      <PageBreadcrumb pageTitle="Enhance Process Video" />
      <div className="space-y-6">
        {ability.can('read', 'Worksheet') && (
          <EnhanceProcess id={Number(param.id)} />
        )}
      </div>
    </>
  );
}
