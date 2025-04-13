import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getAllData } from '@/services/api';
import { Main } from '@/types/main';

interface Role extends Main {
  name: string;
  description?: string;
  isRoot?: boolean;
  isActive?: boolean;
}

const RoleContext = createContext<{ roles: Role[]; loading: boolean } | null>(
  null,
);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllData('/api/v1/role');
        setRoles(response?.data || []);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <RoleContext.Provider value={{ roles, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
};
