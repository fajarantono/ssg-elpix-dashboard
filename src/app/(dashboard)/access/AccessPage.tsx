'use client';

import React from 'react';
import { useAbility } from '@/context/AbilityContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ListData from './_components/ListData';

export default function AccessPage() {
  const ability = useAbility();

  return (
    <>
      <PageBreadcrumb pageTitle="Access" />
      <div className="space-y-6">
        {ability.can('read', 'Access') && (
          <ListData />
        )}
      </div>
    </>
  );
}
