'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { defineAbilityFor, AppAbility } from '@/lib/ability';
import { getAllData } from '@/services/api';
import { getUser } from '@/lib/cookies';

const AbilityContext = createContext<AppAbility | null>(null);

export const AbilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ability, setAbility] = useState(new AppAbility([]));

  useEffect(() => {
    const fetchPermissions = async () => {
      const user = getUser();
      if (user) {
        const res = await getAllData(
          `/api/v1/role/permission?roleId=${user.roleId}`,
        );

        if (res.status === 'success') {
          setAbility(defineAbilityFor(res.data[0]));
        }
      }
    };

    fetchPermissions();
  }, []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within an AbilityProvider');
  }
  return context;
};
