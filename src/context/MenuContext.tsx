'use client';
import { getAllData } from '@/services/api';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type MenuItem = {
  id: string;
  name: string;
  sequenceNo: number;
  icon: string;
  url: string;
  alias: string;
  isActive: boolean;
  children?: MenuItem[];
};

type MenuContextType = {
  menu: MenuItem[];
  isLoading: boolean;
  refreshMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await getAllData(`/api/v1/menu/side`);
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const refreshMenu = () => {
    fetchMenu();
  };

  const obj = useMemo(() => ({ menu, isLoading, refreshMenu }), []);

  return <MenuContext.Provider value={{ menu, isLoading, refreshMenu }}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
