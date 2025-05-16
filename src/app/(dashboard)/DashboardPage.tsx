'use client';

import { useAbility } from '@/context/AbilityContext';
import React from 'react';
import DashboardScreen from './_components/DashboardScreen';

export default function DashboardPage() {
  const ability = useAbility();

  return (
    <>
      <div className="space-y-6">
        {ability.can('read', 'Dashboard') && <DashboardScreen />}
      </div>
    </>
  );
}
