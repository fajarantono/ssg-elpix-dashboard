export interface Profile {
  id: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  avatarFile: string;
  roleId: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  role: string;
}
