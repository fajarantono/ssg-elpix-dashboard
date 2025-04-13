export interface User {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  avatarFile?: string;
  role: string;
  roleId: string;
  isActive: boolean;
}
