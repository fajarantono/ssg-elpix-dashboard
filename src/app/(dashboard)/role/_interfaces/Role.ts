import { Main } from '@/types/main';

export interface Role extends Main {
  name: string;
  description?: string;
  isRoot?: boolean;
  isActive?: boolean;
}
export interface AddFormValues {
  name: string;
  description?: string | null;
  isRoot: boolean;
  isActive?: boolean;
}
export interface EditFormValues {
  name: string;
  description: string;
  isRoot: boolean;
  isActive: boolean;
}
export interface Access {
  id: string;
  name: string;
  isActive: boolean;
}
export interface MenuItem {
  id: string;
  name: string;
  parentId?: string | null;
  sequenceNo?: number;
  accesses: Record<string, Access>;
  children?: MenuItem[];
}

export interface RolePermission {
  id: string;
  menus: MenuItem[];
}

export type DataRolePermission = MenuItem;