import { Main } from '@/types/main';

export interface User extends Main {
  username: string;
  fullname?: string;
  email?: string;
  phone?: string;
  role?: string;
  roleId?: string;
  avatarFile?: string;
  isActive?: boolean;
}
export interface AddFormValues {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  avatarFile?: string | null;
  password: string;
  roleId: string;
}

export interface EditFormValues {
  fullname: string;
  username: string;
  email: string;
  phone: string;
  avatarFile?: string | null;
  password?: string | null;
  roleId: string;
  isActive: boolean;
}
