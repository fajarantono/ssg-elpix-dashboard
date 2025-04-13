'use client';

import React from 'react';
import { useAbility } from '@/context/AbilityContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ListData from './_components/ListData';

export default function MenusPage() {
  const ability = useAbility();
  return (
    <>
      <PageBreadcrumb pageTitle="Menu" />
      <div className="space-y-6">
        {ability.can('read', 'Menu') && (
          <ListData />
        )}
      </div>
    </>
  );
}
